import { usePrivy } from '@privy-io/react-auth';
import { trpc } from '@/utils/trpc';

// The React Query hook using tRPC
export const useUserSafes = () => {
  const { authenticated } = usePrivy(); // Only need auth state now

  // Use the tRPC query hook with the correct path
  return trpc.settings.userSafes.list.useQuery(
    undefined, // No input required for the list procedure
    {
      enabled: authenticated, // Only run query if user is authenticated
      // queryKey is managed by tRPC, but you can customize if needed
    }
  );
}; 