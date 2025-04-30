'use client';

import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/utils/trpc';
import { usePrivy } from '@privy-io/react-auth';
import superjson from 'superjson';
import { api } from '@/trpc/react';

// Helper component to handle the sync logic
function SyncUserToLoops() {
  const { ready, authenticated, user } = usePrivy();
  const syncMutation = api.user.syncContactToLoops.useMutation();
  const syncAttemptedRef = useRef(false);

  useEffect(() => {
    if (ready && authenticated && user && !syncAttemptedRef.current) {
      console.log('User authenticated, attempting to sync contact to Loops from TRPCProvider...');
      syncAttemptedRef.current = true;

      syncMutation.mutate(
        {
          privyUserId: user.id,
          email: user.email?.address,
          // Corrected name access - Discord uses username
          name: user.google?.name || user.github?.name || user.discord?.username || user.linkedin?.name || user.twitter?.name || undefined,
        },
        {
          onSuccess: (data) => {
            console.log('Loops sync response:', data.message);
          },
          onError: (error) => {
            console.error('Failed to sync contact to Loops:', error);
            syncAttemptedRef.current = false;
          },
        },
      );
    }
    else if (ready && !authenticated) {
       syncAttemptedRef.current = false;
    }
  }, [ready, authenticated, user, syncMutation]);

  return null;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { getAccessToken } = usePrivy();
  
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
          
          async headers() {
            const token = await getAccessToken();
            return {
              Authorization: token ? `Bearer ${token}` : '',
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Sync logic now runs within the tRPC context */}
        <SyncUserToLoops /> 
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
} 