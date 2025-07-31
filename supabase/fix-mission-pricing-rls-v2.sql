-- Script pour corriger les politiques RLS de mission_pricing (Version 2)
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Everyone can view mission pricing" ON mission_pricing;
DROP POLICY IF EXISTS "Admins can manage mission pricing" ON mission_pricing;
DROP POLICY IF EXISTS "Technicians can view pricing for assigned events" ON mission_pricing;
DROP POLICY IF EXISTS "Admins can view all mission pricing" ON mission_pricing;

-- Créer de nouvelles politiques plus permissives pour le débogage
-- Politique 1: Permettre à tous les utilisateurs authentifiés de voir les pricing
CREATE POLICY "Authenticated users can view mission pricing" ON mission_pricing 
FOR SELECT USING (auth.role() = 'authenticated');

-- Politique 2: Permettre aux admins de gérer les pricing
CREATE POLICY "Admins can manage mission pricing" ON mission_pricing 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politique 3: Permettre aux techniciens de voir les pricing des événements auxquels ils sont assignés
CREATE POLICY "Technicians can view pricing for assigned events" ON mission_pricing 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM assignments a 
    WHERE a.event_id = mission_pricing.event_id 
    AND a.technician_id = auth.uid()
  )
);

-- Vérifier que les politiques sont bien appliquées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'mission_pricing';

-- Vérifier s'il y a des données dans mission_pricing
SELECT COUNT(*) as total_pricing_records FROM mission_pricing;

-- Vérifier les assignations existantes
SELECT COUNT(*) as total_assignments FROM assignments;

-- Vérifier les événements avec pricing
SELECT 
  e.id as event_id,
  e.title as event_title,
  mp.id as pricing_id,
  mp.base_price,
  mp.price_per_hour
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
ORDER BY e.created_at DESC
LIMIT 10; 