import { initTRPC, TRPCError } from '@trpc/server';
import { ContextType } from './context';

// Initialize tRPC
const t = initTRPC.context<ContextType>().create();

// Export middlewares and procedures
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

// Create protected procedure (requires authentication)
const isAuthed = middleware(({ ctx, next }) => {
  if (!ctx.req.headers.authorization) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      // Inferred auth user object
      user: { id: 'user-id' }, // Replace with actual auth logic
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed); 