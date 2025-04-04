import { Site, Project, ConfigSetting, ExcelImportFormat } from '@/types';
import { toast } from 'sonner';

// Données de simulation pour les sites
const mockSites: Site[] = [
  {
    id: '1',
    name: 'Site Antananarivo',
    location: 'Antananarivo, Madagascar',
    region: 'Analamanga',
    district: 'Antananarivo Renivohitra',
    commune: 'Antananarivo',
    status: 'Actif',
    lastUpdate: '2025-04-03',
    ipAddress: '192.168.1.1',
    manager: 'Jean Dupont',
    activeSite: true,
    sitesToVisit: 3,
    visitCount: 1,
    monitoringPriority: 'High',
    requiredFrequency: 'Monthly',
    lastVisitDate: '2025-03-15',
    finalScore: 2,
    priority: 'High'
  },
  {
    id: '2',
    name: 'Site Toamasina',
    location: 'Toamasina, Madagascar',
    region: 'Atsinanana',
    district: 'Toamasina I',
    commune: 'Toamasina',
    status: 'En maintenance',
    lastUpdate: '2025-04-02',
    ipAddress: '192.168.1.2',
    manager: 'Marie Laurent',
    activeSite: true,
    sitesToVisit: 2,
    visitCount: 0,
    monitoringPriority: 'Medium',
    requiredFrequency: 'Quarterly',
    lastVisitDate: '2025-02-10',
    finalScore: 1,
    priority: 'Normal'
  },
  {
    id: '3',
    name: 'Site Mahajanga',
    location: 'Mahajanga, Madagascar',
    region: 'Boeny',
    district: 'Mahajanga I',
    commune: 'Mahajanga',
    status: 'Actif',
    lastUpdate: '2025-04-01',
    ipAddress: '192.168.1.3',
    manager: 'Pierre Martin',
    activeSite: false,
    sitesToVisit: 0,
    visitCount: 0,
    monitoringPriority: 'Low',
    requiredFrequency: 'Biannual',
    finalScore: 0,
    priority: 'Low'
  },
  {
    id: '4',
    name: 'Site Fianarantsoa',
    location: 'Fianarantsoa, Madagascar',
    region: 'Haute Matsiatra',
    district: 'Fianarantsoa I',
    commune: 'Fianarantsoa',
    status: 'Actif',
    lastUpdate: '2025-03-28',
    ipAddress: '192.168.1.4',
    manager: 'Sophie Rakoto',
    activeSite: true,
    sitesToVisit: 4,
    visitCount: 2,
    monitoringPriority: 'High',
    requiredFrequency: 'Monthly',
    lastVisitDate: '2025-03-25',
    finalScore: 2,
    priority: 'High'
  },
  {
    id: '5',
    name: 'Site Toliara',
    location: 'Toliara, Madagascar',
    region: 'Atsimo-Andrefana',
    district: 'Toliara I',
    commune: 'Toliara',
    status: 'Inactif',
    lastUpdate: '2025-03-20',
    ipAddress: '192.168.1.5',
    manager: 'Luc Andria',
    activeSite: false,
    sitesToVisit: 0,
    visitCount: 0,
    monitoringPriority: 'Low',
    requiredFrequency: 'Annual',
    finalScore: 0,
    priority: 'Low'
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
        lastUpdate: new Date().toISOString().split('T')[0],
        visitCount: site.visitCount || 0,
        sitesToVisit: site.sitesToVisit || 0
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
      // Dans une application réelle, nous analyserions ici le fichier Excel
      // et convertirions les données en objets Site
      
      setTimeout(() => {
        // Simulation d'ajout de nouveaux sites
        const newSites: Site[] = [
          {
            id: `${mockSites.length + 1}`,
            name: 'Site Importé 1',
            location: 'Antsirabe, Madagascar',
            region: 'Vakinankaratra',
            district: 'Antsirabe I',
            commune: 'Antsirabe',
            status: 'Actif',
            lastUpdate: new Date().toISOString().split('T')[0],
            ipAddress: '192.168.1.6',
            manager: 'Importé Manager 1',
            activeSite: true,
            sitesToVisit: 2,
            visitCount: 0,
            monitoringPriority: 'Medium',
            requiredFrequency: 'Quarterly'
          },
          {
            id: `${mockSites.length + 2}`,
            name: 'Site Importé 2',
            location: 'Ambositra, Madagascar',
            region: 'Amoron\'i Mania',
            district: 'Ambositra',
            commune: 'Ambositra',
            status: 'Actif',
            lastUpdate: new Date().toISOString().split('T')[0],
            ipAddress: '192.168.1.7',
            manager: 'Importé Manager 2',
            activeSite: true,
            sitesToVisit: 3,
            visitCount: 1,
            monitoringPriority: 'High',
            requiredFrequency: 'Monthly'
          }
        ];
        
        // Ajouter les nouveaux sites à notre liste simulée
        mockSites.push(...newSites);
        
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
