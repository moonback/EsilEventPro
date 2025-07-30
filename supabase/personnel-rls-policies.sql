-- Politiques RLS pour la gestion du personnel
-- À exécuter dans l'éditeur SQL de Supabase

-- Politiques pour les utilisateurs (gestion du personnel)
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Créer de nouvelles politiques pour les utilisateurs
CREATE POLICY "Admins can manage all users" ON users 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view all users" ON users 
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les compétences
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
DROP POLICY IF EXISTS "Everyone can view skills" ON skills;

CREATE POLICY "Admins can manage skills" ON skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Everyone can view skills" ON skills 
FOR SELECT USING (true);

-- Politiques pour les compétences utilisateurs
DROP POLICY IF EXISTS "Admins can manage user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can view own skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can view all user skills" ON user_skills;

CREATE POLICY "Admins can manage user skills" ON user_skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own skills" ON user_skills 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user skills" ON user_skills 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les affectations
DROP POLICY IF EXISTS "Admins can manage assignments" ON assignments;
DROP POLICY IF EXISTS "Users can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can update own assignments" ON assignments;

CREATE POLICY "Admins can manage assignments" ON assignments 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own assignments" ON assignments 
FOR SELECT USING (auth.uid() = technician_id);

CREATE POLICY "Technicians can update own assignments" ON assignments 
FOR UPDATE USING (auth.uid() = technician_id);

-- Politiques pour les événements (pour les affectations)
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Everyone can view events" ON events;

CREATE POLICY "Admins can manage events" ON events 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Everyone can view events" ON events 
FOR SELECT USING (true);

-- Politiques pour les types d'événements
DROP POLICY IF EXISTS "Admins can manage event types" ON event_types;
DROP POLICY IF EXISTS "Everyone can view event types" ON event_types;

CREATE POLICY "Admins can manage event types" ON event_types 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Everyone can view event types" ON event_types 
FOR SELECT USING (true);

-- Politiques pour les exigences d'événements
DROP POLICY IF EXISTS "Admins can manage event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Everyone can view event requirements" ON event_requirements;

CREATE POLICY "Admins can manage event requirements" ON event_requirements 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Everyone can view event requirements" ON event_requirements 
FOR SELECT USING (true); 