# Guide - Profil Technicien

## Vue d'ensemble

La page de profil technicien permet aux techniciens de gérer leurs informations personnelles, compétences et de consulter leurs statistiques. Cette fonctionnalité remplace le placeholder "Profil technicien (à venir)" qui était présent dans l'application.

## Fonctionnalités

### 🔧 Informations personnelles
- **Modification des données** : Prénom, nom, email, téléphone
- **Changement de mot de passe** : Interface sécurisée avec validation
- **Mode édition** : Basculement entre consultation et modification
- **Validation** : Vérification des mots de passe et des champs requis

### 🎯 Gestion des compétences
- **Affichage des compétences** : Liste des compétences actuelles avec niveaux
- **Sélection multiple** : Interface de sélection avec checkboxes
- **Catégorisation** : Compétences organisées par catégorie (son, lumière, vidéo, scène)
- **Niveaux** : Indicateurs visuels pour débutant, intermédiaire, expert

### 📊 Statistiques
- **Contrats totaux** : Nombre total de contrats assignés
- **Contrats acceptés** : Contrats acceptés par le technicien
- **Heures travaillées** : Temps total de travail (simulé)

### 📋 Informations du compte
- **Email** : Adresse email de connexion
- **Date d'inscription** : Date de création du compte
- **Rôle** : Rôle utilisateur (technicien)
- **Téléphone** : Numéro de contact (si renseigné)

## Interface utilisateur

### Header
- **Titre** : "Mon Profil" avec icône utilisateur
- **Bouton d'édition** : Bascule entre mode consultation et édition
- **Design** : Gradient bleu avec ombres et bordures

### Layout responsive
- **Desktop** : 3 colonnes (2 pour le contenu principal, 1 pour les stats)
- **Mobile** : Layout en colonne unique
- **Tablet** : Adaptation automatique

### Sections principales

#### 1. Informations personnelles
```
┌─────────────────────────────────────┐
│ 👤 Informations personnelles        │
├─────────────────────────────────────┤
│ Prénom    │ Nom                     │
│ Email     │ Téléphone               │
│ [Changement de mot de passe]       │
│ [Boutons Sauvegarder/Annuler]      │
└─────────────────────────────────────┘
```

#### 2. Compétences
```
┌─────────────────────────────────────┐
│ 🏆 Mes Compétences                 │
├─────────────────────────────────────┤
│ [Liste des compétences avec        │
│  icônes, noms, catégories,        │
│  niveaux et sélection]             │
└─────────────────────────────────────┘
```

#### 3. Statistiques
```
┌─────────────────────────────────────┐
│ 📈 Statistiques                    │
├─────────────────────────────────────┤
│ 💼 Contrats totaux: 12            │
│ ✅ Contrats acceptés: 8            │
│ ⏰ Heures travaillées: 156h        │
└─────────────────────────────────────┘
```

#### 4. Informations du compte
```
┌─────────────────────────────────────┐
│ 👤 Informations du compte          │
├─────────────────────────────────────┤
│ 📧 Email: user@example.com         │
│ 📅 Membre depuis: 15 jan 2024     │
│ 🏆 Rôle: technicien                │
│ 📞 Téléphone: +33 1 23 45 67 89   │
└─────────────────────────────────────┘
```

## Fonctionnalités techniques

### Services utilisés
- **`userSkillsService`** : Gestion des compétences utilisateur
- **`useAuthStore`** : État d'authentification et utilisateur
- **`useAppStore`** : Données globales de l'application

### Validation
- **Mots de passe** : Correspondance et longueur minimale
- **Champs requis** : Validation côté client
- **Compétences** : Gestion des doublons et contraintes

### Sécurité
- **Authentification** : Vérification de l'utilisateur connecté
- **Autorisations** : Mise à jour uniquement de son propre profil
- **Validation serveur** : Contrôles côté base de données

## Navigation

### Accès
- **URL** : `/technician/profile`
- **Menu** : Lien "Profil" dans le header pour les techniciens
- **Redirection** : Automatique vers `/technician` si non connecté

### Intégration
- **Routing** : Ajouté dans `App.tsx`
- **Header** : Lien existant dans la navigation
- **Layout** : Intégré dans le layout principal

## Base de données

### Tables utilisées
- **`users`** : Informations utilisateur
- **`user_skills`** : Relation many-to-many utilisateurs/compétences
- **`skills`** : Catalogue des compétences

### Opérations
- **Lecture** : Récupération des données utilisateur et compétences
- **Mise à jour** : Modification des informations personnelles
- **Gestion des compétences** : Suppression/ajout de relations user_skills

## Gestion d'erreurs

### Erreurs courantes
- **401 Unauthorized** : Utilisateur non connecté
- **403 Forbidden** : Tentative de modification d'un autre utilisateur
- **409 Conflict** : Doublons dans les compétences
- **500 Server Error** : Erreur serveur

### Messages utilisateur
- **Succès** : "Profil mis à jour avec succès"
- **Erreur validation** : "Les mots de passe ne correspondent pas"
- **Erreur serveur** : "Erreur lors de la mise à jour du profil"

## Tests

### Scénarios de test
1. **Consultation** : Affichage correct des informations
2. **Édition** : Basculement en mode édition
3. **Validation** : Messages d'erreur appropriés
4. **Sauvegarde** : Mise à jour réussie en base
5. **Annulation** : Retour à l'état initial
6. **Compétences** : Ajout/suppression de compétences
7. **Mot de passe** : Changement sécurisé

### Données de test
- **Utilisateur** : Technicien avec compétences existantes
- **Compétences** : Catalogue complet de compétences
- **Statistiques** : Données simulées pour l'affichage

## Améliorations futures

### Fonctionnalités suggérées
- **Photo de profil** : Upload et gestion d'avatar
- **Historique** : Log des modifications
- **Notifications** : Alertes de mise à jour
- **Export** : Téléchargement des données
- **Statistiques réelles** : Calcul basé sur les vraies données

### Optimisations
- **Cache** : Mise en cache des compétences
- **Lazy loading** : Chargement à la demande
- **Offline** : Fonctionnement hors ligne
- **Performance** : Optimisation des requêtes

## Support

### Documentation
- **Code** : Commentaires dans le code source
- **Types** : Interfaces TypeScript complètes
- **Services** : Documentation des services Supabase

### Maintenance
- **Mise à jour** : Compatibilité avec les nouvelles versions
- **Sécurité** : Audit régulier des permissions
- **Performance** : Monitoring des requêtes

---

*Ce guide couvre l'implémentation complète de la fonctionnalité de profil technicien, remplaçant le placeholder initial par une interface complète et fonctionnelle.* 