-- Script de diagnostic pour le taux horaire
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure de la table users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'hourly_rate';

-- 2. Vérifier les données actuelles des utilisateurs
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    hourly_rate,
    CASE 
        WHEN hourly_rate IS NULL THEN 'NULL'
        WHEN hourly_rate = 0 THEN '0 (non défini)'
        ELSE CONCAT(hourly_rate::text, ' €/h')
    END as hourly_rate_status
FROM users 
ORDER BY created_at DESC;

-- 3. Compter les utilisateurs par statut de taux horaire
SELECT 
    CASE 
        WHEN hourly_rate IS NULL THEN 'NULL'
        WHEN hourly_rate = 0 THEN '0 (non défini)'
        WHEN hourly_rate > 0 THEN 'Défini'
        ELSE 'Autre'
    END as status,
    COUNT(*) as count
FROM users 
GROUP BY 
    CASE 
        WHEN hourly_rate IS NULL THEN 'NULL'
        WHEN hourly_rate = 0 THEN '0 (non défini)'
        WHEN hourly_rate > 0 THEN 'Défini'
        ELSE 'Autre'
    END;

-- 4. Vérifier les techniciens spécifiquement
SELECT 
    id,
    email,
    first_name,
    last_name,
    hourly_rate,
    CASE 
        WHEN hourly_rate IS NULL THEN 'NULL'
        WHEN hourly_rate = 0 THEN '0 (non défini)'
        ELSE CONCAT(hourly_rate::text, ' €/h')
    END as hourly_rate_status
FROM users 
WHERE role = 'technician'
ORDER BY created_at DESC; 