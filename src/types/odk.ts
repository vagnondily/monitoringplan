
export interface OdkForm {
  id: string;
  name: string;
  version: string;
  isEncrypted: boolean;
  submissionCount: number;
  lastSubmission?: string;
}

export interface OdkSubmission {
  id: string;
  formId: string;
  submissionDate: string;
  data: Record<string, any>;
  status: 'complete' | 'incomplete' | 'encrypted';
}

export interface OdkBriefcaseConfig {
  path: string;
  storageDirectory: string;
  pullBefore?: boolean;
  decryptionKey?: string;
  useCombinedSources?: boolean;
  additionalSources?: string[];
  serverUrl?: string;
  username?: string;
  password?: string;
  formId?: string;
  lastSyncDate?: string;
  syncInterval?: 'hourly' | 'daily' | 'weekly' | 'manual';
  exportDirectory?: string;
  exportFormat?: 'csv' | 'json';
}

export interface OdkDecryptionKey {
  id: string;
  name: string;
  formId: string;
  key: string;
  createdAt: string;
}

export interface OdkBriefcaseConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    version: string;
    formsFound: number;
    encryptedForms: number;
  };
}

export interface OdkSyncResult {
  success: boolean;
  message: string;
  stats?: {
    formsProcessed: number;
    newSubmissions: number;
    updatedSubmissions: number;
    encryptedSubmissions: number;
    failedSubmissions: number;
  };
}
