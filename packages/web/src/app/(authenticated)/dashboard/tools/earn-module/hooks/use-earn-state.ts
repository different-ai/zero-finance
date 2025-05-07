'use client';

import { api } from '@/trpc/react';
import { type Address } from 'viem';

export function useEarnState(safeAddress?: Address | string) {
  const { 
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = api.earn.status.useQuery(
    { safeAddress: safeAddress as string }, 
    {
      enabled: !!safeAddress, // Only run query if safeAddress is provided
      retry: 1, // Retry once on failure
      // Add other react-query options if needed, e.g., staleTime, cacheTime
    }
  );

  return {
    isEnabled: data?.enabled,
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetchStatus: refetch,
  };
} 