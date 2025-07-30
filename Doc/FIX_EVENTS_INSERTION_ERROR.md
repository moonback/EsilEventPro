# 🔧 Résolution du problème d'insertion d'événements

## 🚨 Problème identifié

L'erreur `401 (Unauthorized)` et `42501 (violation de politique RLS)` indique que :
1. L'utilisateur n'est pas correctement authentifié
2. Les politiques RLS empêchent l'insertion d'événements
3. Le champ `created_by` n'est pas correctement défini

## 📋 Étapes de résolution

### 1. 🔍 Diagnostic initial

Exécutez le script de diagnostic dans l'éditeur SQL de Supabase :

```sql
-- Copier et exécuter le contenu de supabase/check-auth-and-policies.sql
```

### 2. 🛠️ Correction des politiques RLS

Exécutez le script de correction dans l'éditeur SQL de Supabase :

```sql
-- Copier et exécuter le contenu de supabase/fix-events-insert-policy.sql
```

### 3. ✅ Vérification de l'authentification

#### A. Vérifier que vous êtes connecté dans l'application :
1. Allez dans votre application React
2. Vérifiez que vous êtes connecté avec un compte admin
3. Vérifiez dans la console du navigateur qu'il n'y a pas d'erreurs d'authentification

#### B. Vérifier les utilisateurs dans Supabase :
```sql
-- Vérifier les utilisateurs dans auth.users
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Vérifier les utilisateurs dans la table users
SELECT 
    id,
    email,
    role,
    created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;
```

### 4. 🔧 Solution alternative temporaire

Si le problème persiste, vous pouvez temporairement désactiver RLS sur la table events :

```sql
-- ATTENTION : À utiliser uniquement en développement
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
```

**⚠️ Important** : Réactivez RLS après avoir corrigé les politiques :
```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

### 5. 🧪 Test de l'insertion

Testez l'insertion d'un événement de test :

```sql
-- Remplacer 'VOTRE_USER_ID' par l'ID d'un utilisateur existant
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
  'VOTRE_USER_ID'
);
```

## 🔍 Vérifications supplémentaires

### 1. Vérifier la configuration Supabase

Dans votre fichier `.env`, vérifiez que les clés sont correctes :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Vérifier l'authentification dans l'App

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

### 3. Vérifier le service d'événements

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
      created_by: eventData.createdBy, // Assurez-vous que cette valeur est correcte
    })
    .select()
    .single();

  if (eventError) throw eventError;
  return this.getById(event.id) as Promise<Event>;
}
```

## 🚀 Solutions avancées

### 1. Politiques RLS plus permissives

Si vous voulez des politiques plus permissives pour le développement :

```sql
-- Politique très permissive (DÉVELOPPEMENT UNIQUEMENT)
CREATE POLICY "Allow all authenticated users" ON events 
FOR ALL USING (auth.role() = 'authenticated');
```

### 2. Vérification des rôles JWT

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

### 3. Politiques basées sur les rôles

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