
import { OverarchingParameter, Site } from '@/types';

// Données de démonstration pour les paramètres généraux
const mockOverarchingParameters: OverarchingParameter[] = [
  {
    id: '1',
    cspActivityNumber: 'CSP-MDG-2023-001',
    fieldOffice: 'RBJ Madagascar, Toliara Sub Office',
    activityCategory: 'Malnutrition prevention activities',
    operationDuration: 6,
    numberOfSites: 101,
    riskLevel: 2,
    minimumRequiredInterval: 3, // operationDuration / riskLevel
    targetedNumberOfSites: 34, // numberOfSites / minimumRequiredInterval
    feasibleNumberOfSites: 12,
    adjustedRequiredInterval: 8.42, // calculé dynamiquement
    feasibilityRatio: 0.36 // feasibleNumberOfSites / targetedNumberOfSites
  },
  {
    id: '2',
    cspActivityNumber: 'CSP-MDG-2023-002',
    fieldOffice: 'RBJ Madagascar, Antananarivo Office',
    activityCategory: 'School based programmes (SMP)',
    operationDuration: 9,
    numberOfSites: 87,
    riskLevel: 1,
    minimumRequiredInterval: 9, // operationDuration / riskLevel
    targetedNumberOfSites: 10, // numberOfSites / minimumRequiredInterval
    feasibleNumberOfSites: 9,
    adjustedRequiredInterval: 10, // calculé dynamiquement
    feasibilityRatio: 0.90 // feasibleNumberOfSites / targetedNumberOfSites
  },
  {
    id: '3',
    cspActivityNumber: 'CSP-MDG-2023-003',
    fieldOffice: 'RBJ Madagascar, Ambovombe Office',
    activityCategory: 'Unconditional Resource Transfers (URT)',
    operationDuration: 12,
    numberOfSites: 156,
    riskLevel: 3,
    minimumRequiredInterval: 4, // operationDuration / riskLevel
    targetedNumberOfSites: 39, // numberOfSites / minimumRequiredInterval
    feasibleNumberOfSites: 30,
    adjustedRequiredInterval: 5, // calculé dynamiquement
    feasibilityRatio: 0.77 // feasibleNumberOfSites / targetedNumberOfSites
  }
];
  // Service pour gérer les Bureaux
  export const FIELD_OFFICES = [
    "Antananarivo",
    "Toamasina",
    "Mahajanga",
    "Fianarantsoa",
    "Toliara"
  ];

// Liste des catégories d'activités disponibles
export const activityCategories = [
  'Unconditional Resource Transfers (URT)',
  'Malnutrition prevention programme (NPA)',
  'Malnutrition treatment programme (NTA)',
  'School based programmes (SMP)',
  'Smallholder agricultural market support programmes (SMS)',
  'Asset Creation and Livelihood (ACL)',
  'Action to protect against climate shocks (CAR)'
];

// Service pour gérer les paramètres généraux
export const parametersService = {
  getOverarchingParameters: async (): Promise<OverarchingParameter[]> => {
    // Simuler une requête API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockOverarchingParameters);
      }, 500);
    });
  },

  // Obtenir la liste des catégories d'activités disponibles
  getActivityCategories: async (): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(activityCategories);
        resolve(FIELD_OFFICES)
      }, 300);
    });
  },

  calculateDerivedValues: (parameter: Partial<OverarchingParameter>): Partial<OverarchingParameter> => {
    const { operationDuration, riskLevel, numberOfSites, feasibleNumberOfSites } = parameter;
    
    // Vérifier si toutes les valeurs nécessaires sont définies
    if (operationDuration === undefined || riskLevel === undefined || numberOfSites === undefined) {
      return parameter;
    }

    // Calcul du minimum required interval: Operation duration / Risk level
    const minimumRequiredInterval = Math.max(1, Math.ceil(operationDuration / (riskLevel || 1)));
    
    // Targeted number of sites to visit (per month) = number of sites / minimum required interval
    const targetedNumberOfSites = Math.ceil(numberOfSites / minimumRequiredInterval);
    
    // Si feasibleNumberOfSites n'est pas défini, utiliser targetedNumberOfSites comme valeur par défaut
    const actualFeasibleNumberOfSites = feasibleNumberOfSites || targetedNumberOfSites;
    
    // Feasibility ratio = Feasible number of sites / Targeted number of sites
    const feasibilityRatio = targetedNumberOfSites > 0 
      ? Number((actualFeasibleNumberOfSites / targetedNumberOfSites).toFixed(2))
      : 1;
    
    // Minimum required frequency of visits during the duration = operation duration / minimumRequiredInterval
    const minimumRequiredFrequency = minimumRequiredInterval > 0 
      ? Math.ceil(operationDuration / minimumRequiredInterval)
      : 0;
    
    // CO adjusted required frequency = Minimum required frequency * feasibility ratio
    const adjustedRequiredFrequency = Math.ceil(minimumRequiredFrequency * feasibilityRatio);
    
    // CO adjusted required interval (in months)
    let adjustedRequiredInterval = 1;
    if (adjustedRequiredFrequency > 0) {
      adjustedRequiredInterval = Math.max(1, Math.ceil(operationDuration / adjustedRequiredFrequency));
    }

    return {
      ...parameter,
      minimumRequiredInterval,
      targetedNumberOfSites,
      feasibleNumberOfSites: actualFeasibleNumberOfSites,
      adjustedRequiredInterval,
      feasibilityRatio
    };
  },

  createOverarchingParameter: async (parameter: Omit<OverarchingParameter, 'id'>): Promise<OverarchingParameter> => {
    // Simuler une requête API pour créer un nouveau paramètre
    return new Promise((resolve) => {
      setTimeout(() => {
        const newParameter = {
          ...parameter,
          id: Date.now().toString()
        };
        mockOverarchingParameters.push(newParameter);
        resolve(newParameter);
      }, 500);
    });
  },

  updateOverarchingParameter: async (parameter: OverarchingParameter): Promise<OverarchingParameter> => {
    // Simuler une requête API pour mettre à jour un paramètre
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockOverarchingParameters.findIndex(p => p.id === parameter.id);
        if (index >= 0) {
          mockOverarchingParameters[index] = parameter;
          resolve(parameter);
        }
        resolve(parameter);
      }, 500);
    });
  },

  deleteOverarchingParameter: async (id: string): Promise<boolean> => {
    // Simuler une requête API pour supprimer un paramètre
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockOverarchingParameters.findIndex(p => p.id === id);
        if (index >= 0) {
          mockOverarchingParameters.splice(index, 1);
          resolve(true);
        }
        resolve(false);
      }, 500);
    });
  },

  // Nouvelle fonction pour calculer le nombre de sites par bureau et catégorie d'activité
  getSiteCountsByOfficeAndActivity: (sites: Site[]): Record<string, Record<string, number>> => {
    // Structure: { fieldOffice: { activityCategory: count } }
    const counts: Record<string, Record<string, number>> = {};
    
    sites.forEach(site => {
      const office = site.subOfficeName || 'Unknown Office';
      const activity = site.activityCategory || 'Unknown Activity';
      
      if (!counts[office]) {
        counts[office] = {};
      }
      
      if (!counts[office][activity]) {
        counts[office][activity] = 0;
      }
      
      counts[office][activity] += 1;
    });
    
    return counts;
  }
};
