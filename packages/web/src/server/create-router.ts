import { initTRPC, TRPCError } from '@trpc/server';
import { ContextType } from './context';
import { getUser } from '@/lib/auth';
import { db } from '@/db';
import { ensureUserWorkspace } from './utils/workspace';
import superjson from 'superjson';

// Initialize tRPC
const t = initTRPC.context<ContextType>().create({
  transformer: superjson,
});

// Export middlewares and procedures
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

// Create protected procedure (requires authentication)
const isAuthed = middleware(async ({ ctx, next }) => {
  // Use userId and user from context (already verified and fetched in createContext)
  // This avoids hitting Privy's rate limit by calling getUser() on every request
  const privyDid = ctx.userId;

  if (!privyDid) {
    // If userId is not in context, authentication failed
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  // Use cached user from context (fetched once in createContext)
  let user = ctx.user;

  // If user is null but we have userId, create minimal user object
  // This handles rate limiting scenarios
  if (!user && privyDid) {
    console.warn(
      `0xHypr - User object not in context for ${privyDid}, creating minimal user`,
    );
    user = { id: privyDid };
  }

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Failed to fetch user details',
    });
  }

  const database = (ctx as { db?: typeof db } | undefined)?.db ?? db;

  let workspaceId: string | null = ctx.workspaceId ?? null;
  let workspaceMembershipId: string | null = ctx.workspaceMembershipId ?? null;

  try {
    const { workspaceId: ensuredWorkspaceId, membership } =
      await ensureUserWorkspace(database, privyDid);
    workspaceId = ensuredWorkspaceId;
    workspaceMembershipId = membership.id;
  } catch (workspaceError) {
    console.error(
      `Database error ensuring workspace for DID ${privyDid}:`,
      workspaceError,
    );
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to initialise workspace context.',
      cause: workspaceError,
    });
  }

  // Pass the authenticated user object to the context
  return next({
    ctx: {
      ...ctx,
      // Pass the full user object to the context
      user,
      workspaceId,
      workspaceMembershipId,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// Create a context function for the API route
export const createContext = async ({ req }: { req: Request }) => {
  // Try to get user but don't throw if authentication fails
  // This allows public routes to work without auth
  let user = null;
  try {
    user = await getUser();
  } catch (error) {
    console.warn(
      'Failed to get user in tRPC context, continuing as unauthenticated',
      error,
    );
    // Don't throw - just continue with null user
  }

  return {
    req,
    user, // Will be null if not authenticated
  };
};
