-- Fix sécurisé pour l'erreur de récursion infinie dans les politiques RLS des utilisateurs
-- À exécuter dans l'éditeur SQL de Supabase

-- SUPPRIMER TOUTES LES POLITIQUES EXISTANTES SUR LA TABLE USERS
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;

-- Attendre un moment pour s'assurer que les suppressions sont terminées
SELECT pg_sleep(0.1);

-- CRÉER DES POLITIQUES PLUS SPÉCIFIQUES AVEC GESTION D'ERREUR
DO $$
BEGIN
    -- Permettre aux administrateurs de gérer tous les utilisateurs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Admins can manage all users') THEN
        CREATE POLICY "Admins can manage all users" ON users 
        FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
    END IF;

    -- Permettre aux utilisateurs de voir leur propre profil
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON users 
        FOR SELECT USING (auth.uid() = id);
    END IF;

    -- Permettre aux administrateurs de voir tous les utilisateurs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Admins can view all users') THEN
        CREATE POLICY "Admins can view all users" ON users 
        FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
    END IF;

    -- Permettre aux utilisateurs de mettre à jour leur propre profil
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON users 
        FOR UPDATE USING (auth.uid() = id);
    END IF;

    -- Permettre aux administrateurs d'insérer des utilisateurs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Admins can insert users') THEN
        CREATE POLICY "Admins can insert users" ON users 
        FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
    END IF;

    -- Permettre aux administrateurs de supprimer des utilisateurs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Admins can delete users') THEN
        CREATE POLICY "Admins can delete users" ON users 
        FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');
    END IF;

EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Certaines politiques existaient déjà et ont été ignorées.';
    WHEN OTHERS THEN
        RAISE NOTICE 'Erreur lors de la création des politiques: %', SQLERRM;
END $$; 