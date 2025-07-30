# Correction de l'affichage du taux horaire

## Problème
Le taux horaire reste affiché comme "Non défini" dans `TechnicianProfile.tsx` même quand il est défini par l'administrateur.

## Causes possibles

### 1. **Données manquantes dans la base de données**
- Le champ `hourly_rate` n'est pas défini pour les techniciens
- Valeur NULL ou 0 dans la base de données

### 2. **Problème de synchronisation**
- L'utilisateur dans le store n'est pas mis à jour après modification par l'admin
- Les données ne sont pas rechargées depuis la base de données

## Solutions appliquées

### ✅ **1. Diagnostic de la base de données**
Exécutez le script `debug-hourly-rate.sql` dans l'éditeur SQL de Supabase pour vérifier :
- La structure de la table `users`
- Les valeurs actuelles du champ `hourly_rate`
- Le statut des techniciens spécifiquement

### ✅ **2. Rechargement automatique des données**
Le composant `TechnicianProfile.tsx` a été modifié pour :
- Recharger les données utilisateur depuis la base de données au montage
- Comparer les données avant mise à jour pour éviter les boucles infinies
- Mettre à jour le store seulement si les données ont changé

### ✅ **3. Vérification des données**
Le composant affiche maintenant correctement :
- Le taux horaire s'il est défini : `XX €/h`
- "Non défini" s'il n'est pas défini

## Étapes de vérification

### 1. **Vérifier la base de données**
```sql
-- Exécuter dans l'éditeur SQL de Supabase
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    hourly_rate
FROM users 
WHERE role = 'technician'
ORDER BY created_at DESC;
```

### 2. **Définir un taux horaire pour un technicien**
Dans l'interface d'administration (`PersonnelManagement.tsx`) :
1. Cliquer sur "Modifier" pour un technicien
2. Définir un "Taux horaire (€/h)" > 0
3. Sauvegarder

### 3. **Vérifier l'affichage**
Dans le profil technicien (`TechnicianProfile.tsx`) :
- Le taux horaire devrait s'afficher correctement
- Pas de boucle infinie de rechargement

## Code modifié

### `TechnicianProfile.tsx`
```tsx
// Recharger l'utilisateur une seule fois au montage du composant
useEffect(() => {
  const reloadUser = async () => {
    if (!user) return;
    
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('Utilisateur non trouvé');

      // Récupérer les compétences de l'utilisateur
      const { data: userSkillsData, error: userSkillsError } = await supabase
        .from('user_skills')
        .select(`
          skills (*)
        `)
        .eq('user_id', user.id);

      if (userSkillsError) throw userSkillsError;

      const skills = userSkillsData?.map((item: any) => item.skills).filter(Boolean) || [];

      const updatedUser: UserType = {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
        phone: userData.phone,
        hourlyRate: userData.hourly_rate || 0,
        skills: skills,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
      };

      // Mettre à jour l'utilisateur dans le store seulement si les données ont changé
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Erreur lors du rechargement de l\'utilisateur:', error);
    }
  };

  reloadUser();
}, []); // Dépendances vides = exécuté une seule fois au montage
```

## Avantages

- ✅ **Synchronisation automatique** : Les données sont rechargées depuis la base de données
- ✅ **Pas de boucle infinie** : Comparaison des données avant mise à jour
- ✅ **Affichage correct** : Le taux horaire s'affiche correctement
- ✅ **Performance optimisée** : Rechargement une seule fois au montage

## Test recommandé

1. **Définir un taux horaire** pour un technicien via l'interface admin
2. **Vérifier l'affichage** dans le profil technicien
3. **Vérifier les logs** pour s'assurer qu'il n'y a pas d'erreurs
4. **Tester la persistance** après rechargement de la page 