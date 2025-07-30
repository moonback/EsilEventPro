-- Script pour ajouter le taux horaire aux techniciens
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter le champ hourly_rate à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(8,2) DEFAULT 0.00;

-- Ajouter une contrainte pour s'assurer que le taux horaire est positif
ALTER TABLE users ADD CONSTRAINT check_hourly_rate_positive CHECK (hourly_rate >= 0);

-- Mettre à jour les politiques RLS pour inclure hourly_rate
-- Les utilisateurs peuvent voir leur propre taux horaire
-- Les admins peuvent voir tous les taux horaires
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Les utilisateurs peuvent mettre à jour leur propre profil (y compris le taux horaire)
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Les admins peuvent mettre à jour tous les profils
DROP POLICY IF EXISTS "Admins can update all users" ON users;
CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Commentaire pour documenter le champ
COMMENT ON COLUMN users.hourly_rate IS 'Taux horaire du technicien en euros par heure'; 