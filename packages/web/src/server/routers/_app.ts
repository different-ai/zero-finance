import { router } from '../create-router';
import { invoiceRouter } from './invoice-router';

export const appRouter = router({
  invoice: invoiceRouter,
  // Add other routers here
});

// Export type definition of API
export type AppRouter = typeof appRouter; 