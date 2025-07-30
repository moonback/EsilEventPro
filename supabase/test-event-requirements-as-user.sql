-- Script pour tester les politiques RLS en tant qu'utilisateur authentifié
-- À exécuter dans l'éditeur SQL de Supabase

-- ÉTAPE 1: VÉRIFIER L'ÉTAT ACTUEL (en tant qu'admin)
SELECT 
  'État actuel (admin)' as info,
  current_user as current_user,
  session_user as session_user,
  auth.uid() as auth_uid,
  auth.role() as auth_role,
  auth.jwt() ->> 'role' as jwt_role;

-- ÉTAPE 2: SIMULER UN UTILISATEUR AUTHENTIFIÉ
-- Note: Cette simulation ne fonctionne que pour les tests de base
-- Pour un vrai test, utilisez l'API REST de Supabase

-- Créer un utilisateur de test s'il n'existe pas
-- Note: Cette approche peut ne pas fonctionner dans tous les cas
-- car nous n'avons pas accès direct à auth.users
-- Utilisons une approche plus simple

-- Vérifier si l'utilisateur existe déjà
DO $$
BEGIN
  -- Créer un utilisateur de test seulement s'il n'existe pas
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'test@example.com') THEN
    INSERT INTO users (
      id,
      email,
      first_name,
      last_name,
      role,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      'test@example.com',
      'Test',
      'User',
      'admin',
      now(),
      now()
    );
  END IF;
END $$;

-- ÉTAPE 3: L'utilisateur de test a déjà été créé à l'étape 2
-- Pas besoin de créer à nouveau

-- ÉTAPE 4: VÉRIFIER LES DONNÉES DE TEST
SELECT 
  'Utilisateurs de test' as info,
  COUNT(*) as user_count
FROM users 
WHERE email = 'test@example.com';

-- ÉTAPE 5: TESTER L'INSERTION D'EXIGENCES (en tant qu'admin)
-- Cette insertion devrait fonctionner car nous sommes admin
INSERT INTO event_requirements (event_id, skill_id, count, level) 
SELECT 
  e.id as event_id,
  s.id as skill_id,
  2 as count,
  'intermediate' as level
FROM events e, skills s
WHERE e.id = (SELECT id FROM events LIMIT 1)
AND s.id = (SELECT id FROM skills LIMIT 1)
LIMIT 1;

-- ÉTAPE 6: VÉRIFIER L'INSERTION
SELECT 
  'Exigences créées' as info,
  COUNT(*) as requirement_count
FROM event_requirements;

-- ÉTAPE 7: AFFICHER LES EXIGENCES
SELECT 
  er.id,
  er.event_id,
  er.skill_id,
  er.count,
  er.level,
  e.title as event_title,
  s.name as skill_name,
  er.created_at
FROM event_requirements er
LEFT JOIN events e ON er.event_id = e.id
LEFT JOIN skills s ON er.skill_id = s.id
ORDER BY er.created_at DESC;

-- ÉTAPE 8: NETTOYER LES DONNÉES DE TEST (optionnel)
-- Décommentez les lignes suivantes pour nettoyer après les tests
/*
DELETE FROM event_requirements 
WHERE event_id IN (SELECT id FROM events WHERE title LIKE '%test%');

DELETE FROM users WHERE email = 'test@example.com';
DELETE FROM auth.users WHERE email = 'test@example.com';
*/ 