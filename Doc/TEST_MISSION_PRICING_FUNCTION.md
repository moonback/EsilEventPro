# Test de la fonction de calcul du prix de mission

## 🔧 **Étapes de test**

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
  e.title as event_title
FROM mission_pricing mp
JOIN events e ON e.id = mp.event_id
ORDER BY mp.updated_at DESC
LIMIT 10;
```

### **Étape 3 : Identifier un technicien pour le test**
```sql
-- Trouver un technicien avec des compétences
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  u.email,
  s.name as skill_name,
  s.level as skill_level
FROM users u
JOIN user_skills us ON u.id = us.user_id
JOIN skills s ON us.skill_id = s.id
WHERE u.role = 'technician'
ORDER BY u.created_at DESC, s.level DESC
LIMIT 5;
```

### **Étape 4 : Tester la fonction avec un vrai technicien**
```sql
-- Remplacer TECH_ID par un vrai ID de technicien trouvé à l'étape 3
SELECT 
  e.id as event_id,
  e.title as event_title,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  calculate_mission_price(e.id, 'TECH_ID') as calculated_price
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
WHERE mp.id IS NOT NULL
ORDER BY e.created_at DESC
LIMIT 5;
```

### **Étape 5 : Vérifier le calcul manuel**
```sql
-- Comparer avec un calcul manuel
SELECT 
  e.id as event_id,
  e.title as event_title,
  mp.base_price,
  mp.price_per_hour,
  mp.bonus_percentage,
  EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600 as duration_hours,
  mp.base_price + (mp.price_per_hour * EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600) as base_calculation,
  (mp.base_price + (mp.price_per_hour * EXTRACT(EPOCH FROM (e.end_date - e.start_date)) / 3600)) * (1 + mp.bonus_percentage / 100) as with_bonus
FROM events e
JOIN mission_pricing mp ON e.id = mp.event_id
ORDER BY e.created_at DESC
LIMIT 5;
```

## 📊 **Interprétation des résultats**

### **Si la fonction retourne 0 :**
- Aucun pricing trouvé pour l'événement
- Créer un pricing avec :
```sql
INSERT INTO mission_pricing (event_id, base_price, price_per_hour, bonus_percentage)
VALUES ('EVENT_ID', 50.00, 25.00, 10.00);
```

### **Si le prix semble incorrect :**
- Vérifier les valeurs de `base_price`, `price_per_hour`, `bonus_percentage`
- Comparer avec le calcul manuel
- Vérifier la durée de l'événement

### **Si le bonus n'est pas appliqué :**
- Vérifier que le technicien a des compétences de niveau 'expert'
- Vérifier que `bonus_percentage > 0`

## 🎯 **Résultat attendu**

Après correction :
- ✅ **Fonction SQL** : `calculate_mission_price()` retourne un prix > 0
- ✅ **Calcul cohérent** : Le prix correspond au forfait configuré
- ✅ **Bonus appliqué** : Pour les techniciens experts avec bonus > 0
- ✅ **Gestion d'erreurs** : Retourne 0 si aucun pricing trouvé

## 🆘 **Dépannage**

### **Erreur "invalid input syntax for type uuid"**
- Utiliser un vrai UUID de technicien, pas un placeholder
- Vérifier que l'ID existe dans la table `users`

### **Fonction retourne toujours 0**
- Vérifier qu'il y a des données dans `mission_pricing`
- Vérifier que `event_id` correspond à un événement existant

### **Prix incorrect**
- Comparer avec le calcul manuel
- Vérifier les valeurs de pricing dans la base de données 