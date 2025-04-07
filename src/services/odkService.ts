
import { toast } from 'sonner';
import { OdkBriefcaseConfig, OdkForm, OdkSubmission, OdkDecryptionKey } from '@/types/odk';

// Mock data for ODK projects
const mockProjects = [
  { id: 'project1', name: 'Madagascar Field Operations' },
  { id: 'project2', name: 'Nutrition Program' },
  { id: 'project3', name: 'MIARO Project' },
  { id: 'project4', name: 'Disaster Response' }
];

// Mock data for ODK forms
const mockForms = {
  'project1': [
    { 
      id: 'form1', 
      name: 'Site Assessment Form', 
      version: '1.2.0',
      isEncrypted: true, 
      submissionCount: 42,
      lastSubmission: '2025-03-12T08:30:00Z'
    },
    { 
      id: 'form2', 
      name: 'Field Monitoring Report',
      version: '2.0.1',
      isEncrypted: false, 
      submissionCount: 87,
      lastSubmission: '2025-04-05T14:20:00Z'
    },
    { 
      id: 'form3', 
      name: 'Beneficiary Registration',
      version: '1.1.5',
      isEncrypted: true, 
      submissionCount: 29,
      lastSubmission: '2025-03-28T09:15:00Z'
    }
  ],
  'project2': [
    { 
      id: 'form4', 
      name: 'Nutrition Screening',
      version: '3.0.0',
      isEncrypted: false, 
      submissionCount: 156,
      lastSubmission: '2025-04-01T16:45:00Z'
    },
    { 
      id: 'form5', 
      name: 'Food Distribution Tracking',
      version: '2.1.3',
      isEncrypted: true, 
      submissionCount: 58,
      lastSubmission: '2025-03-25T11:10:00Z'
    }
  ],
  'project3': [
    { 
      id: 'form6', 
      name: 'MIARO Site Monitoring',
      version: '1.0.8',
      isEncrypted: false, 
      submissionCount: 112,
      lastSubmission: '2025-04-03T13:25:00Z'
    },
    { 
      id: 'form7', 
      name: 'Community Feedback',
      version: '2.2.1',
      isEncrypted: true, 
      submissionCount: 43,
      lastSubmission: '2025-03-20T10:05:00Z'
    }
  ],
  'project4': [
    { 
      id: 'form8', 
      name: 'Rapid Needs Assessment',
      version: '1.3.2',
      isEncrypted: true, 
      submissionCount: 37,
      lastSubmission: '2025-03-15T15:30:00Z'
    },
    { 
      id: 'form9', 
      name: 'Emergency Response Tracking',
      version: '2.0.5',
      isEncrypted: false, 
      submissionCount: 75,
      lastSubmission: '2025-04-02T09:50:00Z'
    }
  ]
};

// Mock form data
const mockFormData = {
  'form1': {
    columns: ['id', 'site_name', 'location', 'date_assessed', 'assessor', 'status'],
    data: Array.from({ length: 25 }, (_, i) => ({
      id: `site${i+1}`,
      site_name: `Site ${i+1}`,
      location: ['Toliara', 'Antananarivo', 'Fianarantsoa', 'Mahajanga'][Math.floor(Math.random() * 4)],
      date_assessed: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      assessor: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Alice Williams'][Math.floor(Math.random() * 4)],
      status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)]
    }))
  },
  'form6': {
    columns: ['id', 'site_id', 'visit_date', 'monitor', 'beneficiaries_present', 'food_stock', 'issues_reported'],
    data: Array.from({ length: 30 }, (_, i) => ({
      id: `visit${i+1}`,
      site_id: `MIARO${Math.floor(Math.random() * 10) + 1}`,
      visit_date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      monitor: ['TOHANA', 'WFP Staff', 'Partner NGO'][Math.floor(Math.random() * 3)],
      beneficiaries_present: Math.floor(Math.random() * 200) + 50,
      food_stock: ['Adequate', 'Low', 'Depleted'][Math.floor(Math.random() * 3)],
      issues_reported: ['None', 'Distribution delay', 'Quality concerns', 'Access issues'][Math.floor(Math.random() * 4)]
    }))
  }
};

