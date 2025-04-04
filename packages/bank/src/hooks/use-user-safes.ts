import { useQuery } from '@tanstack/react-query';
import { userSafes } from '@/db/schema'; // Import the type, adjust path if needed

// Define the expected shape of a safe object from the API
// This could be more specific if needed, using Drizzle's inference
type UserSafe = typeof userSafes.$inferSelect;

// Define the structure of the API response
// Assuming the API directly returns an array of UserSafe objects on success
type FetchUserSafesResponse = UserSafe[];

// Function to fetch user safes from the API
const fetchUserSafes = async (): Promise<FetchUserSafesResponse> => {
  // In a real app, ensure the request includes authentication (e.g., headers)
  // Since the backend uses a placeholder DID for now, no specific auth needed here *yet*.
  const response = await fetch('/api/user/safes');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Attempt to parse error
    throw new Error(errorData.error || 'Failed to fetch user safes');
  }

  return response.json();
};

// The React Query hook
export const useUserSafes = () => {
  return useQuery<FetchUserSafesResponse, Error>({
    queryKey: ['userSafes'], // Unique key for this query
    queryFn: fetchUserSafes,
    // Optional: Configure stale time, cache time, refetch intervals, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}; 