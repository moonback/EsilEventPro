# Correction des problèmes Supabase

## Problèmes identifiés

1. **Erreur 403 lors de la création d'événements** : Les politiques RLS sont trop restrictives
2. **Fichier .env manquant** : Les variables d'environnement ne sont pas configurées
3. **Erreurs 404** : Problèmes de chargement de modules

## Solutions

### 1. Configuration des variables d'environnement

Le fichier `.env` a été créé avec des valeurs par défaut. Vous devez :

1. Aller sur votre dashboard Supabase
2. Copier votre URL de projet et votre clé anonyme
3. Modifier le fichier `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anonyme-ici
```

### 2. Correction des politiques RLS

**Option 1 (recommandée)** : Exécutez le script SQL `fix-rls-policies-simple.sql` dans l'éditeur SQL de Supabase. Ce script supprime automatiquement toutes les politiques existantes avant d'en créer de nouvelles.

**Option 2** : Si l'option 1 ne fonctionne pas, exécutez le script `fix-rls-policies.sql` qui liste explicitement toutes les politiques à supprimer.

Ces scripts permettent :
- Aux utilisateurs authentifiés de créer des événements
- Aux créateurs d'événements de modifier leurs événements
- De maintenir les permissions d'administrateur

### 3. Redémarrage du serveur de développement

Après avoir configuré le fichier `.env`, redémarrez le serveur :

```bash
npm run dev
```

### 4. Vérification de l'authentification

Assurez-vous qu'un utilisateur est connecté avant de créer des événements. L'application devrait :

1. Rediriger vers la page de connexion si non authentifié
2. Permettre la création d'événements une fois connecté

## Test de la correction

1. Configurez les variables d'environnement
2. Exécutez le script SQL dans Supabase
3. Redémarrez l'application
4. Connectez-vous avec un compte utilisateur
5. Essayez de créer un événement

## Notes importantes

- Les politiques RLS sont maintenant plus permissives pour les utilisateurs authentifiés
- Seuls les créateurs d'événements et les administrateurs peuvent modifier/supprimer les événements
- Les utilisateurs non authentifiés ne peuvent que voir les événements 