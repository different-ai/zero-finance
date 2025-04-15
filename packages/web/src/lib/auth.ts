'use server';

import { cookies } from 'next/headers';
import { PrivyClient } from '@privy-io/server-auth';

// Check for required environment variables
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyAppSecret = process.env.PRIVY_APP_SECRET;

// Initialize the client only if both environment variables are present
let privyClient: PrivyClient | null = null;
try {
  if (privyAppId && privyAppSecret) {
    privyClient = new PrivyClient(privyAppId, privyAppSecret);
  } else {
    console.warn('Privy environment variables are missing. Authentication will be disabled.');
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
    // In Next.js 14, cookies() returns a Promise
    const cookieStore = await cookies();
    const authorizationToken = cookieStore.get('privy-token')?.value;
    
    if (!authorizationToken || !privyClient) {
      return null;
    }
    
    // Verify the token and get the user
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

/**
 * Gets user data from Privy
 */
export async function getUser() {
  const userId = await getUserId();
  
  if (!userId) {
    return null;
  }
  
  try {
    // Check if privyClient is properly initialized
    if (!privyClient || typeof privyClient.getUser !== 'function') {
      console.error('Privy client is not properly initialized');
      return null;
    }
    
    const user = await privyClient.getUser(userId);
    return user;
  } catch (error) {
    console.error('Error fetching Privy user:', error);
    return null;
  }
}