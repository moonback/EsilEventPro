-- Script pour corriger les politiques RLS de user_skills
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer les politiques existantes pour user_skills
DROP POLICY IF EXISTS "Admins can manage user skills" ON user_skills;
DROP POLICY IF EXISTS "Authenticated users can create user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can view own skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can view all user skills" ON user_skills;

-- Créer les nouvelles politiques pour user_skills
CREATE POLICY "Admins can manage user skills" ON user_skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated users can create user skills" ON user_skills 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own skills" ON user_skills 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user skills" ON user_skills 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Vérifier les politiques créées
SELECT 
    tablename,
    policyname,
    cmd,
    permissive as policy_type
FROM pg_policies 
WHERE tablename = 'user_skills'
ORDER BY policyname; 