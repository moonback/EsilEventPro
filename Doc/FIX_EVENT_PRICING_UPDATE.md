# Correction de la mise à jour des tarifs d'événement

## Problème identifié

Lors de la modification d'un événement, les données de tarification (`pricing`) n'étaient pas mises à jour car :

1. **Données manquantes dans `EventFormModal`** : Les données de tarification n'étaient pas passées dans `initialData`
2. **Données non récupérées dans `eventService.getById`** : La fonction ne récupérait pas les données de tarification depuis la base de données
3. **Données non récupérées dans `eventService.getAll`** : La fonction ne récupérait pas les données de tarification pour tous les événements

## Solutions appliquées

### ✅ **1. Correction de `EventFormModal.tsx`**

**Problème** : Les données de tarification n'étaient pas passées dans `initialData`

**Solution** : Ajout des données de tarification et des techniciens ciblés

```typescript
// Avant
initialData={selectedEvent ? {
  title: selectedEvent.title,
  description: selectedEvent.description,
  startDate: selectedEvent.startDate,
  endDate: selectedEvent.endDate,
  location: selectedEvent.location,
  typeId: selectedEvent.type.id,
  requiredTechnicians: selectedEvent.requiredTechnicians,
} : undefined}

// Après
initialData={selectedEvent ? {
  title: selectedEvent.title,
  description: selectedEvent.description,
  startDate: selectedEvent.startDate,
  endDate: selectedEvent.endDate,
  location: selectedEvent.location,
  typeId: selectedEvent.type.id,
  requiredTechnicians: selectedEvent.requiredTechnicians,
  pricing: selectedEvent.pricing,
  targetedTechnicians: selectedEvent.targetedTechnicians,
} : undefined}
```

### ✅ **2. Correction de `eventService.getById()`**

**Problème** : La fonction ne récupérait pas les données de tarification

**Solution** : Ajout de la récupération des données de tarification et des techniciens ciblés

```typescript
// Ajout de la récupération des données de tarification
let pricing: MissionPricing | undefined = undefined;
try {
  pricing = await missionPricingService.getByEventId(id) || undefined;
} catch (error) {
  console.error('Erreur lors de la récupération de la tarification:', error);
}

// Ajout de la récupération des techniciens ciblés
let targetedTechnicians: TargetedTechnician[] = [];
try {
  targetedTechnicians = await targetedTechniciansService.getByEventId(id);
} catch (error) {
  console.error('Erreur lors de la récupération des techniciens ciblés:', error);
}

// Ajout dans l'objet retourné
return {
  // ... autres propriétés
  pricing,
  targetedTechnicians,
};
```

### ✅ **3. Correction de `eventService.getAll()`**

**Problème** : La fonction ne récupérait pas les données de tarification pour tous les événements

**Solution** : Optimisation avec récupération en une seule requête

```typescript
// Récupération de toutes les données de tarification
const { data: pricingData, error: pricingError } = await supabase
  .from('mission_pricing')
  .select('*');

// Récupération de toutes les sélections de techniciens
const { data: targetedData, error: targetedError } = await supabase
  .from('targeted_technicians')
  .select('*');

// Organisation des données par événement
const pricingByEvent = new Map();
pricingData?.forEach((pricing: any) => {
  pricingByEvent.set(pricing.event_id, {
    // ... transformation des données
  });
});

// Ajout dans chaque événement
return data?.map(event => ({
  // ... autres propriétés
  pricing: pricingByEvent.get(event.id),
  targetedTechnicians: targetedByEvent.get(event.id) || [],
})) || [];
```

## Tests et vérification

### 🔧 **Script de test créé**

Le fichier `supabase/test-event-pricing-update.sql` contient un script complet pour :

1. **Créer un événement de test** avec tarification
2. **Vérifier les données initiales**
3. **Simuler une mise à jour** des tarifs
4. **Vérifier les données après mise à jour**
5. **Tester la fonction de calcul** de prix
6. **Afficher les statistiques** des événements avec/sans tarification

### 📊 **Vérifications à effectuer**

1. **Créer un événement** avec des données de tarification
2. **Modifier l'événement** et changer les tarifs
3. **Vérifier** que les nouveaux tarifs sont sauvegardés
4. **Vérifier** que les tarifs s'affichent correctement dans le dashboard des techniciens

## Résultat attendu

✅ **Les tarifs sont maintenant correctement mis à jour** lors de la modification d'un événement

✅ **Les données de tarification sont récupérées** et affichées dans tous les composants

✅ **La synchronisation est maintenue** entre les événements et le dashboard des techniciens

## Commandes de test

```sql
-- Exécuter le script de test
-- Dans l'éditeur SQL de Supabase
-- Fichier: supabase/test-event-pricing-update.sql
```

## Notes importantes

- Les erreurs de récupération des données de tarification sont **gérées gracieusement** et ne font pas échouer la récupération de l'événement
- Les données de tarification sont **optionnelles** et peuvent être `undefined` si non définies
- La performance est **optimisée** avec des requêtes en lot pour `getAll()` 