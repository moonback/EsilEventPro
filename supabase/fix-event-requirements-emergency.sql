-- Script d'urgence pour corriger le problème des exigences en techniciens
-- À exécuter dans l'éditeur SQL de Supabase

-- ÉTAPE 1: SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Supprimer toutes les politiques sur event_requirements
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'event_requirements' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "%s" ON event_requirements', policy_record.policyname);
    END LOOP;
END $$;

-- ÉTAPE 2: DÉSACTIVER TEMPORAIREMENT RLS POUR PERMETTRE L'INSERTION
ALTER TABLE event_requirements DISABLE ROW LEVEL SECURITY;

-- ÉTAPE 3: VÉRIFIER QUE RLS EST DÉSACTIVÉ
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN 'RLS activé'
    ELSE 'RLS désactivé'
  END as rls_status
FROM pg_tables 
WHERE tablename = 'event_requirements';

-- ÉTAPE 4: TESTER L'INSERTION (devrait fonctionner maintenant)
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

-- ÉTAPE 5: VÉRIFIER L'INSERTION
SELECT 
  'Test insertion (RLS désactivé)' as info,
  COUNT(*) as total_requirements
FROM event_requirements;

-- ÉTAPE 6: AFFICHER LES RÉSULTATS
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

-- ÉTAPE 7: RÉACTIVER RLS AVEC DES POLITIQUES TRÈS PERMISSIVES
ALTER TABLE event_requirements ENABLE ROW LEVEL SECURITY;

-- Créer une politique qui permet tout
CREATE POLICY "emergency_allow_all" ON event_requirements 
FOR ALL USING (true);

-- ÉTAPE 8: VÉRIFIER LES NOUVELLES POLITIQUES
SELECT 
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'event_requirements'
ORDER BY policyname;

-- ÉTAPE 9: TESTER L'INSERTION AVEC RLS RÉACTIVÉ
INSERT INTO event_requirements (event_id, skill_id, count, level) 
SELECT 
  e.id as event_id,
  s.id as skill_id,
  2 as count,
  'intermediate' as level
FROM events e, skills s
WHERE e.id = (SELECT id FROM events LIMIT 1)
AND s.id = (SELECT id FROM skills LIMIT 1)
LIMIT 1;

-- ÉTAPE 10: VÉRIFIER FINALE
SELECT 
  'Test final' as info,
  COUNT(*) as total_requirements
FROM event_requirements; 