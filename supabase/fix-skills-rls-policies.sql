-- Correction des politiques RLS pour la table skills
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer les anciennes politiques pour skills
DROP POLICY IF EXISTS "Everyone can view skills" ON skills;
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;

-- Créer de nouvelles politiques plus permissives pour skills
CREATE POLICY "Everyone can view skills" ON skills 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create skills" ON skills 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update skills" ON skills 
FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete skills" ON skills 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Vérifier que les politiques sont bien créées
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'skills'
ORDER BY policyname; 