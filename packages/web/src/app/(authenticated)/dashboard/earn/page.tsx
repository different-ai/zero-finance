'use client';

import { api } from '@/trpc/react';
import Dashboard from './dashboard/dashboard';
import FullScreenSpinner from './full-screen-spinner';
import ErrorView from './error-view';
import { useRouter } from 'next/navigation'; // Corrected import
import { useUserSafes } from '@/hooks/use-user-safes';

export default function EarnPage() {
  const router = useRouter();
  const {data} = useUserSafes()
  const safeAddress = data?.[0]?.safeAddress
  const safeId = safeAddress?.toString()
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

  return <Dashboard state={state} router={router} safeAddress={safeId!} />;
}
