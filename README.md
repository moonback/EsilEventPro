# Esil-Events 🎉 – Application de Gestion Événementielle

Une application complète pour les agences événementielles, développée avec **React**, **TypeScript** et **Supabase**, permettant de gérer le personnel, les prestations et la planification des événements.

---

## ✨ Fonctionnalités

### 🔑 Dashboard Administrateur
- 👥 **Gestion du personnel** – CRUD complet, rôles et compétences
- 🛠️ **Gestion des compétences** – Définition et attribution technique
- 📋 **Gestion des affectations** – Planification et suivi en temps réel
- 📅 **Gestion des événements** – Création, modification et types de prestations
- 🖱️ **Planification interactive** – Calendrier *drag & drop* avec gestion des conflits
- 📊 **Suivi en temps réel** – Confirmations et statistiques de disponibilité

### 👨‍🔧 Espace Technicien
- 🔐 **Connexion sécurisée** avec dashboard personnel
- 📆 **Gestion des disponibilités** – Validation/refus avec justification
- 🕓 **Historique des missions** – Suivi complet
- 🧑‍💼 **Profil personnel** – Informations et compétences
- 🗓️ **Calendrier personnel** – Vue claire des missions assignées

---

## 🛠️ Technologies Utilisées

- **Frontend** : React 18+, Vite 5+, TypeScript 5+
- **Backend** : Supabase (PostgreSQL + Auth + Real-time)
- **État Global** : Zustand 4+
- **UI** : Tailwind CSS 3+
- **Calendrier** : React Big Calendar
- **Formulaires** : React Hook Form + Zod
- **Notifications** : React Hot Toast
- **Routing** : React Router v6
- **Icons** : Lucide React
- **Dates** : date-fns
- **Linting** : ESLint + TypeScript

---

## 🏗️ Architecture

\`\`\`
src/
├── components/          # Composants réutilisables
│   ├── Auth/            # Authentification
│   ├── Calendar/        # Calendrier
│   ├── Events/          # Gestion d'événements
│   ├── Layout/          # Layout global
│   └── Utils...         
├── pages/               # Pages principales
├── store/               # Zustand stores
├── services/            # Services API
├── hooks/               # Hooks personnalisés
├── lib/                 # Config Supabase
├── types/               # Types TypeScript
├── config/              # Données par défaut
└── styles/              # Styles personnalisés
\`\`\`

---

## 🚀 Installation

### 1️⃣ Prérequis
- Node.js 16+
- Compte Supabase

### 2️⃣ Configuration Supabase
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez \`supabase-schema.sql\` dans l’éditeur SQL
3. Configurez vos clés :
\`\`\`bash
cp .env.example .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
\`\`\`
4. Ajoutez les utilisateurs de test dans Supabase Auth.

### 3️⃣ Installation du projet
\`\`\`bash
git clone <repo-url>
cd esil-events
npm install
npm run dev
\`\`\`
Application accessible sur **http://localhost:5173**

---

## 🔐 Comptes Démo

| Rôle         | Email                   | Mot de passe |
|--------------|------------------------|--------------|
| Administrateur | admin@esil-events.com   | admin123     |
| Technicien     | tech@esil-events.com    | tech123      |

---

## 🎨 Design et UX

- ✅ Palette cohérente et moderne
- ✅ Responsive mobile-first
- ✅ Micro-interactions fluides
- ✅ Accessibilité (contrastes, navigation clavier)
- ✅ Interface moderne avec Tailwind

---

## 🗺️ Roadmap

### ✅ Version 1.1 (Actuelle)
- Authentification complète
- Gestion des rôles et permissions
- Dashboard admin & technicien
- Affectations et calendrier personnel
- Gestion avancée des compétences

### 🔜 Version 1.2
- [ ] Notifications push et en temps réel
- [ ] Export PDF des plannings
- [ ] Chat intégré
- [ ] Mode sombre/clair
- [ ] Synchronisation avec Google/Outlook

### 🚀 Version 2.0
- [ ] Multi-agences
- [ ] IA pour optimisation du planning
- [ ] Application mobile React Native
- [ ] Module facturation & analytics

---

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche (`feature/ma-fonctionnalité`)
3. Commitez vos changements
4. Ouvrez une Pull Request

---

## 📜 Licence

Projet sous licence **MIT** – utilisation libre et contributions bienvenues.
