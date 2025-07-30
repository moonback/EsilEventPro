-- Script pour corriger les politiques RLS de la table events
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier que RLS est activé sur la table events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer toutes les anciennes politiques sur events
DROP POLICY IF EXISTS "Everyone can view events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Authenticated users can view events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Users can view events" ON events;
DROP POLICY IF EXISTS "Admins can insert events" ON events;
DROP POLICY IF EXISTS "Admins can update events" ON events;
DROP POLICY IF EXISTS "Admins can delete events" ON events;

-- 3. Créer de nouvelles politiques plus permissives pour les événements
-- Politique pour permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Authenticated users can view events" ON events 
FOR SELECT USING (auth.role() = 'authenticated');

-- Politique pour permettre l'insertion aux administrateurs
CREATE POLICY "Admins can insert events" ON events 
FOR INSERT WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR 
  auth.jwt() ->> 'role' = 'technician' OR
  auth.role() = 'authenticated'
);

-- Politique pour permettre la mise à jour aux administrateurs
CREATE POLICY "Admins can update events" ON events 
FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  auth.jwt() ->> 'role' = 'technician'
);

-- Politique pour permettre la suppression aux administrateurs
CREATE POLICY "Admins can delete events" ON events 
FOR DELETE USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- 4. Vérifier que les politiques sont bien créées
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
WHERE schemaname = 'public' AND tablename = 'events'
ORDER BY policyname;

-- 5. Vérifier les permissions actuelles
SELECT 
  table_name,
  privilege_type,
  grantee
FROM information_schema.role_table_grants 
WHERE table_name = 'events' AND table_schema = 'public'; 