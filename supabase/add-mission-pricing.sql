-- Ajout du système de forfaits de rémunération par mission
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des forfaits de rémunération par mission
CREATE TABLE IF NOT EXISTS mission_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_per_hour DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  bonus_percentage DECIMAL(5,2) DEFAULT 0.00, -- Bonus en pourcentage pour les techniciens expérimentés
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des sélections ciblées de techniciens
CREATE TABLE IF NOT EXISTS targeted_technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES users(id) ON DELETE CASCADE,
  selected_by_admin BOOLEAN DEFAULT false,
  selection_reason TEXT, -- Raison de la sélection (compétences spécifiques, disponibilité, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, technician_id)
);

-- Ajout de la colonne pricing_id dans la table events
ALTER TABLE events ADD COLUMN IF NOT EXISTS pricing_id UUID REFERENCES mission_pricing(id);

-- Fonction pour calculer le prix total d'une mission
CREATE OR REPLACE FUNCTION calculate_mission_price(
  p_event_id UUID,
  p_technician_id UUID
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  v_base_price DECIMAL(10,2);
  v_price_per_hour DECIMAL(10,2);
  v_bonus_percentage DECIMAL(5,2);
  v_duration_hours DECIMAL(10,2);
  v_technician_level VARCHAR(20);
  v_total_price DECIMAL(10,2);
BEGIN
  -- Récupérer les informations de tarification
  SELECT mp.base_price, mp.price_per_hour, mp.bonus_percentage
  INTO v_base_price, v_price_per_hour, v_bonus_percentage
  FROM mission_pricing mp
  JOIN events e ON e.pricing_id = mp.id
  WHERE e.id = p_event_id;
  
  -- Calculer la durée en heures
  SELECT EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600
  INTO v_duration_hours
  FROM events e
  WHERE e.id = p_event_id;
  
  -- Récupérer le niveau du technicien (basé sur ses compétences les plus élevées)
  SELECT COALESCE(
    (SELECT level FROM user_skills us
     JOIN skills s ON s.id = us.skill_id
     WHERE us.user_id = p_technician_id
     ORDER BY 
       CASE s.level 
         WHEN 'expert' THEN 3
         WHEN 'intermediate' THEN 2
         WHEN 'beginner' THEN 1
       END DESC
     LIMIT 1),
    'intermediate'
  ) INTO v_technician_level;
  
  -- Calculer le prix total
  v_total_price := v_base_price + (v_price_per_hour * v_duration_hours);
  
  -- Appliquer le bonus pour les techniciens expérimentés
  IF v_technician_level = 'expert' AND v_bonus_percentage > 0 THEN
    v_total_price := v_total_price * (1 + v_bonus_percentage / 100);
  END IF;
  
  RETURN v_total_price;
END;
$$ LANGUAGE plpgsql;

-- Politiques RLS pour les nouvelles tables
ALTER TABLE mission_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE targeted_technicians ENABLE ROW LEVEL SECURITY;

-- Politiques pour mission_pricing
CREATE POLICY "Everyone can view mission pricing" ON mission_pricing FOR SELECT USING (true);
CREATE POLICY "Admins can manage mission pricing" ON mission_pricing FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour targeted_technicians
CREATE POLICY "Technicians can view own selections" ON targeted_technicians FOR SELECT USING (auth.uid() = technician_id);
CREATE POLICY "Admins can view all selections" ON targeted_technicians FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage selections" ON targeted_technicians FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Trigger pour updated_at sur mission_pricing
CREATE TRIGGER update_mission_pricing_updated_at BEFORE UPDATE ON mission_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement un forfait de rémunération lors de la création d'un événement
CREATE OR REPLACE FUNCTION create_default_mission_pricing()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO mission_pricing (event_id, base_price, price_per_hour, bonus_percentage)
  VALUES (NEW.id, 50.00, 25.00, 10.00);
  
  UPDATE events SET pricing_id = (SELECT id FROM mission_pricing WHERE event_id = NEW.id ORDER BY created_at DESC LIMIT 1)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer automatiquement un forfait lors de la création d'un événement
CREATE TRIGGER create_mission_pricing_on_event_insert
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION create_default_mission_pricing(); 