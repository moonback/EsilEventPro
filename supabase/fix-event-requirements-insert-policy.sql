-- Correction des politiques RLS pour la table event_requirements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. SUPPRIMER TOUTES LES ANCIENNES POLITIQUES SUR event_requirements
DROP POLICY IF EXISTS "Admins can manage event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Everyone can view event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Authenticated users can create event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Event creators can update their event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Admins can update all event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Event creators can delete their event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Admins can delete all event requirements" ON event_requirements;
DROP POLICY IF EXISTS "event_requirements_select_all" ON event_requirements;
DROP POLICY IF EXISTS "event_requirements_manage_admin" ON event_requirements;
DROP POLICY IF EXISTS "authenticated_users_can_create_requirements" ON event_requirements;
DROP POLICY IF EXISTS "everyone_can_view_requirements" ON event_requirements;
DROP POLICY IF EXISTS "event_creators_can_update_requirements" ON event_requirements;
DROP POLICY IF EXISTS "admins_can_update_all_requirements" ON event_requirements;
DROP POLICY IF EXISTS "event_creators_can_delete_requirements" ON event_requirements;
DROP POLICY IF EXISTS "admins_can_delete_all_requirements" ON event_requirements;

-- 2. S'ASSURER QUE RLS EST ACTIVÉ
ALTER TABLE event_requirements ENABLE ROW LEVEL SECURITY;

-- 3. CRÉER LES NOUVELLES POLITIQUES PERMISSIVES
-- Permettre à tous les utilisateurs authentifiés de créer des exigences
CREATE POLICY "authenticated_users_can_create_requirements" ON event_requirements 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Permettre à tous de voir les exigences
CREATE POLICY "everyone_can_view_requirements" ON event_requirements 
FOR SELECT USING (true);

-- Permettre aux créateurs d'événements de mettre à jour leurs exigences
CREATE POLICY "event_creators_can_update_requirements" ON event_requirements 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_requirements.event_id 
    AND events.created_by = auth.uid()
  )
);

-- Permettre aux administrateurs de mettre à jour toutes les exigences
CREATE POLICY "admins_can_update_all_requirements" ON event_requirements 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Permettre aux créateurs d'événements de supprimer leurs exigences
CREATE POLICY "event_creators_can_delete_requirements" ON event_requirements 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_requirements.event_id 
    AND events.created_by = auth.uid()
  )
);

-- Permettre aux administrateurs de supprimer toutes les exigences
CREATE POLICY "admins_can_delete_all_requirements" ON event_requirements 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- 4. VÉRIFIER QUE LES POLITIQUES SONT CRÉÉES
SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'event_requirements'
ORDER BY policyname;

-- 5. TESTER L'ACCÈS (à exécuter en tant qu'utilisateur authentifié)
-- Cette requête devrait fonctionner pour un utilisateur authentifié
SELECT COUNT(*) as total_requirements FROM event_requirements; 