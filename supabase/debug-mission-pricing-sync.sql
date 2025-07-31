-- Script de diagnostic pour vérifier la synchronisation des données de tarification
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure des tables
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('events', 'mission_pricing', 'event_requirements')
ORDER BY table_name, ordinal_position;

-- 2. Vérifier les données de mission_pricing
SELECT 
    mp.id,
    mp.event_id,
    mp.base_price,
    mp.price_per_hour,
    mp.bonus_percentage,
    mp.created_at,
    mp.updated_at,
    e.title as event_title,
    e.start_date,
    e.end_date
FROM mission_pricing mp
LEFT JOIN events e ON e.id = mp.event_id
ORDER BY mp.created_at DESC
LIMIT 10;

-- 3. Vérifier les événements sans tarification
SELECT 
    e.id,
    e.title,
    e.start_date,
    e.end_date,
    e.created_at,
    CASE 
        WHEN mp.id IS NULL THEN 'SANS TARIFICATION'
        ELSE 'AVEC TARIFICATION'
    END as pricing_status
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
ORDER BY e.created_at DESC
LIMIT 10;

-- 4. Vérifier les politiques RLS pour mission_pricing
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
WHERE tablename = 'mission_pricing';

-- 5. Tester la fonction de calcul de prix
SELECT 
    e.id as event_id,
    e.title,
    mp.base_price,
    mp.price_per_hour,
    mp.bonus_percentage,
    EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600 as duration_hours,
    calculate_mission_price(e.id, '00000000-0000-0000-0000-000000000000') as calculated_price
FROM events e
JOIN mission_pricing mp ON e.id = mp.event_id
LIMIT 5;

-- 6. Vérifier les affectations avec tarification
SELECT 
    a.id as assignment_id,
    a.event_id,
    a.technician_id,
    a.status,
    e.title as event_title,
    mp.base_price,
    mp.price_per_hour,
    mp.bonus_percentage,
    calculate_mission_price(e.id, a.technician_id) as calculated_price
FROM assignments a
JOIN events e ON e.id = a.event_id
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
WHERE a.status = 'accepted'
ORDER BY a.created_at DESC
LIMIT 10;

-- 7. Statistiques générales
SELECT 
    COUNT(*) as total_events,
    COUNT(mp.id) as events_with_pricing,
    COUNT(*) - COUNT(mp.id) as events_without_pricing,
    ROUND(COUNT(mp.id) * 100.0 / COUNT(*), 2) as percentage_with_pricing
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id;

-- 8. Vérifier les valeurs par défaut dans mission_pricing
SELECT 
    base_price,
    price_per_hour,
    bonus_percentage,
    COUNT(*) as count
FROM mission_pricing
GROUP BY base_price, price_per_hour, bonus_percentage
ORDER BY count DESC; 