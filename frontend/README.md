# 🎯 Compétence Tracker - Projet MERN

Un système de gestion et d'évaluation des compétences professionnelles, développé avec la stack MERN (MongoDB, Express.js, React, Node.js).

## 🚀 Fonctionnalités

### 📊 Gestion des Compétences
- **Création** de compétences avec code unique et sous-compétences
- **Visualisation** en grille de cartes avec statut global
- **Évaluation** interactive des sous-compétences
- **Suppression** sécurisée avec confirmation
- **Recherche et filtrage** avancés

### 🎨 Interface Moderne
- Design responsive et animations fluides
- Palette de couleurs noir/gris/vert froid
- Micro-interactions et transitions CSS
- Interface utilisateur intuitive

### ⚡ Performance
- Calcul automatique du statut global
- API REST optimisée avec pagination
- Validation côté client et serveur
- Tests unitaires pour la logique métier

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** avec Hooks
- **Vite** pour le bundling rapide
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **Axios** pour les appels API
- **Lucide React** pour les icônes

### Backend
- **Node.js** avec Express.js
- **MongoDB** avec Mongoose ODM
- **JWT** pour l'authentification (optionnel)
- **Jest** pour les tests unitaires
- **Helmet** pour la sécurité

### DevOps
- **Docker & Docker Compose** pour la containerisation
- **ESLint** pour la qualité du code
- **Nodemon** pour le développement

## 🏗️ Architecture

```
competence-tracker/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services API
│   │   └── styles/         # Styles CSS
│   └── public/
├── backend/                 # API Express
│   ├── controllers/        # Logique métier
│   ├── models/            # Modèles Mongoose
│   ├── routes/            # Routes API
│   ├── config/            # Configuration
│   └── tests/             # Tests unitaires
├── docker-compose.yml      # Orchestration des services
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v18+)
- Docker et Docker Compose
- Git

### 1. Cloner le projet
```bash
git clone <repository-url>
cd competence-tracker
```

### 2. Démarrage avec Docker (Recommandé)
```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

### 3. Démarrage manuel

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
npm install
npm run dev
```

## 🔧 Configuration

### Variables d'environnement (Backend)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/competence-tracker
FRONTEND_URL=http://localhost:5173
```

### Variables d'environnement (Frontend)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/competences` | Récupérer toutes les compétences |
| GET | `/api/competences/:id` | Récupérer une compétence par ID |
| POST | `/api/competences` | Créer une nouvelle compétence |
| PUT | `/api/competences/:id/evaluation` | Mettre à jour l'évaluation |
| DELETE | `/api/competences/:id` | Supprimer une compétence |

## 🧪 Tests

### Tests Backend
```bash
cd backend
npm test                # Tests unitaires
npm run test:watch     # Mode watch
```

### Logique de Calcul du Statut Global
Le statut global d'une compétence est **"validée"** si :
```
Nombre de sous-compétences validées ≥ Nombre de sous-compétences non validées
```

## 🎨 Design System

### Palette de Couleurs
- **Noir** : `#000000` - Texte principal et CTA
- **Gris** : `#6B7280` - Texte secondaire et bordures
- **Vert froid** : `#10B981` - Statut validé et succès
- **Blanc** : `#FFFFFF` - Arrière-plans et cartes

### Animations
- Transitions fluides (200-300ms)
- Hover effects sur les cartes
- Animations de chargement
- Micro-interactions sur les boutons

## 🔒 Sécurité

- Validation des données côté client et serveur
- Sanitisation des entrées utilisateur
- Gestion d'erreurs robuste
- Headers de sécurité avec Helmet
- CORS configuré correctement

## 📈 Performance

- Lazy loading des composants
- Optimisation des requêtes MongoDB
- Compression des assets
- Cache des données fréquemment utilisées

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - Développement initial

## 🙏 Remerciements

- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)