# Correction de la synchronisation des données de tarification

## Problème identifié

La rémunération de mission dans le dashboard des techniciens ne correspondait pas au prix du forfait ou à l'heure stipulée dans les événements.

### Causes du problème

1. **Mise à jour incomplète des événements** : La fonction `update` de `eventService` ne mettait pas à jour les données de tarification (`pricing`) lors de la modification d'un événement.

2. **Données manquantes** : Les données de tarification définies dans `MissionPricingForm` n'étaient pas toujours sauvegardées dans la table `mission_pricing`.

3. **Incohérence entre création et modification** : Les événements créés avaient des données de tarification, mais les événements modifiés ne les conservaient pas.

## Solutions appliquées

### ✅ **1. Correction de la fonction `update` dans `eventService`**

**Fichier modifié :** `src/services/supabaseService.ts`

**Ajouts :**
- Mise à jour des données de tarification (`pricing`) lors de la modification d'un événement
- Mise à jour des sélections ciblées de techniciens (`targetedTechnicians`)
- Gestion des erreurs pour éviter l'échec de la mise à jour de l'événement

**Code ajouté :**
```typescript
// Mettre à jour le forfait de rémunération si fourni
if (eventData.pricing) {
  try {
    // Vérifier si un forfait existe déjà pour cet événement
    const existingPricing = await missionPricingService.getByEventId(id);
    if (existingPricing) {
      // Mettre à jour le forfait existant
      await missionPricingService.update(id, {
        basePrice: eventData.pricing.basePrice,
        pricePerHour: eventData.pricing.pricePerHour,
        bonusPercentage: eventData.pricing.bonusPercentage,
      });
    } else {
      // Créer un nouveau forfait
      await missionPricingService.create({
        eventId: id,
        basePrice: eventData.pricing.basePrice,
        pricePerHour: eventData.pricing.pricePerHour,
        bonusPercentage: eventData.pricing.bonusPercentage,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du forfait de rémunération:', error);
    // Ne pas faire échouer la mise à jour de l'événement pour un problème de tarification
  }
}

// Mettre à jour les sélections ciblées de techniciens si fournies
if (eventData.targetedTechnicians !== undefined) {
  // Supprimer les anciennes sélections
  await targetedTechniciansService.deleteByEventId(id);
  
  // Ajouter les nouvelles sélections
  if (eventData.targetedTechnicians.length > 0) {
    const selectionInserts = eventData.targetedTechnicians.map(technicianId => ({
      eventId: id,
      technicianId,
      selectedByAdmin: true,
      selectionReason: '',
    }));
    await targetedTechniciansService.createMultiple(selectionInserts);
  }
}
```

### ✅ **2. Script de diagnostic**

**Fichier créé :** `supabase/debug-mission-pricing-sync.sql`

**Fonctionnalités :**
- Vérification de la structure des tables
- Diagnostic des données de tarification
- Identification des événements sans tarification
- Test de la fonction de calcul de prix
- Statistiques générales

### ✅ **3. Vérification du calcul dans le dashboard**

**Fichier vérifié :** `src/pages/TechnicianDashboard.tsx`

**Confirmation :**
- Le calcul de rémunération utilise correctement les données de `mission_pricing`
- L'affichage avec `MissionPricingDisplay` est fonctionnel
- Les bonus pour experts sont correctement appliqués

## Fonctionnement attendu

### Pour les administrateurs

1. **Création d'événement** : Les données de tarification sont sauvegardées dans `mission_pricing`
2. **Modification d'événement** : Les données de tarification sont mises à jour
3. **Affichage** : Les techniciens voient la rémunération correcte

### Pour les techniciens

1. **Dashboard** : Affichage de la rémunération pour chaque événement
2. **Calcul** : Prix basé sur `basePrice + (pricePerHour × durée) + bonus`
3. **Bonus experts** : Application automatique du bonus pour les techniciens experts

## Formule de calcul

```
Rémunération = Prix de base + (Tarif horaire × Durée en heures) + Bonus expert
```

Où :
- **Prix de base** : Montant fixe défini dans l'événement
- **Tarif horaire** : Montant par heure défini dans l'événement
- **Durée** : Différence entre `endDate` et `startDate`
- **Bonus expert** : Pourcentage supplémentaire pour les techniciens de niveau "expert"

## Tests recommandés

### 1. **Créer un nouvel événement**
- Définir des valeurs de tarification
- Vérifier que les données sont sauvegardées dans `mission_pricing`

### 2. **Modifier un événement existant**
- Changer les valeurs de tarification
- Vérifier que les données sont mises à jour

### 3. **Vérifier le dashboard technicien**
- Se connecter en tant que technicien
- Vérifier que la rémunération s'affiche correctement
- Tester avec un technicien expert pour voir le bonus

### 4. **Exécuter le script de diagnostic**
```sql
-- Dans l'éditeur SQL de Supabase
-- Exécuter le contenu de debug-mission-pricing-sync.sql
```

## Résolution des problèmes courants

### Problème : "Aucune tarification affichée"
**Solution :**
1. Vérifier que l'événement a des données dans `mission_pricing`
2. Exécuter le script de diagnostic
3. Vérifier les politiques RLS

### Problème : "Calcul incorrect"
**Solution :**
1. Vérifier les valeurs dans `mission_pricing`
2. Tester la fonction `calculate_mission_price`
3. Vérifier la durée de l'événement

### Problème : "Bonus non appliqué"
**Solution :**
1. Vérifier le niveau du technicien dans `user_skills`
2. Vérifier que `bonus_percentage > 0`
3. Vérifier que le technicien a le niveau "expert"

## Monitoring

### Indicateurs à surveiller

1. **Pourcentage d'événements avec tarification**
2. **Cohérence des calculs** (local vs SQL)
3. **Erreurs de mise à jour** dans les logs
4. **Performance des requêtes** de tarification

### Logs à surveiller

```javascript
// Dans la console du navigateur
console.error('Erreur lors de la mise à jour du forfait de rémunération:', error);
```

## Améliorations futures

1. **Historique des tarifications** : Suivre les changements de prix
2. **Négociation** : Interface pour ajuster les tarifs
3. **Facturation** : Génération automatique de factures
4. **Rapports** : Export des données de rémunération
5. **Notifications** : Alertes pour les changements de tarification 