# Résolution de l'erreur 406 pour mission_pricing

## Problème
Les techniciens reçoivent une erreur `406 (Not Acceptable)` lors de la tentative de récupération des données de tarification des missions.

## Causes possibles
1. **Politiques RLS incorrectes** : Les techniciens n'ont pas les bonnes permissions pour accéder aux données `mission_pricing`
2. **Doublons dans la base de données** : Plusieurs entrées `mission_pricing` pour le même événement
3. **Problème de jointure** : Les relations entre les tables ne sont pas correctement configurées

## Solutions

### Étape 1 : Exécuter le script de diagnostic
Exécutez le script `supabase/debug-mission-pricing-access.sql` dans l'éditeur SQL de Supabase pour diagnostiquer le problème.

### Étape 2 : Corriger les politiques RLS
Exécutez le script `supabase/fix-mission-pricing-rls.sql` pour corriger les politiques RLS :

```sql
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Everyone can view mission pricing" ON mission_pricing;
DROP POLICY IF EXISTS "Admins can manage mission pricing" ON mission_pricing;

-- Créer de nouvelles politiques plus spécifiques
CREATE POLICY "Technicians can view pricing for assigned events" ON mission_pricing 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM assignments a 
    WHERE a.event_id = mission_pricing.event_id 
    AND a.technician_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all mission pricing" ON mission_pricing 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage mission pricing" ON mission_pricing 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Étape 3 : Nettoyer les doublons
Si le diagnostic révèle des doublons, exécutez le script `supabase/fix-mission-pricing-duplicates.sql`.

### Étape 4 : Vérifier les assignations
Assurez-vous que les techniciens sont correctement assignés aux événements dans la table `assignments`.

### Étape 5 : Tester l'accès
1. Connectez-vous en tant que technicien
2. Vérifiez la console du navigateur pour les logs de débogage
3. Les nouveaux logs dans `supabaseService.ts` vous aideront à diagnostiquer le problème

## Logs de débogage
Le service `missionPricingService.getByEventId` a été amélioré avec des logs détaillés :
- Tentative de récupération du pricing
- Gestion des erreurs PGRST116 (doublons)
- Gestion des erreurs 406 avec approche alternative
- Logs de succès et d'échec

## Vérification
Après avoir appliqué les corrections :
1. Les techniciens doivent pouvoir voir les tarifications des événements auxquels ils sont assignés
2. Les admins doivent pouvoir voir et gérer toutes les tarifications
3. Les erreurs 406 doivent disparaître

## Support
Si le problème persiste, vérifiez :
- Les logs dans la console du navigateur
- Les politiques RLS dans Supabase
- Les assignations des techniciens aux événements
- L'état de la base de données avec le script de diagnostic 