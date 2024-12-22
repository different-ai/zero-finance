import { WagmiProvider } from 'wagmi';
import { config } from './config/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Your existing app content */}
      </QueryClientProvider>
    </WagmiProvider>
  );
} 