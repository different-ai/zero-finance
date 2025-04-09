import { router } from '../create-router';
import { invoiceRouter } from './invoice-router';
import { userSafesRouter } from './user-safes';
import { fundingSourceRouter } from './funding-source-router';

export const appRouter = router({
  invoice: invoiceRouter,
  userSafes: userSafesRouter,
  fundingSource: fundingSourceRouter,
  // Add other routers here
});

// Export type definition of API
export type AppRouter = typeof appRouter;