# Guide de Déploiement Vercel

## Configuration requise

### 1. Variables d'environnement

Dans votre projet Vercel, configurez les variables d'environnement suivantes :

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Étapes de déploiement

1. **Connectez votre repository GitHub à Vercel**
2. **Configurez les variables d'environnement** dans les paramètres du projet Vercel
3. **Déployez automatiquement** - Vercel détectera automatiquement la configuration

### 3. Configuration Vercel

Le fichier `vercel.json` est déjà configuré pour :
- Gérer le routing SPA (Single Page Application)
- Rediriger toutes les routes vers `index.html`
- Utiliser Vite comme framework

### 4. Vérification du déploiement

Après le déploiement, vérifiez que :
- La page de connexion s'affiche correctement
- Les variables d'environnement sont bien configurées
- Le routing fonctionne (navigation entre les pages)

### 5. Dépannage

Si vous avez une page blanche :
1. Vérifiez les variables d'environnement dans Vercel
2. Consultez les logs de build dans Vercel
3. Vérifiez la console du navigateur pour les erreurs

### 6. Commandes de build

```bash
npm run build
```

Le build génère les fichiers dans le dossier `dist/` qui seront déployés sur Vercel. 