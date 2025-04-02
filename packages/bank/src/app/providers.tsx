'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!privyAppId) {
    console.error('0xHypr Error: NEXT_PUBLIC_PRIVY_APP_ID is not set.');
    // You might want to render an error message or fallback UI here
    return <div>Privy App ID not configured.</div>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        // Customize Privy's appearance
        appearance: {
          theme: 'light', 
          accentColor: '#676FFF', 
          logo: 'https://your-logo-url', // Replace with your logo URL
        },
        // Configure external wallets
        externalWallets: {
          coinbaseWallet: {
            // Recommended: Enables connecting Coinbase Wallet on mobile
            connectionOptions: 'smartWalletOnly', 
          },
        },
        // Define supported chains
        supportedChains: [base],
        // Set default chain
        defaultChain: base,
      }}
    >
      {children}
    </PrivyProvider>
  );
} 