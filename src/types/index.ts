
export interface Site {
  id: string;
  name: string;
  location: string;
  status: string;
  lastUpdate: string;
  ipAddress: string;
  manager: string;
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
