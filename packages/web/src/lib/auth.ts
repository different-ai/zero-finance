'use server';

import { cookies } from 'next/headers';
import { PrivyClient } from '@privy-io/server-auth';

const PRIVY_TOKEN_COOKIE = 'privy-token';
const DEV_USER_ID_COOKIE = 'x-dev-user-id';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const DEV_IMPERSONATION_ENABLED =
  IS_DEVELOPMENT && process.env.DEV_IMPERSONATION_ENABLED === 'true';

const DEMO_USER_DID = 'did:privy:demo_user';
const DEMO_SAFE_ADDRESS = '0x954A329e1e59101DF529CC54A54666A0b36Cae22';

// Check for required environment variables
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyAppSecret = process.env.PRIVY_APP_SECRET;

// Initialize the client only if both environment variables are present
let privyClient: PrivyClient | null = null;
try {
  if (privyAppId && privyAppSecret) {
    privyClient = new PrivyClient(privyAppId, privyAppSecret);
  } else {
    console.warn(
      'Privy environment variables are missing. Authentication will be disabled.',
    );
  }
} catch (error) {
  console.error('Failed to initialize Privy client:', error);
}

/**
 * Gets the initialized Privy client instance.
 * @returns The PrivyClient instance or null if not initialized.
 */
export async function getPrivyClient(): Promise<PrivyClient | null> {
  return privyClient;
}

/**
 * Gets the user ID from Privy authentication token
 * @returns The user ID or null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();

    // Dev-only impersonation. Disabled by default.
    if (DEV_IMPERSONATION_ENABLED) {
      const devUserId = cookieStore.get(DEV_USER_ID_COOKIE)?.value;
      if (devUserId) {
        return devUserId;
      }
    }

    const authorizationToken = cookieStore.get(PRIVY_TOKEN_COOKIE)?.value;

    if (!authorizationToken || !privyClient) {
      return null;
    }

    const { userId } = await privyClient.verifyAuthToken(authorizationToken);
    return userId;
  } catch (error) {
    console.error('Error verifying Privy token:', error);
    return null;
  }
}

/**
 * Similar to the old auth() function, gets userId without redirecting
 * Use this in server actions
 */
export async function getAuthUserId(): Promise<string | null> {
  return getUserId();
}

/**
 * Checks if a user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getUserId();
  return !!userId;
}

function buildDemoUser(userId: string) {
  return {
    id: userId,
    email: { address: 'demo@0.finance' },
    wallet: { address: DEMO_SAFE_ADDRESS },
    linkedAccounts: [
      {
        type: 'smart_wallet',
        address: DEMO_SAFE_ADDRESS,
      },
    ],
  };
}

/**
 * Gets user data from Privy by DID.
 * Prefer this over `getUser()` when you already have a DID.
 */
export async function getUserById(userId: string) {
  if (!userId) {
    return null;
  }

  // Keep demo mocking, but tie it to explicit impersonation.
  if (DEV_IMPERSONATION_ENABLED && userId === DEMO_USER_DID) {
    return buildDemoUser(userId);
  }

  if (!privyClient || typeof privyClient.getUser !== 'function') {
    console.warn('Privy client is not initialized; cannot fetch user');
    return null;
  }

  try {
    return await privyClient.getUser(userId);
  } catch (error) {
    console.error('Error fetching Privy user:', error);
    return null;
  }
}

/**
 * Gets user data from Privy based on the current request's auth state.
 */
export async function getUser() {
  const userId = await getUserId();
  if (!userId) {
    return null;
  }

  return getUserById(userId);
}

export type AuthSession = {
  user: {
    id: string;
    email?: string | null;
  };
};

/**
 * Session helper used by server components/routes that expect a NextAuth-like shape.
 *
 * In production this returns a real user session (or null).
 * In development you can opt into a mock session via `MOCK_AUTH_SESSION=true`.
 */
export const auth = async (): Promise<AuthSession | null> => {
  const user = await getUser();

  if (!user) {
    if (IS_DEVELOPMENT && process.env.MOCK_AUTH_SESSION === 'true') {
      return { user: { id: 'mock-user-id' } };
    }
    return null;
  }

  const email =
    typeof user.email === 'string' ? user.email : (user.email?.address ?? null);

  return {
    user: {
      id: user.id,
      email,
    },
  };
};
