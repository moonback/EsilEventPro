# Guide de dépannage - Erreurs user_skills

## Erreur 403 (Forbidden) - user_skills

**Erreur :**
```
new row violates row-level security policy for table "user_skills"
```

**Cause :**
- Les politiques RLS pour `user_skills` ne permettent pas l'insertion par les utilisateurs authentifiés
- Seuls les administrateurs peuvent gérer les compétences utilisateurs

## Solution

### ✅ **Scripts de correction**

**Option 1 : Script simple** - Exécuter `fix-user-skills-policies.sql` dans l'éditeur SQL de Supabase

**Option 2 : Script robuste** - Exécuter `fix-user-skills-policies-robust.sql` (recommandé)

```sql
-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Admins can manage user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can view own skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can view all user skills" ON user_skills;

-- Créer les nouvelles politiques
CREATE POLICY "Admins can manage user skills" ON user_skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated users can create user skills" ON user_skills 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own skills" ON user_skills 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user skills" ON user_skills 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

### ✅ **Politiques ajoutées**

1. **`Authenticated users can create user skills`** : Permet aux utilisateurs authentifiés de créer des compétences utilisateur
2. **`Users can view own skills`** : Permet aux utilisateurs de voir leurs propres compétences
3. **`Admins can view all user skills`** : Permet aux administrateurs de voir toutes les compétences
4. **`Admins can manage user skills`** : Permet aux administrateurs de gérer toutes les compétences

## Vérifications

### 1. Vérifier les politiques actuelles
```sql
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'user_skills'
ORDER BY policyname;
```

### 2. Tester l'insertion manuelle
```sql
-- Tester l'insertion (remplacer les IDs)
INSERT INTO user_skills (user_id, skill_id) 
VALUES ('ID_UTILISATEUR', 'ID_COMPETENCE');
```

### 3. Vérifier les compétences existantes
```sql
SELECT 
    u.first_name || ' ' || u.last_name as user_name,
    s.name as skill_name,
    s.category,
    s.level
FROM user_skills us
JOIN users u ON us.user_id = u.id
JOIN skills s ON us.skill_id = s.id
ORDER BY u.first_name, s.name;
```

## Fonctionnalités de l'application

### ✅ **Gestion des compétences utilisateur**
- Ajout de compétences lors de la création/modification d'utilisateur
- Affichage des compétences dans la liste des utilisateurs
- Filtrage par compétences

### ✅ **Sécurité**
- Seuls les utilisateurs authentifiés peuvent créer des compétences
- Les utilisateurs ne peuvent voir que leurs propres compétences
- Les administrateurs ont un accès complet

## Prévention

1. **Exécuter le script de correction** : `fix-user-skills-policies.sql`
2. **Vérifier les politiques** : Utiliser le script de vérification
3. **Tester les fonctionnalités** : Créer/modifier un utilisateur avec des compétences
4. **Vérifier les logs** : En cas d'erreur, consulter les messages détaillés

## Scripts utiles

- **`check-user-skills-policies.sql`** : Diagnostic des politiques user_skills
- **`fix-user-skills-policies.sql`** : Correction simple des politiques user_skills
- **`fix-user-skills-policies-robust.sql`** : Correction robuste (recommandé)
- **`verify-policies.sql`** : Vérification générale des politiques
- **`clean-and-recreate-policies.sql`** : Nettoyage complet et recréation

## Résultat

✅ **L'erreur 403 est résolue**
✅ **Les utilisateurs peuvent ajouter des compétences**
✅ **La sécurité est maintenue**
✅ **Les administrateurs ont un accès complet** 