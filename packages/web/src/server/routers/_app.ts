import { router } from '../create-router';
import { invoiceRouter } from './invoice-router';
import { fundingSourceRouter } from './funding-source-router';
import { allocationsRouter } from './allocations-router';
import { userSafesRouter } from './settings/user-safes';

export const appRouter = router({
  invoice: invoiceRouter,
  fundingSource: fundingSourceRouter,
  allocations: allocationsRouter,
  settings: router({
    userSafes: userSafesRouter,
  }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;