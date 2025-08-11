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

// Export router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Create protected procedure (requires authentication)
const isAuthed = middleware(async ({ ctx, next }) => {
  let user = null;
  let privyDid: string | null = null;
  let isCliAuth = false;

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

  console.log('[Auth] Authorization header present:', !!authHeader);

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    console.log('[Auth] Attempting CLI token validation...');
    user = await validateCliToken(token);
    if (user) {
      privyDid = user.id;
      isCliAuth = true;
      console.log(`[Auth] CLI authentication successful for user: ${privyDid}`);
    } else {
      console.log('[Auth] CLI token validation failed');
    }
  }

  // If no CLI token, fall back to cookie-based auth (web authentication)
  if (!user) {
    console.log('[Auth] Attempting Privy cookie authentication...');
    user = await getUser();
    if (user && user.id) {
      privyDid = user.id;
      console.log(`[Auth] Privy authentication successful for user: ${privyDid}`);
    } else {
      console.log('[Auth] Privy authentication failed');
    }
  }

  if (!user || !privyDid) {
    // If neither auth method succeeded, authentication failed
    console.log('[Auth] Authentication failed - no valid user');
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
      console.log(`[Auth] User with DID ${privyDid} not found in DB. Creating...`);
      await db.insert(users).values({ privyDid: privyDid });
      console.log(`[Auth] User with DID ${privyDid} created successfully.`);
    } else {
      console.log(`[Auth] User ${privyDid} found in database`);
    }
  } catch (dbError) {
    console.error(`[Auth] Database error during user check/creation for DID ${privyDid}:`, dbError);
    // Handle potential DB errors, e.g., connection issues
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database error during authentication',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: {
        id: privyDid,
        email: user.email,
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// Middleware helper
function middleware<T>(fn: T): T {
  return fn;
}
