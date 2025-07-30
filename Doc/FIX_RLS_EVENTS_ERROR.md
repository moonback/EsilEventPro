# 🔧 Résolution de l'Erreur RLS Events

## 🚨 Problème Identifié

L'erreur `new row violates row-level security policy for table "events"` indique que les politiques RLS (Row Level Security) de Supabase empêchent l'insertion de nouvelles lignes dans la table `events`.

## 📋 Étapes de Résolution

### 1. 🔍 Diagnostic Initial

Exécutez le script de diagnostic dans l'éditeur SQL de Supabase :

```sql
-- Copier et exécuter le contenu de supabase/debug-events-rls.sql
```

### 2. 🛠️ Correction des Politiques RLS

Exécutez le script de correction dans l'éditeur SQL de Supabase :

```sql
-- Copier et exécuter le contenu de supabase/fix-events-rls-policy.sql
```

### 3. ✅ Vérification de l'Authentification

1. **Vérifiez que vous êtes connecté** :
   - Allez dans l'interface Supabase
   - Vérifiez que vous êtes connecté avec un compte admin

2. **Vérifiez les utilisateurs existants** :
   ```sql
   SELECT id, email, role FROM auth.users;
   SELECT id, email, role FROM users;
   ```

### 4. 🔧 Solution Alternative Temporaire

Si le problème persiste, vous pouvez temporairement désactiver RLS sur la table events :

```sql
-- ATTENTION : À utiliser uniquement en développement
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
```

**⚠️ Important** : Réactivez RLS après avoir corrigé les politiques :
```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

### 5. 🧪 Test de l'Insertion

Testez l'insertion d'un événement de test :

```sql
INSERT INTO events (
  title, 
  description, 
  start_date, 
  end_date, 
  location, 
  type_id, 
  status, 
  created_by
) VALUES (
  'Test Event', 
  'Test Description', 
  '2024-01-01 10:00:00', 
  '2024-01-01 12:00:00', 
  'Test Location', 
  '1', 
  'draft', 
  'test-user-id'
);
```

## 🔍 Vérifications Supplémentaires

### 1. Vérifier la Configuration Supabase

Dans votre fichier `.env`, vérifiez que les clés sont correctes :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Vérifier l'Authentification dans l'App

Dans `src/lib/supabase.ts`, vérifiez la configuration :

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### 3. Vérifier le Service d'Événements

Dans `src/services/supabaseService.ts`, la méthode `create` devrait ressembler à :

```typescript
async create(eventData: EventFormData & { createdBy: string }): Promise<Event> {
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      title: eventData.title,
      description: eventData.description,
      start_date: eventData.startDate.toISOString(),
      end_date: eventData.endDate.toISOString(),
      location: eventData.location,
      type_id: eventData.typeId,
      status: 'draft',
      created_by: eventData.createdBy,
    })
    .select()
    .single();

  if (eventError) throw eventError;
  return this.getById(event.id) as Promise<Event>;
}
```

## 🚀 Solutions Avancées

### 1. Politiques RLS Plus Permissives

Si vous voulez des politiques plus permissives pour le développement :

```sql
-- Politique très permissive (DÉVELOPPEMENT UNIQUEMENT)
CREATE POLICY "Allow all authenticated users" ON events 
FOR ALL USING (auth.role() = 'authenticated');
```

### 2. Vérification des Rôles JWT

Ajoutez une fonction pour vérifier les rôles JWT :

```sql
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt() ->> 'role',
    'authenticated'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Politiques Basées sur les Rôles

```sql
-- Politique pour les admins
CREATE POLICY "Admins full access" ON events 
FOR ALL USING (get_user_role() = 'admin');

-- Politique pour les techniciens
CREATE POLICY "Technicians read access" ON events 
FOR SELECT USING (get_user_role() = 'technician');
```

## 📞 Support

Si le problème persiste après avoir suivi ces étapes :

1. **Vérifiez les logs** dans la console du navigateur
2. **Testez avec un utilisateur admin** différent
3. **Vérifiez les permissions** dans l'interface Supabase
4. **Consultez la documentation** Supabase sur RLS

## 🔄 Prévention

Pour éviter ce problème à l'avenir :

1. **Testez toujours les politiques RLS** avant le déploiement
2. **Utilisez des environnements séparés** pour dev/prod
3. **Documentez les politiques RLS** pour votre équipe
4. **Créez des scripts de migration** pour les politiques

---

**Note** : Ces solutions sont spécifiques à Supabase et PostgreSQL. Adaptez selon votre configuration exacte. 