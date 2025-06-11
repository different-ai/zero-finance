export const POSTHOG_HOST = 'https://us.i.posthog.com';

export function getPostHogKey(): string {
  // Prefer the env-provided key so it can vary between environments.
  // Falls back to the public project key that works in all environments.
  return process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_HxAOuIz9mTAqksVrWCEH5eJmRCZf4Ehd4TINbivkvoI';
}

export const POSTHOG_API_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || POSTHOG_HOST;
