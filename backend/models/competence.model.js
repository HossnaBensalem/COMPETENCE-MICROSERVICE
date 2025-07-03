import mongoose from 'mongoose';

// Schéma pour les sous-compétences
const sousCompetenceSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la sous-compétence est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères']
  },
  statut: {
    type: String,
    required: [true, 'Le statut est requis'],
    enum: {
      values: ['validée', 'non validée'],
      message: 'Le statut doit être "validée" ou "non validée"'
    },
    default: 'non validée'
  }
}, {
  _id: false // Pas besoin d'ID pour les sous-documents
});

// Schéma principal pour les compétences
const competenceSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Le code de la compétence est requis'],
    unique: true,  // <=== هنا فقط unique بدون index إضافي لاحق
    trim: true,
    uppercase: true,
    minlength: [1, 'Le code doit contenir au moins 1 caractère'],
    maxlength: [10, 'Le code ne peut pas dépasser 10 caractères'],
    match: [/^[A-Z0-9]+$/, 'Le code ne peut contenir que des lettres majuscules et des chiffres']
  },
  nom: {
    type: String,
    required: [true, 'Le nom de la compétence est requis'],
    trim: true,
    minlength: [3, 'Le nom doit contenir au moins 3 caractères'],
    maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères']
  },
  sousCompetences: {
    type: [sousCompetenceSchema],
    default: [],
    validate: {
      validator: function(sousCompetences) {
        return sousCompetences.length >= 0;
      },
      message: 'Les sous-compétences doivent être un tableau valide'
    }
  }
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Propriété virtuelle pour calculer le statut global
competenceSchema.virtual('statutGlobal').get(function() {
  if (!this.sousCompetences || this.sousCompetences.length === 0) {
    return 'non validée';
  }

  const validees = this.sousCompetences.filter(sc => sc.statut === 'validée').length;
  const nonValidees = this.sousCompetences.length - validees;
  
  // Statut validé si le nombre de sous-compétences validées >= non validées
  return validees >= nonValidees ? 'validée' : 'non validée';
});

// Propriété virtuelle pour calculer le pourcentage de progression
competenceSchema.virtual('progression').get(function() {
  if (!this.sousCompetences || this.sousCompetences.length === 0) {
    return 0;
  }

  const validees = this.sousCompetences.filter(sc => sc.statut === 'validée').length;
  return Math.round((validees / this.sousCompetences.length) * 100);
});

// Index de recherche textuelle (seulement un index ici, pas duplicata)
competenceSchema.index({ nom: 'text' });

// Middleware pre-save pour nettoyer les données
competenceSchema.pre('save', function(next) {
  // Nettoyer les sous-compétences vides
  this.sousCompetences = this.sousCompetences.filter(sc => 
    sc.nom && sc.nom.trim().length > 0
  );
  
  next();
});

// Méthodes statiques utiles
competenceSchema.statics.getByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() });
};

competenceSchema.statics.searchByName = function(searchTerm) {
  return this.find({
    $text: { $search: searchTerm }
  }).sort({ score: { $meta: 'textScore' } });
};

// Méthodes d'instance
competenceSchema.methods.updateSousCompetences = function(nouvelleSousCompetences) {
  this.sousCompetences = nouvelleSousCompetences.filter(sc => 
    sc.nom && sc.nom.trim().length > 0
  );
  return this.save();
};

competenceSchema.methods.toggleSousCompetenceStatus = function(index) {
  if (index >= 0 && index < this.sousCompetences.length) {
    const currentStatus = this.sousCompetences[index].statut;
    this.sousCompetences[index].statut = currentStatus === 'validée' ? 'non validée' : 'validée';
    return this.save();
  }
  throw new Error('Index de sous-compétence invalide');
};

const Competence = mongoose.model('Competence', competenceSchema);

export default Competence;
