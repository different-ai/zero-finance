import * as trpc from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserId } from '../lib/auth'; // Import getUserId
// Remove privy imports - no longer needed here
// import { getPrivyClient } from '../lib/auth';

// Context object to be passed to your tRPC procedures
export interface Context {
  req?: NextApiRequest;
  res?: NextApiResponse;
  // userId is typically added by the auth middleware (protectedProcedure)
  // We don't set it directly in createContext anymore.
  userId?: string | null; 
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
export const createContext = async ({ req, res }: CreateContextOptions): Promise<Context> => {
  console.log('0xHypr - createContext called (with userId fetch attempt)');
  let userId: string | null = null;
  try {
    // getUserId uses next/headers cookies() which works server-side
    userId = await getUserId(); 
    console.log(`0xHypr - userId fetched in context: ${userId}`);
  } catch (error) {
    console.error('0xHypr - Error fetching userId in context:', error);
  }

  return {
    req,
    res,
    userId, // Add userId to the context
  };
};

export type ContextType = trpc.inferAsyncReturnType<typeof createContext>; 