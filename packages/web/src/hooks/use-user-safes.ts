import { useQuery } from '@tanstack/react-query';
import { usePrivy } from '@privy-io/react-auth';
import { safes } from '@/lib/mock-data';

// Define the type of a user safe
export type UserSafe = {
  safeAddress: string;
  safeType: string;
  name: string;
  balance: number;
  currency: string;
};

// Function that returns mock data for now
const fetchUserSafes = async (): Promise<UserSafe[]> => {
  // In a real implementation, this would fetch from an API
  // For now, return the mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(safes);
    }, 500); // Simulate network delay
  });
};

// The React Query hook
export const useUserSafes = () => {
  const { authenticated } = usePrivy();

  return useQuery<UserSafe[], Error>({
    queryKey: ['userSafes'],
    queryFn: fetchUserSafes,
    enabled: authenticated,
  });
}; 