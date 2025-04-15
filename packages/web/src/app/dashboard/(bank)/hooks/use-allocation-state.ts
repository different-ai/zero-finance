import { useQuery } from '@tanstack/react-query';
import { allocationStates } from '@/db/schema'; // Import the type
import { usePrivy } from '@privy-io/react-auth'; // Import usePrivy

// Define the expected shape of the API response
interface AllocationStateResponse {
  allocationState: typeof allocationStates.$inferSelect | null;
  message?: string; // Optional message (e.g., if primary safe not found)
  error?: string; // Optional error message
}

// Function to fetch the allocation state from the API, now requires getAccessToken
const fetchAllocationState = async (getAccessToken: () => Promise<string | null>): Promise<AllocationStateResponse> => {
  const token = await getAccessToken();
  if (!token) {
    console.warn('Attempted to fetch allocation state without auth token.');
    // Return a structure indicating no state due to auth issue, or throw
    return { allocationState: null, message: 'User not authenticated' }; 
  }

  const response = await fetch('/api/user/allocation', {
     headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    // Try to parse error from response body
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    } catch (parseError) {
      // Fallback if parsing fails
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  const data: AllocationStateResponse = await response.json();
  return data;
};

// Custom hook to use the allocation state query
export const useAllocationState = () => {
  const { getAccessToken, authenticated } = usePrivy(); // Get auth state and token function

  return useQuery<AllocationStateResponse, Error>({
    queryKey: ['allocationState'], // Unique key for this query
    queryFn: () => fetchAllocationState(getAccessToken), // Pass function to queryFn
    enabled: authenticated, // Only run query if user is authenticated
    refetchInterval: 30000, // Refresh every 30 seconds (30000ms)
    // Additional query options
    refetchOnWindowFocus: true, // Refresh when user focuses window
    staleTime: 10000, // Data becomes stale after 10 seconds
  });
}; 