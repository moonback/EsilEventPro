-- Script de test pour le calcul du prix de mission
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les données de pricing existantes
SELECT 
  mp.id,
  mp.event_id,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  e.title as event_title,
  e.start_date,
  e.end_date,
  EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600 as duration_hours
FROM mission_pricing mp
JOIN events e ON e.id = mp.event_id
ORDER BY mp.updated_at DESC
LIMIT 10;

-- 2. Vérifier les techniciens disponibles pour le test
SELECT 
  id,
  first_name,
  last_name,
  email,
  role
FROM users 
WHERE role = 'technician'
ORDER BY created_at DESC
LIMIT 5;

-- 3. Tester la fonction avec un vrai technicien (remplacer TECH_ID par un vrai ID)
-- SELECT 
--   e.id as event_id,
--   e.title as event_title,
--   mp.base_price,
--   mp.price_per_hour,
--   mp.bonus_percentage,
--   calculate_mission_price(e.id, 'TECH_ID') as calculated_price
-- FROM events e
-- LEFT JOIN mission_pricing mp ON e.id = mp.event_id
-- WHERE mp.id IS NOT NULL
-- ORDER BY e.created_at DESC
-- LIMIT 5;

-- 4. Vérifier les compétences des techniciens
SELECT 
  u.id as user_id,
  u.first_name,
  u.last_name,
  s.name as skill_name,
  s.level as skill_level
FROM users u
JOIN user_skills us ON u.id = us.user_id
JOIN skills s ON us.skill_id = s.id
WHERE u.role = 'technician'
ORDER BY u.created_at DESC, s.level DESC
LIMIT 10;

-- 5. Calcul manuel pour vérification
SELECT 
  e.id as event_id,
  e.title as event_title,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600 as duration_hours,
  mp.base_price + (mp.price_per_hour * EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600) as base_calculation,
  (mp.base_price + (mp.price_per_hour * EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600)) * (1 + mp.bonus_percentage / 100) as with_bonus
FROM events e
JOIN mission_pricing mp ON e.id = mp.event_id
ORDER BY e.created_at DESC
LIMIT 5; 