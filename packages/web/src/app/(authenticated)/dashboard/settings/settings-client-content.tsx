"use client";

import { RecoveryWalletManager } from '@/components/settings/recovery-wallet-manager';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Address } from 'viem';
import { FundingSourceDisplay } from './components/funding-source-display';

export function SettingsClientContent() {
   // Fetch user Safes to get the primary one
   const { data: userSafes, isLoading: isLoadingSafes, error: errorSafes } = trpc.settings.userSafes.list.useQuery();

   // Determine the primary safe address (assuming the first one is primary or based on some flag if available)
   // TODO: Confirm logic for identifying the *primary* safe if multiple exist.
   // Using find for isPrimary first, then fallback to the first element if any exist.
   const primarySafeAddress = userSafes?.find(safe => safe.safeType === 'primary')?.safeAddress as Address | undefined ?? userSafes?.[0]?.safeAddress as Address | undefined;


  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold" data-text="Settings">Settings</h1>
        <p className="text-gray-500 mt-2">Configure your payment methods and wallet connections</p>
      </div>


      {/* Funding Sources Section */}
      <div>
         <h2 className="text-xl font-semibold mb-4">Funding Sources</h2>
         <div className="space-y-6">
            {/* Display Existing Sources */}
            <FundingSourceDisplay />
            {/* TODO: Add form to add new source if needed */}
         </div>
      </div>

      {/* Safe Management & Recovery Section */}
       <div>
          <h2 className="text-xl font-semibold mb-4">Wallet Management</h2>
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
                <RecoveryWalletManager primarySafeAddress={primarySafeAddress} />
             )}
          </div>
       </div>
    </div>
  );
} 