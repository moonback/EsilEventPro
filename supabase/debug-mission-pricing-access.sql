-- Script de diagnostic pour les problèmes d'accès à mission_pricing
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les politiques RLS actuelles
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'mission_pricing';

-- 2. Vérifier les assignations existantes
SELECT 
  a.id as assignment_id,
  a.event_id,
  a.technician_id,
  a.status,
  e.title as event_title,
  u.first_name,
  u.last_name,
  u.role
FROM assignments a
JOIN events e ON e.id = a.event_id
JOIN users u ON u.id = a.technician_id
ORDER BY a.created_at DESC
LIMIT 10;

-- 3. Vérifier les données de mission_pricing
SELECT 
  mp.id,
  mp.event_id,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  e.title as event_title,
  e.status as event_status
FROM mission_pricing mp
JOIN events e ON e.id = mp.event_id
ORDER BY mp.created_at DESC
LIMIT 10;

-- 4. Vérifier les doublons dans mission_pricing
SELECT 
  event_id,
  COUNT(*) as count,
  ARRAY_AGG(id) as pricing_ids
FROM mission_pricing
GROUP BY event_id
HAVING COUNT(*) > 1;

-- 5. Tester l'accès en tant que technicien (remplacer USER_ID par un vrai ID)
-- SELECT * FROM mission_pricing WHERE event_id IN (
--   SELECT event_id FROM assignments WHERE technician_id = 'USER_ID'
-- );

-- 6. Vérifier les permissions de l'utilisateur actuel
SELECT 
  current_user,
  session_user,
  current_setting('role'),
  current_setting('request.jwt.claims', true)::json->>'role' as jwt_role,
  current_setting('request.jwt.claims', true)::json->>'sub' as jwt_sub; 