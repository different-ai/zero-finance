import { trpc } from '@/utils/trpc';
import { useCallback } from 'react';
import type { NewCardAction } from '@/db/schema';

export function useCardActions() {
  const utils = trpc.useUtils();
  
  const trackActionMutation = trpc.cardActions.trackAction.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries
      utils.cardActions.getRecentActions.invalidate();
      utils.cardActions.getActionStats.invalidate();
    },
  });

  const trackBatchActionsMutation = trpc.cardActions.trackBatchActions.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries
      utils.cardActions.getRecentActions.invalidate();
      utils.cardActions.getActionStats.invalidate();
    },
  });

  const trackAction = useCallback(async (
    cardId: string,
    actionType: NewCardAction['actionType'],
    details?: {
      actor?: NewCardAction['actor'];
      actorDetails?: any;
      previousValue?: any;
      newValue?: any;
      details?: any;
      metadata?: any;
    }
  ) => {
    return trackActionMutation.mutateAsync({
      cardId,
      actionType,
      ...details,
    });
  }, [trackActionMutation]);

  const trackBatchActions = useCallback(async (
    actions: Array<{
      cardId: string;
      actionType: NewCardAction['actionType'];
      actor?: NewCardAction['actor'];
      actorDetails?: any;
      previousValue?: any;
      newValue?: any;
      details?: any;
      metadata?: any;
    }>
  ) => {
    return trackBatchActionsMutation.mutateAsync({ actions });
  }, [trackBatchActionsMutation]);

  return {
    trackAction,
    trackBatchActions,
    isTracking: trackActionMutation.isPending || trackBatchActionsMutation.isPending,
  };
} 