import * as trpc from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserId } from '../lib/auth'; // Import getUserId
import { db } from '@/db'; // <-- IMPORT DB INSTANCE
import { ensureUserWorkspace } from './utils/workspace';
// Remove privy imports - no longer needed here
// import { getPrivyClient } from '../lib/auth';

// Define a simple logger interface (optional, but good practice)
export interface Logger {
  info: (payload: any, message: string) => void;
  error: (payload: any, message: string) => void;
  warn: (payload: any, message: string) => void;
}

// Context object to be passed to your tRPC procedures
export interface Context {
  req?: NextApiRequest;
  res?: NextApiResponse;
  // userId is typically added by the auth middleware (protectedProcedure)
  // We don't set it directly in createContext anymore.
  userId?: string | null;
  user?: any | null; // Full user object from Privy (cached in context)
  log: Logger; // Add logger to context type
  db: typeof db; // <-- ADD DB TYPE TO CONTEXT
  workspaceId?: string | null;
  workspaceMembershipId?: string | null;
}

// Define options type for flexibility
interface CreateContextOptions {
  req?: NextApiRequest;
  res?: NextApiResponse;
}

/**
 * Creates context for an incoming request.
 * This is typically called by the tRPC Next.js adapter.
 * It attempts to get the userId from the request headers/cookies.
 */
export const createContext = async ({
  req,
  res,
}: CreateContextOptions): Promise<Context> => {
  console.log('0xHypr - createContext called (with userId fetch attempt)');
  let userId: string | null = null;
  let user: any | null = null;
  let workspaceId: string | null = null;
  let workspaceMembershipId: string | null = null;
  try {
    // getUserId uses next/headers cookies() which works server-side
    userId = await getUserId();
    console.log(`0xHypr - userId fetched in context: ${userId}`);
    if (userId) {
      // Fetch and cache full user object from Privy ONCE per request
      // This avoids hitting rate limits from multiple getUser() calls
      try {
        const { getUser } = await import('@/lib/auth');
        user = await getUser();
        if (!user) {
          console.warn(`0xHypr - getUser returned null for userId: ${userId}`);
        }
      } catch (userError: any) {
        console.error('0xHypr - Error fetching user in context:', userError);
        // If rate limited, log but don't fail - we still have userId
        if (userError?.type === 'too_many_requests') {
          console.warn(
            '0xHypr - Rate limited by Privy, continuing with userId only',
          );
        }
      }
    }
  } catch (error) {
    console.error('0xHypr - Error fetching userId in context:', error);
  }

  // Simple console logger implementation
  const log: Logger = {
    info: (payload, message) =>
      console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
    error: (payload, message) =>
      console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
    warn: (payload, message) =>
      console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
  };

  return {
    req,
    res,
    userId, // Add userId to the context
    user, // Add cached user object to context
    log, // Add logger instance to context
    db, // <-- ADD DB INSTANCE TO RETURNED CONTEXT
    workspaceId,
    workspaceMembershipId,
  };
};

export type ContextType = trpc.inferAsyncReturnType<typeof createContext>;
