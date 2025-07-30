-- Script pour identifier et corriger les doublons dans user_skills
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Identifier les doublons
SELECT 
    user_id,
    skill_id,
    COUNT(*) as duplicate_count
FROM user_skills
GROUP BY user_id, skill_id
HAVING COUNT(*) > 1
ORDER BY user_id, skill_id;

-- 2. Afficher les détails des doublons
WITH duplicates AS (
    SELECT 
        user_id,
        skill_id,
        COUNT(*) as duplicate_count
    FROM user_skills
    GROUP BY user_id, skill_id
    HAVING COUNT(*) > 1
)
SELECT 
    us.*,
    u.first_name || ' ' || u.last_name as user_name,
    s.name as skill_name
FROM user_skills us
JOIN duplicates d ON us.user_id = d.user_id AND us.skill_id = d.skill_id
JOIN users u ON us.user_id = u.id
JOIN skills s ON us.skill_id = s.id
ORDER BY us.user_id, us.skill_id, us.created_at;

-- 3. Supprimer les doublons (garder seulement le plus récent)
DELETE FROM user_skills 
WHERE id IN (
    SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY user_id, skill_id 
                   ORDER BY created_at DESC
               ) as rn
        FROM user_skills
    ) ranked
    WHERE rn > 1
);

-- 4. Vérifier qu'il n'y a plus de doublons
SELECT 
    user_id,
    skill_id,
    COUNT(*) as count
FROM user_skills
GROUP BY user_id, skill_id
HAVING COUNT(*) > 1
ORDER BY user_id, skill_id;

-- 5. Afficher les statistiques finales
SELECT 
    COUNT(*) as total_user_skills,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT skill_id) as unique_skills
FROM user_skills; 