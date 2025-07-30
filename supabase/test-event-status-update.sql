-- Script de test pour la mise à jour des statuts d'événements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les événements existants
SELECT 
    id,
    title,
    status,
    created_at,
    updated_at
FROM events 
ORDER BY created_at DESC
LIMIT 5;

-- 2. Tester la mise à jour d'un événement (remplacez EVENT_ID)
-- UPDATE events 
-- SET status = 'published', updated_at = NOW()
-- WHERE id = 'EVENT_ID';

-- 3. Vérifier les politiques RLS sur events
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'events'
ORDER BY policyname;

-- 4. Vérifier les permissions de l'utilisateur actuel
SELECT 
    current_user,
    session_user,
    auth.role() as auth_role,
    auth.jwt() as jwt_data;

-- 5. Tester une requête de mise à jour simple
-- Cette requête devrait fonctionner si les politiques sont correctes
UPDATE events 
SET status = 'published'
WHERE id IN (
    SELECT id FROM events LIMIT 1
);

-- 6. Vérifier le résultat
SELECT 
    id,
    title,
    status,
    updated_at
FROM events 
ORDER BY updated_at DESC
LIMIT 5;

-- 7. Vérifier les logs d'erreur (si disponible)
-- SELECT * FROM pg_stat_activity WHERE state = 'active'; 