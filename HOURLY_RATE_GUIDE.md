# Guide d'implémentation du taux horaire

## Vue d'ensemble

Ce guide explique comment le taux horaire a été implémenté pour les techniciens dans l'application Esil-Events.

## Fonctionnalités implémentées

### 1. Base de données

- **Champ `hourly_rate`** : Ajouté à la table `users` avec le type `DECIMAL(8,2)`
- **Contrainte de validation** : Le taux horaire doit être positif (>= 0)
- **Valeur par défaut** : 0.00€/h
- **Politiques RLS** : Mises à jour pour permettre la lecture et modification du taux horaire

### 2. Types TypeScript

- **Interface `User`** : Ajout du champ `hourlyRate?: number`
- **Validation** : Le taux horaire est optionnel et en euros par heure

### 3. Services Supabase

- **`userService.getAll()`** : Inclut le taux horaire dans les données retournées
- **`userService.getById()`** : Récupère le taux horaire de l'utilisateur
- **`userService.create()`** : Permet de définir le taux horaire lors de la création
- **`userService.update()`** : Permet de modifier le taux horaire

### 4. Interface utilisateur

#### Page de profil technicien (`TechnicianProfile.tsx`)

**Champ de saisie :**
- Type : `number` avec step="0.01" et min="0"
- Placeholder : "0.00"
- Validation : Taux horaire positif
- Mode édition : Modifiable uniquement en mode édition

**Section rémunération :**
- Affichage du taux horaire actuel
- Calcul des gains estimés :
  - Gains ce mois (heures × taux horaire)
  - Gains cette année (heures × taux horaire)
  - Gains totaux (heures × taux horaire)
- Message d'encouragement si le taux n'est pas défini

## Utilisation

### Pour les techniciens

1. **Accéder au profil** : Navigation vers `/technician/profile`
2. **Modifier le taux** : Cliquer sur "Modifier" puis saisir le nouveau taux
3. **Sauvegarder** : Cliquer sur "Sauvegarder" pour enregistrer
4. **Voir les gains** : Les gains estimés s'affichent automatiquement

### Pour les administrateurs

1. **Gestion des utilisateurs** : Peuvent voir et modifier les taux horaires
2. **Tableau de bord** : Accès aux informations de rémunération

## Calculs automatiques

### Gains estimés

Les gains sont calculés automatiquement en fonction :
- Du taux horaire défini par le technicien
- Des heures travaillées (événements acceptés)
- Des périodes : mois en cours, année en cours, total

### Formule

```
Gains = Heures travaillées × Taux horaire
```

## Sécurité

### Contraintes de base de données

```sql
-- Taux horaire positif
ALTER TABLE users ADD CONSTRAINT check_hourly_rate_positive CHECK (hourly_rate >= 0);

-- Politiques RLS
-- Les utilisateurs peuvent voir/modifier leur propre taux
-- Les admins peuvent voir/modifier tous les taux
```

### Validation côté client

- Type `number` avec contraintes min="0" et step="0.01"
- Validation dans le service avant envoi à Supabase

## Extensions possibles

### Fonctionnalités futures

1. **Historique des taux** : Suivi des changements de taux horaire
2. **Taux par compétence** : Différents taux selon les compétences
3. **Négociation** : Interface pour négocier les taux
4. **Facturation** : Génération automatique de factures
5. **Rapports** : Export des données de rémunération

### Intégrations

1. **Système de paiement** : Intégration avec Stripe/PayPal
2. **Comptabilité** : Export vers logiciels comptables
3. **Notifications** : Alertes pour paiements reçus

## Scripts SQL

### Ajout du champ

```sql
-- Script pour ajouter le taux horaire aux techniciens
ALTER TABLE users ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(8,2) DEFAULT 0.00;
ALTER TABLE users ADD CONSTRAINT check_hourly_rate_positive CHECK (hourly_rate >= 0);
```

### Mise à jour des politiques RLS

```sql
-- Politiques pour la lecture
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour la modification
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Tests

### Scénarios de test

1. **Définition du taux** : Un technicien définit son taux horaire
2. **Modification du taux** : Mise à jour du taux existant
3. **Calcul des gains** : Vérification des calculs automatiques
4. **Validation** : Test des contraintes (taux négatif, etc.)
5. **Permissions** : Test des politiques RLS

### Données de test

```sql
-- Insérer un technicien avec un taux horaire
INSERT INTO users (email, first_name, last_name, role, hourly_rate)
VALUES ('tech@example.com', 'Jean', 'Dupont', 'technician', 25.50);

-- Vérifier les données
SELECT id, first_name, last_name, hourly_rate FROM users WHERE role = 'technician';
```

## Support

Pour toute question ou problème lié au taux horaire, consultez :
- La documentation Supabase
- Les logs d'erreur dans la console
- Les politiques RLS dans l'éditeur SQL de Supabase 