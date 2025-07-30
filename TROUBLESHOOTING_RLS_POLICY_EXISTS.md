# Guide de dépannage : Erreur "policy already exists"

## Problème
L'erreur `ERROR: 42710: policy "Users can view own profile" for table "users" already exists` se produit lors de l'exécution du script `fix-users-rls-infinite-recursion.sql`.

## Cause
Cette erreur indique que le script tente de créer des politiques RLS qui existent déjà dans la base de données Supabase.

## Solutions

### Solution 1 : Script mis à jour (Recommandé)
Utilisez le script `fix-users-rls-infinite-recursion.sql` mis à jour qui supprime toutes les politiques existantes avant de les recréer.

### Solution 2 : Script sécurisé
Utilisez le script `fix-users-rls-infinite-recursion-safe.sql` qui vérifie l'existence des politiques avant de les créer.

### Solution 3 : Nettoyage manuel
Si les scripts ne fonctionnent pas, vous pouvez nettoyer manuellement les politiques :

1. Allez dans l'éditeur SQL de Supabase
2. Exécutez cette requête pour voir les politiques existantes :
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'users';
```

3. Supprimez manuellement chaque politique :
```sql
DROP POLICY IF EXISTS "nom_de_la_politique" ON users;
```

4. Puis exécutez le script de création des nouvelles politiques.

## Vérification
Après avoir appliqué le fix, vérifiez que les politiques sont correctement créées :

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;
```

## Politiques attendues
- `Admins can manage all users` (FOR ALL)
- `Users can view own profile` (FOR SELECT)
- `Admins can view all users` (FOR SELECT)
- `Users can update own profile` (FOR UPDATE)
- `Admins can insert users` (FOR INSERT)
- `Admins can delete users` (FOR DELETE)

## Test de fonctionnement
Pour tester que les politiques fonctionnent correctement :

1. Connectez-vous en tant qu'administrateur
2. Allez dans la page "Gestion du personnel"
3. Vérifiez que la liste des utilisateurs se charge sans erreur

Si vous rencontrez encore des erreurs, consultez les logs de la console du navigateur pour plus de détails. 