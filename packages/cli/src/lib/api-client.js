import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import config from './config.js';

/**
 * Create a tRPC client for the Zero Finance API
 */
export function createApiClient() {
  const token = config.get('auth.token');
  const apiUrl = config.get('api.url');

  return createTRPCProxyClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: apiUrl,
        headers() {
          return token ? {
            authorization: `Bearer ${token}`,
          } : {};
        },
      }),
    ],
  });
}

/**
 * Get an authenticated API client
 * Throws if not authenticated
 */
export async function getAuthenticatedApi() {
  const token = config.get('auth.token');
  if (!token) {
    throw new Error('Not authenticated. Please run "zero auth login" first.');
  }
  return createApiClient();
}