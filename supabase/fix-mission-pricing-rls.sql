-- Script pour corriger les politiques RLS de mission_pricing
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Everyone can view mission pricing" ON mission_pricing;
DROP POLICY IF EXISTS "Admins can manage mission pricing" ON mission_pricing;

-- Créer de nouvelles politiques plus spécifiques
-- Les techniciens peuvent voir les tarifications des événements auxquels ils sont assignés
CREATE POLICY "Technicians can view pricing for assigned events" ON mission_pricing 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM assignments a 
    WHERE a.event_id = mission_pricing.event_id 
    AND a.technician_id = auth.uid()
  )
);

-- Les admins peuvent voir toutes les tarifications
CREATE POLICY "Admins can view all mission pricing" ON mission_pricing 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Les admins peuvent gérer toutes les tarifications
CREATE POLICY "Admins can manage mission pricing" ON mission_pricing 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Vérifier que les politiques sont bien appliquées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'mission_pricing'; 