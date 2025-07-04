import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const competenceApi = {
  // Récupérer toutes les compétences
  getAll: () => api.get('/competences'),
  
  // Récupérer une compétence par ID
  getById: (id) => api.get(`/competences/${id}`),
  
  // Créer une nouvelle compétence
  create: (competence) => api.post('/competences', competence),
  
  // Mettre à jour l'évaluation d'une compétence
  updateEvaluation: (id, sousCompetences) => 
    api.put(`/competences/${id}/evaluation`, { sousCompetences }),
  
  // Supprimer une compétence
  delete: (id) => api.delete(`/competences/${id}`),
};

export default api;