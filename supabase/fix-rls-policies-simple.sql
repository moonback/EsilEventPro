-- Script SQL simple pour corriger les politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer toutes les politiques existantes sur les tables events et event_requirements
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Supprimer toutes les politiques sur la table events
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'events'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON events';
    END LOOP;
    
    -- Supprimer toutes les politiques sur la table event_requirements
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'event_requirements'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON event_requirements';
    END LOOP;
END $$;

-- Créer les nouvelles politiques pour les événements
CREATE POLICY "authenticated_users_can_create_events" ON events 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "users_can_view_all_events" ON events 
FOR SELECT USING (true);

CREATE POLICY "event_creators_can_update_events" ON events 
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "admins_can_update_all_events" ON events 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "event_creators_can_delete_events" ON events 
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "admins_can_delete_all_events" ON events 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Créer les nouvelles politiques pour les exigences d'événements
CREATE POLICY "authenticated_users_can_create_requirements" ON event_requirements 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "everyone_can_view_requirements" ON event_requirements 
FOR SELECT USING (true);

CREATE POLICY "event_creators_can_update_requirements" ON event_requirements 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_requirements.event_id 
    AND events.created_by = auth.uid()
  )
);

CREATE POLICY "admins_can_update_all_requirements" ON event_requirements 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "event_creators_can_delete_requirements" ON event_requirements 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_requirements.event_id 
    AND events.created_by = auth.uid()
  )
);

CREATE POLICY "admins_can_delete_all_requirements" ON event_requirements 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin'); 