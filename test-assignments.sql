-- Script de test pour les affectations
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les événements disponibles
SELECT 
    id,
    title,
    start_date,
    status
FROM events 
ORDER BY start_date DESC 
LIMIT 5;

-- 2. Vérifier les techniciens disponibles
SELECT 
    id,
    first_name,
    last_name,
    email,
    role
FROM users 
WHERE role = 'technician'
ORDER BY first_name;

-- 3. Vérifier les affectations existantes
SELECT 
    a.id,
    e.title as event_title,
    u.first_name || ' ' || u.last_name as technician_name,
    a.status,
    a.created_at
FROM assignments a
JOIN events e ON a.event_id = e.id
JOIN users u ON a.technician_id = u.id
ORDER BY a.created_at DESC;

-- 4. Tester la création d'une affectation (remplacer les IDs par des valeurs réelles)
-- INSERT INTO assignments (event_id, technician_id, status) 
-- VALUES ('ID_EVENEMENT', 'ID_TECHNICIEN', 'pending');

-- 5. Vérifier les contraintes d'unicité
SELECT 
    event_id,
    technician_id,
    COUNT(*) as count
FROM assignments 
GROUP BY event_id, technician_id 
HAVING COUNT(*) > 1;

-- 6. Compter les affectations par événement
SELECT 
    e.title,
    COUNT(a.id) as assignment_count,
    STRING_AGG(u.first_name || ' ' || u.last_name, ', ' ORDER BY u.first_name) as technicians
FROM events e
LEFT JOIN assignments a ON e.id = a.event_id
LEFT JOIN users u ON a.technician_id = u.id
GROUP BY e.id, e.title
ORDER BY e.title; 