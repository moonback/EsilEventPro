# Configuration Supabase pour EventPro

Ce guide vous explique comment configurer Supabase pour votre application EventPro.

## 🚀 Étapes de Configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé anon (Settings > API)

### 2. Configurer les Variables d'Environnement

Créez un fichier `.env` à la racine du projet avec :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Créer les Tables

1. Allez dans l'éditeur SQL de Supabase
2. Copiez et exécutez le contenu du fichier `supabase-schema.sql`

### 4. Configurer l'Authentification

1. Dans Supabase Dashboard > Authentication > Settings
2. Activez "Enable email confirmations" si nécessaire
3. Configurez les redirect URLs si besoin

### 5. Créer les Utilisateurs de Test

#### Via l'Interface Supabase :

1. **Créer l'admin :**
   - Allez dans Authentication > Users
   - Cliquez sur "Add user"
   - Email: `admin@eventpro.com`
   - Password: `admin123`
   - Notez l'UUID généré

2. **Créer le technicien :**
   - Email: `tech@eventpro.com`
   - Password: `tech123`
   - Notez l'UUID généré

#### Via SQL (optionnel) :

```sql
-- Insérer le profil admin (remplacez l'UUID par celui généré)
INSERT INTO users (id, email, first_name, last_name, role, phone) VALUES
  ('UUID_DE_L_ADMIN', 'admin@eventpro.com', 'Admin', 'System', 'admin', '+33123456789');

-- Insérer le profil technicien (remplacez l'UUID par celui généré)
INSERT INTO users (id, email, first_name, last_name, role, phone) VALUES
  ('UUID_DU_TECH', 'tech@eventpro.com', 'Jean', 'Dupont', 'technician', '+33987654321');

-- Ajouter des compétences au technicien
INSERT INTO user_skills (user_id, skill_id) VALUES
  ('UUID_DU_TECH', '550e8400-e29b-41d4-a716-446655440001'), -- Mixage Audio
  ('UUID_DU_TECH', '550e8400-e29b-41d4-a716-446655440003'); -- Éclairage Scène
```

## 🔧 Configuration Avancée

### Politiques de Sécurité (RLS)

Les politiques RLS sont déjà configurées dans le script SQL. Elles permettent :

- **Admins** : Accès complet à toutes les données
- **Techniciens** : Lecture de leurs propres affectations, mise à jour de leur profil
- **Tous** : Lecture des événements, compétences, types d'événements

### Fonctions de Base de Données

Le script crée automatiquement :
- Triggers pour `updated_at`
- Contraintes de validation
- Index pour les performances

## 🧪 Test de l'Application

1. **Démarrer l'application :**
   ```bash
   npm run dev
   ```

2. **Tester la connexion :**
   - Admin: `admin@eventpro.com` / `admin123`
   - Technicien: `tech@eventpro.com` / `tech123`

3. **Vérifier les données :**
   - Les compétences et types d'événements sont automatiquement chargés
   - Créez des événements pour tester le système

## 🔍 Dépannage

### Erreurs Courantes

1. **"Variables d'environnement manquantes"**
   - Vérifiez que le fichier `.env` existe
   - Redémarrez le serveur de développement

2. **"Erreur d'authentification"**
   - Vérifiez que l'utilisateur existe dans Supabase Auth
   - Vérifiez que le profil existe dans la table `users`

3. **"Erreur de permissions"**
   - Vérifiez que les politiques RLS sont correctement configurées
   - Vérifiez que l'utilisateur a le bon rôle

### Logs de Débogage

Activez les logs dans la console du navigateur pour voir les erreurs détaillées.

## 📊 Monitoring

Dans Supabase Dashboard, vous pouvez surveiller :
- **Database** : Requêtes, performances
- **Authentication** : Connexions, utilisateurs
- **Logs** : Erreurs et événements

## 🔐 Sécurité

- Les mots de passe sont hashés par Supabase
- Les politiques RLS protègent les données
- Les tokens JWT sont gérés automatiquement
- Les sessions expirent automatiquement

## 🚀 Déploiement

Pour déployer en production :

1. **Variables d'environnement :**
   - Utilisez les variables d'environnement de votre plateforme
   - Ne committez jamais le fichier `.env`

2. **Base de données :**
   - Les migrations sont automatiques via le script SQL
   - Sauvegardez régulièrement vos données

3. **Authentification :**
   - Configurez les domaines autorisés dans Supabase
   - Activez HTTPS en production

## 📞 Support

En cas de problème :
1. Vérifiez les logs de la console
2. Consultez la documentation Supabase
3. Vérifiez les politiques RLS
4. Testez avec un utilisateur fraîchement créé 