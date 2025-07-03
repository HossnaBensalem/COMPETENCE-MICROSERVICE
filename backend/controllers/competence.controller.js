import Competence from '../models/competence.model.js';

// Fonction utilitaire pour calculer le statut global
const calculateGlobalStatus = (sousCompetences) => {
  if (!sousCompetences || sousCompetences.length === 0) {
    return 'non validée';
  }
  
  const validees = sousCompetences.filter(sc => sc.statut === 'validée').length;
  const nonValidees = sousCompetences.length - validees;
  
  return validees >= nonValidees ? 'validée' : 'non validée';
};

// GET /api/competences - Récupérer toutes les compétences
export const getAllCompetences = async (req, res) => {
  try {
    const { search, status, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Construction de la requête avec filtres
    const query = {};
    
    // Filtre de recherche textuelle
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Récupération des compétences
    let competencesQuery = Competence.find(query);
    
    // Tri
    const sortOrder = order === 'desc' ? -1 : 1;
    competencesQuery = competencesQuery.sort({ [sort]: sortOrder });
    
    const competences = await competencesQuery.exec();
    
    // Filtrage par statut global (après récupération car c'est une propriété virtuelle)
    let filteredCompetences = competences;
    if (status && ['validée', 'non validée'].includes(status)) {
      filteredCompetences = competences.filter(comp => comp.statutGlobal === status);
    }
    
    // Statistiques
    const stats = {
      total: competences.length,
      validees: competences.filter(c => c.statutGlobal === 'validée').length,
      nonValidees: competences.filter(c => c.statutGlobal === 'non validée').length,
    };
    
    res.status(200).json({
      success: true,
      count: filteredCompetences.length,
      stats,
      data: filteredCompetences
    });
    
  } catch (error) {
    console.error('Erreur getAllCompetences:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des compétences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/competences/:id - Récupérer une compétence par ID
export const getCompetenceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const competence = await Competence.findById(id);
    
    if (!competence) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: competence
    });
    
  } catch (error) {
    console.error('Erreur getCompetenceById:', error);
    
    // Erreur de format d'ID MongoDB
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Format d\'ID invalide'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la compétence',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST /api/competences - Créer une nouvelle compétence
export const createCompetence = async (req, res) => {
  try {
    const { code, nom, sousCompetences = [] } = req.body;
    
    // Validation des champs obligatoires
    if (!code || !nom) {
      return res.status(400).json({
        success: false,
        message: 'Le code et le nom sont obligatoires'
      });
    }
    
    // Vérification de l'unicité du code
    const existingCompetence = await Competence.findOne({ 
      code: code.toUpperCase() 
    });
    
    if (existingCompetence) {
      return res.status(409).json({
        success: false,
        message: 'Une compétence avec ce code existe déjà'
      });
    }
    
    // Nettoyage et validation des sous-compétences
    const cleanSousCompetences = sousCompetences
      .filter(sc => sc.nom && sc.nom.trim().length > 0)
      .map(sc => ({
        nom: sc.nom.trim(),
        statut: ['validée', 'non validée'].includes(sc.statut) ? sc.statut : 'non validée'
      }));
    
    // Création de la compétence
    const competence = new Competence({
      code: code.toUpperCase().trim(),
      nom: nom.trim(),
      sousCompetences: cleanSousCompetences
    });
    
    const savedCompetence = await competence.save();
    
    res.status(201).json({
      success: true,
      message: 'Compétence créée avec succès',
      data: savedCompetence
    });
    
  } catch (error) {
    console.error('Erreur createCompetence:', error);
    
    // Erreur de validation Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors
      });
    }
    
    // Erreur de duplication (code unique)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Une compétence avec ce code existe déjà'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la compétence',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT /api/competences/:id/evaluation - Mettre à jour l'évaluation d'une compétence
export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { sousCompetences } = req.body;
    
    if (!sousCompetences || !Array.isArray(sousCompetences)) {
      return res.status(400).json({
        success: false,
        message: 'Les sous-compétences doivent être fournies sous forme de tableau'
      });
    }
    
    const competence = await Competence.findById(id);
    
    if (!competence) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }
    
    // Validation et nettoyage des sous-compétences
    const cleanSousCompetences = sousCompetences
      .filter(sc => sc.nom && sc.nom.trim().length > 0)
      .map(sc => ({
        nom: sc.nom.trim(),
        statut: ['validée', 'non validée'].includes(sc.statut) ? sc.statut : 'non validée'
      }));
    
    // Mise à jour des sous-compétences
    competence.sousCompetences = cleanSousCompetences;
    
    const updatedCompetence = await competence.save();
    
    res.status(200).json({
      success: true,
      message: 'Évaluation mise à jour avec succès',
      data: updatedCompetence
    });
    
  } catch (error) {
    console.error('Erreur updateEvaluation:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Format d\'ID invalide'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'évaluation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE /api/competences/:id - Supprimer une compétence
export const deleteCompetence = async (req, res) => {
  try {
    const { id } = req.params;
    
    const competence = await Competence.findById(id);
    
    if (!competence) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }
    
    await Competence.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Compétence supprimée avec succès',
      data: {
        id: competence._id,
        code: competence.code,
        nom: competence.nom
      }
    });
    
  } catch (error) {
    console.error('Erreur deleteCompetence:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Format d\'ID invalide'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la compétence',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fonction utilitaire exportée pour les tests
export { calculateGlobalStatus };