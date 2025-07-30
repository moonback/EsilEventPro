-- Fix pour l'erreur de récursion infinie dans les politiques RLS des utilisateurs
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

-- CRÉER DES POLITIQUES PLUS SPÉCIFIQUES
-- Permettre aux administrateurs de gérer tous les utilisateurs
CREATE POLICY "Admins can manage all users" ON users 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view own profile" ON users 
FOR SELECT USING (auth.uid() = id);

-- Permettre aux administrateurs de voir tous les utilisateurs
CREATE POLICY "Admins can view all users" ON users 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE USING (auth.uid() = id);

-- Permettre aux administrateurs d'insérer des utilisateurs
CREATE POLICY "Admins can insert users" ON users 
FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Permettre aux administrateurs de supprimer des utilisateurs
CREATE POLICY "Admins can delete users" ON users 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin'); 