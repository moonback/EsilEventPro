-- Script de diagnostic pour vérifier les politiques RLS existantes
-- À exécuter dans l'éditeur SQL de Supabase

-- Vérifier toutes les politiques existantes
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

-- Vérifier les tables avec RLS activé
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

-- Compter les politiques par table
SELECT 
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename; 