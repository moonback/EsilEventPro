-- Script de diagnostic pour vérifier les politiques user_skills
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les politiques existantes pour user_skills
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_skills' 
AND schemaname = 'public'
ORDER BY policyname;

-- 2. Vérifier le statut RLS de la table user_skills
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN 'RLS activé'
        ELSE 'RLS désactivé'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'user_skills' 
AND schemaname = 'public';

-- 3. Compter les politiques par table
SELECT 
    tablename,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('user_skills', 'users', 'skills')
GROUP BY tablename
ORDER BY tablename;

-- 4. Vérifier les contraintes de la table user_skills
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_skills' 
AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name; 