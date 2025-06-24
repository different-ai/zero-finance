import { useQuery } from '@tanstack/react-query';
import { userSafes } from '@/db/schema'; // Import the type, adjust path if needed
import { usePrivy } from '@privy-io/react-auth'; // Import usePrivy
import { trpc } from '@/utils/trpc'; // Corrected import path

// Define the expected shape of a safe object from the API
// This could be more specific if needed, using Drizzle's inference
type UserSafe = typeof userSafes.$inferSelect;

// Define the structure of the API response
// Assuming the API directly returns an array of UserSafe objects on success
type FetchUserSafesResponse = UserSafe[];

// Function to fetch user safes from the API, now requires getAccessToken
const fetchUserSafes = async (getAccessToken: () => Promise<string | null>): Promise<FetchUserSafesResponse> => {
  const token = await getAccessToken();
  if (!token) {
    // Handle case where user is not authenticated or token is unavailable
    // Returning empty array might be appropriate, or throw an error
    console.warn('Attempted to fetch user safes without auth token.');
    return []; // Or throw new Error('Not authenticated');
  }
  
  const response = await fetch('/api/user/safes', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Attempt to parse error
    throw new Error(errorData.error || 'Failed to fetch user safes');
  }

  return response.json();
};

// The React Query hook using tRPC
export const useUserSafes = (chain?: 'ethereum' | 'solana') => {
  const { authenticated } = usePrivy(); // Only need auth state now

  // Use the tRPC query hook with the correct path
  return trpc.settings.userSafes.list.useQuery(
    { chain },
    {
      enabled: authenticated, // Only run query if user is authenticated
      // queryKey is managed by tRPC, but you can customize if needed
    }
  );
}; 