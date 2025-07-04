import React from 'react';
import { X, Plus } from 'lucide-react';

const SousCompetenceInput = ({ sousCompetences, onChange }) => {
  const addSousCompetence = () => {
    onChange([...sousCompetences, { nom: '', statut: 'non validée' }]);
  };

  const removeSousCompetence = (index) => {
    const newSousCompetences = sousCompetences.filter((_, i) => i !== index);
    onChange(newSousCompetences);
  };

  const updateSousCompetence = (index, field, value) => {
    const newSousCompetences = sousCompetences.map((sc, i) => 
      i === index ? { ...sc, [field]: value } : sc
    );
    onChange(newSousCompetences);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Sous-compétences
        </label>
        <button
          type="button"
          onClick={addSousCompetence}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {sousCompetences.map((sousComp, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg animate-slide-up">
            <div className="flex-1">
              <input
                type="text"
                value={sousComp.nom}
                onChange={(e) => updateSousCompetence(index, 'nom', e.target.value)}
                placeholder={`Sous-compétence ${index + 1}`}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all duration-200"
              />
            </div>
            
            <select
              value={sousComp.statut}
              onChange={(e) => updateSousCompetence(index, 'statut', e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all duration-200"
            >
              <option value="non validée">Non validée</option>
              <option value="validée">Validée</option>
            </select>

            <button
              type="button"
              onClick={() => removeSousCompetence(index)}
              className="p-2 text-gray-500 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {sousCompetences.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Aucune sous-compétence ajoutée</p>
            <p className="text-xs text-gray-400 mt-1">Cliquez sur "Ajouter" pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SousCompetenceInput;