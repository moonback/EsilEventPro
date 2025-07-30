-- Insérer les compétences par défaut si elles n'existent pas
INSERT INTO skills (id, name, category, level) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Mixage Audio', 'sound', 'expert'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Installation Sono', 'sound', 'intermediate'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Éclairage Scène', 'lighting', 'expert'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Projecteurs LED', 'lighting', 'intermediate'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Régie Vidéo', 'video', 'expert'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Captation Multi-Cam', 'video', 'expert'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Montage Vidéo', 'video', 'intermediate'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Installation Scène', 'stage', 'expert'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Décors', 'stage', 'intermediate'),
  ('550e8400-e29b-41d4-a716-446655440010', 'Sécurité', 'stage', 'beginner')
ON CONFLICT (id) DO NOTHING;

-- Insérer les types d'événements par défaut
INSERT INTO event_types (id, name, color, default_duration) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Concert', '#3B82F6', 6),
  ('660e8400-e29b-41d4-a716-446655440002', 'Conférence', '#10B981', 8),
  ('660e8400-e29b-41d4-a716-446655440003', 'Mariage', '#F59E0B', 12),
  ('660e8400-e29b-41d4-a716-446655440004', 'Festival', '#EF4444', 24),
  ('660e8400-e29b-41d4-a716-446655440005', 'Spectacle', '#8B5CF6', 4),
  ('660e8400-e29b-41d4-a716-446655440006', 'Exposition', '#06B6D4', 8),
  ('660e8400-e29b-41d4-a716-446655440007', 'Séminaire', '#84CC16', 6),
  ('660e8400-e29b-41d4-a716-446655440008', 'Soirée Privée', '#F97316', 4)
ON CONFLICT (id) DO NOTHING;

-- Supprimer la fonction existante si elle existe
DROP FUNCTION IF EXISTS create_user_with_skills(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, UUID[]);

-- Fonction pour créer un utilisateur avec ses compétences
CREATE OR REPLACE FUNCTION create_user_with_skills(
  p_user_id UUID,
  p_user_email TEXT,
  p_user_first_name TEXT,
  p_user_last_name TEXT,
  p_user_role TEXT,
  p_user_phone TEXT DEFAULT NULL,
  p_skill_ids UUID[] DEFAULT '{}'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  current_skill_id UUID;
  result JSON;
BEGIN
  -- Insérer l'utilisateur
  INSERT INTO users (
    id,
    email,
    first_name,
    last_name,
    role,
    phone
  ) VALUES (
    p_user_id,
    p_user_email,
    p_user_first_name,
    p_user_last_name,
    p_user_role,
    p_user_phone
  ) RETURNING id INTO new_user_id;

  -- Ajouter les compétences si fournies (vérifier qu'elles existent)
  IF array_length(p_skill_ids, 1) > 0 THEN
    FOREACH current_skill_id IN ARRAY p_skill_ids
    LOOP
      -- Vérifier que la compétence existe avant de l'ajouter
      IF EXISTS (SELECT 1 FROM skills WHERE id = current_skill_id) THEN
        INSERT INTO user_skills (user_id, skill_id)
        VALUES (new_user_id, current_skill_id)
        ON CONFLICT (user_id, skill_id) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- Retourner les données de l'utilisateur
  SELECT json_build_object(
    'id', u.id,
    'email', u.email,
    'firstName', u.first_name,
    'lastName', u.last_name,
    'role', u.role,
    'phone', u.phone,
    'createdAt', u.created_at,
    'updatedAt', u.updated_at
  ) INTO result
  FROM users u
  WHERE u.id = new_user_id;

  RETURN result;
END;
$$;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Allow user skills insertion" ON user_skills;

-- Politique pour permettre l'insertion d'utilisateurs (pour l'inscription)
CREATE POLICY "Allow user registration" ON users
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre l'insertion de compétences utilisateur
CREATE POLICY "Allow user skills insertion" ON user_skills
  FOR INSERT
  WITH CHECK (true); 