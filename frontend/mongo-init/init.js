// Script d'initialisation pour MongoDB
// Ce script s'exécute automatiquement lors de la première création de la base de données

// Création de la base de données
db = db.getSiblingDB('competence-tracker');

// Création d'un utilisateur pour l'application
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'competence-tracker'
    }
  ]
});

// Insertion des nouvelles compétences selon les spécifications
db.competences.insertMany([
  {
    code: 'C1',
    nom: 'Installer et configurer son environnement de travail en fonction du projet',
    sousCompetences: [
      { nom: 'Maîtriser Git et GitHub (git commands, gitignore)', statut: 'validée' },
      { nom: 'Configurer l\'environnement de développement (.env, package.json)', statut: 'validée' },
      { nom: 'Gérer les dépendances du projet (npm, yarn)', statut: 'non validée' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'C2',
    nom: 'Maquetter des interfaces utilisateur web et web mobile',
    sousCompetences: [
      { nom: 'Créer des maquettes respectant les principes UI / UX', statut: 'non validée' },
      { nom: 'Utiliser un outil de maquettage (figma, adobe XD ...)', statut: 'non validée' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'C3',
    nom: 'Réaliser des interfaces utilisateur statiques web ou web mobile',
    sousCompetences: [
      { nom: 'Rendre les pages web responsives (media queries, breakpoints)', statut: 'validée' },
      { nom: 'Mettre en forme les pages web (box model, typographie, couleurs)', statut: 'validée' },
      { nom: 'Positionner les éléments (static, fixed, relative, absolute, sticky)', statut: 'validée' },
      { nom: 'Agencer le contenu des pages (flexbox, grid, display, z-index, animation)', statut: 'validée' },
      { nom: 'Créer des formulaires (form, input, button)', statut: 'non validée' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'C4',
    nom: 'Développer la partie dynamique des interfaces utilisateur web ou web mobile',
    sousCompetences: [
      { nom: 'Manipuler les données (variables, objets, tableaux)', statut: 'validée' },
      { nom: 'Utiliser les structures conditionnelles, les boucles et les fonctions', statut: 'validée' },
      { nom: 'Rendre les pages web interactive en utilisant les DOM et les evenements', statut: 'validée' },
      { nom: 'Manipuler les listes avec les HOF (map, filter, find, reduce)', statut: 'non validée' },
      { nom: 'Exploiter les fonctionnalités ES6+ (fonctions fléchées, destructuring, spread operators, rest operators, template strings)', statut: 'non validée' },
      { nom: 'Communiquer avec le back-end en implémentant des requêtes API avec Fetch ou Axios', statut: 'non validée' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'C5',
    nom: 'Mettre en place une base de données relationnelle',
    sousCompetences: [
      { nom: 'Diagramme de cas d\'utilisation', statut: 'non validée' },
      { nom: 'Diagramme de classe', statut: 'non validée' },
      { nom: 'Diagramme de séquence', statut: 'non validée' },
      { nom: 'Respecter les contraintes d\'intégrité et du cahier des charges', statut: 'non validée' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'C6',
    nom: 'Développer des composants d\'accès aux données SQL et NoSQL',
    sousCompetences: [
      { nom: 'Définir des schémas et relations avec Mongoose en respectant (les références ou sous-documents)', statut: 'validée' },
      { nom: 'Valider les données avec des schémas Mongoose (types, champs obligatoires, longueurs, etc.) et gérer les erreurs d\'une manière appropriée', statut: 'validée' },
      { nom: 'Configurer un ODM en utilisant des outils comme Prisma, ou Mongoose, ou en rédigeant des requêtes natives SQL/NoSQL', statut: 'non validée' },
      { nom: 'Réaliser les opérations CRUD (création, lecture, mise à jour, suppression) via ODM ou requêtes natives', statut: 'validée' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'C7',
    nom: 'Développer des composants métier coté serveur',
    sousCompetences: [
      { nom: 'Exécuter des requêtes HTTP (GET, POST, DELETE, PUT, PATCH)', statut: 'validée' },
      { nom: 'Créer des Endpoints', statut: 'validée' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Création d'index pour améliorer les performances
db.competences.createIndex({ "code": 1 }, { unique: true });
db.competences.createIndex({ "nom": "text" });
db.competences.createIndex({ "createdAt": -1 });

print('Base de données initialisée avec les nouvelles compétences !');