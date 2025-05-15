'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';
import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { WagmiProvider } from '@privy-io/wagmi';
import { config as wagmiConfig } from '@/lib/wagmi';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
import { PostHogProvider } from './PostHogProvider';

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL as string;

const BASE_FACTORY_ADDRESS = '0x1F8A80d853204B8E4e4C3b7a816eaf52eeEfAeee'; // Safe v1.4.1 proxy factory on Base mainnet
const ENTRY_POINT_ADDRESS = '0x0576a174D229E3cFA37253523E645A78A0C91B57'; // EntryPoint v0.6 for Base

// Smart-wallet chain configuration for Privy
const smartWalletsConfig = {
  chains: [
    {
      id: base.id,
      rpcUrl: BASE_RPC_URL,
      factoryAddress: BASE_FACTORY_ADDRESS,
      entryPointAddress: ENTRY_POINT_ADDRESS,
      // Use an env-specific bundler URL if provided, otherwise fall back to Privy's public bundler
      bundlerUrl: process.env.NEXT_PUBLIC_PRIVY_BUNDLER_URL ?? 'https://bundler.privy.io',
    },
  ],
} as const;

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

export function Providers({ children }: { children: ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const [queryClient] = useState(() => getQueryClient());

  if (!privyAppId) {
    console.error('Error: NEXT_PUBLIC_PRIVY_APP_ID is not set.');
    return <div>Privy App ID not configured.</div>;
  }

  return (
    <PostHogProvider>
      <PrivyProvider
        appId={privyAppId}
        config={{
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://pygvfunuirngbnf5.public.blob.vercel-storage.com/eqwrt-LXxp514DL8VsT9jGXUrVy6ItfqEhje.png',
          },
          externalWallets: {
            coinbaseWallet: {
              connectionOptions: 'smartWalletOnly',
            },
          },
          supportedChains: [base],
          defaultChain: base,
          embeddedWallets: {
            // Create an embedded EOA for *every* user, even if they logged in with Metamask.
            // This gives us a deterministic signer for the downstream smart-wallet client.
            createOnLogin: 'all-users',
          },
        }}
      >
        <SmartWalletsProvider config={smartWalletsConfig}>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>
              {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> */}
              {children}
              {/* </ThemeProvider> */}
            </WagmiProvider>
          </QueryClientProvider>
        </SmartWalletsProvider>
      </PrivyProvider>
    </PostHogProvider>
  );
}