'use client';

import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { AutoEarnSetupCard } from '../components/auto-earn-setup-card';
import { AutoEarnStatsCard } from '../components/auto-earn-stats-card';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AutoEarnPage() {
  const { client: smartClient } = useSmartWallets();
  const [primarySafe, setPrimarySafe] = useState<Address | undefined>(undefined);

  // Get the primary safe address from the user's smart wallet
  useEffect(() => {
    const fetchSafeAddress = async () => {
      if (smartClient && smartClient.account) {
        // Use the first available Smart Wallet as primary 
        // (this should be the one used throughout the app)
        setPrimarySafe(smartClient.account.address as Address);
      }
    };
    
    fetchSafeAddress();
  }, [smartClient]);

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Auto-Earn</h1>
      <p className="text-muted-foreground">
        Configure your auto-earn settings to automatically move funds to the Seamless vault and earn yield.
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <AutoEarnStatsCard safeAddress={primarySafe} />
          </TabsContent>
          <TabsContent value="settings">
            <AutoEarnSetupCard safeAddress={primarySafe} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 