
/**
 * Server Configuration for Windows Server Deployment
 * This file contains all necessary configuration for deploying the application
 * to a Windows server environment.
 */

// Base API URL - change this to match your server environment
export const API_BASE_URL = window.location.origin;

// Server configuration
export const serverConfig = {
  // Application details
  appName: "Monitoring and Evaluation System",
  appVersion: "1.0.0",
  
  // API Endpoints
  apiEndpoints: {
    users: `${API_BASE_URL}/api/users`,
    sites: `${API_BASE_URL}/api/sites`,
    projects: `${API_BASE_URL}/api/projects`,
    reports: `${API_BASE_URL}/api/reports`,
    parameters: `${API_BASE_URL}/api/parameters`,
    odk: `${API_BASE_URL}/api/odk`,
    workflow: `${API_BASE_URL}/api/workflow`,
    messaging: `${API_BASE_URL}/api/messaging`,
    integrations: `${API_BASE_URL}/api/integrations`,
  },
  
  // Server limits and settings
  limits: {
    maxUploadSize: 50 * 1024 * 1024, // 50MB
    maxConcurrentRequests: 20,
    requestTimeout: 60000, // 60 seconds
  },
  
  // Cache configuration
  cache: {
    enabled: true,
    maxAge: 3600, // 1 hour in seconds
  },
  
  // Logging configuration
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    filePath: 'logs/app.log',
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  },
  
  // Static file serving
  static: {
    path: '/static',
    maxAge: 86400, // 1 day in seconds
  },
  
  // Windows Server specific settings
  windowsServer: {
    iisConfiguration: {
      applicationPoolName: "MonitoringEvaluationAppPool",
      authentication: "Windows",
      anonymousAuthentication: true,
      windowsAuthentication: false,
    },
    
    // Web.config settings for IIS
    webConfig: {
      customErrors: false,
      staticCompression: true,
      dynamicCompression: true,
    },
    
    // Local storage path for file uploads and data
    localStoragePath: "C:\\ProgramData\\MonitoringEvaluationApp\\",
  }
};

export default serverConfig;
