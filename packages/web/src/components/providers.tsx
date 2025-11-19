'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base, mainnet, arbitrum } from 'viem/chains';
import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { WagmiProvider, createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
import SuspendedPostHogPageView from './posthog-pageview';
import { PostHogUserIdentification } from './posthog-user-identification';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  });
}

export function PHProvider({ children }: { children: ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

// Create a client
// Use useState to ensure the client is only created once per session client-side
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const wagmiConfig = createConfig({
  chains: [base, mainnet, arbitrum],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const [queryClient] = useState(() => getQueryClient());

  if (!privyAppId) {
    console.error('Error: NEXT_PUBLIC_PRIVY_APP_ID is not set.');
    return <div>Privy App ID not configured.</div>;
  }

  // PostHog is now initialised in app/instrumentation.client.ts. We only need to
  // ensure the provider is available so that the `usePostHog` hook works in
  // components.

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#0040FF',
          logo: 'https://zerofinance.ai/new-logo-bluer.png',
        },
        externalWallets: {
          coinbaseWallet: {},
        },
        supportedChains: [base, arbitrum],
        defaultChain: base,
        embeddedWallets: {
          ethereum: {
            // Ensure a deterministic EOA exists so the AA smart wallet can be owned
            // even if a user connects an external wallet first.
            createOnLogin: 'all-users', // 'all-users' | 'users-without-wallets' | 'off'
          },
        },
      }}
    >
      <SmartWalletsProvider>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <PHProvider>
              <SuspendedPostHogPageView />
              <PostHogUserIdentification />
              {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> */}
              {children}
              {/* </ThemeProvider> */}
            </PHProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
