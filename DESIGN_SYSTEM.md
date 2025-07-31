# 🎨 Design System - Esil-Events

## Vue d'ensemble

Ce design system moderne et professionnel a été conçu pour offrir une expérience utilisateur exceptionnelle avec des composants réutilisables, des animations fluides et une cohérence visuelle parfaite.

## 🎯 Principes de design

### 1. **Modernité**
- Design épuré et minimaliste
- Utilisation de gradients subtils
- Animations fluides et naturelles
- Effets de glassmorphism

### 2. **Accessibilité**
- Contraste élevé pour la lisibilité
- Focus states clairs
- Navigation au clavier
- Support des lecteurs d'écran

### 3. **Responsive**
- Mobile-first approach
- Breakpoints optimisés
- Composants adaptatifs
- Performance optimisée

## 🎨 Palette de couleurs

### Couleurs principales
```css
--primary-50: #eff6ff
--primary-500: #3b82f6
--primary-600: #2563eb
--primary-700: #1d4ed8
```

### Couleurs secondaires
```css
--secondary-50: #f8fafc
--secondary-500: #64748b
--secondary-600: #475569
--secondary-700: #334155
```

### Couleurs de statut
```css
--success-500: #22c55e
--warning-500: #f59e0b
--error-500: #ef4444
```

## 📦 Composants principaux

### 1. **Boutons**
```tsx
// Bouton primaire
<button className="btn btn-primary">
  Action principale
</button>

// Bouton secondaire
<button className="btn btn-secondary">
  Action secondaire
</button>

// Bouton de succès
<button className="btn btn-success">
  Confirmer
</button>

// Bouton de danger
<button className="btn btn-danger">
  Supprimer
</button>
```

### 2. **Cartes**
```tsx
<div className="card">
  <div className="card-header">
    <h2>Titre de la carte</h2>
  </div>
  <div className="card-body">
    Contenu de la carte
  </div>
</div>
```

### 3. **Formulaires**
```tsx
<div className="form-group">
  <label className="form-label">Label</label>
  <input className="form-input" type="text" />
</div>
```

### 4. **Badges**
```tsx
<span className="badge badge-success">Succès</span>
<span className="badge badge-warning">Attention</span>
<span className="badge badge-error">Erreur</span>
```

## 🎭 Animations

### Animations d'entrée
```css
.animate-fade-in    /* Fade in avec translation Y */
.animate-slide-in   /* Slide in depuis la gauche */
.animate-scale-in   /* Scale in avec fade */
```

### Animations de survol
```css
.hover-lift         /* Légère élévation au survol */
.hover-scale        /* Agrandissement au survol */
```

### Animations de chargement
```css
.animate-shimmer    /* Effet de brillance */
.animate-pulse      /* Pulsation */
```

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile large */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop large */
```

### Classes utilitaires
```css
.mobile-hidden      /* Masqué sur mobile */
.md:block          /* Affiché à partir de md */
.lg:grid-cols-3    /* 3 colonnes à partir de lg */
```

## 🎨 Effets visuels

### Glassmorphism
```css
.glass-effect {
  @apply bg-white/80 backdrop-blur-sm border border-white/20;
}
```

### Gradients
```css
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent;
}
```

### Ombres
```css
.shadow-soft    /* Ombre douce */
.shadow-medium  /* Ombre moyenne */
.shadow-large   /* Ombre prononcée */
```

## 🔧 Configuration Tailwind

### Extensions personnalisées
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { /* ... */ },
      secondary: { /* ... */ },
      success: { /* ... */ },
      warning: { /* ... */ },
      error: { /* ... */ },
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-out',
      'slide-in': 'slideIn 0.3s ease-out',
      'scale-in': 'scaleIn 0.3s ease-out',
      'shimmer': 'shimmer 1.5s infinite',
    },
  },
}
```

## 📋 Guide d'utilisation

### 1. **Créer un nouveau composant**
```tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, children }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold text-secondary-900">{title}</h2>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};
```

### 2. **Utiliser les animations**
```tsx
<div className="animate-fade-in stagger-1">
  <div className="animate-fade-in stagger-2">
    <div className="animate-fade-in stagger-3">
      {/* Contenu avec animations échelonnées */}
    </div>
  </div>
</div>
```

### 3. **Créer des états de chargement**
```tsx
{isLoading ? (
  <div className="skeleton h-8 w-24 rounded-md" />
) : (
  <span>Contenu chargé</span>
)}
```

## 🎯 Bonnes pratiques

### 1. **Cohérence**
- Utilisez toujours les classes du design system
- Respectez la hiérarchie typographique
- Maintenez les espacements cohérents

### 2. **Performance**
- Évitez les animations complexes sur mobile
- Utilisez `transform` et `opacity` pour les animations
- Optimisez les images et icônes

### 3. **Accessibilité**
- Ajoutez des `aria-label` appropriés
- Utilisez des contrastes suffisants
- Testez avec les lecteurs d'écran

## 🔄 Mise à jour du design system

### Ajouter une nouvelle couleur
1. Définir dans `tailwind.config.js`
2. Ajouter les variables CSS dans `index.css`
3. Documenter dans ce guide

### Ajouter un nouveau composant
1. Créer le composant dans `src/components/`
2. Ajouter les styles dans `index.css`
3. Tester sur tous les breakpoints
4. Documenter l'utilisation

## 📚 Ressources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [Inter Font](https://rsms.me/inter/)

---

*Ce design system est en constante évolution. N'hésitez pas à proposer des améliorations !* 