-- Correction des politiques RLS pour permettre aux utilisateurs authentifiés de créer des événements
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer TOUTES les anciennes politiques pour les événements
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Everyone can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Users can view all events" ON events;
DROP POLICY IF EXISTS "Event creators can update their events" ON events;
DROP POLICY IF EXISTS "Admins can update all events" ON events;
DROP POLICY IF EXISTS "Event creators can delete their events" ON events;
DROP POLICY IF EXISTS "Admins can delete all events" ON events;

-- Créer de nouvelles politiques plus permissives
CREATE POLICY "Authenticated users can create events" ON events 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view all events" ON events 
FOR SELECT USING (true);

CREATE POLICY "Event creators can update their events" ON events 
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update all events" ON events 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Event creators can delete their events" ON events 
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete all events" ON events 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Supprimer TOUTES les anciennes politiques pour les exigences d'événements
DROP POLICY IF EXISTS "Admins can manage event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Everyone can view event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Authenticated users can create event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Event creators can update their event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Admins can update all event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Event creators can delete their event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Admins can delete all event requirements" ON event_requirements;

-- Créer de nouvelles politiques pour les exigences d'événements
CREATE POLICY "Authenticated users can create event requirements" ON event_requirements 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Everyone can view event requirements" ON event_requirements 
FOR SELECT USING (true);

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