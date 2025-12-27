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
 *   EMAIL_PROVIDER: 'resend' | 'ses' (default: 'ses')
 */
export function getEmailProvider(): EmailProvider {
  const providerType = (process.env.EMAIL_PROVIDER ||
    'ses') as EmailProviderType;

  switch (providerType) {
    case 'resend':
      return new ResendProvider();
    case 'ses':
      return new SESProvider();
    default:
      console.warn(
        `[EmailProvider] Unknown provider "${providerType}", falling back to SES`,
      );
      return new SESProvider();
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
