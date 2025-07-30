-- Script pour vérifier l'état de l'authentification et des rôles
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les utilisateurs existants et leurs rôles
SELECT 
  id,
  email,
  role,
  created_at,
  updated_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Vérifier les utilisateurs dans la table users
SELECT 
  id,
  email,
  role,
  first_name,
  last_name,
  created_at,
  updated_at
FROM users
ORDER BY created_at DESC;

-- 3. Vérifier les politiques RLS actuelles
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Vérifier les permissions sur les tables
SELECT 
  table_name,
  privilege_type,
  grantee
FROM information_schema.role_table_grants 
WHERE table_schema = 'public'
ORDER BY table_name, privilege_type;

-- 5. Vérifier si RLS est activé sur toutes les tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 6. Créer un utilisateur de test admin si nécessaire
-- Décommentez les lignes suivantes si vous voulez créer un utilisateur admin de test
/*
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role
) VALUES (
  gen_random_uuid(),
  'admin@esil-events.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'admin'
);

INSERT INTO users (
  id,
  email,
  first_name,
  last_name,
  role,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@esil-events.com'),
  'admin@esil-events.com',
  'Admin',
  'User',
  'admin',
  now(),
  now()
);
*/ 