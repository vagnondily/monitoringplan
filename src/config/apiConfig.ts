
import { API_BASE_URL } from './serverConfig';

// API Configuration
export const API_CONFIG = {
  // Base API URL
  baseUrl: API_BASE_URL,
  
  // API Endpoints
  endpoints: {
    // Auth
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      refreshToken: '/api/auth/refresh-token',
      requestPasswordReset: '/api/auth/request-reset',
      resetPassword: '/api/auth/reset-password',
    },
    
    // Users
    users: {
      base: '/api/users',
      current: '/api/users/me',
      byId: (id: string) => `/api/users/${id}`,
      roles: '/api/users/roles',
    },
    
    // Sites
    sites: {
      base: '/api/sites',
      byId: (id: string) => `/api/sites/${id}`,
      byRegion: (region: string) => `/api/sites/region/${region}`,
      byFieldOffice: (office: string) => `/api/sites/field-office/${office}`,
      import: '/api/sites/import',
      export: '/api/sites/export',
    },
    
    // Projects
    projects: {
      base: '/api/projects',
      byId: (id: string) => `/api/projects/${id}`,
      sites: (projectId: string) => `/api/projects/${projectId}/sites`,
      addSite: (projectId: string) => `/api/projects/${projectId}/sites`,
      removeSite: (projectId: string, siteId: string) => `/api/projects/${projectId}/sites/${siteId}`,
    },
    
    // Planning
    planning: {
      base: '/api/planning',
      configuration: '/api/planning/configuration',
      sitesMonitoring: '/api/planning/sites-monitoring',
      distribution: '/api/planning/distribution',
      outcomes: '/api/planning/outcomes',
      staffLeaves: '/api/planning/staff-leaves',
    },
    
    // Actual Data
    actualData: {
      base: '/api/actual-data',
      output: '/api/actual-data/output',
      outcome: '/api/actual-data/outcome',
      processMonitoring: '/api/actual-data/process-monitoring',
    },
    
    // ODK Integration
    odk: {
      base: '/api/odk',
      briefcase: '/api/odk/briefcase',
      forms: '/api/odk/forms',
      submissions: '/api/odk/submissions',
      decrypt: '/api/odk/decrypt',
    },
    
    // Reports
    reports: {
      base: '/api/reports',
      outcomes: '/api/reports/outcomes',
      processMonitoring: '/api/reports/process-monitoring',
      meReport: '/api/reports/me-report',
      siteMap: '/api/reports/site-map',
      export: (reportId: string, format: 'pdf' | 'excel') => 
        `/api/reports/${reportId}/export/${format}`,
    },
    
    // Tools
    tools: {
      workflow: {
        base: '/api/tools/workflow',
        byId: (id: string) => `/api/tools/workflow/${id}`,
      },
      reportTemplate: {
        base: '/api/tools/report-template',
        byId: (id: string) => `/api/tools/report-template/${id}`,
      },
    },
    
    // Settings
    settings: {
      base: '/api/settings',
      general: '/api/settings/general',
      appearance: '/api/settings/appearance',
      calculations: '/api/settings/calculations',
      odkBriefcase: '/api/settings/odk-briefcase',
      api: '/api/settings/api',
    },
    
    // Parameters
    parameters: {
      base: '/api/parameters',
      byId: (id: string) => `/api/parameters/${id}`,
      byCategory: (category: string) => `/api/parameters/category/${category}`,
    },
    
    // Overarching Parameters
    overarchingParameters: {
      base: '/api/overarching-parameters',
      byId: (id: string) => `/api/overarching-parameters/${id}`,
    },
  },
  
  // Request timeouts (in milliseconds)
  timeouts: {
    default: 30000, // 30 seconds
    upload: 120000, // 2 minutes
    download: 120000, // 2 minutes
  },
  
  // Pagination defaults
  pagination: {
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
  },
};

export default API_CONFIG;
