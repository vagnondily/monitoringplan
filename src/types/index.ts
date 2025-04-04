
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
