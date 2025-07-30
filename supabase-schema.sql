-- Script de création des tables pour EventPro
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'technician')),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des compétences
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('sound', 'lighting', 'video', 'stage')),
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison utilisateurs-compétences
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Table des types d'événements
CREATE TABLE IF NOT EXISTS event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) NOT NULL,
  default_duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des événements
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255) NOT NULL,
  type_id UUID REFERENCES event_types(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'confirmed', 'completed', 'cancelled')),
  created_by UUID REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des exigences en techniciens pour les événements
CREATE TABLE IF NOT EXISTS event_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  count INTEGER NOT NULL DEFAULT 1,
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des affectations
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  response_date TIMESTAMP WITH TIME ZONE,
  decline_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, technician_id)
);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Politiques RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Admins can insert users" ON users FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can delete users" ON users FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les compétences
CREATE POLICY "Everyone can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Admins can manage skills" ON skills FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les types d'événements
CREATE POLICY "Everyone can view event types" ON event_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage event types" ON event_types FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les événements
CREATE POLICY "Everyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les exigences d'événements
CREATE POLICY "Everyone can view event requirements" ON event_requirements FOR SELECT USING (true);
CREATE POLICY "Admins can manage event requirements" ON event_requirements FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les affectations
CREATE POLICY "Users can view own assignments" ON assignments FOR SELECT USING (auth.uid() = technician_id);
CREATE POLICY "Admins can view all assignments" ON assignments FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage assignments" ON assignments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Technicians can update own assignments" ON assignments FOR UPDATE USING (auth.uid() = technician_id);

-- Insertion des données par défaut
INSERT INTO skills (id, name, category, level) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Mixage Audio', 'sound', 'expert'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Installation Sono', 'sound', 'intermediate'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Éclairage Scène', 'lighting', 'expert'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Projecteurs LED', 'lighting', 'intermediate'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Régie Vidéo', 'video', 'expert')
ON CONFLICT (id) DO NOTHING;

INSERT INTO event_types (id, name, color, default_duration) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Concert', '#3B82F6', 6),
  ('660e8400-e29b-41d4-a716-446655440002', 'Conférence', '#10B981', 8),
  ('660e8400-e29b-41d4-a716-446655440003', 'Mariage', '#F59E0B', 12),
  ('660e8400-e29b-41d4-a716-446655440004', 'Festival', '#EF4444', 24),
  ('660e8400-e29b-41d4-a716-446655440005', 'Spectacle', '#8B5CF6', 4)
ON CONFLICT (id) DO NOTHING;

-- Création d'un utilisateur admin par défaut (mot de passe: admin123)
-- Note: L'utilisateur doit être créé via Supabase Auth, puis le profil dans la table users 