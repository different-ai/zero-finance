import { initTRPC, TRPCError } from '@trpc/server';
import { ContextType } from './context';
import { getUser } from '@/lib/auth';

// Initialize tRPC
const t = initTRPC.context<ContextType>().create();

// Export middlewares and procedures
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

// Create protected procedure (requires authentication)
const isAuthed = middleware(async ({ ctx, next }) => {
  // The getUser function already handles token verification
  const user = await getUser(); 
  console.log('0xHypr', 'isAuthed middleware user:', user);

  if (!user) {
    // If getUser returns null, authentication failed
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  // Pass the authenticated user ID to the context
  return next({
    ctx: {
      ...ctx,
      // Add the authenticated user ID to the context
      user: { id: user.id }, 
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// Create a context function for the API route
export const createContext = async ({ req }: { req: Request }) => {
  // use privy to get user did
  const user = await getUser();
  console.log('0xHypr', 'user', user, 'but in createContext');
  // You can add session handling or other context here
  return {
    req,
    user: { id: user?.id }, // Replace with actual session management
  };
};
