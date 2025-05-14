'use client';

import { api } from '@/trpc/react';
import Stepper from './stepper/Stepper';
import Dashboard from './dashboard/Dashboard';
import { useSafeId } from '@/hooks/use-safe-id';
import FullScreenSpinner from '@/components/ui/FullScreenSpinner';
import ErrorView from '@/components/ui/ErrorView';
import { useRouter } from "next/navigation"; // Corrected import

export default function EarnPage() {
  const router = useRouter();
  const safeId = useSafeId();

  const { data: state, isLoading, error } = api.earn.getState.useQuery({
    safeId: safeId!,
  }, {
    enabled: !!safeId,
  });

  if (isLoading || !safeId) return <FullScreenSpinner />;
  if (error) return <ErrorView msg={`Could not load earn state: ${error.message}`} />;
  if (!state) return <ErrorView msg="Could not load earn state (no data)." />;

  return state.enabled
    ? <Dashboard state={state} router={router} />
    : <Stepper initialAllocation={state.allocation} safeId={safeId!} router={router} />;
} 