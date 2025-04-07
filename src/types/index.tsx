
export interface Site {
  id: string;
  name: string;
  location: string;
  status: 'Actif' | 'Inactif' | 'En attente';
  lastUpdate: string;
  lastVisitDate?: string;
  priority?: 'high' | 'medium' | 'low';
  // Additional fields from spreadsheet
  subOffice?: string;
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
  issuesFromMonitoring?: number;
  partnerReportIssue?: number;
  cfmIssue?: number;
  fraudAndCorruption?: number;
  finalScore?: number;
  adjustedInterval?: number;
  sizeCaseload?: number;
  scoreLastVisit?: number;
  urgentRedFlags?: number;
  newPartnerTimeSinceLastVisit?: number;
  average?: number;
  priority?: string;
  activeSite?: boolean;
  numberSitesToVisit?: number;
  monitoringPriority?: string;
  minimumRequiredFrequency?: number;
  planCount?: number;
  monthsRemaining?: number;
  sitesToBePlanned?: number;
  visitsToBePlanned?: number;
  visitCount?: number;
  sitesVisitedOnce?: number;
  sitesVisitedTwice?: number;
  sitesVisitedThreeTimes?: number;
  sitesVisitedFourOrMore?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'En cours' | 'Terminé' | 'En attente';
  startDate: string;
  endDate: string;
  progress: number;
  sites?: string[];
  partners?: string[];
  budget?: number;
  actualSpent?: number;
}

export interface ConfigSetting {
  id: string;
  name: string;
  description: string;
  value: string;
  category: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
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

export interface OdkProject {
  id: string;
  name: string;
}

export interface OdkForm {
  id: string;
  name: string;
}

export interface OdkFormData {
  columns: string[];
  data: Record<string, any>[];
}

export interface MonthPlanningData {
  active: boolean;
  cpName: string;
  planned: boolean;
  actual: boolean;
  missionReport: string;
  modaReport: string;
  missionary: string;
}

export interface SiteMonthlyPlanning {
  [month: string]: MonthPlanningData;
}

// Workflow related interfaces
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
