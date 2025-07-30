# Correction - Techniciens requis ne sont pas sauvegardés

## 🚨 Problème
Les "Techniciens requis" ne sont pas sauvegardés lors de la création ou modification d'un événement. Cela se produit à cause de l'erreur 401 (Unauthorized) lors de l'insertion dans la table `event_requirements`.

## 🔍 Diagnostic

### Étape 1 : Vérifier l'erreur
Dans la console du navigateur, vous devriez voir :
```
POST https://npikxhxfegrdfrbbuysd.supabase.co/rest/v1/event_requirements?columns=%22event_id%22%2C%22skill_id%22%2C%22count%22%2C%22level%22 401 (Unauthorized)
```

### Étape 2 : Exécuter le diagnostic
Exécutez le script de diagnostic :
```sql
-- Voir le fichier : supabase/test-event-requirements-insert.sql
```

## ✅ Solution

### Option 1 : Correction rapide (recommandée)
Exécutez le script de correction complète :

```sql
-- Voir le fichier : supabase/fix-event-requirements-complete.sql
```

Ce script va :
- ✅ Supprimer toutes les anciennes politiques restrictives
- ✅ Créer des politiques très permissives pour les tests
- ✅ Vérifier que les tables ont des données
- ✅ Tester l'insertion

### Option 2 : Correction spécifique
Si l'option 1 ne fonctionne pas, exécutez le script spécifique :

```sql
-- Voir le fichier : supabase/fix-event-requirements-insert-policy.sql
```

## 🧪 Test de la correction

### Étape 1 : Vérifier les politiques
Après avoir appliqué la correction, vérifiez que les politiques sont en place :

```sql
SELECT 
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'event_requirements'
ORDER BY policyname;
```

### Étape 2 : Tester manuellement
Connectez-vous en tant qu'utilisateur authentifié et testez l'insertion :

```sql
-- Remplacer les UUIDs par des valeurs réelles
INSERT INTO event_requirements (event_id, skill_id, count, level) 
VALUES (
  (SELECT id FROM events LIMIT 1),
  (SELECT id FROM skills LIMIT 1),
  2,
  'intermediate'
);
```

### Étape 3 : Tester dans l'application
1. Connectez-vous à l'application
2. Créez un nouvel événement
3. Ajoutez des techniciens requis
4. Sauvegardez l'événement
5. Vérifiez que les exigences sont sauvegardées

## 🔧 Vérifications supplémentaires

### Vérifier les données existantes
```sql
-- Vérifier les événements
SELECT COUNT(*) as event_count FROM events;

-- Vérifier les compétences
SELECT COUNT(*) as skill_count FROM skills;

-- Vérifier les exigences existantes
SELECT COUNT(*) as requirement_count FROM event_requirements;
```

### Vérifier les contraintes
```sql
-- Vérifier les clés étrangères
SELECT 
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'event_requirements' 
AND tc.constraint_type = 'FOREIGN KEY';
```

## 🐛 Si le problème persiste

### Vérification des logs
1. Allez dans **Supabase Dashboard > Logs**
2. Filtrez par **API** ou **Database**
3. Recherchez les erreurs liées à `event_requirements`

### Vérification de l'authentification
```sql
-- Vérifier que l'utilisateur est bien authentifié
SELECT 
  auth.uid() as user_id,
  auth.role() as user_role,
  auth.jwt() ->> 'role' as jwt_role;
```

### Vérification des données
```sql
-- Vérifier que les UUIDs sont valides
SELECT 
  er.id,
  er.event_id,
  er.skill_id,
  e.title as event_title,
  s.name as skill_name
FROM event_requirements er
LEFT JOIN events e ON er.event_id = e.id
LEFT JOIN skills s ON er.skill_id = s.id
ORDER BY er.created_at DESC;
```

## 📋 Politiques créées

Le script de correction crée les politiques suivantes :

1. **`allow_all_for_authenticated_users`** : Permet tout aux utilisateurs authentifiés
2. **`authenticated_users_can_insert`** : Permet l'insertion aux utilisateurs authentifiés
3. **`everyone_can_select`** : Permet la lecture à tous
4. **`authenticated_users_can_update`** : Permet la mise à jour aux utilisateurs authentifiés
5. **`authenticated_users_can_delete`** : Permet la suppression aux utilisateurs authentifiés

## 🎯 Résultat attendu

Après avoir appliqué la correction :
- ✅ Les techniciens requis sont sauvegardés lors de la création d'événements
- ✅ Les techniciens requis sont sauvegardés lors de la modification d'événements
- ✅ Aucune erreur 401 dans la console
- ✅ Les exigences apparaissent dans la base de données

---

*Ce guide est mis à jour régulièrement. Pour les dernières corrections, consultez la documentation officielle de Supabase.* 