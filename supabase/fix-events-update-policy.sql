-- Script pour corriger les politiques RLS pour la mise à jour des événements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les politiques existantes sur la table events
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'events'
ORDER BY policyname;

-- 2. Supprimer les anciennes politiques de mise à jour si elles existent
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Admins can update all events" ON events;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON events;

-- 3. Créer une nouvelle politique pour permettre la mise à jour des événements
CREATE POLICY "Enable update for authenticated users" ON events
FOR UPDATE USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 4. Alternative : Politique plus permissive pour les administrateurs
CREATE POLICY "Admins can update all events" ON events
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- 5. Vérifier que RLS est activé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'events';

-- 6. S'assurer que RLS est activé
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 7. Tester la mise à jour d'un événement
-- Remplacez 'EVENT_ID' par l'ID d'un événement existant
UPDATE events 
SET status = 'published', updated_at = NOW()
WHERE id = 'EVENT_ID';

-- 8. Vérifier les politiques après correction
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'events'
ORDER BY policyname; 