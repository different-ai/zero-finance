import { router } from '../create-router';
import { invoiceRouter } from './invoice-router';
import { fundingSourceRouter } from './funding-source-router';
import { allocationsRouter } from './allocations-router';
import { userSafesRouter } from './settings/user-safes';
import { safeRouter } from './safe-router';
import { onboardingRouter } from './onboarding-router';
import { companyProfileRouter } from './company-profile-router';
import { alignRouter } from './align-router';
import { adminRouter } from './admin-router';
import { relayRouter } from './relay';

// Test router for superjson functionality

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
  align: alignRouter,
  admin: adminRouter,
  relay: relayRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
