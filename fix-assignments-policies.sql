-- Script pour corriger les politiques RLS des affectations
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer les anciennes politiques d'affectation
DROP POLICY IF EXISTS "Users can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can view all assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can manage assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can update own assignments" ON assignments;

-- Créer de nouvelles politiques plus permissives pour les affectations
-- Permettre à tous les utilisateurs authentifiés de voir les affectations
CREATE POLICY "Authenticated users can view assignments" ON assignments 
FOR SELECT USING (auth.role() = 'authenticated');

-- Permettre aux admins de gérer toutes les affectations
CREATE POLICY "Admins can manage all assignments" ON assignments 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Permettre aux techniciens de mettre à jour leurs propres affectations
CREATE POLICY "Technicians can update own assignments" ON assignments 
FOR UPDATE USING (auth.uid() = technician_id);

-- Permettre aux techniciens de voir leurs propres affectations
CREATE POLICY "Technicians can view own assignments" ON assignments 
FOR SELECT USING (auth.uid() = technician_id);

-- Permettre aux admins de créer des affectations
CREATE POLICY "Admins can create assignments" ON assignments 
FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Permettre aux admins de supprimer des affectations
CREATE POLICY "Admins can delete assignments" ON assignments 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Vérifier que RLS est activé
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Afficher les politiques actuelles pour vérification
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'assignments'; 