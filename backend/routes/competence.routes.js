import express from 'express';
import {
  getAllCompetences,
  getCompetenceById,
  createCompetence,
  updateEvaluation,
  deleteCompetence
} from '../controllers/competence.controller.js';

const router = express.Router();

// Middleware de logging pour les routes de compétences
const logRoute = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};

// Application du middleware de logging
router.use(logRoute);

// Routes des compétences
router.get('/', getAllCompetences);           // GET /api/competences
router.get('/:id', getCompetenceById);        // GET /api/competences/:id
router.post('/', createCompetence);           // POST /api/competences
router.put('/:id/evaluation', updateEvaluation); // PUT /api/competences/:id/evaluation
router.delete('/:id', deleteCompetence);      // DELETE /api/competences/:id

export default router;