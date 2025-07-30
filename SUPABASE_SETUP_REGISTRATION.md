# Configuration de l'Inscription - Supabase

## 🔧 Étape 1 : Exécuter la fonction SQL

1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL
3. Copiez et exécutez le contenu de `supabase-functions.sql`

## 🔧 Étape 2 : Vérifier les politiques RLS

Assurez-vous que les politiques suivantes existent :

```sql
-- Politique pour permettre l'insertion d'utilisateurs (pour l'inscription)
CREATE POLICY "Allow user registration" ON users
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre l'insertion de compétences utilisateur
CREATE POLICY "Allow user skills insertion" ON user_skills
  FOR INSERT
  WITH CHECK (true);
```

## 🔧 Étape 3 : Tester l'inscription

1. Redémarrez votre application React
2. Allez sur `/register`
3. Remplissez le formulaire avec :
   - Prénom : Test
   - Nom : User
   - Email : `test@example.com`
   - Mot de passe : `test123`
   - Sélectionnez quelques compétences
4. Cliquez sur "S'inscrire en tant que technicien"

## ✅ Vérification

Après l'inscription réussie :
1. Vérifiez dans Supabase Auth > Users que l'utilisateur est créé
2. Vérifiez dans la table `users` que le profil est créé
3. Vérifiez dans la table `user_skills` que les compétences sont associées

## 🐛 Résolution des problèmes

### Erreur 401
- Vérifiez que la fonction `create_user_with_skills` existe
- Vérifiez que les politiques RLS sont activées

### Erreur de fonction
- Vérifiez que la fonction SQL a été exécutée correctement
- Vérifiez les logs dans la console Supabase

### Erreur useAppStore
- Redémarrez le serveur de développement : `npm run dev`
- Videz le cache du navigateur 