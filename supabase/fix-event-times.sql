-- Script pour corriger les heures des événements existants
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les événements avec des heures incorrectes
SELECT 
    id,
    title,
    start_date,
    end_date,
    EXTRACT(hour FROM start_date) as start_hour,
    EXTRACT(hour FROM end_date) as end_hour
FROM events 
WHERE EXTRACT(hour FROM start_date) = 0 
   OR EXTRACT(hour FROM end_date) = 0
   OR start_date = end_date;

-- 2. Mettre à jour les événements avec des heures par défaut
-- Remplacer les heures 00:00 par des heures plus réalistes
UPDATE events 
SET 
    start_date = start_date + INTERVAL '9 hours',
    end_date = end_date + INTERVAL '11 hours'
WHERE EXTRACT(hour FROM start_date) = 0 
   AND EXTRACT(hour FROM end_date) = 0
   AND start_date::date = end_date::date;

-- 3. Corriger les événements qui se terminent à la même heure qu'ils commencent
UPDATE events 
SET end_date = start_date + INTERVAL '2 hours'
WHERE start_date = end_date;

-- 4. Corriger les événements avec des heures très tardives (après 22h)
UPDATE events 
SET 
    start_date = start_date - INTERVAL '12 hours',
    end_date = end_date - INTERVAL '12 hours'
WHERE EXTRACT(hour FROM start_date) >= 22 
   OR EXTRACT(hour FROM end_date) >= 22;

-- 5. Corriger les événements avec des heures très tôt (avant 6h)
UPDATE events 
SET 
    start_date = start_date + INTERVAL '6 hours',
    end_date = end_date + INTERVAL '6 hours'
WHERE EXTRACT(hour FROM start_date) < 6 
   OR EXTRACT(hour FROM end_date) < 6;

-- 6. Vérifier le résultat après les corrections
SELECT 
    id,
    title,
    start_date,
    end_date,
    EXTRACT(hour FROM start_date) as start_hour,
    EXTRACT(hour FROM end_date) as end_hour,
    end_date - start_date as duration
FROM events 
ORDER BY start_date DESC;

-- 7. Statistiques des événements par heure de début
SELECT 
    EXTRACT(hour FROM start_date) as hour_of_day,
    COUNT(*) as event_count
FROM events 
GROUP BY EXTRACT(hour FROM start_date)
ORDER BY hour_of_day;

-- 8. Statistiques des durées d'événements
SELECT 
    CASE 
        WHEN (end_date - start_date) < INTERVAL '1 hour' THEN 'Moins de 1h'
        WHEN (end_date - start_date) < INTERVAL '2 hours' THEN '1-2h'
        WHEN (end_date - start_date) < INTERVAL '4 hours' THEN '2-4h'
        WHEN (end_date - start_date) < INTERVAL '8 hours' THEN '4-8h'
        ELSE 'Plus de 8h'
    END as duration_category,
    COUNT(*) as event_count
FROM events 
GROUP BY duration_category
ORDER BY event_count DESC; 