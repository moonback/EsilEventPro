-- Script pour corriger l'erreur 409 sur user_skills
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES DE USER_SKILLS
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

-- 2. S'ASSURER QUE RLS EST ACTIVÉ
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- 3. CRÉER LES NOUVELLES POLITIQUES POUR USER_SKILLS
-- Politique pour permettre aux administrateurs de gérer toutes les compétences utilisateur
CREATE POLICY "Admins can manage all user skills" ON user_skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Politique pour permettre aux utilisateurs de voir leurs propres compétences
CREATE POLICY "Users can view own skills" ON user_skills 
FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre aux administrateurs de voir toutes les compétences
CREATE POLICY "Admins can view all user skills" ON user_skills 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Politique pour permettre l'insertion de compétences par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert user skills" ON user_skills 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour permettre la suppression de compétences par les administrateurs
CREATE POLICY "Admins can delete user skills" ON user_skills 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Politique pour permettre la mise à jour de compétences par les administrateurs
CREATE POLICY "Admins can update user skills" ON user_skills 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- 4. VÉRIFIER LES POLITIQUES CRÉÉES
SELECT 
    tablename,
    policyname,
    cmd,
    permissive as policy_type,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_skills'
ORDER BY policyname;

-- 5. TEST - Vérifier que les politiques fonctionnent
-- Cette requête devrait fonctionner pour un administrateur
-- SELECT COUNT(*) FROM user_skills; 