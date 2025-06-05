import { router, publicProcedure } from '../create-router';
import { invoiceRouter } from './invoice-router';
import { fundingSourceRouter } from './funding-source-router';
import { allocationsRouter } from './allocations-router';
import { userSafesRouter } from './settings/user-safes';
import { bankAccountsRouter } from './settings/bank-accounts-router';
import { userSettingsRouter } from './settings/user-settings-router';
import { safeRouter } from './safe-router';
import { onboardingRouter } from './onboarding-router';
import { alignRouter } from './align-router';
import { adminRouter } from './admin-router';
import { allocationStrategyRouter } from './allocation-strategy-router';
import { userRouter } from './user-router';
import { earnRouter } from './earn-router';
import { inboxRouter } from './inbox-router';
import { actionLedgerRouter } from './action-ledger';
import { inboxCardsRouter } from './inbox-cards-router';

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
    userSettings: userSettingsRouter,
  }),
  align: alignRouter,
  admin: adminRouter,
  allocationStrategy: allocationStrategyRouter,
  user: userRouter,
  earn: earnRouter,
  inbox: inboxRouter,
  inboxCards: inboxCardsRouter,
  actionLedger: actionLedgerRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
