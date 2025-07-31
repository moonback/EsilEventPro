-- Script pour corriger le calcul du prix de mission
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS calculate_mission_price(UUID, UUID);

-- Créer la nouvelle fonction corrigée
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
  -- Récupérer les informations de tarification directement par event_id
  SELECT mp.base_price, mp.price_per_hour, mp.bonus_percentage
  INTO v_base_price, v_price_per_hour, v_bonus_percentage
  FROM mission_pricing mp
  WHERE mp.event_id = p_event_id
  ORDER BY mp.updated_at DESC
  LIMIT 1;
  
  -- Si aucun pricing trouvé, retourner 0
  IF v_base_price IS NULL THEN
    RETURN 0;
  END IF;
  
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

-- Vérifier que la fonction fonctionne correctement
-- Test avec un événement existant (sans technicien spécifique)
SELECT 
  e.id as event_id,
  e.title as event_title,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600 as duration_hours,
  mp.base_price + (mp.price_per_hour * EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600) as manual_calculation
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
WHERE mp.id IS NOT NULL
ORDER BY e.created_at DESC
LIMIT 5;

-- Vérifier les données de pricing existantes
SELECT 
  mp.id,
  mp.event_id,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  e.title as event_title,
  e.start_date,
  e.end_date
FROM mission_pricing mp
JOIN events e ON e.id = mp.event_id
ORDER BY mp.updated_at DESC
LIMIT 10; 