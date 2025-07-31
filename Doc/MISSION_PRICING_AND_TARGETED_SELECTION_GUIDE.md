# Guide des Forfaits de Rémunération et Sélection Ciblée des Techniciens

## Vue d'ensemble

Ce guide explique les nouvelles fonctionnalités ajoutées au système ESIL-Events :

1. **Forfaits de rémunération par mission** - Permet aux administrateurs de définir des tarifs visibles par les techniciens
2. **Sélection ciblée des techniciens** - Permet de sélectionner des techniciens spécifiques au lieu d'envoyer à tout le monde

## 1. Forfaits de Rémunération

### Fonctionnalités

- **Prix de base** : Montant fixe pour la mission
- **Tarif horaire** : Montant par heure de travail
- **Bonus experts** : Pourcentage supplémentaire pour les techniciens de niveau expert
- **Calcul automatique** : Le prix total est calculé automatiquement selon la durée

### Configuration

#### Étape 1 : Créer un événement
1. Allez dans le tableau de bord administrateur
2. Cliquez sur "Nouvel événement"
3. Remplissez les informations de base (étape 1)

#### Étape 2 : Configurer la tarification
1. Dans l'étape 2, configurez :
   - **Prix de base** : Montant fixe (ex: 50€)
   - **Prix par heure** : Tarif horaire (ex: 25€/h)
   - **Bonus experts** : Pourcentage pour les experts (ex: 10%)

#### Étape 3 : Sélectionner les techniciens
1. Dans l'étape 3, sélectionnez les techniciens ciblés
2. Ajoutez des raisons de sélection si nécessaire

### Calcul du Prix

```
Prix total = Prix de base + (Prix par heure × Durée en heures)
Prix final = Prix total + (Prix total × Bonus experts %)
```

**Exemple :**
- Prix de base : 50€
- Prix par heure : 25€
- Durée : 6 heures
- Bonus experts : 10%

**Calcul :**
- Prix total = 50€ + (25€ × 6h) = 200€
- Prix final (pour expert) = 200€ + (200€ × 10%) = 220€

## 2. Sélection Ciblée des Techniciens

### Fonctionnalités

- **Filtrage par compétences** : Voir uniquement les techniciens ayant les compétences requises
- **Filtrage par disponibilité** : Voir le statut de disponibilité
- **Recherche** : Rechercher par nom ou email
- **Sélection multiple** : Sélectionner plusieurs techniciens
- **Raisons de sélection** : Ajouter des commentaires pour chaque sélection

### Processus de Sélection

#### Étape 1 : Filtrer les techniciens
1. Utilisez les filtres pour affiner la liste :
   - **Compétences** : Sélectionnez une compétence spécifique
   - **Disponibilité** : Disponible, Occupé, ou Inconnu
   - **Recherche** : Tapez un nom ou email

#### Étape 2 : Évaluer les candidats
Pour chaque technicien, vous verrez :
- **Informations personnelles** : Nom, email
- **Compétences** : Liste des compétences avec niveaux
- **Disponibilité** : Statut actuel
- **Prix estimé** : Rémunération calculée

#### Étape 3 : Sélectionner
1. Cochez les techniciens souhaités
2. Ajoutez une raison de sélection (optionnel)
3. Validez la sélection

### Avantages

- **Contrôle précis** : Sélectionnez uniquement les techniciens appropriés
- **Transparence** : Les techniciens voient le prix avant d'accepter
- **Efficacité** : Évite les refus inutiles
- **Traçabilité** : Raisons de sélection documentées

## 3. Interface Technicien

### Affichage des Missions

Les techniciens voient :
- **Détails de la mission** : Titre, description, lieu, dates
- **Rémunération** : Prix total avec détails du calcul
- **Compétences requises** : Liste des compétences nécessaires
- **Durée** : Heures de travail estimées

### Calcul de Rémunération

Le système calcule automatiquement :
1. **Prix de base** + **Tarif horaire** × **Durée**
2. **Bonus experts** si applicable
3. **Prix final** affiché clairement

### Acceptation/Refus

Les techniciens peuvent :
- **Accepter** : Confirmer leur participation
- **Refuser** : Décliner avec une raison optionnelle
- **Voir les détails** : Consulter tous les calculs

## 4. Base de Données

### Nouvelles Tables

#### `mission_pricing`
```sql
- id (UUID, Primary Key)
- event_id (UUID, Foreign Key)
- base_price (DECIMAL)
- price_per_hour (DECIMAL)
- bonus_percentage (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `targeted_technicians`
```sql
- id (UUID, Primary Key)
- event_id (UUID, Foreign Key)
- technician_id (UUID, Foreign Key)
- selected_by_admin (BOOLEAN)
- selection_reason (TEXT)
- created_at (TIMESTAMP)
```

### Fonctions SQL

#### `calculate_mission_price(event_id, technician_id)`
Calcule automatiquement le prix pour un technicien donné en tenant compte :
- Du forfait de l'événement
- De la durée de l'événement
- Du niveau du technicien (pour le bonus)

## 5. Configuration

### Installation

1. **Exécuter le script SQL** :
   ```bash
   # Dans l'éditeur SQL de Supabase
   # Exécuter le contenu de supabase/add-mission-pricing.sql
   ```

2. **Vérifier les politiques RLS** :
   - Les techniciens peuvent voir les forfaits de leurs missions
   - Les admins peuvent gérer tous les forfaits
   - Les sélections ciblées sont privées par technicien

### Paramètres par Défaut

- **Prix de base** : 50€
- **Prix par heure** : 25€
- **Bonus experts** : 10%
- **Création automatique** : Un forfait est créé automatiquement pour chaque nouvel événement

## 6. Utilisation Avancée

### Personnalisation des Tarifs

Vous pouvez ajuster les tarifs selon :
- **Type d'événement** : Concerts, mariages, conférences
- **Complexité** : Événements simples vs complexes
- **Urgence** : Missions de dernière minute
- **Compétences spéciales** : Techniciens avec expertise particulière

### Stratégies de Sélection

1. **Par compétences** : Sélectionner selon les besoins spécifiques
2. **Par disponibilité** : Privilégier les techniciens disponibles
3. **Par expérience** : Choisir des experts pour des événements complexes
4. **Par proximité** : Techniciens proches du lieu de l'événement

### Monitoring

Suivez :
- **Taux d'acceptation** : Pourcentage d'acceptations par mission
- **Prix moyens** : Tarifs moyens par type d'événement
- **Satisfaction** : Retours des techniciens sur les rémunérations

## 7. Dépannage

### Problèmes Courants

#### Prix non calculés
- Vérifiez que le forfait existe pour l'événement
- Contrôlez les dates de début et fin
- Vérifiez les permissions RLS

#### Techniciens non visibles
- Vérifiez les compétences requises
- Contrôlez les filtres appliqués
- Vérifiez les permissions utilisateur

#### Erreurs de création
- Vérifiez la connexion Supabase
- Contrôlez les contraintes de base de données
- Vérifiez les logs d'erreur

### Support

Pour toute question ou problème :
1. Consultez les logs d'erreur
2. Vérifiez la configuration Supabase
3. Testez avec des données simples
4. Contactez l'équipe de développement

---

**Note :** Ces fonctionnalités améliorent significativement l'efficacité de la gestion des missions en permettant un contrôle précis des affectations et une transparence totale sur les rémunérations. 