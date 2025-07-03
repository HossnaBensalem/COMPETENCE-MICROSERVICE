import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import competenceRoutes from './routes/competence.routes.js';

// Configuration des variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de sécurité et de logging
app.use(helmet());
app.use(morgan('combined'));

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5175',
  credentials: true
}));

// Middlewares pour le parsing des données
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/competences', competenceRoutes);

// Route de test de santé de l'API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Compétence Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(` API Health: http://localhost:${PORT}/api/health`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;