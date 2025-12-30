import type { EmailProvider, EmailProviderType } from './types';
import { ResendProvider } from './resend-provider';
import { SESProvider } from './ses-provider';

export * from './types';
export { ResendProvider } from './resend-provider';
export { SESProvider } from './ses-provider';

/**
 * Get the configured email provider based on EMAIL_PROVIDER env var.
 *
 * Usage:
 *   const provider = getEmailProvider();
 *   await provider.send({ from, to, subject, text });
 *
 * Environment variables:
 *   EMAIL_PROVIDER: 'resend' | 'ses' (default: 'resend')
 */
export function getEmailProvider(): EmailProvider {
  const rawProviderType = process.env.EMAIL_PROVIDER || 'resend';
  // Trim whitespace/newlines that might be in env var
  const providerType = rawProviderType.trim() as EmailProviderType;

  console.log(
    `[EmailProvider] Initializing provider: "${providerType}" (raw: "${rawProviderType}")`,
  );

  switch (providerType) {
    case 'resend':
      console.log('[EmailProvider] ✅ Using Resend provider');
      return new ResendProvider();
    case 'ses':
      console.log('[EmailProvider] Using AWS SES provider');
      return new SESProvider();
    default:
      console.warn(
        `[EmailProvider] Unknown provider "${providerType}", falling back to Resend`,
      );
      return new ResendProvider();
  }
}

// Singleton instance (lazy initialized)
let _emailProvider: EmailProvider | null = null;

/**
 * Get the singleton email provider instance.
 * Useful when you want to reuse the same client across requests.
 */
export function getEmailProviderSingleton(): EmailProvider {
  if (!_emailProvider) {
    _emailProvider = getEmailProvider();
  }
  return _emailProvider;
}