// Mock decryption keys
const mockDecryptionKeys: OdkDecryptionKey[] = [
  { 
    id: 'key-1', 
    name: 'Site Assessment Key', 
    formId: 'form1', 
    key: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgw...', 
    createdAt: '2025-01-10T09:00:00Z' 
  },
  { 
    id: 'key-2', 
    name: 'Food Distribution Key', 
    formId: 'form5', 
    key: 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcw...', 
    createdAt: '2025-02-15T14:30:00Z' 
  }
];

// Default data for other forms
const getDefaultFormData = (formId: string) => ({
  columns: ['id', 'submission_date', 'submitter', 'location', 'status'],
  data: Array.from({ length: 15 }, (_, i) => ({
    id: `submission${i+1}`,
    submission_date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    submitter: ['Field Officer', 'Program Manager', 'Data Collector', 'Supervisor'][Math.floor(Math.random() * 4)],
    location: ['Atsimo-Andrefana', 'Analamanga', 'Haute Matsiatra', 'Boeny'][Math.floor(Math.random() * 4)],
    status: ['Submitted', 'Verified', 'Rejected'][Math.floor(Math.random() * 3)]
  }))
});

export const odkService = {
  getProjects: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockProjects;
  },

  getFormsByProject: async (projectId: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockForms[projectId] || [];
  },

  getForms: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return Object.values(mockForms).flat();
  },

  getEncryptedForms: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 600));
    const allForms = Object.values(mockForms).flat();
    return allForms.filter(form => form.isEncrypted);
  },

  getDecryptionKeys: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDecryptionKeys;
  },

  saveDecryptionKey: async (key: Omit<OdkDecryptionKey, 'id' | 'createdAt'>) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newKey = {
      ...key,
      id: `key-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    mockDecryptionKeys.push(newKey);
    return newKey;
  },

  deleteDecryptionKey: async (keyId: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockDecryptionKeys.findIndex(k => k.id === keyId);
    if (index !== -1) {
      mockDecryptionKeys.splice(index, 1);
    }
    return { success: true };
  },

  getFormData: async (formId: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (mockFormData[formId]) {
      return mockFormData[formId];
    }
    
    return getDefaultFormData(formId);
  },

  saveConfig: async (config: OdkBriefcaseConfig) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('ODK config saved:', config);
    return { success: true, config };
  },

  testBriefcaseConfig: async (config: OdkBriefcaseConfig) => {
    // Simulate API request delay for testing connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify basic configuration values
    if (!config.path || !config.storageDirectory) {
      throw new Error('Path to ODK Briefcase and storage directory are required');
    }
    
    // Simulate a successful connection
    return { 
      success: true, 
      message: 'ODK Briefcase configuration test successful',
      details: {
        version: '1.18.0',
        formsFound: 12,
        encryptedForms: 5
      }
    };
  },

  syncData: async (config: OdkBriefcaseConfig) => {
    // Simulate a longer API request for syncing
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('ODK data synced with config:', config);
    
    // 10% chance of random error for testing
    if (Math.random() < 0.1) {
      throw new Error('Simulated sync error');
    }
    
    const syncResults = {
      success: true, 
      message: 'Data synchronized successfully',
      stats: {
        formsProcessed: 8,
        newSubmissions: Math.floor(Math.random() * 30) + 5,
        updatedSubmissions: Math.floor(Math.random() * 15),
        encryptedSubmissions: config.decryptionKey ? Math.floor(Math.random() * 10) : 0,
        failedSubmissions: Math.floor(Math.random() * 3)
      }
    };
    
    return syncResults;
  },
  
  getSubmissions: async (formId: string): Promise<OdkSubmission[]> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock submissions
    return Array.from({ length: 20 }, (_, i) => ({
      id: `submission-${i+1}`,
      formId,
      submissionDate: new Date(
        2025, 
        Math.floor(Math.random() * 4), 
        Math.floor(Math.random() * 28) + 1,
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60)
      ).toISOString(),
      data: {
        // Sample data depending on the form
        [`question_${i % 5 + 1}`]: `Answer ${i % 3 + 1}`,
        location: ['Toliara', 'Antananarivo', 'Fianarantsoa', 'Mahajanga'][Math.floor(Math.random() * 4)],
        timestamp: Date.now() - Math.floor(Math.random() * 10000000),
        notes: i % 4 === 0 ? 'Some additional notes here' : undefined
      },
      status: Math.random() > 0.2 ? 'complete' : (Math.random() > 0.5 ? 'incomplete' : 'encrypted')
    }));
  }
};
