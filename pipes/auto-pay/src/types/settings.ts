export interface MercurySettings {
  mercuryApiKey?: string;
  mercuryAccountId?: string;
}

export interface AutoPaySettings {
  mercuryApiKey?: string;
  mercuryAccountId?: string;
  enableProduction?: boolean;
  openaiApiKey?: string;
}

export interface CustomSettings {
  [key: string]: AutoPaySettings;
}

export interface Settings {
  customSettings?: CustomSettings;
  openaiApiKey?: string;
}

export interface UpdateSettingsParams {
  namespace: string;
  isPartialUpdate: boolean;
  value: Partial<AutoPaySettings>;
} 