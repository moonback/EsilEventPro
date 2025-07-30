-- Script de vérification des politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. VÉRIFIER LES POLITIQUES EXISTANTES
SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 2. VÉRIFIER QUE RLS EST ACTIVÉ
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'skills', 'user_skills', 'assignments', 'events', 'event_types', 'event_requirements')
ORDER BY tablename;

-- 3. TESTER L'ACCÈS AUX DONNÉES (à exécuter en tant qu'utilisateur authentifié)
-- Ces requêtes devraient fonctionner pour un utilisateur authentifié

-- Test des affectations
SELECT 'assignments' as table_name, COUNT(*) as count FROM assignments;

-- Test des événements
SELECT 'events' as table_name, COUNT(*) as count FROM events;

-- Test des utilisateurs
SELECT 'users' as table_name, COUNT(*) as count FROM users;

-- Test des compétences
SELECT 'skills' as table_name, COUNT(*) as count FROM skills;

-- Test des types d'événements
SELECT 'event_types' as table_name, COUNT(*) as count FROM event_types;

-- Test des exigences d'événements
SELECT 'event_requirements' as table_name, COUNT(*) as count FROM event_requirements;

-- Test des compétences utilisateur
SELECT 'user_skills' as table_name, COUNT(*) as count FROM user_skills;

-- 4. VÉRIFIER LES RÔLES DES UTILISATEURS
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  created_at
FROM users
ORDER BY created_at DESC;

-- 5. VÉRIFIER LES AFFECTATIONS EXISTANTES
SELECT 
  a.id,
  a.event_id,
  a.technician_id,
  a.status,
  a.response_date,
  e.title as event_title,
  u.first_name || ' ' || u.last_name as technician_name
FROM assignments a
LEFT JOIN events e ON a.event_id = e.id
LEFT JOIN users u ON a.technician_id = u.id
ORDER BY a.created_at DESC; 