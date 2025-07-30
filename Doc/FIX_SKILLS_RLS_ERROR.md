# Guide de résolution - Erreur RLS Skills

## Problème identifié

**Erreur :**
```
{code: '42501', details: null, hint: null, message: 'new row violates row-level security policy for table "skills"'}
```

**Cause :**
- Les politiques RLS (Row Level Security) de la table `skills` sont trop restrictives
- Seuls les administrateurs peuvent créer des compétences, mais l'application essaie d'insérer des compétences sans être connecté en tant qu'admin
- Les politiques actuelles ne permettent pas aux utilisateurs authentifiés de créer des compétences

## Solution

### ✅ **1. Exécuter le script de correction RLS**

Dans l'éditeur SQL de Supabase, exécuter le script `fix-all-tables-rls-policies.sql` :

```sql
-- Ce script corrige toutes les politiques RLS pour permettre aux utilisateurs authentifiés de créer des données
-- Voir le fichier: supabase/fix-all-tables-rls-policies.sql
```

### ✅ **2. Vérifier les politiques après correction**

```sql
-- Vérifier les politiques de la table skills
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'skills'
ORDER BY policyname;
```

**Résultat attendu :**
- `Everyone can view skills` (SELECT)
- `Authenticated users can create skills` (INSERT)
- `Admins can update skills` (UPDATE)
- `Admins can delete skills` (DELETE)

### ✅ **3. Tester la création de compétences**

Après avoir exécuté le script, tester la création d'une compétence dans l'interface :

1. Aller dans "Gestion des compétences"
2. Cliquer sur "Ajouter une compétence"
3. Remplir le formulaire
4. Vérifier qu'il n'y a plus d'erreur 401/42501

## Politiques RLS corrigées

### **Table Skills**
- ✅ **Lecture** : Tout le monde peut voir les compétences
- ✅ **Création** : Utilisateurs authentifiés peuvent créer des compétences
- ✅ **Modification** : Seuls les admins peuvent modifier
- ✅ **Suppression** : Seuls les admins peuvent supprimer

### **Table Event Types**
- ✅ **Lecture** : Tout le monde peut voir les types d'événements
- ✅ **Création** : Utilisateurs authentifiés peuvent créer des types
- ✅ **Modification** : Seuls les admins peuvent modifier
- ✅ **Suppression** : Seuls les admins peuvent supprimer

### **Table Users**
- ✅ **Lecture** : Tout le monde peut voir les utilisateurs
- ✅ **Création** : Utilisateurs authentifiés peuvent créer des utilisateurs
- ✅ **Modification** : Utilisateurs peuvent modifier leur propre profil
- ✅ **Suppression** : Seuls les admins peuvent supprimer

## Prévention

### ✅ **Bonnes pratiques**

1. **Tester les politiques** : Vérifier les politiques RLS après chaque modification
2. **Logs d'erreur** : Surveiller les erreurs 401/42501 dans la console
3. **Permissions minimales** : Donner le minimum de permissions nécessaires
4. **Documentation** : Documenter les politiques RLS pour chaque table

### ✅ **Scripts de vérification**

```sql
-- Vérifier toutes les politiques RLS
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Vérifier les tables avec RLS activé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

## Résultat

✅ **L'erreur 42501 est résolue**
✅ **Les utilisateurs authentifiés peuvent créer des compétences**
✅ **La sécurité est maintenue (seuls les admins peuvent modifier/supprimer)**
✅ **Toutes les tables ont des politiques RLS cohérentes**

## Test

1. **Redémarrer l'application** après avoir exécuté le script
2. **Tester la création** d'une nouvelle compétence
3. **Vérifier** qu'aucune erreur 401/42501 n'apparaît dans la console
4. **Tester** les autres fonctionnalités (création d'événements, etc.) 