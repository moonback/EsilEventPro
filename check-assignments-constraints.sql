-- Script de vérification des contraintes de la table assignments
-- À exécuter dans l'éditeur SQL de Supabase

-- Vérifier la structure de la table assignments
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'assignments' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier les contraintes d'unicité
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'assignments' 
AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;

-- Vérifier les affectations existantes
SELECT 
    a.id,
    a.event_id,
    a.technician_id,
    a.status,
    e.title as event_title,
    u.first_name || ' ' || u.last_name as technician_name
FROM assignments a
JOIN events e ON a.event_id = e.id
JOIN users u ON a.technician_id = u.id
ORDER BY e.title, u.first_name;

-- Compter les affectations par événement
SELECT 
    e.title as event_title,
    COUNT(a.id) as assignment_count,
    STRING_AGG(u.first_name || ' ' || u.last_name, ', ' ORDER BY u.first_name) as technicians
FROM events e
LEFT JOIN assignments a ON e.id = a.event_id
LEFT JOIN users u ON a.technician_id = u.id
WHERE u.role = 'technician' OR a.id IS NULL
GROUP BY e.id, e.title
ORDER BY e.title; 