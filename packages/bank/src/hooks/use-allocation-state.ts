import { useQuery } from '@tanstack/react-query';
import { allocationStates } from '@/db/schema'; // Import the type

// Define the expected shape of the API response
interface AllocationStateResponse {
  allocationState: typeof allocationStates.$inferSelect | null;
  message?: string; // Optional message (e.g., if primary safe not found)
  error?: string; // Optional error message
}

// Function to fetch the allocation state from the API
const fetchAllocationState = async (): Promise<AllocationStateResponse> => {
  const response = await fetch('/api/user/allocation');
  
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
  return useQuery<AllocationStateResponse, Error>({
    queryKey: ['allocationState'], // Unique key for this query
    queryFn: fetchAllocationState,
    // Optional: Configure staleTime, cacheTime, refetch intervals etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // refetchOnWindowFocus: false, 
  });
}; 