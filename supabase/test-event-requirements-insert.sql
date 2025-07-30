-- Script de test pour diagnostiquer l'insertion des exigences d'événements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. VÉRIFIER LES POLITIQUES ACTUELLES
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

-- 2. VÉRIFIER L'ÉTAT DE RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'event_requirements';

-- 3. TESTER L'INSERTION MANUELLE (à exécuter en tant qu'utilisateur authentifié)
-- Remplacer les UUIDs par des valeurs réelles de votre base de données

-- D'abord, vérifier qu'il y a des événements et des compétences
SELECT 'Événements existants' as info, COUNT(*) as count FROM events;
SELECT 'Compétences existantes' as info, COUNT(*) as count FROM skills;

-- Afficher quelques exemples
SELECT 'Événements' as type, id, title FROM events LIMIT 5;
SELECT 'Compétences' as type, id, name FROM skills LIMIT 5;

-- 4. TESTER L'INSERTION D'UNE EXIGENCE (remplacer les UUIDs)
-- Décommentez et modifiez les lignes suivantes avec des UUIDs réels :

/*
INSERT INTO event_requirements (event_id, skill_id, count, level) 
VALUES (
  'UUID_DE_VOTRE_EVENEMENT',  -- Remplacez par un UUID d'événement réel
  'UUID_DE_VOTRE_COMPETENCE', -- Remplacez par un UUID de compétence réel
  2,
  'intermediate'
);
*/

-- 5. VÉRIFIER LES EXIGENCES EXISTANTES
SELECT 
  er.id,
  er.event_id,
  er.skill_id,
  er.count,
  er.level,
  e.title as event_title,
  s.name as skill_name
FROM event_requirements er
LEFT JOIN events e ON er.event_id = e.id
LEFT JOIN skills s ON er.skill_id = s.id
ORDER BY er.created_at DESC
LIMIT 10;

-- 6. VÉRIFIER LES PERMISSIONS DE L'UTILISATEUR ACTUEL
SELECT 
  current_user as current_user,
  session_user as session_user,
  auth.uid() as auth_uid,
  auth.role() as auth_role,
  auth.jwt() ->> 'role' as jwt_role;

-- 7. TESTER L'ACCÈS EN LECTURE
SELECT 
  'Test lecture event_requirements' as test,
  COUNT(*) as total_records
FROM event_requirements;

-- 8. VÉRIFIER LES CONTRAINTES DE CLÉS ÉTRANGÈRES
SELECT 
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
WHERE tc.table_name = 'event_requirements' 
AND tc.table_schema = 'public'
AND tc.constraint_type = 'FOREIGN KEY'; 