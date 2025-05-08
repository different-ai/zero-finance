import { api } from '@/trpc/react';
import { type Address } from 'viem';

/**
 * Custom hook to fetch earn module statistics for a given Safe address.
 * It uses the 'api.earn.stats' tRPC query.
 *
 * @param safeAddress The address of the Safe to fetch stats for.
 * @returns The result of the useQuery hook from tRPC, which includes data, isLoading, isError, etc.
 */
export function useEarnStats(safeAddress: Address | undefined) {
  return api.earn.stats.useQuery(
    { safeAddress: safeAddress! }, // The input object for the tRPC query
    { 
      enabled: !!safeAddress, // Only run the query if safeAddress is defined
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes if window is focused
    }
  );
} 