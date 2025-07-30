-- Script de diagnostic pour vérifier l'authentification et les politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier l'utilisateur actuel
SELECT 
    current_user,
    session_user,
    current_setting('role'),
    current_setting('application_name');

-- 2. Vérifier les utilisateurs dans auth.users
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 3. Vérifier les utilisateurs dans la table users
SELECT 
    id,
    email,
    role,
    created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- 4. Vérifier les politiques RLS sur events
SELECT 
    tablename,
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'events'
ORDER BY policyname;

-- 5. Vérifier si RLS est activé sur events
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'events';

-- 6. Vérifier les permissions sur la table events
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'events' AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- 7. Tester l'authentification actuelle
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role,
    auth.jwt() ->> 'role' as jwt_role;

-- 8. Vérifier les données existantes dans events
SELECT 
    id,
    title,
    status,
    created_by,
    created_at
FROM events
ORDER BY created_at DESC
LIMIT 5;

-- 9. Vérifier les types d'événements disponibles
SELECT 
    id,
    name,
    color
FROM event_types
ORDER BY name; 