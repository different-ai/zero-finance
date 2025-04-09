import { router, publicProcedure } from '../create-router';
import { invoiceRouter } from './invoice-router';
import { z } from 'zod';

export const appRouter = router({
  // Merge other routers
  invoice: invoiceRouter,
  
  // Health check endpoint
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }),
  
  // Example hello endpoint
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text ?? 'world'}`,
      };
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter; 