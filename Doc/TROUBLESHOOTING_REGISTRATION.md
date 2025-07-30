# Dépannage - Inscription Technicien

## 🚨 Problème Actuel

L'erreur indique une ambiguïté de colonne dans la fonction SQL :

```
column reference "skill_id" is ambiguous
```

Cette erreur se produit car les noms des variables dans la fonction entrent en conflit avec les noms des colonnes de la table.

## ✅ Solution

### Étape 1 : Exécuter le script SQL complet

1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL
3. **Copiez et exécutez TOUT le contenu** de `supabase-functions.sql`

Ce script va :
- ✅ Insérer les compétences par défaut
- ✅ Insérer les types d'événements par défaut
- ✅ Supprimer l'ancienne fonction `create_user_with_skills`
- ✅ Créer la nouvelle fonction `create_user_with_skills` (avec variables corrigées)
- ✅ Supprimer les anciennes politiques RLS
- ✅ Créer les nouvelles politiques RLS nécessaires

### Étape 2 : Vérifier l'exécution

Après avoir exécuté le script, vérifiez dans Supabase :

1. **Table `skills`** : Doit contenir 10 compétences
2. **Table `event_types`** : Doit contenir 8 types d'événements
3. **Fonctions** : La fonction `create_user_with_skills` doit exister

### Étape 3 : Tester l'inscription

1. Redémarrez votre application React
2. Allez sur `http://localhost:5175/register`
3. Remplissez le formulaire avec :
   - Prénom : Test
   - Nom : User
   - Email : `test@example.com`
   - Mot de passe : `test123`
   - Sélectionnez quelques compétences
4. Cliquez sur "S'inscrire en tant que technicien"

## 🔍 Vérification

### Dans Supabase Auth > Users
- L'utilisateur doit apparaître dans la liste

### Dans la table `users`
- Le profil utilisateur doit être créé

### Dans la table `user_skills`
- Les compétences sélectionnées doivent être associées

## 🐛 Si le problème persiste

### Option 1 : Vérifier les compétences
```sql
SELECT * FROM skills ORDER BY name;
```

### Option 2 : Vérifier la fonction
```sql
SELECT * FROM pg_proc WHERE proname = 'create_user_with_skills';
```

### Option 3 : Tester la fonction manuellement
```sql
SELECT create_user_with_skills(
  '00000000-0000-0000-0000-000000000001'::UUID,
  'test@example.com',
  'Test',
  'User',
  'technician',
  '+33123456789',
  ARRAY['550e8400-e29b-41d4-a716-446655440001'::UUID]
);
```

## 📞 Support

Si le problème persiste après avoir suivi ces étapes, vérifiez :
1. Que le script SQL a été exécuté sans erreur
2. Que les tables `skills` et `event_types` contiennent des données
3. Que la fonction `create_user_with_skills` existe
4. Que les politiques RLS sont activées 