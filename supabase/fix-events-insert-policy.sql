-- Script de correction pour permettre l'insertion d'événements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier l'état actuel des politiques
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'events'
ORDER BY policyname;

-- 2. Supprimer toutes les anciennes politiques sur events
DROP POLICY IF EXISTS "Everyone can view events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Authenticated users can view events" ON events;
DROP POLICY IF EXISTS "Admins can insert events" ON events;
DROP POLICY IF EXISTS "Admins can update events" ON events;
DROP POLICY IF EXISTS "Admins can delete events" ON events;
DROP POLICY IF EXISTS "Users can view events" ON events;
DROP POLICY IF EXISTS "Event creators can update their events" ON events;
DROP POLICY IF EXISTS "Event creators can delete their events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Admins can update all events" ON events;
DROP POLICY IF EXISTS "Admins can delete all events" ON events;

-- 3. S'assurer que RLS est activé
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 4. Créer des politiques permissives pour le développement
-- Politique pour permettre la lecture à tous
CREATE POLICY "Everyone can view events" ON events 
FOR SELECT USING (true);

-- Politique pour permettre l'insertion aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can create events" ON events 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour permettre la mise à jour aux créateurs et admins
CREATE POLICY "Event creators can update their events" ON events 
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update all events" ON events 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Politique pour permettre la suppression aux créateurs et admins
CREATE POLICY "Event creators can delete their events" ON events 
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete all events" ON events 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- 5. Vérifier que les nouvelles politiques sont créées
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'events'
ORDER BY policyname;

-- 6. Tester une insertion (optionnel - décommentez pour tester)
-- INSERT INTO events (title, description, start_date, end_date, location, type_id, status, created_by)
-- VALUES ('Test Event', 'Test Description', '2024-01-01 10:00:00', '2024-01-01 12:00:00', 'Test Location', '1', 'draft', auth.uid());

-- 7. Vérifier les permissions sur la table
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'events' AND table_schema = 'public'
ORDER BY grantee, privilege_type; 