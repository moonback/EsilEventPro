-- Script de nettoyage complet et recréation des politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- ÉTAPE 1: SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- Cette requête supprime automatiquement toutes les politiques existantes
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('users', 'skills', 'user_skills', 'assignments', 'events', 'event_types', 'event_requirements')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "%s" ON %s', 
                      policy_record.policyname, 
                      policy_record.tablename);
    END LOOP;
END $$;

-- ÉTAPE 2: CRÉER LES NOUVELLES POLITIQUES
-- Politiques pour les utilisateurs
CREATE POLICY "Admins can manage all users" ON users 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view all users" ON users 
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les compétences
CREATE POLICY "Admins can manage skills" ON skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Everyone can view skills" ON skills 
FOR SELECT USING (true);

-- Politiques pour les compétences utilisateurs
CREATE POLICY "Admins can manage user skills" ON user_skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own skills" ON user_skills 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user skills" ON user_skills 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les affectations
CREATE POLICY "Admins can manage assignments" ON assignments 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated users can create assignments" ON assignments 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own assignments" ON assignments 
FOR SELECT USING (auth.uid() = technician_id);

CREATE POLICY "Admins can view all assignments" ON assignments 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Technicians can update own assignments" ON assignments 
FOR UPDATE USING (auth.uid() = technician_id);

CREATE POLICY "Admins can delete assignments" ON assignments 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Politiques pour les événements
CREATE POLICY "Admins can manage events" ON events 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated users can create events" ON events 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Everyone can view events" ON events 
FOR SELECT USING (true);

-- Politiques pour les types d'événements
CREATE POLICY "Admins can manage event types" ON event_types 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Everyone can view event types" ON event_types 
FOR SELECT USING (true);

-- Politiques pour les exigences d'événements
CREATE POLICY "Admins can manage event requirements" ON event_requirements 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated users can create event requirements" ON event_requirements 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Everyone can view event requirements" ON event_requirements 
FOR SELECT USING (true);

-- ÉTAPE 3: VÉRIFICATION
-- Afficher toutes les politiques créées
SELECT 
    tablename,
    policyname,
    cmd,
    permissive as policy_type
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('users', 'skills', 'user_skills', 'assignments', 'events', 'event_types', 'event_requirements')
ORDER BY tablename, policyname; 