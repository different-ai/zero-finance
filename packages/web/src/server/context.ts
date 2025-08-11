import * as trpc from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserId } from '../lib/auth'; // Import getUserId
import { db } from '@/db'; // <-- IMPORT DB INSTANCE

// Define a simple logger interface (optional, but good practice)
export interface Logger {
  info: (payload: any, message: string) => void;
  error: (payload: any, message: string) => void;
  warn: (payload: any, message: string) => void;
}

// Context object to be passed to your tRPC procedures
export interface Context {
  req?: NextApiRequest | Request; // Support both Next.js API and Fetch API
  res?: NextApiResponse;
  // userId is typically added by the auth middleware (protectedProcedure)
  // We don't set it directly in createContext anymore.
  userId?: string | null; 
  log: Logger; // Add logger to context type
  db: typeof db; // <-- ADD DB TYPE TO CONTEXT
  user?: { id: string; email?: { address?: string } }; // Add user object for middleware
}

// Define options type for flexibility
interface CreateContextOptions {
  req?: NextApiRequest;
  res?: NextApiResponse;
}

/**
 * Creates context for an incoming request.
 * This is typically called by the tRPC Next.js adapter.
 * For CLI requests, the auth middleware will handle authentication.
 * For web requests, we attempt to get the userId from cookies.
 */
export const createContext = async ({ req, res }: CreateContextOptions): Promise<Context> => {
  // Check if this is a CLI request (has Bearer token)
  let authHeader: string | undefined;
  if (req && 'headers' in req) {
    if (typeof req.headers.get === 'function') {
      // Fetch API Request
      authHeader = (req as Request).headers.get('authorization') || undefined;
    } else if (req.headers) {
      // Next.js API Request
      const headers = (req as NextApiRequest).headers;
      authHeader = Array.isArray(headers.authorization) 
        ? headers.authorization[0] 
        : headers.authorization;
    }
  }

  let userId: string | null = null;
  
  // Only try to get userId from cookies if there's no Bearer token
  // CLI requests will have their auth handled by middleware
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('API Route: Context creation for web request (no Bearer token)');
    try {
      // getUserId uses next/headers cookies() which works server-side
      userId = await getUserId(); 
      console.log(`API Route: Context creation for user: ${userId}`);
    } catch (error) {
      console.error('API Route: Error fetching userId in context:', error);
    }
  } else {
    console.log('API Route: Context creation for CLI request (Bearer token present)');
    // Don't set userId here - let the middleware handle it
  }

  // Simple console logger implementation
  const log: Logger = {
    info: (payload, message) => console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
    error: (payload, message) => console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
    warn: (payload, message) => console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
  };

  return {
    req,
    res,
    userId, // This will be null for CLI requests (middleware will set it)
    log, // Add logger instance to context
    db, // <-- ADD DB INSTANCE TO RETURNED CONTEXT
  };
};

export type ContextType = trpc.inferAsyncReturnType<typeof createContext>;
