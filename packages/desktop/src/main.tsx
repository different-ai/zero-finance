// import './polyfills';
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { config } from './config/connect-kit';
import { Toaster } from './components/ui/toaster';

// Create query client
const queryClient = new QueryClient();

export const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            {children}
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
};
