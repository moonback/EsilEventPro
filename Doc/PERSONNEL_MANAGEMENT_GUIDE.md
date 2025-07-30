# Guide de Gestion du Personnel - Esil-Events

## Vue d'ensemble

Le module de gestion du personnel permet aux administrateurs de gérer efficacement les utilisateurs, leurs compétences et leurs affectations aux événements. Ce guide détaille les fonctionnalités disponibles et leur utilisation.

## Fonctionnalités principales

### 1. Gestion du Personnel (`/admin/personnel`)

#### Fonctionnalités disponibles :
- **Visualisation des utilisateurs** : Liste complète avec filtres par rôle
- **Ajout d'utilisateurs** : Création de nouveaux comptes avec attribution de compétences
- **Modification d'utilisateurs** : Mise à jour des informations et compétences
- **Suppression d'utilisateurs** : Suppression sécurisée avec vérifications
- **Recherche et filtrage** : Recherche par nom/email et filtrage par rôle

#### Processus d'ajout d'un utilisateur :
1. Cliquer sur "Ajouter un utilisateur"
2. Remplir les informations obligatoires :
   - Email (unique)
   - Mot de passe
   - Prénom et nom
   - Téléphone (optionnel)
   - Rôle (admin ou technicien)
3. Sélectionner les compétences associées
4. Valider la création

#### Gestion des compétences utilisateur :
- Attribution multiple de compétences
- Visualisation des niveaux (débutant, intermédiaire, expert)
- Modification des compétences existantes

### 2. Gestion des Compétences (`/admin/skills`)

#### Fonctionnalités disponibles :
- **Catalogue des compétences** : Vue d'ensemble avec statistiques par catégorie
- **Ajout de compétences** : Création de nouvelles compétences techniques
- **Modification de compétences** : Mise à jour des informations
- **Suppression sécurisée** : Vérification des dépendances avant suppression
- **Filtrage avancé** : Par catégorie et niveau

#### Catégories de compétences :
- **Audio** : Mixage, installation sono, etc.
- **Éclairage** : Éclairage scène, projecteurs LED, etc.
- **Vidéo** : Régie vidéo, streaming, etc.
- **Scène** : Montage, logistique, etc.

#### Niveaux de compétence :
- **Débutant** : Connaissances de base
- **Intermédiaire** : Expérience pratique
- **Expert** : Maîtrise complète

### 3. Gestion des Affectations (`/admin/assignments`)

#### Fonctionnalités disponibles :
- **Vue d'ensemble des affectations** : Statuts et statistiques
- **Création d'affectations** : Attribution de techniciens aux événements
- **Gestion des statuts** : En attente, acceptée, refusée
- **Suivi des réponses** : Dates et raisons de refus
- **Filtrage et recherche** : Par événement, technicien ou statut

#### Statuts d'affectation :
- **En attente** : Affectation créée, en attente de réponse
- **Acceptée** : Technicien a confirmé sa participation
- **Refusée** : Technicien a décliné (avec raison optionnelle)

#### Processus d'affectation :
1. Sélectionner un événement
2. Choisir un technicien
3. Définir le statut initial
4. Ajouter une raison si refus
5. Valider l'affectation

## Navigation dans l'interface

### Barre de navigation
L'interface administrateur propose une navigation par onglets :
- **Dashboard** : Vue d'ensemble et calendrier
- **Personnel** : Gestion des utilisateurs
- **Compétences** : Catalogue des compétences
- **Affectations** : Gestion des affectations

### Fonctionnalités communes
- **Recherche** : Barre de recherche dans chaque section
- **Filtres** : Options de filtrage spécifiques à chaque module
- **Statistiques** : Tableaux de bord avec métriques clés
- **Actions rapides** : Boutons d'ajout et de modification

## Sécurité et permissions

### Politiques RLS (Row Level Security)
Le système utilise des politiques de sécurité pour contrôler l'accès :

#### Pour les administrateurs :
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs, compétences et affectations
- Visualisation de toutes les données

#### Pour les techniciens :
- Accès en lecture seule aux listes
- Modification de leur propre profil
- Gestion de leurs affectations

### Vérifications de sécurité
- **Suppression d'utilisateurs** : Vérification des affectations existantes
- **Suppression de compétences** : Vérification des utilisations
- **Création d'utilisateurs** : Validation des données et unicité

## Bonnes pratiques

### Gestion du personnel
1. **Créer des profils complets** : Remplir toutes les informations disponibles
2. **Attribuer des compétences pertinentes** : Basées sur l'expérience réelle
3. **Maintenir les données à jour** : Mettre à jour régulièrement les informations
4. **Documenter les changements** : Noter les modifications importantes

### Gestion des compétences
1. **Standardiser les noms** : Utiliser une nomenclature cohérente
2. **Définir des niveaux appropriés** : Basés sur des critères objectifs
3. **Maintenir le catalogue** : Ajouter de nouvelles compétences selon les besoins
4. **Vérifier les dépendances** : Avant toute suppression

### Gestion des affectations
1. **Planifier à l'avance** : Créer les affectations suffisamment tôt
2. **Vérifier les disponibilités** : S'assurer de la compatibilité horaire
3. **Suivre les réponses** : Relancer si nécessaire
4. **Documenter les refus** : Noter les raisons pour améliorer le processus

## Dépannage

### Problèmes courants

#### Impossible de créer un utilisateur
- Vérifier que l'email n'existe pas déjà
- S'assurer que tous les champs obligatoires sont remplis
- Vérifier les permissions administrateur

#### Impossible de supprimer une compétence
- Vérifier qu'aucun utilisateur n'utilise cette compétence
- Vérifier qu'aucun événement ne requiert cette compétence
- Utiliser la fonction de recherche pour identifier les dépendances

#### Affectation non visible
- Vérifier les filtres appliqués
- S'assurer que l'utilisateur a les bonnes permissions
- Vérifier que l'affectation a bien été créée

### Support technique
En cas de problème persistant :
1. Vérifier les logs de la console
2. Contacter l'équipe technique
3. Fournir les détails de l'erreur

## Évolutions futures

### Fonctionnalités prévues
- **Notifications automatiques** : Alertes pour les affectations en attente
- **Calendrier de disponibilité** : Gestion des plannings des techniciens
- **Rapports avancés** : Statistiques détaillées et exports
- **API mobile** : Application mobile pour les techniciens

### Améliorations techniques
- **Performance** : Optimisation des requêtes pour de gros volumes
- **Interface** : Amélioration de l'expérience utilisateur
- **Sécurité** : Renforcement des politiques d'accès
- **Intégration** : Connexion avec d'autres systèmes

---

*Ce guide est destiné aux administrateurs du système Esil-Events. Pour toute question ou suggestion d'amélioration, contactez l'équipe de développement.* 