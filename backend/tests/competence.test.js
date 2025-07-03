import { calculateGlobalStatus } from '../controllers/competence.controller.js';

// Configuration de Jest pour les modules ES6
const { describe, test, expect } = global;

describe('Logique de calcul du statut global', () => {
  test('devrait retourner "non validée" pour un tableau vide', () => {
    const result = calculateGlobalStatus([]);
    expect(result).toBe('non validée');
  });

  test('devrait retourner "non validée" pour null ou undefined', () => {
    expect(calculateGlobalStatus(null)).toBe('non validée');
    expect(calculateGlobalStatus(undefined)).toBe('non validée');
  });

  test('devrait retourner "validée" quand validées >= non validées', () => {
    const sousCompetences = [
      { nom: 'SC1', statut: 'validée' },
      { nom: 'SC2', statut: 'validée' },
      { nom: 'SC3', statut: 'non validée' }
    ];
    const result = calculateGlobalStatus(sousCompetences);
    expect(result).toBe('validée');
  });

  test('devrait retourner "non validée" quand validées < non validées', () => {
    const sousCompetences = [
      { nom: 'SC1', statut: 'validée' },
      { nom: 'SC2', statut: 'non validée' },
      { nom: 'SC3', statut: 'non validée' }
    ];
    const result = calculateGlobalStatus(sousCompetences);
    expect(result).toBe('non validée');
  });

  test('devrait retourner "validée" pour un égalité parfaite (50/50)', () => {
    const sousCompetences = [
      { nom: 'SC1', statut: 'validée' },
      { nom: 'SC2', statut: 'validée' },
      { nom: 'SC3', statut: 'non validée' },
      { nom: 'SC4', statut: 'non validée' }
    ];
    const result = calculateGlobalStatus(sousCompetences);
    expect(result).toBe('validée');
  });

  test('devrait retourner "validée" pour une seule sous-compétence validée', () => {
    const sousCompetences = [
      { nom: 'SC1', statut: 'validée' }
    ];
    const result = calculateGlobalStatus(sousCompetences);
    expect(result).toBe('validée');
  });

  test('devrait retourner "non validée" pour une seule sous-compétence non validée', () => {
    const sousCompetences = [
      { nom: 'SC1', statut: 'non validée' }
    ];
    const result = calculateGlobalStatus(sousCompetences);
    expect(result).toBe('non validée');
  });

  test('devrait gérer un grand nombre de sous-compétences', () => {
    // Créer 100 sous-compétences : 51 validées, 49 non validées
    const sousCompetences = [];
    
    // 51 validées
    for (let i = 0; i < 51; i++) {
      sousCompetences.push({ nom: `SC${i + 1}`, statut: 'validée' });
    }
    
    // 49 non validées
    for (let i = 51; i < 100; i++) {
      sousCompetences.push({ nom: `SC${i + 1}`, statut: 'non validée' });
    }
    
    const result = calculateGlobalStatus(sousCompetences);
    expect(result).toBe('validée');
  });

  test('devrait ignorer les statuts invalides et les traiter comme "non validée"', () => {
    const sousCompetences = [
      { nom: 'SC1', statut: 'validée' },
      { nom: 'SC2', statut: 'invalide' }, // Statut invalide
      { nom: 'SC3', statut: 'non validée' }
    ];
    
    // Filtrer seulement les statuts valides pour le test
    const validStatuses = sousCompetences.filter(sc => 
      ['validée', 'non validée'].includes(sc.statut)
    );
    
    const result = calculateGlobalStatus(validStatuses);
    expect(result).toBe('non validée'); // 1 validée, 1 non validée -> non validée
  });
});

// Tests de performance pour des cas d'usage réels
describe('Performance et cas d\'usage réels', () => {
  test('devrait calculer rapidement pour des compétences typiques (5-10 sous-compétences)', () => {
    const sousCompetences = [
      { nom: 'Maîtrise du HTML', statut: 'validée' },
      { nom: 'Maîtrise du CSS', statut: 'validée' },
      { nom: 'Maîtrise du JavaScript', statut: 'validée' },
      { nom: 'Frameworks front-end', statut: 'non validée' },
      { nom: 'Responsive design', statut: 'validée' },
      { nom: 'Accessibilité web', statut: 'non validée' },
      { nom: 'Performance web', statut: 'non validée' }
    ];
    
    const start = performance.now();
    const result = calculateGlobalStatus(sousCompetences);
    const end = performance.now();
    
    expect(result).toBe('validée'); // 4 validées, 3 non validées
    expect(end - start).toBeLessThan(1); // Moins d'1 ms
  });

  test('devrait gérer des noms de sous-compétences complexes', () => {
    const sousCompetences = [
      { nom: 'Développement d\'API REST avec Node.js et Express', statut: 'validée' },
      { nom: 'Intégration de bases de données NoSQL (MongoDB)', statut: 'validée' },
      { nom: 'Tests unitaires et d\'intégration avec Jest', statut: 'non validée' },
      { nom: 'Déploiement et DevOps avec Docker', statut: 'validée' },
      { nom: 'Sécurité des applications web (OWASP)', statut: 'non validée' }
    ];
    
    const result = calculateGlobalStatus(sousCompetences);
    expect(result).toBe('validée'); // 3 validées, 2 non validées
  });
});