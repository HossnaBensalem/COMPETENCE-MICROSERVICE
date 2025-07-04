import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { competenceApi } from '../services/api';

const EvaluateCompetence = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competence, setCompetence] = useState(null);
  const [sousCompetences, setSousCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCompetence();
  }, [id]);

  const loadCompetence = async () => {
    try {
      const response = await competenceApi.getById(id);
      setCompetence(response.data);
      setSousCompetences(response.data.sousCompetences || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = (index) => {
    const newSousCompetences = sousCompetences.map((sc, i) => 
      i === index 
        ? { ...sc, statut: sc.statut === 'validée' ? 'non validée' : 'validée' }
        : sc
    );
    setSousCompetences(newSousCompetences);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await competenceApi.updateEvaluation(id, sousCompetences);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!competence) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Compétence non trouvée</h2>
          <Link to="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const validatedCount = sousCompetences.filter(sc => sc.statut === 'validée').length;
  const totalCount = sousCompetences.length;
  const progressPercentage = totalCount > 0 ? (validatedCount / totalCount) * 100 : 0;
  const newGlobalStatus = validatedCount >= (totalCount - validatedCount) ? 'validée' : 'non validée';

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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gray-900 text-white rounded text-sm font-bold flex items-center justify-center mr-3">
                  {competence.code}
                </div>
                Évaluation - {competence.nom}
              </h1>
              <p className="text-gray-600 mt-1">Modifiez le statut des sous-compétences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statut global et progression */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Statut global
            </h2>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
              newGlobalStatus === 'validée' 
                ? 'bg-success-50 text-success-700 border-success-200' 
                : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              {newGlobalStatus === 'validée' ? (
                <CheckCircle className="w-4 h-4 mr-1.5" />
              ) : (
                <XCircle className="w-4 h-4 mr-1.5" />
              )}
              {newGlobalStatus}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Progression</span>
              <span className="text-sm font-medium text-gray-900">
                {validatedCount}/{totalCount} sous-compétences validées
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-success-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {Math.round(progressPercentage)}% de progression • {
                newGlobalStatus === 'validée' 
                  ? 'Compétence validée' 
                  : `${Math.ceil(totalCount / 2) - validatedCount} validation(s) restante(s) pour valider la compétence`
              }
            </p>
          </div>
        </div>

        {/* Liste des sous-compétences */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sous-compétences</h2>
          
          {sousCompetences.length > 0 ? (
            <div className="space-y-3">
              {sousCompetences.map((sousComp, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{sousComp.nom}</h3>
                  </div>
                  
                  <button
                    onClick={() => handleStatusToggle(index)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      sousComp.statut === 'validée'
                        ? 'bg-success-100 text-success-800 hover:bg-success-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {sousComp.statut === 'validée' ? (
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1.5" />
                    )}
                    {sousComp.statut}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune sous-compétence à évaluer</p>
            </div>
          )}
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
            onClick={handleSave}
            disabled={saving}
            className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluateCompetence;