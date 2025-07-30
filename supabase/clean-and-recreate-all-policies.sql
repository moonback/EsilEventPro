-- Nettoyage complet et recréation de toutes les politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- ========================================
-- NETTOYAGE COMPLET - SUPPRESSION DE TOUTES LES POLITIQUES
-- ========================================

-- Supprimer TOUTES les politiques existantes
DROP POLICY IF EXISTS "Everyone can view skills" ON skills;
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can create skills" ON skills;
DROP POLICY IF EXISTS "Admins can update skills" ON skills;
DROP POLICY IF EXISTS "Admins can delete skills" ON skills;

DROP POLICY IF EXISTS "Everyone can view event types" ON event_types;
DROP POLICY IF EXISTS "Admins can manage event types" ON event_types;
DROP POLICY IF EXISTS "Authenticated users can create event types" ON event_types;
DROP POLICY IF EXISTS "Admins can update event types" ON event_types;
DROP POLICY IF EXISTS "Admins can delete event types" ON event_types;

DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Everyone can view users" ON users;
DROP POLICY IF EXISTS "Authenticated users can create users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

DROP POLICY IF EXISTS "Everyone can view user skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can manage user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;
DROP POLICY IF EXISTS "Authenticated users can create user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can update own skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can update all user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can delete own skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can delete all user skills" ON user_skills;

DROP POLICY IF EXISTS "Everyone can view events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Event creators can update their events" ON events;
DROP POLICY IF EXISTS "Admins can update all events" ON events;
DROP POLICY IF EXISTS "Event creators can delete their events" ON events;
DROP POLICY IF EXISTS "Admins can delete all events" ON events;

DROP POLICY IF EXISTS "Everyone can view event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Admins can manage event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Authenticated users can create event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Event creators can update their event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Admins can update all event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Event creators can delete their event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Admins can delete all event requirements" ON event_requirements;

DROP POLICY IF EXISTS "Users can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can view all assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can manage assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can update own assignments" ON assignments;
DROP POLICY IF EXISTS "Everyone can view assignments" ON assignments;
DROP POLICY IF EXISTS "Authenticated users can create assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can update all assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can delete assignments" ON assignments;

-- ========================================
-- RECRÉATION DES POLITIQUES
-- ========================================

-- TABLE SKILLS
CREATE POLICY "Everyone can view skills" ON skills 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create skills" ON skills 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update skills" ON skills 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete skills" ON skills 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- TABLE EVENT_TYPES
CREATE POLICY "Everyone can view event types" ON event_types 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create event types" ON event_types 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update event types" ON event_types 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete event types" ON event_types 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- TABLE USERS
CREATE POLICY "Everyone can view users" ON users 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create users" ON users 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all users" ON users 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete users" ON users 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- TABLE USER_SKILLS
CREATE POLICY "Everyone can view user skills" ON user_skills 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create user skills" ON user_skills 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own skills" ON user_skills 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all user skills" ON user_skills 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can delete own skills" ON user_skills 
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all user skills" ON user_skills 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- TABLE EVENTS
CREATE POLICY "Everyone can view events" ON events 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON events 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Event creators can update their events" ON events 
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update all events" ON events 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Event creators can delete their events" ON events 
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete all events" ON events 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- TABLE EVENT_REQUIREMENTS
CREATE POLICY "Everyone can view event requirements" ON event_requirements 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create event requirements" ON event_requirements 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Event creators can update their event requirements" ON event_requirements 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_requirements.event_id 
    AND events.created_by = auth.uid()
  )
);

CREATE POLICY "Admins can update all event requirements" ON event_requirements 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Event creators can delete their event requirements" ON event_requirements 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_requirements.event_id 
    AND events.created_by = auth.uid()
  )
);

CREATE POLICY "Admins can delete all event requirements" ON event_requirements 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- TABLE ASSIGNMENTS
CREATE POLICY "Everyone can view assignments" ON assignments 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create assignments" ON assignments 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Technicians can update own assignments" ON assignments 
FOR UPDATE USING (auth.uid() = technician_id);

CREATE POLICY "Admins can update all assignments" ON assignments 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete assignments" ON assignments 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- ========================================
-- VÉRIFICATION FINALE
-- ========================================
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 