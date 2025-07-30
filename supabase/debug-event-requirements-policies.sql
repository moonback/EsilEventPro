-- Script de diagnostic pour les politiques RLS de event_requirements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. VÉRIFIER L'ÉTAT DE RLS SUR LA TABLE
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'event_requirements';

-- 2. LISTER TOUTES LES POLITIQUES EXISTANTES
SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'event_requirements'
ORDER BY policyname;

-- 3. VÉRIFIER LES PERMISSIONS DE L'UTILISATEUR ACTUEL
SELECT 
  current_user as current_user,
  session_user as session_user,
  auth.uid() as auth_uid,
  auth.role() as auth_role,
  auth.jwt() ->> 'role' as jwt_role;

-- 4. TESTER L'ACCÈS EN LECTURE
SELECT 
  'event_requirements_read_test' as test_name,
  COUNT(*) as record_count
FROM event_requirements;

-- 5. VÉRIFIER LES DONNÉES EXISTANTES
SELECT 
  id,
  event_id,
  skill_id,
  count,
  level,
  created_at
FROM event_requirements
LIMIT 10;

-- 6. VÉRIFIER LES ÉVÉNEMENTS ASSOCIÉS
SELECT 
  er.id as requirement_id,
  er.event_id,
  er.skill_id,
  er.count,
  er.level,
  e.title as event_title,
  e.created_by as event_creator
FROM event_requirements er
LEFT JOIN events e ON er.event_id = e.id
LIMIT 10;

-- 7. VÉRIFIER LES COMPÉTENCES
SELECT 
  id,
  name,
  category,
  level
FROM skills
LIMIT 10; 