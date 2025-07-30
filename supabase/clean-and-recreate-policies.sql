-- Script pour nettoyer et recréer toutes les politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. NETTOYAGE COMPLET - Supprimer TOUTES les politiques existantes

-- Politiques d'affectations
DROP POLICY IF EXISTS "Users can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can view all assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can manage assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can update own assignments" ON assignments;
DROP POLICY IF EXISTS "Authenticated users can view assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can manage all assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can create assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can delete assignments" ON assignments;
DROP POLICY IF EXISTS "Enable read access for all users" ON assignments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON assignments;
DROP POLICY IF EXISTS "Enable update for users based on technician_id" ON assignments;
DROP POLICY IF EXISTS "Enable delete for users based on technician_id" ON assignments;

-- Politiques d'événements
DROP POLICY IF EXISTS "Everyone can view events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Authenticated users can view events" ON events;

-- Politiques d'utilisateurs
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Authenticated users can view users" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;

-- Politiques de compétences
DROP POLICY IF EXISTS "Everyone can view skills" ON skills;
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can view skills" ON skills;

-- Politiques de types d'événements
DROP POLICY IF EXISTS "Everyone can view event types" ON event_types;
DROP POLICY IF EXISTS "Admins can manage event types" ON event_types;
DROP POLICY IF EXISTS "Authenticated users can view event types" ON event_types;

-- Politiques d'exigences d'événements
DROP POLICY IF EXISTS "Everyone can view event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Admins can manage event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Authenticated users can view event requirements" ON event_requirements;

-- Politiques de compétences utilisateur
DROP POLICY IF EXISTS "Everyone can view user skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can manage user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;
DROP POLICY IF EXISTS "Authenticated users can view user skills" ON user_skills;

-- 2. DÉSACTIVER TEMPORAIREMENT RLS POUR LE NETTOYAGE
ALTER TABLE assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_requirements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills DISABLE ROW LEVEL SECURITY;

-- 3. RÉACTIVER RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- 4. CRÉER LES NOUVELLES POLITIQUES

-- Politiques pour les affectations
CREATE POLICY "assignments_select_all" ON assignments 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "assignments_insert_admin" ON assignments 
FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "assignments_update_own" ON assignments 
FOR UPDATE USING (auth.uid() = technician_id);

CREATE POLICY "assignments_delete_admin" ON assignments 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les événements
CREATE POLICY "events_select_all" ON events 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "events_manage_admin" ON events 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les utilisateurs
CREATE POLICY "users_select_all" ON users 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "users_manage_admin" ON users 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "users_update_own" ON users 
FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les compétences
CREATE POLICY "skills_select_all" ON skills 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "skills_manage_admin" ON skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les types d'événements
CREATE POLICY "event_types_select_all" ON event_types 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "event_types_manage_admin" ON event_types 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les exigences d'événements
CREATE POLICY "event_requirements_select_all" ON event_requirements 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "event_requirements_manage_admin" ON event_requirements 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les compétences utilisateur
CREATE POLICY "user_skills_select_all" ON user_skills 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "user_skills_manage_admin" ON user_skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "user_skills_manage_own" ON user_skills 
FOR ALL USING (auth.uid() = user_id);

-- 5. VÉRIFICATION - Afficher toutes les politiques créées
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

-- 6. TEST - Vérifier que les politiques fonctionnent
-- Cette requête devrait fonctionner pour un utilisateur authentifié
-- SELECT COUNT(*) FROM assignments; 