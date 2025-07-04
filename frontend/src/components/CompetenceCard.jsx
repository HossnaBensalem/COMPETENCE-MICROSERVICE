import React from 'react';
import { CheckCircle, XCircle, Edit3, Trash2, Code, Target, BookOpen } from 'lucide-react';

const CompetenceCard = ({ competence, onEdit, onDelete, onEvaluate }) => {
  const getStatusIcon = (statut) => {
    return statut === 'validée' ? (
      <CheckCircle className="w-4 h-4 text-success-600" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-400" />
    );
  };

  const getGlobalStatusColor = (statut) => {
    return statut === 'validée' 
      ? 'bg-success-50 text-success-700 border-success-200' 
      : 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const validatedCount = competence.sousCompetences?.filter(sc => sc.statut === 'validée').length || 0;
  const totalCount = competence.sousCompetences?.length || 0;
  const progressPercentage = totalCount > 0 ? (validatedCount / totalCount) * 100 : 0;

  return (
    <div className="card p-6 animate-fade-in hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-lg">
            {competence.code}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight mb-2">
              {competence.nom}
            </h3>
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getGlobalStatusColor(competence.statutGlobal)}`}>
              {getStatusIcon(competence.statutGlobal)}
              <span className="ml-1.5">{competence.statutGlobal}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEvaluate(competence)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Évaluer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(competence)}
            className="p-2 text-gray-500 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Progression
          </span>
          <span className="text-sm font-medium text-gray-900">
            {validatedCount}/{totalCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-success-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">{Math.round(progressPercentage)}%</span>
          <span className="text-xs text-gray-500">
            {validatedCount >= (totalCount - validatedCount) ? '✓ Validée' : `${Math.ceil(totalCount / 2) - validatedCount} restante(s)`}
          </span>
        </div>
      </div>

      {/* Liste des sous-compétences */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 flex items-center">
          <Code className="w-4 h-4 mr-1.5" />
          Sous-compétences ({totalCount})
        </h4>
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {competence.sousCompetences?.map((sousComp, index) => (
            <div key={index} className="flex items-start justify-between py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200">
              <span className="text-sm text-gray-700 flex-1 leading-relaxed pr-2">{sousComp.nom}</span>
              <div className="flex items-center ml-2 flex-shrink-0">
                {getStatusIcon(sousComp.statut)}
              </div>
            </div>
          )) || (
            <p className="text-sm text-gray-500 italic py-2">Aucune sous-compétence</p>
          )}
        </div>
      </div>

      {/* Action rapide */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEvaluate(competence)}
          className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center py-2 hover:bg-gray-50 rounded-md transition-all duration-200"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Évaluer cette compétence
        </button>
      </div>
    </div>
  );
};

export default CompetenceCard;