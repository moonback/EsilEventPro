# Guide : Taux horaire défini par l'administrateur uniquement

## Modifications apportées

### 1. **Profil technicien** (`src/pages/TechnicianProfile.tsx`)

#### Changements effectués :
- **Champ taux horaire en lecture seule** : Le champ est maintenant affiché comme un div grisé au lieu d'un input modifiable
- **Message informatif** : Ajout d'un texte explicatif "Le taux horaire est défini par l'administrateur"
- **Suppression de la mise à jour** : Le taux horaire n'est plus inclus dans les données de mise à jour du profil
- **Message de rémunération** : Modification du message quand le taux horaire n'est pas défini

#### Code modifié :
```tsx
// Avant (champ modifiable)
<input
  type="number"
  step="0.01"
  min="0"
  value={formData.hourlyRate}
  onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
  disabled={!isEditing}
  className="..."
/>

// Après (champ en lecture seule)
<div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
  {user?.hourlyRate ? `${user.hourlyRate} €/h` : 'Non défini'}
</div>
<p className="text-xs text-gray-500 mt-1">
  Le taux horaire est défini par l'administrateur
</p>
```

### 2. **Gestion du personnel** (`src/pages/PersonnelManagement.tsx`)

#### Changements effectués :
- **Ajout du champ taux horaire** dans les formulaires d'ajout et de modification
- **Intégration dans les fonctions** `handleAddUser` et `handleEditUser`
- **Mise à jour du formData** pour inclure `hourlyRate`
- **Correction des erreurs de linter** dans `resetForm` et `openEditModal`

#### Nouveaux champs ajoutés :
```tsx
<div>
  <label className="block text-sm font-medium text-gray-700">Taux horaire (€/h)</label>
  <input
    type="number"
    step="0.01"
    min="0"
    value={formData.hourlyRate}
    onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value) || 0})}
    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="0.00"
  />
  <p className="text-xs text-gray-500 mt-1">
    Défini uniquement pour les techniciens
  </p>
</div>
```

## Fonctionnalités

### Pour les techniciens :
- ✅ **Visualisation** : Peuvent voir leur taux horaire actuel
- ✅ **Lecture seule** : Ne peuvent pas modifier leur taux horaire
- ✅ **Calculs automatiques** : Les gains estimés sont calculés automatiquement
- ❌ **Modification** : Ne peuvent pas changer leur taux horaire

### Pour les administrateurs :
- ✅ **Définition** : Peuvent définir le taux horaire lors de la création d'un technicien
- ✅ **Modification** : Peuvent modifier le taux horaire d'un technicien existant
- ✅ **Gestion complète** : Contrôle total sur les taux horaires de tous les techniciens

## Sécurité

### Politiques RLS :
- Les techniciens ne peuvent pas modifier leur `hourly_rate` via les politiques RLS
- Seuls les administrateurs peuvent modifier les champs `hourly_rate` des utilisateurs

### Validation :
- Le taux horaire doit être un nombre positif
- Valeur par défaut : 0.00 €/h
- Pas de limite supérieure (peut être ajustée selon les besoins)

## Utilisation

### Pour créer un technicien avec taux horaire :
1. Aller dans "Gestion du personnel"
2. Cliquer sur "Ajouter un utilisateur"
3. Remplir les informations (email, nom, prénom, téléphone)
4. Sélectionner le rôle "Technicien"
5. **Définir le taux horaire** (ex: 25.50 €/h)
6. Sélectionner les compétences
7. Cliquer sur "Ajouter"

### Pour modifier le taux horaire d'un technicien :
1. Aller dans "Gestion du personnel"
2. Cliquer sur l'icône "Modifier" d'un technicien
3. Modifier le taux horaire dans le champ correspondant
4. Cliquer sur "Modifier"

### Pour les techniciens :
1. Aller dans "Mon Profil"
2. Voir le taux horaire affiché (en lecture seule)
3. Consulter les gains estimés dans la section "Rémunération"

## Avantages

1. **Contrôle centralisé** : L'administrateur a le contrôle total sur les taux horaires
2. **Sécurité** : Les techniciens ne peuvent pas modifier leurs propres taux
3. **Transparence** : Les techniciens peuvent voir leur taux et leurs gains estimés
4. **Flexibilité** : L'administrateur peut ajuster les taux selon les compétences et l'expérience

## Tests recommandés

1. **Test de création** : Créer un technicien avec un taux horaire
2. **Test de modification** : Modifier le taux horaire d'un technicien existant
3. **Test de visualisation** : Vérifier que le technicien voit son taux en lecture seule
4. **Test de calculs** : Vérifier que les gains estimés sont calculés correctement
5. **Test de sécurité** : Vérifier qu'un technicien ne peut pas modifier son taux horaire 