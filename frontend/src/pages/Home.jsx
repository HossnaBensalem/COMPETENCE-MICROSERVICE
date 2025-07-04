import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, BarChart3, BookOpen, Code, Target, TrendingUp } from 'lucide-react';
import CompetenceCard from '../components/CompetenceCard';
import { competenceApi } from '../services/api';

const Home = () => {
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [competenceToDelete, setCompetenceToDelete] = useState(null);

  useEffect(() => {
    loadCompetences();
  }, []);

  const loadCompetences = async () => {
    try {
      const response = await competenceApi.getAll();
      setCompetences(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (competence) => {
    setCompetenceToDelete(competence);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (competenceToDelete) {
      try {
        await competenceApi.delete(competenceToDelete._id);
        setCompetences(competences.filter(c => c._id !== competenceToDelete._id));
        setShowDeleteModal(false);
        setCompetenceToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const filteredCompetences = competences.filter(competence => {
    const matchesSearch = competence.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competence.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'validated') return matchesSearch && competence.statutGlobal === 'validée';
    if (filter === 'not-validated') return matchesSearch && competence.statutGlobal === 'non validée';
    
    return matchesSearch;
  });

  const stats = {
    total: competences.length,
    validated: competences.filter(c => c.statutGlobal === 'validée').length,
    notValidated: competences.filter(c => c.statutGlobal === 'non validée').length,
  };

  // Calcul de la progression globale
  const totalSousCompetences = competences.reduce((acc, comp) => acc + (comp.sousCompetences?.length || 0), 0);
  const totalValidated = competences.reduce((acc, comp) => 
    acc + (comp.sousCompetences?.filter(sc => sc.statut === 'validée').length || 0), 0);
  const globalProgress = totalSousCompetences > 0 ? Math.round((totalValidated / totalSousCompetences) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des compétences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Code className="w-8 h-8 mr-3 text-gray-700" />
                Compétence Tracker
              </h1>
              <p className="text-gray-600 mt-1">Suivi des compétences techniques et professionnelles</p>
            </div>
            <Link
              to="/create"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle compétence
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Compétences</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Validées</p>
                <p className="text-2xl font-bold text-success-600">{stats.validated}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-gray-500">{stats.notValidated}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Progression</p>
                <p className="text-2xl font-bold text-blue-600">{globalProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        {totalSousCompetences > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Progression globale</h2>
              <span className="text-sm text-gray-600">{totalValidated}/{totalSousCompetences} sous-compétences validées</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${globalProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {globalProgress === 100 ? '🎉 Toutes les compétences sont maîtrisées !' : 
               `${100 - globalProgress}% restant pour compléter toutes les compétences`}
            </p>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une compétence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                >
                  <option value="all">Toutes les compétences</option>
                  <option value="validated">Compétences validées</option>
                  <option value="not-validated">Compétences en cours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des compétences */}
        {filteredCompetences.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompetences.map((competence) => (
              <CompetenceCard
                key={competence._id}
                competence={competence}
                onEvaluate={(comp) => window.location.href = `/evaluate/${comp._id}`}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filter !== 'all' ? 'Aucune compétence trouvée' : 'Aucune compétence'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Commencez par créer votre première compétence technique'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <Link
                to="/create"
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Créer une compétence
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la compétence <strong>"{competenceToDelete?.code} - {competenceToDelete?.nom}"</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="btn-danger"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;