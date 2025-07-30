# Guide de Test - Formulaire d'Inscription Technicien

## 🎯 Test du Formulaire d'Inscription

### 1. Accès au Formulaire
- Ouvrez l'application sur `http://localhost:5174`
- Cliquez sur "S'inscrire" depuis la page de connexion
- Ou naviguez directement vers `/register`

### 2. Test des Champs Obligatoires
- **Prénom** : Testez avec moins de 2 caractères (doit afficher une erreur)
- **Nom** : Testez avec moins de 2 caractères (doit afficher une erreur)
- **Email** : Testez avec un email invalide (doit afficher une erreur)
- **Mot de passe** : Testez avec moins de 6 caractères (doit afficher une erreur)
- **Confirmation** : Testez avec des mots de passe différents (doit afficher une erreur)

### 3. Test de la Sélection des Compétences
- Cliquez sur différentes compétences dans chaque catégorie
- Vérifiez que les compétences sélectionnées apparaissent en haut
- Testez la suppression d'une compétence avec le bouton X
- Vérifiez que les compétences déjà sélectionnées sont désactivées

### 4. Test de Soumission
- Remplissez tous les champs correctement
- Sélectionnez au moins 2-3 compétences
- Cliquez sur "S'inscrire en tant que technicien"
- Vérifiez que vous êtes redirigé vers le dashboard technicien

### 5. Test des Cas d'Erreur
- Essayez de vous inscrire avec un email déjà utilisé
- Testez avec un mot de passe trop court
- Vérifiez les messages d'erreur appropriés

### 6. Test de Navigation
- Depuis `/register`, cliquez sur "Se connecter"
- Vérifiez que vous arrivez sur `/login`
- Depuis `/login`, cliquez sur "S'inscrire"
- Vérifiez que vous arrivez sur `/register`

## 🔧 Données de Test

### Comptes de Démonstration Existants
- **Admin** : `admin@Esil-Events.com` / `admin123`
- **Technicien** : `tech@Esil-Events.com` / `tech123`

### Exemple de Nouveau Technicien
- **Prénom** : Jean
- **Nom** : Dupont
- **Email** : `jean.dupont@example.com`
- **Téléphone** : `+33 6 12 34 56 78`
- **Mot de passe** : `technicien123`
- **Compétences** : Mixage Audio (expert), Installation Scène (expert), Décors (intermédiaire)

## ✅ Points de Validation

- [ ] Formulaire accessible depuis la page de connexion
- [ ] Validation des champs en temps réel
- [ ] Sélection des compétences fonctionnelle
- [ ] Inscription réussie avec redirection
- [ ] Gestion des erreurs appropriée
- [ ] Navigation entre les formulaires
- [ ] Attributs autocomplete présents
- [ ] Design responsive

## 🐛 Problèmes Connus

1. **Avertissements React Router** : Avertissements normaux pour les futures versions
2. **Erreur 401** : Normale quand l'utilisateur n'est pas connecté (gérée silencieusement)

## 🚀 Prochaines Étapes

- Tester l'inscription avec différents types de compétences
- Vérifier que les données sont bien sauvegardées dans Supabase
- Tester la connexion avec un compte nouvellement créé 