-- Script de test pour vérifier la mise à jour des tarifs d'événement
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Créer un événement de test avec tarification
INSERT INTO events (title, description, start_date, end_date, location, type_id, status, created_by)
VALUES (
  'Test Event Pricing Update',
  'Événement de test pour vérifier la mise à jour des tarifs',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '2 days',
  'Lieu de test',
  (SELECT id FROM event_types LIMIT 1),
  'draft',
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
) RETURNING id;

-- 2. Ajouter une tarification initiale
INSERT INTO mission_pricing (event_id, base_price, price_per_hour, bonus_percentage)
VALUES (
  (SELECT id FROM events WHERE title = 'Test Event Pricing Update'),
  50.00,
  25.00,
  10.00
);

-- 3. Vérifier les données initiales
SELECT 
  e.id,
  e.title,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  mp.created_at as pricing_created,
  mp.updated_at as pricing_updated
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
WHERE e.title = 'Test Event Pricing Update';

-- 4. Simuler une mise à jour des tarifs
UPDATE mission_pricing 
SET 
  base_price = 75.00,
  price_per_hour = 35.00,
  bonus_percentage = 15.00,
  updated_at = NOW()
WHERE event_id = (
  SELECT id FROM events WHERE title = 'Test Event Pricing Update'
);

-- 5. Vérifier les données après mise à jour
SELECT 
  e.id,
  e.title,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  mp.created_at as pricing_created,
  mp.updated_at as pricing_updated
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
WHERE e.title = 'Test Event Pricing Update';

-- 6. Tester la fonction de calcul de prix
SELECT 
  e.id,
  e.title,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600 as duration_hours,
  calculate_mission_price(e.id, (SELECT id FROM users WHERE role = 'technician' LIMIT 1)) as calculated_price
FROM events e
JOIN mission_pricing mp ON e.id = mp.event_id
WHERE e.title = 'Test Event Pricing Update';

-- 7. Nettoyer les données de test
-- DELETE FROM mission_pricing WHERE event_id = (SELECT id FROM events WHERE title = 'Test Event Pricing Update');
-- DELETE FROM events WHERE title = 'Test Event Pricing Update';

-- 8. Vérifier les événements avec et sans tarification
SELECT 
  COUNT(*) as total_events,
  COUNT(mp.id) as events_with_pricing,
  COUNT(*) - COUNT(mp.id) as events_without_pricing
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id;

-- 9. Afficher les derniers événements avec leurs tarifications
SELECT 
  e.title,
  e.start_date,
  e.end_date,
  CASE 
    WHEN mp.id IS NULL THEN 'SANS TARIFICATION'
    ELSE CONCAT(mp.base_price, '€ + ', mp.price_per_hour, '€/h + ', mp.bonus_percentage, '% bonus')
  END as pricing_info
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
ORDER BY e.created_at DESC
LIMIT 10; 