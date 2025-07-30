-- Script simple pour corriger le problème des exigences en techniciens
-- À exécuter dans l'éditeur SQL de Supabase

-- ÉTAPE 1: SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
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
DROP POLICY IF EXISTS "allow_all_for_authenticated_users" ON event_requirements;
DROP POLICY IF EXISTS "authenticated_users_can_insert" ON event_requirements;
DROP POLICY IF EXISTS "everyone_can_select" ON event_requirements;
DROP POLICY IF EXISTS "authenticated_users_can_update" ON event_requirements;
DROP POLICY IF EXISTS "authenticated_users_can_delete" ON event_requirements;

-- ÉTAPE 2: S'ASSURER QUE RLS EST ACTIVÉ
ALTER TABLE event_requirements ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 3: CRÉER UNE SEULE POLITIQUE TRÈS PERMISSIVE
-- Cette politique permet tout aux utilisateurs authentifiés
CREATE POLICY "allow_all_for_authenticated" ON event_requirements 
FOR ALL USING (auth.uid() IS NOT NULL);

-- ÉTAPE 4: CRÉER UNE POLITIQUE POUR LES ADMINISTRATEURS
CREATE POLICY "admins_can_do_everything" ON event_requirements 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ÉTAPE 5: CRÉER UNE POLITIQUE POUR LA LECTURE PUBLIQUE
CREATE POLICY "everyone_can_read" ON event_requirements 
FOR SELECT USING (true);

-- ÉTAPE 6: VÉRIFIER LES POLITIQUES CRÉÉES
SELECT 
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'event_requirements'
ORDER BY policyname;

-- ÉTAPE 7: TESTER L'INSERTION (en tant qu'admin)
-- Cette insertion devrait fonctionner car nous sommes admin
INSERT INTO event_requirements (event_id, skill_id, count, level) 
SELECT 
  e.id as event_id,
  s.id as skill_id,
  1 as count,
  'beginner' as level
FROM events e, skills s
WHERE e.id = (SELECT id FROM events LIMIT 1)
AND s.id = (SELECT id FROM skills LIMIT 1)
LIMIT 1;

-- ÉTAPE 8: VÉRIFIER L'INSERTION
SELECT 
  'Test insertion' as info,
  COUNT(*) as total_requirements
FROM event_requirements;

-- ÉTAPE 9: AFFICHER LES RÉSULTATS
SELECT 
  er.id,
  er.event_id,
  er.skill_id,
  er.count,
  er.level,
  e.title as event_title,
  s.name as skill_name,
  er.created_at
FROM event_requirements er
LEFT JOIN events e ON er.event_id = e.id
LEFT JOIN skills s ON er.skill_id = s.id
ORDER BY er.created_at DESC; 