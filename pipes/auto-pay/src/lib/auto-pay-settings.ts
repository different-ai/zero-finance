import type { PaymentMethod } from '@/types/payment';

export interface AutoPaySettings {
  wiseApiKey?: string;
  wiseProfileId?: string;
  mercuryApiKey?: string;
  mercuryAccountId?: string;
}

export interface ConfigStatus {
  isConfigured: boolean;
  missing: string[];
}

export interface ConfigurationStatus {
  wise: ConfigStatus;
  mercury: ConfigStatus;
  isAnyConfigured: boolean;
  availableMethods: PaymentMethod[];
}

export function getConfigurationStatus(settings?: { customSettings?: { 'auto-pay'?: AutoPaySettings } }): ConfigurationStatus {
  const customSettings = settings?.customSettings?.['auto-pay'];
    
  const wiseConfig = {
    isConfigured: !!(customSettings?.wiseApiKey && customSettings?.wiseProfileId),
    missing: [] as string[],
  };

  const mercuryConfig = {
    isConfigured: !!(customSettings?.mercuryApiKey && customSettings?.mercuryAccountId),
    missing: [] as string[],
  };

  if (!customSettings?.wiseApiKey) wiseConfig.missing.push('Wise API Key');
  if (!customSettings?.wiseProfileId) wiseConfig.missing.push('Wise Profile ID');
  if (!customSettings?.mercuryApiKey) mercuryConfig.missing.push('Mercury API Key');
  if (!customSettings?.mercuryAccountId) mercuryConfig.missing.push('Mercury Account ID');

  return {
    wise: wiseConfig,
    mercury: mercuryConfig,
    isAnyConfigured: wiseConfig.isConfigured || mercuryConfig.isConfigured,
    availableMethods: [
      ...(wiseConfig.isConfigured ? ['wise' as const] : []),
      ...(mercuryConfig.isConfigured ? ['mercury' as const] : []),
    ],
  };
}
