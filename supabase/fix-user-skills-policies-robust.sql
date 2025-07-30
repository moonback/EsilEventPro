-- Script robuste pour corriger les politiques RLS de user_skills
-- À exécuter dans l'éditeur SQL de Supabase

-- ÉTAPE 1: SUPPRIMER TOUTES LES POLITIQUES EXISTANTES DE USER_SKILLS
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_skills' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "%s" ON user_skills', policy_record.policyname);
    END LOOP;
END $$;

-- ÉTAPE 2: CRÉER LES NOUVELLES POLITIQUES POUR USER_SKILLS
CREATE POLICY "Admins can manage user skills" ON user_skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated users can create user skills" ON user_skills 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own skills" ON user_skills 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user skills" ON user_skills 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- ÉTAPE 3: VÉRIFIER LES POLITIQUES CRÉÉES
SELECT 
    tablename,
    policyname,
    cmd,
    permissive as policy_type
FROM pg_policies 
WHERE tablename = 'user_skills'
ORDER BY policyname; 