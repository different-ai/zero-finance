'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';
import { ReactNode, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { WagmiProvider } from '@privy-io/wagmi';
import { config as wagmiConfig } from '@/lib/wagmi';

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
    <PrivyProvider appId={privyAppId} config={{
      appearance: {
        theme: 'light',
        accentColor: '#676FFF',
        logo: process.env.NEXT_PUBLIC_LOGO_URL || 'https://placehold.co/100x40?text=HyprSQRL', 
      },
      externalWallets: {
        coinbaseWallet: {
          connectionOptions: 'smartWalletOnly',
        },
      },
      supportedChains: [base],
      defaultChain: base,
      embeddedWallets: {
        createOnLogin: 'users-without-wallets',
      },
    }}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> */}
          {children}
          {/* </ThemeProvider> */}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
} 