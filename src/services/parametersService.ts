
import { OverarchingParameter } from '@/types';

// Données de démonstration pour les paramètres généraux
const mockOverarchingParameters: OverarchingParameter[] = [
  {
    id: '1',
    cspActivityNumber: 'CSP-MDG-2023-001',
    fieldOffice: 'RBJ Madagascar, Toliara Sub Office',
    activityCategory: 'Malnutrition prevention activities',
    operationDuration: 12,
    numberOfSites: 125,
    riskLevel: 2,
    minimumRequiredInterval: 3,
    targetedNumberOfSites: 42,
    feasibleNumberOfSites: 35,
    adjustedRequiredInterval: 14,
    feasibilityRatio: 0.83
  },
  {
    id: '2',
    cspActivityNumber: 'CSP-MDG-2023-002',
    fieldOffice: 'RBJ Madagascar, Antananarivo Office',
    activityCategory: 'School Feeding',
    operationDuration: 9,
    numberOfSites: 87,
    riskLevel: 1,
    minimumRequiredInterval: 2,
    targetedNumberOfSites: 30,
    feasibleNumberOfSites: 28,
    adjustedRequiredInterval: 7,
    feasibilityRatio: 0.93
  },
  {
    id: '3',
    cspActivityNumber: 'CSP-MDG-2023-003',
    fieldOffice: 'RBJ Madagascar, Ambovombe Office',
    activityCategory: 'Food distribution',
    operationDuration: 12,
    numberOfSites: 156,
    riskLevel: 3,
    minimumRequiredInterval: 1,
    targetedNumberOfSites: 50,
    feasibleNumberOfSites: 40,
    adjustedRequiredInterval: 4,
    feasibilityRatio: 0.8
  }
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
  }
};
