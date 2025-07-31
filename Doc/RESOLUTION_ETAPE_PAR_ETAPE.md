# Résolution étape par étape - Erreur 406 mission_pricing

## 🔍 **Diagnostic du problème**

L'erreur `PGRST116` avec "The result contains 0 rows" indique qu'il n'y a pas de données `mission_pricing` pour l'événement `a08fd4a6-946a-49cc-bf4e-e76cd05cfe2b`.

## 📋 **Étapes de résolution**

### **Étape 1 : Vérifier les données existantes**
Exécutez dans Supabase SQL Editor :

```sql
-- Vérifier s'il y a des données mission_pricing
SELECT COUNT(*) as total_pricing_records FROM mission_pricing;

-- Vérifier les événements avec pricing
SELECT 
  e.id as event_id,
  e.title as event_title,
  mp.id as pricing_id,
  mp.base_price,
  mp.price_per_hour
FROM events e
LEFT JOIN mission_pricing mp ON e.id = mp.event_id
ORDER BY e.created_at DESC
LIMIT 10;
```

### **Étape 2 : Appliquer les nouvelles politiques RLS**
Exécutez le script `supabase/fix-mission-pricing-rls-v2.sql` :

```sql
-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Everyone can view mission pricing" ON mission_pricing;
DROP POLICY IF EXISTS "Admins can manage mission pricing" ON mission_pricing;
DROP POLICY IF EXISTS "Technicians can view pricing for assigned events" ON mission_pricing;
DROP POLICY IF EXISTS "Admins can view all mission pricing" ON mission_pricing;

-- Créer de nouvelles politiques plus permissives
CREATE POLICY "Authenticated users can view mission pricing" ON mission_pricing 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage mission pricing" ON mission_pricing 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### **Étape 3 : Créer des données de test**
Si aucun pricing n'existe, créez-en un pour l'événement problématique :

```sql
-- Créer un pricing pour l'événement
INSERT INTO mission_pricing (event_id, base_price, price_per_hour, bonus_percentage)
VALUES ('a08fd4a6-946a-49cc-bf4e-e76cd05cfe2b', 50.00, 25.00, 10.00);
```

### **Étape 4 : Vérifier les assignations**
Assurez-vous que le technicien est assigné à l'événement :

```sql
-- Vérifier les assignations pour cet événement
SELECT 
  a.id as assignment_id,
  a.technician_id,
  a.status,
  u.first_name,
  u.last_name,
  u.role
FROM assignments a
JOIN users u ON u.id = a.technician_id
WHERE a.event_id = 'a08fd4a6-946a-49cc-bf4e-e76cd05cfe2b';
```

### **Étape 5 : Tester l'accès**
1. Connectez-vous en tant que technicien
2. Ouvrez la console du navigateur (F12)
3. Vérifiez les logs de débogage
4. Les nouveaux logs vous diront exactement où le problème se situe

## 🔧 **Codes d'erreur et solutions**

| Erreur | Cause | Solution |
|--------|-------|----------|
| `PGRST116` + "0 rows" | Pas de données pricing | Créer des données de test |
| `406 Not Acceptable` | Problème de permissions RLS | Appliquer les nouvelles politiques |
| `PGRST116` + "multiple rows" | Doublons dans la base | Nettoyer avec le script de doublons |

## 📊 **Vérification finale**

Après avoir appliqué toutes les étapes :

1. **Les techniciens peuvent voir les pricing** ✅
2. **Les admins peuvent gérer les pricing** ✅  
3. **Plus d'erreurs 406** ✅
4. **Logs de débogage fonctionnels** ✅

## 🆘 **Si le problème persiste**

1. Vérifiez que l'utilisateur est bien authentifié
2. Vérifiez que l'événement existe
3. Vérifiez que le technicien est assigné à l'événement
4. Vérifiez que les données pricing existent
5. Contactez le support avec les logs de la console 