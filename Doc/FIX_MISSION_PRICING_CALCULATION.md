# Correction du calcul de rémunération de mission

## 🔍 **Problème identifié**

La rémunération de la mission ne correspond pas au forfait configuré pour l'événement. Cela peut être dû à :

1. **Incohérence entre la fonction SQL et le calcul local**
2. **Données de pricing manquantes ou incorrectes**
3. **Problème de liaison entre events et mission_pricing**

## 📋 **Solutions appliquées**

### **1. Correction de la fonction SQL**
Le script `supabase/fix-mission-pricing-calculation.sql` corrige :

- **Problème de jointure** : La fonction utilisait `e.pricing_id = mp.id` au lieu de `mp.event_id = p_event_id`
- **Gestion des doublons** : Ajout de `ORDER BY mp.updated_at DESC LIMIT 1`
- **Gestion des erreurs** : Retour de 0 si aucun pricing trouvé

### **2. Amélioration du composant MissionPricingDisplay**
Le composant utilise maintenant :

- **Calcul SQL** : Appel de `missionPricingService.calculateMissionPrice()`
- **Fallback local** : Calcul local si la fonction SQL échoue
- **Indicateur de source** : Affiche si le prix vient du SQL ou du calcul local
- **Gestion d'erreurs** : Affichage des erreurs de calcul

## 🔧 **Étapes de correction**

### **Étape 1 : Exécuter le script de correction**
```sql
-- Exécuter dans l'éditeur SQL de Supabase
-- Copier le contenu de supabase/fix-mission-pricing-calculation.sql
```

### **Étape 2 : Vérifier les données existantes**
```sql
-- Vérifier les pricing existants
SELECT 
  mp.id,
  mp.event_id,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  e.title as event_title,
  e.start_date,
  e.end_date
FROM mission_pricing mp
JOIN events e ON e.id = mp.event_id
ORDER BY mp.updated_at DESC
LIMIT 10;
```

### **Étape 3 : Tester la fonction de calcul**
```sql
-- Tester avec un événement existant (remplacer USER_ID_HERE)
SELECT 
  e.id as event_id,
  e.title as event_title,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  calculate_mission_price(e.id, 'USER_ID_HERE') as calculated_price
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
ORDER BY e.created_at DESC
LIMIT 5;
```

### **Étape 4 : Créer des données de test si nécessaire**
```sql
-- Créer un pricing pour un événement existant
INSERT INTO mission_pricing (event_id, base_price, price_per_hour, bonus_percentage)
VALUES ('EVENT_ID_HERE', 75.00, 30.00, 15.00);
```

## 📊 **Vérification**

### **Dans l'interface technicien :**
1. **Prix affiché** : Doit correspondre au forfait configuré
2. **Source du calcul** : Affiche "Prix calculé par le système" ou "Prix estimé localement"
3. **Détails du calcul** : Montre la décomposition (base + horaire + bonus)

### **Dans la console du navigateur :**
- Vérifier les logs de calcul
- S'assurer qu'il n'y a pas d'erreurs 406 ou PGRST116

## 🔍 **Diagnostic des problèmes courants**

| Symptôme | Cause | Solution |
|----------|-------|----------|
| Prix = 0€ | Pas de pricing pour l'événement | Créer un pricing avec INSERT |
| Prix incorrect | Données pricing incorrectes | Vérifier et corriger les valeurs |
| Erreur de calcul | Problème de fonction SQL | Exécuter le script de correction |
| Prix différent | Incohérence entre SQL et local | Vérifier la fonction SQL |

## 🎯 **Résultat attendu**

Après correction :
- ✅ **Prix cohérent** : La rémunération correspond au forfait configuré
- ✅ **Calcul précis** : Utilise la fonction SQL pour un calcul exact
- ✅ **Affichage clair** : Indique la source du calcul
- ✅ **Gestion d'erreurs** : Affiche les erreurs de calcul

## 🆘 **Si le problème persiste**

1. **Vérifier les données** : S'assurer que les pricing existent pour tous les événements
2. **Tester la fonction** : Exécuter des tests SQL pour vérifier le calcul
3. **Vérifier les logs** : Consulter la console pour les erreurs
4. **Comparer les valeurs** : Vérifier que les prix affichés correspondent aux données 