import { router, publicProcedure } from '../create-router';
import { invoiceRouter } from './invoice-router';
import { fundingSourceRouter } from './funding-source-router';
import { allocationsRouter } from './allocations-router';
import { userSafesRouter } from './settings/user-safes';
import { bankAccountsRouter } from './settings/bank-accounts-router';
import { safeRouter } from './safe-router';
import { onboardingRouter } from './onboarding-router';
import { companyProfileRouter } from './company-profile-router';
import { alignRouter } from './align-router';
import { adminRouter } from './admin-router';
// import { settingsRouter } from './settings/settings-router';
// import { offrampRouter } from './offramp-router'; // Commenting out potentially missing router
import { allocationStrategyRouter } from './allocation-strategy-router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  invoice: invoiceRouter,
  fundingSource: fundingSourceRouter,
  allocations: allocationsRouter,
  safe: safeRouter,
  onboarding: onboardingRouter,
  settings: router({
    userSafes: userSafesRouter,
    bankAccounts: bankAccountsRouter,
  }),
  companyProfile: companyProfileRouter,
  align: alignRouter,
  admin: adminRouter,
  allocationStrategy: allocationStrategyRouter,
  // offramp: offrampRouter, // Commenting out potentially missing router
});

// Export type definition of API
export type AppRouter = typeof appRouter;
