# Esil-Events 🎉 – Application de Gestion Événementielle

Une application complète pour les agences événementielles, développée avec **React**, **TypeScript** et **Supabase**, permettant de gérer le personnel, les prestations et la planification des événements.

---

## 📸 Captures d'Écran

### 🏢 Dashboard Administrateur
![Dashboard Admin](Screen/screencapture-localhost-5173-admin-2025-07-30-18_32_02.png)
*Interface principale avec calendrier interactif, statistiques en temps réel et gestion des événements*

### 👥 Gestion du Personnel
![Gestion Personnel](Screen/screencapture-localhost-5173-admin-users-2025-07-30-18_32_16.png)
*CRUD complet des utilisateurs avec attribution des rôles et compétences*

### 🛠️ Gestion des Compétences
![Gestion Compétences](Screen/screencapture-localhost-5173-admin-skills-2025-07-30-18_32_28.png)
*Définition et gestion des compétences techniques par catégorie*

### 📋 Gestion des Affectations
![Gestion Affectations](Screen/screencapture-localhost-5173-admin-assignments-2025-07-30-18_32_43.png)
*Planification et suivi des affectations techniciens-événements*

### 👨‍🔧 Dashboard Technicien
![Dashboard Technicien](Screen/screencapture-localhost-5173-technician-2025-07-30-18_33_25.png)
*Interface technicien avec missions assignées et gestion des disponibilités*

### 🧑‍💼 Profil Technicien
![Profil Technicien](Screen/screencapture-localhost-5173-technician-profile-2025-07-30-18_34_07.png)
*Gestion du profil personnel, compétences et statistiques*

---

## ✨ Fonctionnalités Avancées

### 🔑 Dashboard Administrateur
- 👥 **Gestion du personnel** – CRUD complet, rôles et compétences
- 🛠️ **Gestion des compétences** – Définition et attribution technique
- 📋 **Gestion des affectations** – Planification et suivi en temps réel
- 📅 **Gestion des événements** – Création, modification et types de prestations
- 🖱️ **Planification interactive** – Calendrier *drag & drop* avec gestion des conflits
- 📊 **Suivi en temps réel** – Confirmations et statistiques de disponibilité
- 💰 **Gestion des taux horaires** – Configuration des tarifs par technicien
- 📈 **Statistiques avancées** – Métriques de performance et utilisation

### 👨‍🔧 Espace Technicien
- 🔐 **Connexion sécurisée** avec dashboard personnel
- 📆 **Gestion des disponibilités** – Validation/refus avec justification
- 🕓 **Historique des missions** – Suivi complet des affectations
- 🧑‍💼 **Profil personnel** – Informations et compétences
- 🗓️ **Calendrier personnel** – Vue claire des missions assignées
- 📊 **Statistiques personnelles** – Heures travaillées, missions acceptées/refusées
- 🔔 **Notifications en temps réel** – Alertes pour nouvelles affectations

### 🎯 Fonctionnalités Techniques
- 🔒 **Authentification sécurisée** avec Supabase Auth
- 🛡️ **Row Level Security (RLS)** – Sécurité granulaire des données
- 📱 **Interface responsive** – Optimisée mobile et desktop
- ⚡ **Performance optimisée** – Chargement rapide et navigation fluide
- 🎨 **Design moderne** – Interface intuitive avec Tailwind CSS
- 🔄 **État global** – Gestion centralisée avec Zustand
- 📝 **Formulaires avancés** – Validation avec React Hook Form + Zod

---

## 🛠️ Technologies Utilisées

### Frontend
- **React 18+** – Interface utilisateur moderne
- **TypeScript 5+** – Typage statique et sécurité
- **Vite 5+** – Build tool ultra-rapide
- **Tailwind CSS 3+** – Framework CSS utilitaire
- **React Router v6** – Navigation SPA
- **Zustand 4+** – Gestion d'état légère
- **React Hook Form** – Gestion des formulaires
- **Zod** – Validation de schémas
- **date-fns** – Manipulation des dates
- **Lucide React** – Icônes modernes

### Backend & Base de Données
- **Supabase** – Backend-as-a-Service
- **PostgreSQL** – Base de données relationnelle
- **Row Level Security** – Sécurité granulaire
- **Real-time** – Mises à jour en temps réel
- **Auth** – Authentification intégrée

### Outils de Développement
- **ESLint** – Linting du code
- **TypeScript ESLint** – Règles TypeScript
- **PostCSS** – Traitement CSS
- **Autoprefixer** – Compatibilité navigateurs

---

