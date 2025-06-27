"use client";

import { RecoveryWalletManager } from '@/components/settings/recovery-wallet-manager';
import { WalletAddressCard } from '../components/wallet-address-card';
import { api as trpc } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Address } from 'viem';

export function AdvancedWalletClientContent() {
   // Fetch user Safes to get the primary one
   const { data: userSafes, isLoading: isLoadingSafes, error: errorSafes } = trpc.settings.userSafes.list.useQuery();

   // Determine the primary safe address (assuming the first one is primary or based on some flag if available)
   // TODO: Confirm logic for identifying the *primary* safe if multiple exist.
   // Using find for isPrimary first, then fallback to the first element if any exist.
   const primarySafeAddress = userSafes?.find(safe => safe.safeType === 'primary')?.safeAddress as Address | undefined ?? userSafes?.[0]?.safeAddress as Address | undefined;


  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold" data-text="Advanced Wallet Settings">Advanced Wallet Settings</h1>
        <p className="text-gray-500 mt-2">Developer wallet addresses - for advanced users only</p>
      </div>


      {/* Safe Management & Recovery Section */}
       <div>
          <div className="space-y-6">
             {isLoadingSafes && (
                // Show skeletons for both cards while loading safes
                <>
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </>
             )}
             {errorSafes && (
               <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error Loading Wallets</AlertTitle>
                  <AlertDescription>
                     Could not load your Safe wallet details. Please try again later.
                  </AlertDescription>
               </Alert>
             )}
             {/* Render Recovery Manager only when loading is done and no error occurred */}
             {!isLoadingSafes && !errorSafes && (
                <>
                  <WalletAddressCard />
                  <RecoveryWalletManager primarySafeAddress={primarySafeAddress} />
                </>
             )}
          </div>
       </div>
    </div>
  );
}  