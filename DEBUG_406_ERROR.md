# Guide de résolution - Erreur 406

## Problème identifié

L'erreur 406 (Not Acceptable) se produit lors de la vérification de l'existence d'une affectation avec la requête :

```
GET /rest/v1/assignments?select=id&event_id=eq.XXX&technician_id=eq.YYY
```

## Cause

L'erreur 406 indique que le serveur ne peut pas produire une réponse conforme aux en-têtes d'acceptation de la requête. Cela peut être dû à :

1. **Problème de format de requête** : La requête avec `.single()` peut causer des problèmes
2. **Politiques RLS** : Les politiques peuvent bloquer cette requête spécifique
3. **Format de réponse** : Le serveur ne peut pas retourner le format demandé

## Solution implémentée

### ✅ **Vérification locale au lieu de requête serveur**

Au lieu de faire une requête serveur pour vérifier l'existence, nous utilisons maintenant les données locales :

```typescript
// Ancienne approche (problématique)
const { data: existingAssignment, error: checkError } = await supabase
  .from('assignments')
  .select('id')
  .eq('event_id', formData.eventId)
  .eq('technician_id', formData.technicianId)
  .single();

// Nouvelle approche (robuste)
const existingAssignment = assignments.find(
  assignment => 
    assignment.eventId === formData.eventId && 
    assignment.technicianId === formData.technicianId
);
```

### ✅ **Avantages de la nouvelle approche**

1. **Pas de requête serveur supplémentaire** : Plus rapide
2. **Pas d'erreur 406** : Évite le problème de format
3. **Données cohérentes** : Utilise les mêmes données que l'interface
4. **Plus robuste** : Moins de points de défaillance

### ✅ **Fallback de sécurité**

Si une affectation en double est quand même créée (cas rare), l'erreur 23505 sera capturée :

```typescript
if (error.code === '23505') {
  alert('Ce technicien est déjà assigné à cet événement.');
}
```

## Vérifications

### 1. Tester la création d'affectation
```sql
-- Vérifier qu'il n'y a pas de doublons
SELECT 
    event_id,
    technician_id,
    COUNT(*) as count
FROM assignments 
GROUP BY event_id, technician_id 
HAVING COUNT(*) > 1;
```

### 2. Vérifier les politiques RLS
```sql
-- Vérifier les politiques pour assignments
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'assignments';
```

### 3. Tester l'insertion manuelle
```sql
-- Tester l'insertion (remplacer les IDs)
INSERT INTO assignments (event_id, technician_id, status) 
VALUES ('ID_EVENEMENT', 'ID_TECHNICIEN', 'pending');
```

## Prévention

1. **Utiliser l'interface** : L'interface filtre automatiquement les techniciens disponibles
2. **Vérification locale** : La vérification se fait maintenant côté client
3. **Fallback serveur** : L'erreur 23505 est capturée en cas de problème
4. **Données à jour** : `fetchAssignments()` est appelé après chaque modification

## Scripts utiles

- **`test-assignments.sql`** : Script de test complet
- **`check-assignments-constraints.sql`** : Vérification des contraintes
- **`verify-policies.sql`** : Vérification des politiques RLS

## Résultat

✅ **L'erreur 406 est maintenant évitée**
✅ **La vérification des doublons fonctionne**
✅ **L'interface est plus réactive**
✅ **La sécurité est maintenue** 