## 🏗️ Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── Auth/            # Authentification
│   ├── Calendar/        # Calendrier interactif
│   ├── Events/          # Gestion d'événements
│   ├── Layout/          # Layout global
│   └── LoadingSpinner/  # Composants de chargement
├── pages/               # Pages principales
│   ├── AdminDashboard/  # Dashboard administrateur
│   ├── TechnicianDashboard/ # Dashboard technicien
│   ├── PersonnelManagement/ # Gestion du personnel
│   ├── SkillsManagement/    # Gestion des compétences
│   ├── AssignmentsManagement/ # Gestion des affectations
│   └── TechnicianProfile/   # Profil technicien
├── store/               # Zustand stores
│   ├── useAuthStore.ts  # État d'authentification
│   └── useAppStore.ts   # État global de l'app
├── services/            # Services API
│   ├── authService.ts   # Service d'authentification
│   └── supabaseService.ts # Service Supabase
├── hooks/               # Hooks personnalisés
├── lib/                 # Configuration Supabase
├── types/               # Types TypeScript
├── config/              # Données par défaut
└── styles/              # Styles personnalisés
```

---

## 🗄️ Structure de la Base de Données

### Tables Principales
- **users** – Utilisateurs (admin/technicien)
- **skills** – Compétences techniques
- **user_skills** – Liaison utilisateurs-compétences
- **event_types** – Types d'événements
- **events** – Événements
- **event_requirements** – Exigences en techniciens
- **assignments** – Affectations techniciens-événements

### Sécurité
- **Row Level Security (RLS)** activé sur toutes les tables
- **Politiques granulaire** par rôle et propriétaire
- **Authentification Supabase** intégrée
- **Gestion des permissions** automatique

---

## 🚀 Installation

### 1️⃣ Prérequis
- Node.js 16+
- Compte Supabase

### 2️⃣ Configuration Supabase
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez `supabase/supabase-schema.sql` dans l'éditeur SQL
3. Configurez vos clés :
```bash
cp env.example .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
4. Ajoutez les utilisateurs de test dans Supabase Auth.

### 3️⃣ Installation du projet
```bash
git clone <repo-url>
cd esil-events
npm install
npm run dev
```
Application accessible sur **http://localhost:5173**

---

## 🔐 Comptes Démo

| Rôle         | Email                   | Mot de passe |
|--------------|------------------------|--------------|
| Administrateur | admin@esil-events.com   | admin123     |
| Technicien     | tech@esil-events.com    | tech123      |

---

## 🎨 Design et UX

### Interface Moderne
- ✅ **Palette cohérente** – Couleurs harmonieuses et accessibles
- ✅ **Responsive mobile-first** – Optimisé pour tous les écrans
- ✅ **Micro-interactions fluides** – Feedback visuel immédiat
- ✅ **Accessibilité** – Contraste, navigation clavier, ARIA
- ✅ **Dark mode ready** – Prêt pour le mode sombre

### Expérience Utilisateur
- 🎯 **Navigation intuitive** – Menus clairs et logiques
- 📊 **Tableaux de bord** – Statistiques en temps réel
- 🔔 **Notifications toast** – Feedback utilisateur
- ⚡ **Performance** – Chargement rapide et navigation fluide
- 📱 **Mobile-friendly** – Interface adaptée aux mobiles

---

## 🔧 Fonctionnalités Techniques Avancées

### Gestion des Événements
- 📅 **Calendrier interactif** – Drag & drop, création rapide
- 🎯 **Types d'événements** – Configuration flexible
- 👥 **Exigences en techniciens** – Spécification des besoins
- 📍 **Géolocalisation** – Gestion des lieux
- 📊 **Statuts multiples** – Draft, published, confirmed, completed, cancelled

### Gestion du Personnel
- 👤 **Profils détaillés** – Informations complètes
- 🛠️ **Compétences multiples** – Attribution par catégorie et niveau
- 💰 **Taux horaires** – Configuration des tarifs
- 📈 **Statistiques** – Performance et historique
- 🔄 **Workflow** – Processus d'affectation et validation

### Système d'Affectations
- 🤝 **Workflow complet** – Pending → Accepted/Declined
- 📝 **Justifications** – Raisons de refus
- ⏰ **Dates de réponse** – Suivi des délais
- 📊 **Statistiques** – Métriques d'acceptation
- 🔔 **Notifications** – Alertes en temps réel

---

## 🗺️ Roadmap

### ✅ Version 1.1 (Actuelle)
- [x] Authentification complète avec Supabase
- [x] Gestion des rôles et permissions RLS
- [x] Dashboard admin & technicien
- [x] Affectations et calendrier personnel
- [x] Gestion avancée des compétences
- [x] Interface responsive et moderne
- [x] Système de notifications toast
- [x] Validation des formulaires avec Zod

### 🔜 Version 1.2
- [ ] Notifications push et en temps réel
- [ ] Export PDF des plannings
- [ ] Chat intégré entre techniciens
- [ ] Mode sombre/clair
- [ ] Synchronisation avec Google/Outlook
- [ ] Système de rapports avancés
- [ ] API REST complète

### 🚀 Version 2.0
- [ ] Multi-agences et organisations
- [ ] IA pour optimisation du planning
- [ ] Application mobile React Native
- [ ] Module facturation & analytics
- [ ] Intégration paiements
- [ ] Système de géolocalisation
- [ ] API GraphQL

---

## 🐛 Dépannage

### Erreurs Courantes
- **Erreur 401** : Vérifiez les clés Supabase dans `.env`
- **Erreur 403** : Vérifiez les politiques RLS dans Supabase
- **Erreur 409** : Conflit de données, vérifiez les contraintes
- **Erreur 406** : Problème de format de données

### Solutions
- Consultez les fichiers dans `Doc/` pour les guides de dépannage
- Vérifiez les logs Supabase pour les erreurs backend
- Testez les politiques RLS avec les scripts SQL fournis

---

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche (`feature/ma-fonctionnalité`)
3. Commitez vos changements
4. Ouvrez une Pull Request

### Standards de Code
- TypeScript strict
- ESLint + Prettier
- Tests unitaires (à venir)
- Documentation des composants

---

## 📜 Licence

Projet sous licence **MIT** – utilisation libre et contributions bienvenues.

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@esil-events.com
- 📖 Documentation : Consultez les fichiers dans `Doc/`
- 🐛 Issues : Utilisez le système d'issues GitHub

---

*Développé avec ❤️ pour les agences événementielles*
