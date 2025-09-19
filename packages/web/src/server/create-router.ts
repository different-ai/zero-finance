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
  // The getUser function already handles token verification
  const user = await getUser();

  if (!user || !user.id) {
    // If getUser returns null or no id, authentication failed
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  const privyDid = user.id;

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
    console.warn('Failed to get user in tRPC context, continuing as unauthenticated', error);
    // Don't throw - just continue with null user
  }
  
  return {
    req,
    user, // Will be null if not authenticated
  };
};
