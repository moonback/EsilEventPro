# Guide de Dépannage - Erreurs 403 (Forbidden)

## Problème
Les erreurs 403 indiquent que les politiques RLS (Row Level Security) de Supabase bloquent l'accès aux données. Voici comment les résoudre.

## Solution 1: Exécuter le Script de Correction des Politiques

### Étape 1: Accéder à l'éditeur SQL de Supabase
1. Connectez-vous à votre projet Supabase
2. Allez dans la section "SQL Editor"
3. Créez un nouveau script

### Étape 2: Exécuter le script de correction
Copiez et exécutez le contenu du fichier `fix-all-rls-policies.sql` dans l'éditeur SQL.

### Étape 3: Vérifier les politiques
Après l'exécution, vous devriez voir une liste des politiques créées. Vérifiez que toutes les tables ont les bonnes politiques.

## Solution 2: Vérifier l'Authentification

### Vérifier que l'utilisateur est connecté
```javascript
// Dans la console du navigateur
console.log('User:', supabase.auth.getUser())
```

### Vérifier le rôle de l'utilisateur
```javascript
// Vérifier le rôle dans la table users
const { data: user } = await supabase
  .from('users')
  .select('role')
  .eq('id', auth.user.id)
  .single()
```

## Solution 3: Politiques RLS Manuelles

Si les scripts automatiques ne fonctionnent pas, créez manuellement ces politiques :

### Pour la table `assignments`
```sql
-- Permettre à tous les utilisateurs authentifiés de voir les affectations
CREATE POLICY "Authenticated users can view assignments" ON assignments 
FOR SELECT USING (auth.role() = 'authenticated');

-- Permettre aux admins de tout gérer
CREATE POLICY "Admins can manage all assignments" ON assignments 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Permettre aux techniciens de voir leurs affectations
CREATE POLICY "Technicians can view own assignments" ON assignments 
FOR SELECT USING (auth.uid() = technician_id);

-- Permettre aux techniciens de mettre à jour leurs affectations
CREATE POLICY "Technicians can update own assignments" ON assignments 
FOR UPDATE USING (auth.uid() = technician_id);
```

### Pour la table `events`
```sql
-- Permettre à tous les utilisateurs authentifiés de voir les événements
CREATE POLICY "Authenticated users can view events" ON events 
FOR SELECT USING (auth.role() = 'authenticated');

-- Permettre aux admins de gérer les événements
CREATE POLICY "Admins can manage events" ON events 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

## Solution 4: Désactiver Temporairement RLS (DÉVELOPPEMENT UNIQUEMENT)

⚠️ **ATTENTION**: Cette solution ne doit être utilisée qu'en développement !

```sql
-- Désactiver RLS temporairement pour le débogage
ALTER TABLE assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_requirements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills DISABLE ROW LEVEL SECURITY;
```

## Solution 5: Vérifier les Variables d'Environnement

Assurez-vous que les variables d'environnement sont correctement configurées :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Solution 6: Debug des Politiques

### Vérifier les politiques existantes
```sql
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Tester une requête simple
```sql
-- Tester l'accès aux affectations
SELECT * FROM assignments LIMIT 1;
```

## Solution 7: Réinitialiser les Politiques

Si rien ne fonctionne, supprimez toutes les politiques et recréez-les :

```sql
-- Supprimer toutes les politiques
DROP POLICY IF EXISTS "Authenticated users can view assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can manage all assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can update own assignments" ON assignments;

-- Recréer les politiques de base
CREATE POLICY "Enable read access for all users" ON assignments FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON assignments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for users based on technician_id" ON assignments FOR UPDATE USING (auth.uid() = technician_id);
CREATE POLICY "Enable delete for users based on technician_id" ON assignments FOR DELETE USING (auth.uid() = technician_id);
```

## Vérification

Après avoir appliqué une solution :

1. **Rechargez la page** de l'application
2. **Vérifiez la console** du navigateur pour les erreurs
3. **Testez les fonctionnalités** qui causaient des erreurs 403
4. **Vérifiez les logs** de Supabase pour plus de détails

## Logs Supabase

Pour voir les logs détaillés :
1. Allez dans la section "Logs" de Supabase
2. Filtrez par "Database" pour voir les requêtes SQL
3. Cherchez les erreurs 403 et les requêtes bloquées

## Support

Si les problèmes persistent :
1. Vérifiez que l'utilisateur a le bon rôle dans la table `users`
2. Vérifiez que l'authentification fonctionne correctement
3. Testez avec un utilisateur admin pour isoler le problème
4. Consultez la documentation Supabase sur les politiques RLS 