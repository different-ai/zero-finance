'use client';

import { api } from '@/trpc/react';
import Dashboard from './dashboard/dashboard';
import { useSafeId } from './use-safe-id';
import FullScreenSpinner from './full-screen-spinner';
import ErrorView from './error-view';
import { useRouter } from 'next/navigation'; // Corrected import

export default function EarnPage() {
  const router = useRouter();
  const safeId = useSafeId();

  const {
    data: state,
    isLoading,
    error,
  } = api.earn.getState.useQuery(
    {
      safeAddress: safeId!,
    },
    {
      enabled: !!safeId,
    },
  );

  if (isLoading || !safeId) return <FullScreenSpinner />;
  if (error)
    return <ErrorView msg={`Could not load earn state: ${error.message}`} />;
  if (!state) return <ErrorView msg="Could not load earn state (no data)." />;

  return <Dashboard state={state} router={router} />;
}
