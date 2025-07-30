-- Script de test pour vérifier l'insertion d'événements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier l'utilisateur actuel
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role,
    auth.jwt() ->> 'role' as jwt_role;

-- 2. Vérifier les types d'événements disponibles
SELECT 
    id,
    name,
    color
FROM event_types
ORDER BY name;

-- 3. Vérifier les utilisateurs disponibles
SELECT 
    id,
    email,
    role,
    first_name,
    last_name
FROM users
ORDER BY created_at DESC
LIMIT 5;

-- 4. Tester l'insertion d'un événement (remplacer USER_ID par un ID valide)
-- Décommentez et modifiez les lignes suivantes pour tester :

/*
INSERT INTO events (
  title, 
  description, 
  start_date, 
  end_date, 
  location, 
  type_id, 
  status, 
  created_by
) VALUES (
  'Test Event - ' || now(), 
  'Test Description', 
  '2024-01-01 10:00:00', 
  '2024-01-01 12:00:00', 
  'Test Location', 
  (SELECT id FROM event_types LIMIT 1), 
  'draft', 
  (SELECT id FROM users LIMIT 1)
) RETURNING id, title, created_by, created_at;
*/

-- 5. Vérifier les événements existants
SELECT 
    id,
    title,
    status,
    created_by,
    created_at
FROM events
ORDER BY created_at DESC
LIMIT 10;

-- 6. Vérifier les politiques RLS actuelles
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'events'
ORDER BY policyname;

-- 7. Vérifier les permissions sur la table events
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'events' AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- 8. Test de fonction pour vérifier les rôles
CREATE OR REPLACE FUNCTION test_user_permissions()
RETURNS TABLE (
    user_id text,
    user_role text,
    can_insert boolean,
    can_update boolean,
    can_delete boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        auth.uid()::text as user_id,
        COALESCE(auth.jwt() ->> 'role', 'authenticated') as user_role,
        auth.uid() IS NOT NULL as can_insert,
        auth.jwt() ->> 'role' = 'admin' as can_update,
        auth.jwt() ->> 'role' = 'admin' as can_delete;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Exécuter le test de permissions
SELECT * FROM test_user_permissions(); 