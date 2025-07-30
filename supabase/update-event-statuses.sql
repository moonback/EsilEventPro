-- Script pour mettre à jour les statuts des événements existants
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les statuts actuels des événements
SELECT 
    status,
    COUNT(*) as count
FROM events 
GROUP BY status
ORDER BY count DESC;

-- 2. Mettre à jour les événements en brouillon vers "publié" s'ils ont des affectations
UPDATE events 
SET status = 'published'
WHERE status = 'draft' 
  AND id IN (
    SELECT DISTINCT event_id 
    FROM assignments 
    WHERE status IN ('accepted', 'pending')
  );

-- 3. Mettre à jour les événements passés vers "terminé"
UPDATE events 
SET status = 'completed'
WHERE status IN ('draft', 'published', 'confirmed')
  AND end_date < NOW();

-- 4. Mettre à jour les événements avec des affectations acceptées vers "confirmé"
UPDATE events 
SET status = 'confirmed'
WHERE status IN ('draft', 'published')
  AND id IN (
    SELECT event_id 
    FROM assignments 
    WHERE status = 'accepted'
    GROUP BY event_id
    HAVING COUNT(*) > 0
  );

-- 5. Vérifier le résultat après les mises à jour
SELECT 
    status,
    COUNT(*) as count
FROM events 
GROUP BY status
ORDER BY count DESC;

-- 6. Statistiques détaillées des événements par statut et date
SELECT 
    status,
    CASE 
        WHEN start_date < NOW() THEN 'Passé'
        WHEN start_date < NOW() + INTERVAL '7 days' THEN 'Cette semaine'
        WHEN start_date < NOW() + INTERVAL '30 days' THEN 'Ce mois'
        ELSE 'Futur'
    END as time_period,
    COUNT(*) as count
FROM events 
GROUP BY status, time_period
ORDER BY status, time_period;

-- 7. Événements qui pourraient être confirmés (avec affectations acceptées)
SELECT 
    e.id,
    e.title,
    e.status,
    e.start_date,
    COUNT(a.id) as total_assignments,
    COUNT(CASE WHEN a.status = 'accepted' THEN 1 END) as accepted_assignments
FROM events e
LEFT JOIN assignments a ON e.id = a.event_id
WHERE e.status IN ('draft', 'published')
GROUP BY e.id, e.title, e.status, e.start_date
HAVING COUNT(CASE WHEN a.status = 'accepted' THEN 1 END) > 0
ORDER BY e.start_date; 