import { api } from '@/trpc/react';
import { useQueryClient } from '@tanstack/react-query';

// Assuming EarnState and SweepEvent types are defined elsewhere and imported
// For now, let'''s define them inline for clarity, matching the backend router.
// In a real app, these would likely come from a shared types definition.
export interface SweepEvent {
  id: string;
  timestamp: string;
  amount: string;
  currency: string;
  apyAtTime: number;
  status: 'success' | 'pending' | 'failed';
  txHash?: string;
  failureReason?: string;
}

export interface EarnState {
  enabled: boolean;
  allocation: number;
  totalBalance: string;
  earningBalance: string;
  apy: number;
  lastSweep: string | null;
  events: SweepEvent[];
  configHash?: string;
}

interface UseEarnProps {
  safeId: string | undefined; // Make safeId optional to handle cases where it might not be available initially
}

export function useEarn({ safeId }: UseEarnProps) {
  const queryClient = useQueryClient();

  const {
    data: earnState,
    isLoading: isLoadingState,
    error: stateError,
  } = api.earn.getState.useQuery(
    { safeAddress: safeId! }, // Assert safeId is non-null; enabled flag handles undefined case
    {
      enabled: !!safeId, // Only run the query if safeId is available
      refetchInterval: 5000, // Refetch every 5 seconds to simulate real-time updates
    },
  );

  const mutationOptions = {
    onSuccess: () => {
      // Invalidate and refetch the earn state query to reflect changes
      if (safeId) {
        queryClient.invalidateQueries({
          queryKey: [['earn', 'getState'], { safeId }], // Corrected queryKey
        });
      }
    },
    onSettled: () => {
      // Always refetch after any mutation attempt (success or error)
      if (safeId) {
        queryClient.invalidateQueries({
          queryKey: [['earn', 'getState'], { safeId }], // Corrected queryKey
        });
      }
    },
  };

  const enableModuleMutation =
    api.earn..useMutation(mutationOptions);
  const disableModuleMutation =
    api.earn.disableAutoEarn.useMutation(mutationOptions);
  const setAllocationMutation =
    api.earn.setAllocation.useMutation(mutationOptions);

  const enable = async (configHash: string) => {
    if (!safeId) throw new Error('Safe ID is not available to enable module.');
    await enableModuleMutation.mutateAsync({ safeId, configHash });
  };

  const disable = async () => {
    if (!safeId) throw new Error('Safe ID is not available to disable module.');
    await disableModuleMutation.mutateAsync({ safeId });
  };

  const setAllocation = async (percentage: number) => {
    if (!safeId) throw new Error('Safe ID is not available to set allocation.');
    await setAllocationMutation.mutateAsync({ safeAddress: safeId, percentage });
  };

  return {
    state: earnState,
    isLoadingState,
    stateError,
    enable,
    isEnabling: enableModuleMutation.isPending,
    enableError: enableModuleMutation.error,
    disable,
    isDisabling: disableModuleMutation.isPending,
    disableError: disableModuleMutation.error,
    setAllocation,
    isSettingAllocation: setAllocationMutation.isPending,
    setAllocationError: setAllocationMutation.error,
  };
}
