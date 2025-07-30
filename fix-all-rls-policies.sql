-- Script complet pour corriger toutes les politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. CORRECTION DES POLITIQUES D'AFFECTATIONS
-- Supprimer les anciennes politiques d'affectation
DROP POLICY IF EXISTS "Users can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can view all assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can manage assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can update own assignments" ON assignments;

-- Créer de nouvelles politiques pour les affectations
CREATE POLICY "Authenticated users can view assignments" ON assignments 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all assignments" ON assignments 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Technicians can update own assignments" ON assignments 
FOR UPDATE USING (auth.uid() = technician_id);

CREATE POLICY "Technicians can view own assignments" ON assignments 
FOR SELECT USING (auth.uid() = technician_id);

CREATE POLICY "Admins can create assignments" ON assignments 
FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete assignments" ON assignments 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- 2. CORRECTION DES POLITIQUES D'ÉVÉNEMENTS
-- Supprimer les anciennes politiques d'événements
DROP POLICY IF EXISTS "Everyone can view events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;

-- Créer de nouvelles politiques pour les événements
CREATE POLICY "Authenticated users can view events" ON events 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage events" ON events 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 3. CORRECTION DES POLITIQUES D'UTILISATEURS
-- Supprimer les anciennes politiques d'utilisateurs
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Créer de nouvelles politiques pour les utilisateurs
CREATE POLICY "Authenticated users can view users" ON users 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage users" ON users 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE USING (auth.uid() = id);

-- 4. CORRECTION DES POLITIQUES DE COMPÉTENCES
-- Supprimer les anciennes politiques de compétences
DROP POLICY IF EXISTS "Everyone can view skills" ON skills;
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;

-- Créer de nouvelles politiques pour les compétences
CREATE POLICY "Authenticated users can view skills" ON skills 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage skills" ON skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 5. CORRECTION DES POLITIQUES DE TYPES D'ÉVÉNEMENTS
-- Supprimer les anciennes politiques de types d'événements
DROP POLICY IF EXISTS "Everyone can view event types" ON event_types;
DROP POLICY IF EXISTS "Admins can manage event types" ON event_types;

-- Créer de nouvelles politiques pour les types d'événements
CREATE POLICY "Authenticated users can view event types" ON event_types 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage event types" ON event_types 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 6. CORRECTION DES POLITIQUES D'EXIGENCES D'ÉVÉNEMENTS
-- Supprimer les anciennes politiques d'exigences d'événements
DROP POLICY IF EXISTS "Everyone can view event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Admins can manage event requirements" ON event_requirements;

-- Créer de nouvelles politiques pour les exigences d'événements
CREATE POLICY "Authenticated users can view event requirements" ON event_requirements 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage event requirements" ON event_requirements 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 7. CORRECTION DES POLITIQUES DE COMPÉTENCES UTILISATEUR
-- Supprimer les anciennes politiques de compétences utilisateur
DROP POLICY IF EXISTS "Everyone can view user skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can manage user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;

-- Créer de nouvelles politiques pour les compétences utilisateur
CREATE POLICY "Authenticated users can view user skills" ON user_skills 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage user skills" ON user_skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can manage own skills" ON user_skills 
FOR ALL USING (auth.uid() = user_id);

-- 8. S'ASSURER QUE RLS EST ACTIVÉ SUR TOUTES LES TABLES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- 9. AFFICHER LES POLITIQUES ACTUELLES POUR VÉRIFICATION
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 