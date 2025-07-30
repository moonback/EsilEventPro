# Guide Développeur - EventPro avec Supabase

Ce guide est destiné aux développeurs qui travaillent sur l'application EventPro avec l'intégration Supabase.

## 🏗️ Architecture

### Structure des Services

```
src/
├── lib/
│   └── supabase.ts          # Configuration Supabase
├── services/
│   ├── supabaseService.ts   # Services CRUD pour les données
│   └── authService.ts       # Service d'authentification
├── store/
│   ├── useAppStore.ts       # Store principal (données)
│   └── useAuthStore.ts      # Store d'authentification
├── hooks/
│   └── useSupabaseError.ts  # Hook de gestion d'erreurs
└── config/
    └── defaultData.ts       # Données par défaut
```

### Flux de Données

1. **Authentification** : `authService` → `useAuthStore`
2. **Données** : `supabaseService` → `useAppStore` → Composants
3. **Erreurs** : `useSupabaseError` → Toast notifications

## 🔧 Services Supabase

### Service Principal (`supabaseService.ts`)

Chaque entité a son service :
- `userService` : Gestion des utilisateurs
- `eventService` : Gestion des événements
- `assignmentService` : Gestion des affectations
- `skillService` : Gestion des compétences
- `eventTypeService` : Gestion des types d'événements

### Pattern CRUD

```typescript
export const entityService = {
  async getAll(): Promise<Entity[]> { /* ... */ },
  async getById(id: string): Promise<Entity | null> { /* ... */ },
  async create(data: CreateEntityData): Promise<Entity> { /* ... */ },
  async update(id: string, data: Partial<Entity>): Promise<Entity> { /* ... */ },
  async delete(id: string): Promise<void> { /* ... */ },
};
```

## 🎯 Stores Zustand

### AppStore (`useAppStore.ts`)

Gère toutes les données de l'application :
- `users`, `events`, `assignments`, `skills`, `eventTypes`
- Méthodes CRUD pour chaque entité
- `loadInitialData()` pour charger les données initiales

### AuthStore (`useAuthStore.ts`)

Gère l'authentification :
- `user`, `isAuthenticated`, `isLoading`
- `login()`, `logout()`, `initializeAuth()`

## 🚨 Gestion d'Erreurs

### Hook `useSupabaseError`

```typescript
const { error, handleError, clearError } = useSupabaseError();

try {
  await someSupabaseOperation();
} catch (error) {
  handleError(error); // Affiche un toast et log l'erreur
}
```

### ErrorBoundary

Capture les erreurs React non gérées :
- Affiche une interface utilisateur d'erreur
- Permet de réessayer ou recharger la page
- Log les erreurs pour le débogage

## 📊 Base de Données

### Tables Principales

```sql
users              # Utilisateurs (admin/technician)
skills             # Compétences techniques
user_skills        # Relation many-to-many users/skills
event_types        # Types d'événements
events             # Événements
event_requirements # Exigences en techniciens
assignments        # Affectations techniciens/événements
```

### Relations

- `users` ←→ `user_skills` ←→ `skills`
- `events` ←→ `event_requirements` ←→ `skills`
- `events` ←→ `assignments` ←→ `users`
- `events` → `event_types`

## 🔐 Sécurité

### Row Level Security (RLS)

Politiques configurées :
- **Admins** : Accès complet
- **Techniciens** : Lecture des événements, gestion de leurs affectations
- **Tous** : Lecture des compétences et types d'événements

### Authentification

- Supabase Auth avec JWT
- Sessions persistantes
- Refresh automatique des tokens

## 🎨 Composants

### LoadingSpinner

Composants de chargement réutilisables :
- `LoadingSpinner` : Spinner personnalisable
- `FullScreenLoader` : Chargement plein écran
- `ButtonLoader` : Spinner pour boutons

### ErrorBoundary

Capture les erreurs React et affiche une interface de récupération.

## 🧪 Tests

### Tests Recommandés

1. **Services** : Tester chaque méthode CRUD
2. **Stores** : Tester les actions et états
3. **Composants** : Tester les interactions utilisateur
4. **Intégration** : Tester le flux complet

### Exemple de Test

```typescript
describe('userService', () => {
  it('should create a user', async () => {
    const userData = { /* ... */ };
    const user = await userService.create(userData);
    expect(user.id).toBeDefined();
  });
});
```

## 🔄 Migrations

### Ajouter une Nouvelle Table

1. **Créer le service** dans `supabaseService.ts`
2. **Ajouter les types** dans `types/index.ts`
3. **Mettre à jour le store** dans `useAppStore.ts`
4. **Créer la table** via SQL dans Supabase

### Exemple

```typescript
// 1. Service
export const newEntityService = {
  async getAll(): Promise<NewEntity[]> { /* ... */ },
  // ...
};

// 2. Types
export interface NewEntity {
  id: string;
  // ...
}

// 3. Store
interface AppStore {
  newEntities: NewEntity[];
  addNewEntity: (data: CreateNewEntityData) => Promise<void>;
  // ...
}
```

## 🚀 Performance

### Optimisations

1. **Chargement en parallèle** : `Promise.all()` pour les données initiales
2. **Mise en cache** : Zustand persiste les données
3. **Lazy loading** : Chargement à la demande
4. **Optimistic updates** : Mise à jour immédiate de l'UI

### Monitoring

- Logs d'erreurs dans la console
- Métriques Supabase dans le dashboard
- Performance monitoring avec React DevTools

## 🔧 Configuration

### Variables d'Environnement

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Configuration par Défaut

Les données par défaut sont dans `src/config/defaultData.ts` :
- Compétences prédéfinies
- Types d'événements
- Configurations des statuts

## 📝 Bonnes Pratiques

### Code

1. **Gestion d'erreurs** : Toujours utiliser `try/catch`
2. **Types TypeScript** : Définir des interfaces claires
3. **Services** : Séparer la logique métier
4. **Stores** : Éviter les effets de bord

### Base de Données

1. **RLS** : Toujours activer pour la sécurité
2. **Index** : Ajouter pour les requêtes fréquentes
3. **Contraintes** : Valider les données au niveau DB
4. **Backup** : Sauvegarder régulièrement

### UI/UX

1. **Loading states** : Toujours afficher un indicateur
2. **Error handling** : Messages d'erreur clairs
3. **Feedback** : Toast notifications pour les actions
4. **Accessibility** : Respecter les standards WCAG

## 🐛 Débogage

### Outils

1. **React DevTools** : Inspecter les stores
2. **Supabase Dashboard** : Voir les logs et métriques
3. **Browser DevTools** : Console et Network
4. **ErrorBoundary** : Capturer les erreurs React

### Logs

```typescript
// Dans les services
console.error('Erreur Supabase:', error);

// Dans les stores
console.error('Erreur lors du chargement:', error);
```

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Zustand](https://github.com/pmndrs/zustand)
- [Documentation React](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribution

1. **Fork** le repository
2. **Créer** une branche feature
3. **Tester** vos changements
4. **Documenter** les nouvelles fonctionnalités
5. **Soumettre** une Pull Request 