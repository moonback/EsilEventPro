# Guide de dépannage - Gestion des affectations

## Erreurs courantes et solutions

### 1. Erreur 409 (Conflict) - Duplicate key value

**Erreur :**
```
duplicate key value violates unique constraint "assignments_event_id_technician_id_key"
```

**Cause :**
- Tentative d'assigner un technicien qui est déjà assigné à l'événement
- La table `assignments` a une contrainte d'unicité sur `(event_id, technician_id)`

**Solutions :**
- ✅ **Vérification automatique** : L'application vérifie maintenant si l'affectation existe déjà
- ✅ **Filtrage des techniciens** : Seuls les techniciens non assignés sont affichés
- ✅ **Message d'erreur clair** : Affichage d'un message explicite

### 2. Erreur 403 (Forbidden) - RLS Policy

**Erreur :**
```
new row violates row-level security policy for table "assignments"
```

**Cause :**
- Politiques RLS mal configurées
- Utilisateur non autorisé à créer des affectations

**Solutions :**
1. Exécuter `clean-and-recreate-policies.sql` dans Supabase
2. Vérifier que l'utilisateur a le rôle 'admin'
3. Vérifier les politiques avec `verify-policies.sql`

### 3. Aucun technicien disponible

**Symptôme :**
- Liste déroulante des techniciens vide
- Message "Aucun technicien disponible"

**Cause :**
- Tous les techniciens sont déjà assignés à l'événement sélectionné

**Solutions :**
- Sélectionner un autre événement
- Créer de nouveaux techniciens
- Supprimer des affectations existantes

## Vérifications utiles

### Vérifier les affectations existantes
```sql
SELECT 
    e.title as event_title,
    u.first_name || ' ' || u.last_name as technician_name,
    a.status
FROM assignments a
JOIN events e ON a.event_id = e.id
JOIN users u ON a.technician_id = u.id
ORDER BY e.title, u.first_name;
```

### Vérifier les techniciens disponibles pour un événement
```sql
SELECT 
    u.first_name || ' ' || u.last_name as technician_name
FROM users u
WHERE u.role = 'technician'
AND u.id NOT IN (
    SELECT technician_id 
    FROM assignments 
    WHERE event_id = 'ID_DE_L_EVENEMENT'
);
```

### Compter les affectations par événement
```sql
SELECT 
    e.title,
    COUNT(a.id) as assignment_count
FROM events e
LEFT JOIN assignments a ON e.id = a.event_id
GROUP BY e.id, e.title
ORDER BY e.title;
```

## Fonctionnalités de l'application

### ✅ Vérifications automatiques
- Contrôle de l'existence d'une affectation avant création
- Filtrage des techniciens disponibles
- Réinitialisation du technicien sélectionné lors du changement d'événement

### ✅ Messages d'erreur clairs
- "Ce technicien est déjà assigné à cet événement"
- "Tous les techniciens sont déjà assignés à cet événement"
- Messages d'erreur spécifiques pour chaque type d'erreur

### ✅ Interface utilisateur améliorée
- Liste déroulante désactivée quand aucun technicien n'est disponible
- Indication visuelle des techniciens non disponibles
- Réinitialisation automatique des sélections

## Scripts de diagnostic

1. **`check-assignments-constraints.sql`** : Vérifier la structure et les contraintes
2. **`verify-policies.sql`** : Vérifier les politiques RLS
3. **`clean-and-recreate-policies.sql`** : Nettoyer et recréer les politiques

## Prévention des erreurs

1. **Toujours vérifier** les affectations existantes avant d'en créer de nouvelles
2. **Utiliser l'interface** qui filtre automatiquement les techniciens disponibles
3. **Vérifier les politiques RLS** si des erreurs 403 surviennent
4. **Consulter les logs** pour des messages d'erreur détaillés 