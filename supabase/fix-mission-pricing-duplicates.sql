-- Script pour nettoyer les doublons dans mission_pricing
-- Garde seulement l'entrée la plus récente pour chaque event_id

-- 1. Identifier les doublons
SELECT 
    event_id,
    COUNT(*) as count,
    array_agg(id) as ids,
    array_agg(updated_at) as updated_ats
FROM mission_pricing 
GROUP BY event_id 
HAVING COUNT(*) > 1
ORDER BY event_id;

-- 2. Supprimer les doublons en gardant seulement la plus récente
WITH duplicates AS (
    SELECT 
        event_id,
        id,
        updated_at,
        ROW_NUMBER() OVER (
            PARTITION BY event_id 
            ORDER BY updated_at DESC, id DESC
        ) as rn
    FROM mission_pricing
)
DELETE FROM mission_pricing 
WHERE id IN (
    SELECT id 
    FROM duplicates 
    WHERE rn > 1
);

-- 3. Vérifier qu'il n'y a plus de doublons
SELECT 
    event_id,
    COUNT(*) as count
FROM mission_pricing 
GROUP BY event_id 
HAVING COUNT(*) > 1
ORDER BY event_id;

-- 4. Ajouter une contrainte unique pour éviter les futurs doublons
-- (Optionnel - décommentez si vous voulez ajouter cette contrainte)
-- ALTER TABLE mission_pricing ADD CONSTRAINT unique_event_pricing UNIQUE (event_id); 