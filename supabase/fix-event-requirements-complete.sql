-- Script complet pour corriger le problème de sauvegarde des exigences en techniciens
-- À exécuter dans l'éditeur SQL de Supabase

-- ÉTAPE 1: NETTOYER TOUTES LES POLITIQUES EXISTANTES
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

-- ÉTAPE 2: S'ASSURER QUE RLS EST ACTIVÉ
ALTER TABLE event_requirements ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 3: CRÉER DES POLITIQUES TRÈS PERMISSIVES POUR LE TEST
-- Ces politiques permettent à tous les utilisateurs authentifiés de tout faire
CREATE POLICY "allow_all_for_authenticated_users" ON event_requirements 
FOR ALL USING (auth.uid() IS NOT NULL);

-- Politique alternative plus spécifique
CREATE POLICY "authenticated_users_can_insert" ON event_requirements 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "everyone_can_select" ON event_requirements 
FOR SELECT USING (true);

CREATE POLICY "authenticated_users_can_update" ON event_requirements 
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_users_can_delete" ON event_requirements 
FOR DELETE USING (auth.uid() IS NOT NULL);

-- ÉTAPE 4: VÉRIFIER QUE LES TABLES EXISTENT ET ONT DES DONNÉES
-- Vérifier les événements
SELECT 
  'Événements' as table_name,
  COUNT(*) as record_count
FROM events;

-- Vérifier les compétences
SELECT 
  'Compétences' as table_name,
  COUNT(*) as record_count
FROM skills;

-- ÉTAPE 5: TESTER L'INSERTION (à décommenter et modifier avec des UUIDs réels)
-- Remplacez les UUIDs par des valeurs réelles de votre base de données

/*
-- Exemple d'insertion de test (à décommenter et modifier)
INSERT INTO event_requirements (event_id, skill_id, count, level) 
VALUES (
  (SELECT id FROM events LIMIT 1),  -- Premier événement
  (SELECT id FROM skills LIMIT 1),  -- Première compétence
  2,
  'intermediate'
);
*/

-- ÉTAPE 6: VÉRIFIER LES POLITIQUES CRÉÉES
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

-- ÉTAPE 7: AFFICHER LES EXIGENCES EXISTANTES
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

-- ÉTAPE 8: VÉRIFIER LES PERMISSIONS DE L'UTILISATEUR
SELECT 
  'Permissions utilisateur' as info,
  current_user as current_user,
  session_user as session_user,
  auth.uid() as auth_uid,
  auth.role() as auth_role,
  auth.jwt() ->> 'role' as jwt_role; 