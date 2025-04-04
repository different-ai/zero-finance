import { useQuery } from '@tanstack/react-query';
import { userSafes } from '@/db/schema'; // Import the type, adjust path if needed
import { usePrivy } from '@privy-io/react-auth'; // Import usePrivy

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

// The React Query hook
export const useUserSafes = () => {
  const { getAccessToken, authenticated } = usePrivy(); // Get auth state and token function

  return useQuery<FetchUserSafesResponse, Error>({
    queryKey: ['userSafes'], // Unique key for this query
    queryFn: () => fetchUserSafes(getAccessToken), // Pass function to queryFn
    enabled: authenticated, // Only run query if user is authenticated
  });
}; 