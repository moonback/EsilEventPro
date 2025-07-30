# Correction de l'erreur 401 pour event_requirements

## Problème
L'erreur 401 (Unauthorized) se produit lors de l'insertion de données dans la table `event_requirements`. Cela indique un problème avec les politiques RLS (Row Level Security).

## Symptômes
```
POST https://npikxhxfegrdfrbbuysd.supabase.co/rest/v1/event_requirements?columns=%22event_id%22%2C%22skill_id%22%2C%22count%22%2C%22level%22 401 (Unauthorized)
```

## Cause
Les politiques RLS actuelles sur la table `event_requirements` sont trop restrictives et ne permettent pas aux utilisateurs authentifiés d'insérer des données.

## Solution

### Étape 1 : Diagnostic
Exécutez le script de diagnostic pour vérifier l'état actuel :

```sql
-- Exécuter dans l'éditeur SQL de Supabase
-- Voir le fichier : supabase/debug-event-requirements-policies.sql
```

### Étape 2 : Correction des politiques
Exécutez le script de correction :

```sql
-- Exécuter dans l'éditeur SQL de Supabase
-- Voir le fichier : supabase/fix-event-requirements-insert-policy.sql
```

### Étape 3 : Vérification
Après avoir appliqué les corrections, vérifiez que les nouvelles politiques sont en place :

```sql
SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'event_requirements'
ORDER BY policyname;
```

## Politiques créées

Le script de correction crée les politiques suivantes :

1. **`authenticated_users_can_create_requirements`** : Permet aux utilisateurs authentifiés d'insérer des exigences
2. **`everyone_can_view_requirements`** : Permet à tous de voir les exigences
3. **`event_creators_can_update_requirements`** : Permet aux créateurs d'événements de mettre à jour leurs exigences
4. **`admins_can_update_all_requirements`** : Permet aux administrateurs de mettre à jour toutes les exigences
5. **`event_creators_can_delete_requirements`** : Permet aux créateurs d'événements de supprimer leurs exigences
6. **`admins_can_delete_all_requirements`** : Permet aux administrateurs de supprimer toutes les exigences

## Test de la correction

Après avoir appliqué les corrections, testez la fonctionnalité :

1. Connectez-vous en tant qu'utilisateur authentifié
2. Créez un nouvel événement avec des exigences en techniciens
3. Vérifiez que l'insertion dans `event_requirements` fonctionne

## Vérification des logs

Si le problème persiste, vérifiez les logs dans Supabase Dashboard :

1. Allez dans **Dashboard > Logs**
2. Filtrez par **API** ou **Database**
3. Recherchez les erreurs liées à `event_requirements`

## Support

Si le problème persiste après avoir appliqué ces corrections :

1. Vérifiez que l'utilisateur est bien authentifié
2. Vérifiez que l'événement existe et appartient à l'utilisateur
3. Vérifiez les contraintes de clés étrangères
4. Contactez le support avec les logs d'erreur

---

*Ce guide est mis à jour régulièrement. Pour les dernières corrections, consultez la documentation officielle de Supabase.* 