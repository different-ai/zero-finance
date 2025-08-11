import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { getUser } from '@/lib/auth';
import type { Context } from '@/server/context';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';

// Define the simple logger interface matching context.ts
interface Logger {
  info: (payload: any, message: string) => void;
  error: (payload: any, message: string) => void;
  warn: (payload: any, message: string) => void;
}

// Simple console logger implementation matching context.ts
const log: Logger = {
  info: (payload, message) => console.log(`[TRPC API] [INFO] ${message}`, JSON.stringify(payload, null, 2)),
  error: (payload, message) => console.error(`[TRPC API] [ERROR] ${message}`, JSON.stringify(payload, null, 2)),
  warn: (payload, message) => console.warn(`[TRPC API] [WARN] ${message}`, JSON.stringify(payload, null, 2)),
};

// This is a fetch API route handler for the App Router
const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    // Create context with the fetch API Request
    createContext: async (): Promise<Context> => {
      // Get the authenticated user (or null if not authenticated)
      let user = null;
      try {
        user = await getUser();
      } catch (error) {
        console.warn('Failed to get user in tRPC context', error);
      }
      
      console.log(`API Route: Context creation for user: ${user?.id}`);
      // Return a context compatible with the Context type
      return {
        req, // Pass the request object for header access
        userId: user?.id || null,
        log, // Include the logger instance
        db, // Include the db instance
      };
    },
  });
};

export { handler as GET, handler as POST }; 