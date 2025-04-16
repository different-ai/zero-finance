import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { getUser } from '@/lib/auth';
import type { Context } from '@/server/context';

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
      
      // Return a context compatible with the Context type
      return {
        userId: user?.id || null,
        // We don't use NextApiRequest/Response in App Router
        // but we set these as undefined to satisfy the Context type
      };
    },
  });
};

export { handler as GET, handler as POST }; 