-- Script de vérification des politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- Vérifier toutes les politiques créées
SELECT 
    tablename,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('users', 'skills', 'user_skills', 'assignments', 'events', 'event_types', 'event_requirements')
ORDER BY tablename, policyname;

-- Compter les politiques par table
SELECT 
    tablename,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('users', 'skills', 'user_skills', 'assignments', 'events', 'event_types', 'event_requirements')
GROUP BY tablename
ORDER BY tablename;

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