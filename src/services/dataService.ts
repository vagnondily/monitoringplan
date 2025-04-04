
import { Site, Project, ConfigSetting } from '@/types';
import { toast } from 'sonner';

// Données de simulation pour les sites
const mockSites: Site[] = [
  {
    id: '1',
    name: 'Site Paris',
    location: 'Paris, France',
    status: 'Actif',
    lastUpdate: '2025-04-03',
    ipAddress: '192.168.1.1',
    manager: 'Jean Dupont'
  },
  {
    id: '2',
    name: 'Site Lyon',
    location: 'Lyon, France',
    status: 'En maintenance',
    lastUpdate: '2025-04-02',
    ipAddress: '192.168.1.2',
    manager: 'Marie Laurent'
  },
  {
    id: '3',
    name: 'Site Marseille',
    location: 'Marseille, France',
    status: 'Actif',
    lastUpdate: '2025-04-01',
    ipAddress: '192.168.1.3',
    manager: 'Pierre Martin'
  }
];

// Données de simulation pour les projets
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Installation Système A',
    description: 'Installation et configuration du système A',
    startDate: '2025-01-15',
    endDate: '2025-05-30',
    status: 'En cours',
    siteId: '1',
    progress: 75
  },
  {
    id: '2',
    name: 'Mise à niveau Infrastructure',
    description: 'Mise à niveau des serveurs et réseaux',
    startDate: '2025-02-10',
    endDate: '2025-06-20',
    status: 'En cours',
    siteId: '2',
    progress: 45
  },
  {
    id: '3',
    name: 'Déploiement Logiciel B',
    description: 'Déploiement de la nouvelle version du logiciel B',
    startDate: '2025-03-05',
    endDate: '2025-04-15',
    status: 'Terminé',
    siteId: '3',
    progress: 100
  }
];

// Données de simulation pour les paramètres
const mockSettings: ConfigSetting[] = [
  {
    id: '1',
    name: 'API URL ONA',
    value: 'https://api.ona.example.com',
    description: 'URL de l\'API ONA pour la synchronisation des données',
    category: 'API'
  },
  {
    id: '2',
    name: 'API URL Foundry',
    value: 'https://api.foundry.example.com',
    description: 'URL de l\'API Foundry pour la synchronisation des données',
    category: 'API'
  },
  {
    id: '3',
    name: 'Intervalle de synchronisation',
    value: '30',
    description: 'Intervalle de synchronisation en minutes',
    category: 'Général'
  },
  {
    id: '4',
    name: 'Limite d\'affichage par page',
    value: '20',
    description: 'Nombre d\'éléments à afficher par page',
    category: 'Affichage'
  }
];

// Service pour la gestion des sites
export const siteService = {
  getSites: (): Promise<Site[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSites);
      }, 500);
    });
  },

  getSiteById: (id: string): Promise<Site | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSites.find(site => site.id === id));
      }, 300);
    });
  },

  createSite: (site: Omit<Site, 'id'>): Promise<Site> => {
    return new Promise((resolve) => {
      const newSite = {
        ...site,
        id: `${mockSites.length + 1}`,
        lastUpdate: new Date().toISOString().split('T')[0]
      };
      mockSites.push(newSite);
      toast.success('Site créé avec succès');
      resolve(newSite);
    });
  },

  updateSite: (site: Site): Promise<Site> => {
    return new Promise((resolve) => {
      const index = mockSites.findIndex(s => s.id === site.id);
      if (index !== -1) {
        mockSites[index] = {
          ...site,
          lastUpdate: new Date().toISOString().split('T')[0]
        };
        toast.success('Site mis à jour avec succès');
        resolve(mockSites[index]);
      } else {
        toast.error('Site non trouvé');
        throw new Error('Site non trouvé');
      }
    });
  },

  deleteSite: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      const index = mockSites.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSites.splice(index, 1);
        toast.success('Site supprimé avec succès');
        resolve();
      } else {
        toast.error('Site non trouvé');
        throw new Error('Site non trouvé');
      }
    });
  },
  
  exportToExcel: (): Promise<string> => {
    return new Promise((resolve) => {
      // Simulation de la génération d'un fichier Excel
      toast.success('Fichier Excel généré');
      resolve('sites-export.xlsx');
    });
  },
  
  importFromExcel: (file: File): Promise<Site[]> => {
    return new Promise((resolve) => {
      // Simulation de l'importation d'un fichier Excel
      setTimeout(() => {
        toast.success('Données importées avec succès');
        resolve(mockSites);
      }, 1000);
    });
  }
};

// Service pour la gestion des projets
export const projectService = {
  getProjects: (): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProjects);
      }, 500);
    });
  },
  
  getProjectById: (id: string): Promise<Project | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProjects.find(project => project.id === id));
      }, 300);
    });
  },
  
  getProjectsBySiteId: (siteId: string): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProjects.filter(project => project.siteId === siteId));
      }, 300);
    });
  }
};

// Service pour la gestion des paramètres
export const settingsService = {
  getSettings: (): Promise<ConfigSetting[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSettings);
      }, 500);
    });
  },
  
  getSetting: (id: string): Promise<ConfigSetting | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSettings.find(setting => setting.id === id));
      }, 300);
    });
  },
  
  updateSetting: (setting: ConfigSetting): Promise<ConfigSetting> => {
    return new Promise((resolve) => {
      const index = mockSettings.findIndex(s => s.id === setting.id);
      if (index !== -1) {
        mockSettings[index] = setting;
        toast.success('Paramètre mis à jour avec succès');
        resolve(mockSettings[index]);
      } else {
        toast.error('Paramètre non trouvé');
        throw new Error('Paramètre non trouvé');
      }
    });
  }
};
