"use client";

import { RecoveryWalletManager } from '@/components/settings/recovery-wallet-manager';
import { WalletAddressCard } from '../components/wallet-address-card';
import { api as trpc } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Copy, CheckCircle2 } from 'lucide-react';
import { Address } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function AdvancedWalletClientContent() {
   // Get Privy user info
   const { user } = usePrivy();
   const [copiedDid, setCopiedDid] = useState(false);
   const [copiedSafe, setCopiedSafe] = useState(false);

   // Fetch user Safes to get the primary one
   const { data: userSafes, isLoading: isLoadingSafes, error: errorSafes } = trpc.settings.userSafes.list.useQuery();

   // Determine the primary safe address (assuming the first one is primary or based on some flag if available)
   // TODO: Confirm logic for identifying the *primary* safe if multiple exist.
   // Using find for isPrimary first, then fallback to the first element if any exist.
   const primarySafeAddress = userSafes?.find(safe => safe.safeType === 'primary')?.safeAddress as Address | undefined ?? userSafes?.[0]?.safeAddress as Address | undefined;

   const copyToClipboard = async (text: string, type: 'did' | 'safe') => {
     try {
       await navigator.clipboard.writeText(text);
       if (type === 'did') {
         setCopiedDid(true);
         setTimeout(() => setCopiedDid(false), 2000);
       } else {
         setCopiedSafe(true);
         setTimeout(() => setCopiedSafe(false), 2000);
       }
       toast({
         title: "Copied!",
         description: `${type === 'did' ? 'User DID' : 'Safe address'} copied to clipboard`,
       });
     } catch (err) {
       toast({
         title: "Failed to copy",
         description: "Please try again",
         variant: "destructive",
       });
     }
   };

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold" data-text="Advanced Wallet Settings">Advanced Wallet Settings</h1>
        <p className="text-gray-500 mt-2">Developer wallet addresses - for advanced users only</p>
      </div>

      {/* Debug Information Card */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Debug Information</CardTitle>
          <CardDescription>Use this information for debugging and support</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Privy User DID */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Privy User DID</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-muted rounded-md text-xs font-mono break-all">
                {user?.id || 'Not authenticated'}
              </code>
              {user?.id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(user.id, 'did')}
                  className="shrink-0"
                >
                  {copiedDid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Primary Safe Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Primary Safe Address</label>
            <div className="flex items-center gap-2">
              {isLoadingSafes ? (
                <Skeleton className="h-10 flex-1" />
              ) : (
                <>
                  <code className="flex-1 px-3 py-2 bg-muted rounded-md text-xs font-mono break-all">
                    {primarySafeAddress || 'No Safe wallet found'}
                  </code>
                  {primarySafeAddress && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(primarySafeAddress, 'safe')}
                      className="shrink-0"
                    >
                      {copiedSafe ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

        </CardContent>
      </Card>

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