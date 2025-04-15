import { router } from '../create-router';
import { invoiceRouter } from './invoice-router';
import { fundingSourceRouter } from './funding-source-router';
import { allocationsRouter } from './allocations-router';
import { userSafesRouter } from './settings/user-safes';
import { safeRouter } from './safe-router';
import { onboardingRouter } from './onboarding-router';
import { companyProfileRouter } from './company-profile-router';

export const appRouter = router({
  invoice: invoiceRouter,
  fundingSource: fundingSourceRouter,
  allocations: allocationsRouter,
  safe: safeRouter,
  onboarding: onboardingRouter,
  settings: router({
    userSafes: userSafesRouter,
  }),
  companyProfile: companyProfileRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;