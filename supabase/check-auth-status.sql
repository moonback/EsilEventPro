-- Script pour vérifier l'état de l'authentification et des politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- ÉTAPE 1: VÉRIFIER L'ÉTAT ACTUEL DE L'UTILISATEUR
SELECT 
  'État utilisateur actuel' as info,
  current_user as current_user,
  session_user as session_user,
  auth.uid() as auth_uid,
  auth.role() as auth_role,
  auth.jwt() ->> 'role' as jwt_role;

-- ÉTAPE 2: VÉRIFIER L'ÉTAT DE RLS SUR TOUTES LES TABLES
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN 'RLS activé'
    ELSE 'RLS désactivé'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('users', 'skills', 'user_skills', 'assignments', 'events', 'event_types', 'event_requirements')
ORDER BY tablename;

-- ÉTAPE 3: VÉRIFIER LES POLITIQUES SUR event_requirements
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

-- ÉTAPE 4: COMPTER LES POLITIQUES PAR TABLE
SELECT 
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('users', 'skills', 'user_skills', 'assignments', 'events', 'event_types', 'event_requirements')
GROUP BY tablename
ORDER BY tablename;

-- ÉTAPE 5: VÉRIFIER LES DONNÉES EXISTANTES
SELECT 
  'Événements' as table_name,
  COUNT(*) as record_count
FROM events
UNION ALL
SELECT 
  'Compétences' as table_name,
  COUNT(*) as record_count
FROM skills
UNION ALL
SELECT 
  'Exigences' as table_name,
  COUNT(*) as record_count
FROM event_requirements;

-- ÉTAPE 6: VÉRIFIER LES UTILISATEURS
SELECT 
  'Utilisateurs' as table_name,
  COUNT(*) as record_count
FROM users;

-- ÉTAPE 7: TESTER L'ACCÈS EN LECTURE
SELECT 
  'Test lecture events' as test,
  COUNT(*) as count
FROM events
UNION ALL
SELECT 
  'Test lecture skills' as test,
  COUNT(*) as count
FROM skills
UNION ALL
SELECT 
  'Test lecture event_requirements' as test,
  COUNT(*) as count
FROM event_requirements;

-- ÉTAPE 8: VÉRIFIER LES CONTRAINTES DE CLÉS ÉTRANGÈRES
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name = 'event_requirements'
AND tc.constraint_type = 'FOREIGN KEY'; 