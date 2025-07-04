import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import SousCompetenceInput from '../components/SousCompetenceInput';
import { competenceApi } from '../services/api';

const CreateCompetence = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    sousCompetences: [{ nom: '', statut: 'non validée' }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filtrer les sous-compétences vides
      const sousCompetencesFiltered = formData.sousCompetences.filter(sc => sc.nom.trim() !== '');
      
      const competenceData = {
        ...formData,
        sousCompetences: sousCompetencesFiltered
      };

      await competenceApi.create(competenceData);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de la compétence');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.code.trim() && formData.nom.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-gray-700" />
                Nouvelle compétence
              </h1>
              <p className="text-gray-600 mt-1">Créez une nouvelle compétence avec ses sous-compétences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations principales */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations principales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Code de la compétence *
                </label>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="Ex: C1, C2, etc."
                  className="input-field"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Identifiant unique pour la compétence
                </p>
              </div>

              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la compétence *
                </label>
                <input
                  type="text"
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Ex: Développement web, Gestion de projet..."
                  className="input-field"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Nom descriptif de la compétence
                </p>
              </div>
            </div>
          </div>

          {/* Sous-compétences */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Sous-compétences</h2>
            <SousCompetenceInput
              sousCompetences={formData.sousCompetences}
              onChange={(sousCompetences) => handleInputChange('sousCompetences', sousCompetences)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/"
              className="btn-secondary"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Création...' : 'Créer la compétence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompetence;