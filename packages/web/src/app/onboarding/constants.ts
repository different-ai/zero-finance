import { featureConfig } from '@/lib/feature-config';

// Define our steps and their corresponding routes
export const steps = [
  { name: 'Activate Primary Account', path: '/onboarding/create-safe' },
  ...(featureConfig.kyc.required
    ? [
        { name: 'Prepare Verification', path: '/onboarding/info' },
        { name: 'Verify Identity', path: '/onboarding/kyc' },
      ]
    : []),
  { name: 'Complete', path: '/onboarding/complete' },
];
