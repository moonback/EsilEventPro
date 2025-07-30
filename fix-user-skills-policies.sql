-- Script pour corriger les politiques RLS pour user_skills
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer les anciennes politiques s'il y en a
DROP POLICY IF EXISTS "Everyone can view user skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can manage user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;

-- Créer les nouvelles politiques
CREATE POLICY "Everyone can view user skills" ON user_skills FOR SELECT USING (true);
CREATE POLICY "Admins can manage user skills" ON user_skills FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);

-- Vérifier que les politiques sont bien créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_skills'; 