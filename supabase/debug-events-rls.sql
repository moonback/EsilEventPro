-- Script de diagnostic pour identifier le problème RLS avec les événements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure de la table events
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'events' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Vérifier les politiques RLS actuelles sur events
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'events'
ORDER BY policyname;

-- 3. Vérifier si RLS est activé sur events
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'events';

-- 4. Vérifier les permissions sur la table events
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'events' AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- 5. Vérifier l'utilisateur actuel et ses rôles
SELECT 
  current_user,
  session_user,
  current_setting('role'),
  current_setting('application_name');

-- 6. Tester une insertion simple (à exécuter manuellement)
-- INSERT INTO events (title, description, start_date, end_date, location, type_id, status, created_by)
-- VALUES ('Test Event', 'Test Description', '2024-01-01 10:00:00', '2024-01-01 12:00:00', 'Test Location', '1', 'draft', 'test-user-id');

-- 7. Vérifier les contraintes sur la table events
SELECT 
  constraint_name,
  constraint_type,
  table_name,
  column_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'events' AND tc.table_schema = 'public';

-- 8. Vérifier les triggers sur la table events
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'events' AND event_object_schema = 'public';

-- 9. Vérifier les index sur la table events
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'events' AND schemaname = 'public';

-- 10. Vérifier les données existantes dans events
SELECT 
  id,
  title,
  status,
  created_by,
  created_at
FROM events
ORDER BY created_at DESC
LIMIT 10; 