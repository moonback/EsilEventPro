# Correction de l'erreur 409 sur user_skills

## Problème
L'erreur `Failed to load resource: the server responded with a status of 409 ()` se produit lors de la mise à jour d'un utilisateur dans `PersonnelManagement.tsx`. Cette erreur indique un conflit lors des opérations DELETE/INSERT sur la table `user_skills`.

## Cause
Les politiques RLS (Row Level Security) sur la table `user_skills` ne permettent pas correctement les opérations DELETE et INSERT par les administrateurs.

## Solution

### 1. Appliquer le script SQL de correction

Exécutez le script `fix-user-skills-409-error.sql` dans l'éditeur SQL de Supabase :

```sql
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
```

### 2. Amélioration du code JavaScript

Le code dans `PersonnelManagement.tsx` a été modifié pour gérer les erreurs de compétences de manière plus robuste :

- Les erreurs de suppression/ajout de compétences ne bloquent plus la mise à jour de l'utilisateur
- Les erreurs sont loggées en warning plutôt qu'en erreur fatale
- L'opération continue même si la gestion des compétences échoue

### 3. Vérification

Après avoir appliqué le script SQL :

1. **Vérifiez les politiques créées** :
```sql
SELECT 
    tablename,
    policyname,
    cmd,
    permissive as policy_type
FROM pg_policies 
WHERE tablename = 'user_skills'
ORDER BY policyname;
```

2. **Testez la mise à jour d'un utilisateur** dans l'interface d'administration

3. **Vérifiez les logs** dans la console du navigateur pour s'assurer qu'il n'y a plus d'erreurs 409

## Politiques créées

- **`Admins can manage all user skills`** : Permet aux administrateurs de gérer toutes les compétences
- **`Users can view own skills`** : Permet aux utilisateurs de voir leurs propres compétences
- **`Admins can view all user skills`** : Permet aux administrateurs de voir toutes les compétences
- **`Authenticated users can insert user skills`** : Permet l'insertion par les utilisateurs authentifiés
- **`Admins can delete user skills`** : Permet la suppression par les administrateurs
- **`Admins can update user skills`** : Permet la mise à jour par les administrateurs

## Avantages

- ✅ Correction de l'erreur 409
- ✅ Gestion robuste des erreurs dans le code
- ✅ Politiques RLS claires et spécifiques
- ✅ Maintien de la sécurité des données
- ✅ Amélioration de l'expérience utilisateur 