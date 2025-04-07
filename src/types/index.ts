
export interface Site {
  id: string;
  name: string;
  location: string;
  status: string;
  lastUpdate: string;
  ipAddress: string;
  manager: string;
  // Nouveaux champs basés sur le format Excel
  subOfficeName?: string;
  antenne?: string;
  region?: string;
  district?: string;
  commune?: string;
  fokontany?: string;
  siteId?: string;
  gpsLatitude?: string;
  gpsLongitude?: string;
  activityCategory?: string;
  programArea?: string;
  activityTags?: string;
  securitySituation?: number;
  programmeSynergies?: number;
  modalityType?: string;
  beneficiaryNumber?: number;
  newPartner?: number;
  experiencedPartner?: number;
  lastVisitDate?: string;
  internalProcessIssue?: number;
  partnerReportIssue?: number;
  cfmIssue?: number;
  fraudCorruption?: number;
  finalScore?: number;
  requiredVisitInterval?: number;
  size?: number;
  lastVisitScore?: number;
  priority?: string;
  monthlyActivities?: {
    [key: string]: {
      active?: boolean;
      cpName?: string;
      planned?: boolean;
      actual?: boolean;
      missionReport?: string;
      modaReport?: string;
      missionary?: string;
    }
  };
  activeSite?: boolean;
  visitCount?: number;
  sitesToVisit?: number;
  monitoringPriority?: string;
  requiredFrequency?: string;
  // Nouveaux champs pour la planification
  planCount?: number;
  monthsRemaining?: number;
  sitesToBePlanned?: number;
  visitsToBePlanned?: number;
  sitesVisitedOnce?: number;
  sitesVisitedTwice?: number;
  sitesVisitedThreeTimes?: number;
  sitesVisitedFourOrMoreTimes?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  siteId: string;
  progress: number;
}

export interface ConfigSetting {
  id: string;
  name: string;
  value: string;
  description: string;
  category: string;
}

// Nouveau type pour les paramètres généraux
export interface OverarchingParameter {
  id: string;
  cspActivityNumber: string;
  fieldOffice: string;
  activityCategory: string;
  operationDuration: number;
  numberOfSites: number;
  riskLevel: number;
  minimumRequiredInterval: number;
  targetedNumberOfSites: number;
  feasibleNumberOfSites: number;
  adjustedRequiredInterval: number;
  feasibilityRatio: number;
}

// Format spécifique pour l'importation Excel
export interface ExcelImportFormat {
  subOfficeName: string;
  antenne: string;
  siteName: string;
  region: string;
  district: string;
  communes: string;
  fokontany: string;
  idSites: string;
  gpsLatitude: string;
  gpsLongitude: string;
  activityCategory: string;
  programmeArea: string;
  activityTags: string;
  securitySituation: number;
  programmeSynergies: number;
  modalityType: string;
  beneficiaryNumber: number;
  newPartner: number;
  experiencedPartner: number;
  lastVisitDate: string;
  internalProcessIssue: number;
  partnerReportIssue: number;
  cfmIssue: number;
  fraudCorruption: number;
  finalScore: number;
  requiredVisitInterval: number;
  size: number;
  lastVisitScore: number;
  priority: string;
  monthlyActivities: {
    [key: string]: {
      active: boolean;
      cpName: string;
      planned: boolean;
      actual: boolean;
      missionReport: string;
      modaReport: string;
      missionary: string;
    }
  };
}

// Adding workflow related interfaces
export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'draft' | 'archived';
  triggers: WorkflowTrigger[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'delay';
  config: Record<string, any>;
  nextSteps: string[];
  position: { x: number; y: number };
}

export interface WorkflowTrigger {
  id: string;
  type: 'event' | 'schedule' | 'manual';
  config: Record<string, any>;
}

// Adding integration, datasource, and notification interfaces
export interface Integration {
  id: string;
  name: string;
  type: 'odk' | 'tableau' | 'api' | 'custom';
  config: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'integration';
  config: Record<string, any>;
  schema?: DataSourceSchema;
  status: 'active' | 'inactive';
}

export interface DataSourceSchema {
  tables: DataSourceTable[];
}

export interface DataSourceTable {
  name: string;
  columns: DataSourceColumn[];
}

export interface DataSourceColumn {
  name: string;
  type: string;
  nullable: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'task';
  date: string;
  read: boolean;
  actionLink: string | null;
  actionText: string | null;
}

export interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  createdAt: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  active: boolean;
  lastLogin: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'canceled';
  priority: 'high' | 'medium' | 'low';
  completedAt: string | null;
}
