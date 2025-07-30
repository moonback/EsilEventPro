# Guide de Dépannage - Erreurs RLS (Row Level Security)

## Problème : Erreur 403 Forbidden lors de la création d'affectations

### Symptômes
```
POST https://your-project.supabase.co/rest/v1/assignments 403 (Forbidden)
new row violates row-level security policy for table "assignments"
```

### Cause
Les politiques RLS (Row Level Security) ne permettent pas aux utilisateurs authentifiés de créer des affectations.

### Solution

#### 1. Exécuter le script SQL corrigé

Exécutez le script `personnel-rls-policies-fixed.sql` dans l'éditeur SQL de Supabase :

```sql
-- Politiques pour les affectations (CORRIGÉES)
DROP POLICY IF EXISTS "Admins can manage assignments" ON assignments;
DROP POLICY IF EXISTS "Users can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can update own assignments" ON assignments;
DROP POLICY IF EXISTS "Authenticated users can create assignments" ON assignments;

-- Permettre aux administrateurs de gérer toutes les affectations
CREATE POLICY "Admins can manage assignments" ON assignments 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Permettre aux utilisateurs authentifiés de créer des affectations
CREATE POLICY "Authenticated users can create assignments" ON assignments 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Permettre aux techniciens de voir leurs propres affectations
CREATE POLICY "Users can view own assignments" ON assignments 
FOR SELECT USING (auth.uid() = technician_id);

-- Permettre aux administrateurs de voir toutes les affectations
CREATE POLICY "Admins can view all assignments" ON assignments 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Permettre aux techniciens de mettre à jour leurs propres affectations
CREATE POLICY "Technicians can update own assignments" ON assignments 
FOR UPDATE USING (auth.uid() = technician_id);

-- Permettre aux administrateurs de supprimer toutes les affectations
CREATE POLICY "Admins can delete assignments" ON assignments 
FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');
```

#### 2. Vérifier les politiques existantes

Dans l'éditeur SQL de Supabase, vérifiez les politiques existantes :

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'assignments';
```

#### 3. Supprimer les anciennes politiques si nécessaire

```sql
-- Supprimer toutes les politiques existantes pour les affectations
DROP POLICY IF EXISTS "Admins can manage assignments" ON assignments;
DROP POLICY IF EXISTS "Users can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can update own assignments" ON assignments;
DROP POLICY IF EXISTS "Authenticated users can create assignments" ON assignments;
```

## Problème : Erreur lors de la création d'utilisateurs

### Symptômes
```
Error: new row violates row-level security policy for table "users"
```

### Solution

#### 1. Vérifier les politiques pour la table users

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';
```

#### 2. Appliquer les politiques correctes

```sql
-- Politiques pour les utilisateurs
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Admins can manage all users" ON users 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view all users" ON users 
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE USING (auth.uid() = id);
```

## Problème : Erreur lors de la gestion des compétences

### Symptômes
```
Error: new row violates row-level security policy for table "skills"
```

### Solution

```sql
-- Politiques pour les compétences
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
DROP POLICY IF EXISTS "Everyone can view skills" ON skills;

CREATE POLICY "Admins can manage skills" ON skills 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Everyone can view skills" ON skills 
FOR SELECT USING (true);
```

## Vérification générale des politiques RLS

### 1. Lister toutes les politiques

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
ORDER BY tablename, policyname;
```

### 2. Vérifier les tables avec RLS activé

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

### 3. Tester les permissions

```sql
-- Tester la lecture des affectations
SELECT * FROM assignments LIMIT 1;

-- Tester la création d'une affectation (remplacer les valeurs)
INSERT INTO assignments (event_id, technician_id, status)
VALUES ('event-uuid', 'user-uuid', 'pending');
```

## Bonnes pratiques

### 1. Structure des politiques RLS

- **Administrateurs** : Accès complet (`FOR ALL`)
- **Utilisateurs authentifiés** : Création et lecture (`FOR INSERT, SELECT`)
- **Utilisateurs spécifiques** : Mise à jour de leurs propres données (`FOR UPDATE USING auth.uid() = user_id`)

### 2. Ordre d'exécution des politiques

1. Supprimer les anciennes politiques
2. Créer les nouvelles politiques
3. Tester les fonctionnalités
4. Vérifier les logs d'erreur

### 3. Debugging

#### Activer les logs détaillés

Dans Supabase Dashboard :
1. Aller dans Settings > Logs
2. Activer "Enable detailed logs"
3. Reproduire l'erreur
4. Vérifier les logs pour plus de détails

#### Tester avec l'API REST

```bash
# Tester la création d'une affectation
curl -X POST "https://your-project.supabase.co/rest/v1/assignments" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"event_id": "uuid", "technician_id": "uuid", "status": "pending"}'
```

## Script de réparation complet

Si vous rencontrez des problèmes persistants, exécutez ce script complet :

```sql
-- Script de réparation complet pour les politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- Réinitialiser toutes les politiques
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
DROP POLICY IF EXISTS "Everyone can view skills" ON skills;
DROP POLICY IF EXISTS "Admins can manage user skills" ON user_skills;
DROP POLICY IF EXISTS "Users can view own skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can view all user skills" ON user_skills;
DROP POLICY IF EXISTS "Admins can manage assignments" ON assignments;
DROP POLICY IF EXISTS "Users can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Technicians can update own assignments" ON assignments;
DROP POLICY IF EXISTS "Authenticated users can create assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can view all assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can delete assignments" ON assignments;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Everyone can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Admins can manage event types" ON event_types;
DROP POLICY IF EXISTS "Everyone can view event types" ON event_types;
DROP POLICY IF EXISTS "Admins can manage event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Everyone can view event requirements" ON event_requirements;
DROP POLICY IF EXISTS "Authenticated users can create event requirements" ON event_requirements;

-- Recréer toutes les politiques
-- Users
CREATE POLICY "Admins can manage all users" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Skills
CREATE POLICY "Admins can manage skills" ON skills FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Everyone can view skills" ON skills FOR SELECT USING (true);

-- User Skills
CREATE POLICY "Admins can manage user skills" ON user_skills FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can view own skills" ON user_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all user skills" ON user_skills FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Assignments
CREATE POLICY "Admins can manage assignments" ON assignments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated users can create assignments" ON assignments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view own assignments" ON assignments FOR SELECT USING (auth.uid() = technician_id);
CREATE POLICY "Admins can view all assignments" ON assignments FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Technicians can update own assignments" ON assignments FOR UPDATE USING (auth.uid() = technician_id);
CREATE POLICY "Admins can delete assignments" ON assignments FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Events
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Everyone can view events" ON events FOR SELECT USING (true);

-- Event Types
CREATE POLICY "Admins can manage event types" ON event_types FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Everyone can view event types" ON event_types FOR SELECT USING (true);

-- Event Requirements
CREATE POLICY "Admins can manage event requirements" ON event_requirements FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated users can create event requirements" ON event_requirements FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Everyone can view event requirements" ON event_requirements FOR SELECT USING (true);
```

## Support

Si vous continuez à rencontrer des problèmes après avoir appliqué ces corrections :

1. **Vérifiez les logs** dans Supabase Dashboard > Logs
2. **Testez les permissions** avec l'API REST
3. **Contactez le support** avec les détails de l'erreur
4. **Fournissez les logs** et les étapes de reproduction

---

*Ce guide est mis à jour régulièrement. Pour les dernières corrections, consultez la documentation officielle de Supabase.* 