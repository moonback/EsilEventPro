# Guide de dépannage - Erreur 409 (Conflict) - Doublons user_skills

## Erreur 409 (Conflict) - user_skills

**Erreur :**
```
duplicate key value violates unique constraint "user_skills_user_id_skill_id_key"
```

**Cause :**
- La table `user_skills` a une contrainte unique sur `(user_id, skill_id)`
- La logique de modification des compétences utilisateur crée des doublons temporaires
- Des doublons existent déjà dans la base de données

## Solution

### ✅ **1. Corriger la logique dans PersonnelManagement.tsx**

La logique a été mise à jour pour :
- Comparer les compétences actuelles avec les nouvelles
- Supprimer seulement les compétences non sélectionnées
- Ajouter seulement les nouvelles compétences
- Éviter les doublons

### ✅ **2. Nettoyer les doublons existants**

Exécuter `fix-user-skills-duplicates.sql` dans l'éditeur SQL de Supabase :

```sql
-- Identifier les doublons
SELECT 
    user_id,
    skill_id,
    COUNT(*) as duplicate_count
FROM user_skills
GROUP BY user_id, skill_id
HAVING COUNT(*) > 1;

-- Supprimer les doublons (garder le plus récent)
DELETE FROM user_skills 
WHERE id IN (
    SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY user_id, skill_id 
                   ORDER BY created_at DESC
               ) as rn
        FROM user_skills
    ) ranked
    WHERE rn > 1
);
```

### ✅ **3. Vérifier la contrainte unique**

```sql
-- Vérifier les contraintes de user_skills
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_skills' 
AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;
```

## Prévention

### ✅ **Logique améliorée**

1. **Avant modification** : Récupérer les compétences actuelles
2. **Comparaison** : Identifier les compétences à ajouter/supprimer
3. **Suppression sélective** : Supprimer seulement les compétences non sélectionnées
4. **Ajout sélectif** : Ajouter seulement les nouvelles compétences

### ✅ **Vérifications**

1. **Avant modification** : Vérifier qu'il n'y a pas de doublons
2. **Après modification** : Confirmer que les compétences sont correctes
3. **Logs** : Surveiller les erreurs de contrainte

## Scripts utiles

- **`fix-user-skills-duplicates.sql`** : Nettoyer les doublons existants
- **`check-user-skills-policies.sql`** : Vérifier les politiques RLS
- **`PersonnelManagement.tsx`** : Logique corrigée pour éviter les doublons

## Résultat

✅ **L'erreur 409 est résolue**
✅ **Les doublons sont évités**
✅ **La logique de modification est robuste**
✅ **Les contraintes de base de données sont respectées**

## Test

1. **Modifier un utilisateur** avec des compétences
2. **Vérifier** qu'aucune erreur 409 ne se produit
3. **Confirmer** que les compétences sont correctement mises à jour
4. **Tester** plusieurs modifications successives 