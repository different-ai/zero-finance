import { initTRPC, TRPCError } from '@trpc/server';
import { ContextType } from './context';
import { getUser } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import superjson from 'superjson';
import { validateCliToken } from './auth/cli-token';
import type { NextApiRequest } from 'next';

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
  let user = null;
  let privyDid: string | null = null;

  // First, check for Bearer token (CLI authentication)
  // Handle both Next.js API routes and Fetch API
  let authHeader: string | undefined;
  if (ctx.req && 'headers' in ctx.req) {
    if (typeof ctx.req.headers.get === 'function') {
      // Fetch API Request
      authHeader = (ctx.req as Request).headers.get('authorization') || undefined;
    } else if (ctx.req.headers) {
      // Next.js API Request
      const headers = (ctx.req as NextApiRequest).headers;
      authHeader = Array.isArray(headers.authorization) 
        ? headers.authorization[0] 
        : headers.authorization;
    }
  }

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    user = await validateCliToken(token);
    if (user) {
      privyDid = user.id;
    }
  }

  // If no CLI token, fall back to cookie-based auth (web authentication)
  if (!user) {
    user = await getUser();
    if (user && user.id) {
      privyDid = user.id;
    }
  }

  if (!user || !privyDid) {
    // If neither auth method succeeded, authentication failed
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    // Check if user exists in the database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.privyDid, privyDid),
      columns: { privyDid: true }, // Only need to check for existence
    });

    // If user doesn't exist, create them
    if (!existingUser) {
      console.log(`User with DID ${privyDid} not found in DB. Creating...`);
      await db.insert(users).values({ privyDid: privyDid });
      console.log(`User with DID ${privyDid} created successfully.`);
    }
  } catch (dbError) {
    console.error(`Database error during user check/creation for DID ${privyDid}:`, dbError);
    // Handle potential DB errors, e.g., connection issues
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database operation failed during authentication.',
      cause: dbError,
    });
  }

  // Pass the authenticated user object to the context
  return next({
    ctx: {
      ...ctx,
      // Pass the full user object to the context
      user: user, 
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
