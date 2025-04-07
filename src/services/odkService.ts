
import { toast } from 'sonner';

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
    { id: 'form1', name: 'Site Assessment Form' },
    { id: 'form2', name: 'Field Monitoring Report' },
    { id: 'form3', name: 'Beneficiary Registration' }
  ],
  'project2': [
    { id: 'form4', name: 'Nutrition Screening' },
    { id: 'form5', name: 'Food Distribution Tracking' }
  ],
  'project3': [
    { id: 'form6', name: 'MIARO Site Monitoring' },
    { id: 'form7', name: 'Community Feedback' }
  ],
  'project4': [
    { id: 'form8', name: 'Rapid Needs Assessment' },
    { id: 'form9', name: 'Emergency Response Tracking' }
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

  getFormData: async (formId: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (mockFormData[formId]) {
      return mockFormData[formId];
    }
    
    return getDefaultFormData(formId);
  },

  saveConfig: async (config: any) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('ODK config saved:', config);
    return { success: true };
  },

  syncData: async (config: any) => {
    // Simulate a longer API request for syncing
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('ODK data synced with config:', config);
    
    // 10% chance of random error for testing
    if (Math.random() < 0.1) {
      throw new Error('Simulated sync error');
    }
    
    return { success: true, message: 'Data synchronized successfully' };
  }
};
