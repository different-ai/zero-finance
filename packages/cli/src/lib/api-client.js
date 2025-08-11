import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import config from './config.js';

/**
 * Create a tRPC client for the Zero Finance API
 */
export function createApiClient() {
  const token = config.get('auth.token');
  const apiUrl = config.get('api.url');

  console.log('[CLI] Creating API client');
  console.log('[CLI] API URL:', apiUrl);
  console.log('[CLI] Token present:', !!token);
  console.log('[CLI] Token length:', token ? token.length : 0);

  return createTRPCProxyClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: apiUrl,
        headers() {
          const headers = {};
          if (token) {
            headers.authorization = `Bearer ${token}`;
            console.log('[CLI] Adding authorization header');
          }
          return headers;
        },
        // Add fetch options to ensure headers are sent
        fetch(url, options) {
          console.log('[CLI] Making request to:', url);
          console.log('[CLI] Request headers:', options.headers);
          return fetch(url, options);
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
