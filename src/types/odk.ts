
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
}

export interface OdkDecryptionKey {
  id: string;
  name: string;
  formId: string;
  key: string;
  createdAt: string;
}
