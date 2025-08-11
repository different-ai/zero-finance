'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserSafes } from '@/hooks/use-user-safes';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Info, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import Link from 'next/link';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/lib/trpc';

// Use inferred output type from tRPC
type UserSafeOutput = RouterOutputs['settings']['userSafes']['list'][number];

export function SafeManagementCard() {
  const queryClient = useQueryClient();
  const { data: safes, isLoading, isError, error: fetchError } = useUserSafes();
  const { wallets } = useWallets();
  const [registeringAddress, setRegisteringAddress] = useState('');

  const embeddedWallet = useMemo(() => wallets.find((w: any) => w.walletClientType === 'privy'), [wallets]);

  const utils = trpc.useUtils();

  const registerPrimaryMutation = trpc.settings.userSafes.registerPrimary.useMutation({
    onSuccess: (data) => {
      toast.success(data.safe.safeAddress || `Primary account registered successfully!`);
      utils.settings.userSafes.list.invalidate();
      setRegisteringAddress('');
    },
    onError: (error) => {
      toast.error(`Error registering primary account: ${error.message}`);
    },
  });

  const primarySafe = useMemo(() => {
    if (!safes) {
      return null;
    }
    return safes.find(s => s.safeType === 'primary');
  }, [safes]);

  const handleRegisterPrimary = () => {
    if (!registeringAddress || !isAddress(registeringAddress)) {
      toast.error("Please enter a valid Ethereum address.");
      return;
    }
    registerPrimaryMutation.mutate({ safeAddress: registeringAddress });
  };

  const copyToClipboard = (text: string) => {
     navigator.clipboard.writeText(text).then(() => {
       toast.success("Address copied to clipboard!");
     }, (err) => {
       toast.error("Failed to copy address.");
       console.error('Could not copy text: ', err);
     });
   };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Account Management</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading your account...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle>Account Management</CardTitle></CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Account</AlertTitle>
            <AlertDescription>
              {fetchError?.message || 'Could not fetch your account details. Please try again later.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Management</CardTitle>
        <CardDescription>
          Manage your primary account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!primarySafe && (
          <div className="space-y-4">
            <Alert variant="default" className="border-blue-500/50 bg-blue-50 text-blue-800">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Register Your Primary Account</AlertTitle>
              <AlertDescription className="text-blue-700 space-y-1">
                <p>We couldn&apos;t find a primary account linked to your account.</p>
                <p>1. Create a new Safe Account on Base network via{' '}
                  <Link href="https://app.safe.global/new-safe/create" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">app.safe.global</Link>.
                </p>
                <p>2. Add your Privy embedded wallet as an owner/signer:</p>
                {embeddedWallet ? (
                  <div className="flex items-center space-x-2 bg-blue-100 p-1.5 rounded text-xs my-1">
                    <span className="font-mono break-all">{embeddedWallet?.address}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-blue-700 hover:text-blue-900" onClick={() => embeddedWallet?.address && copyToClipboard(embeddedWallet.address)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-yellow-700">(Loading your wallet address...)</p>
                )}
                <p>3. Paste the new Account address below and click Register.</p>
              </AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter Primary Account Address (0x...)"
                value={registeringAddress}
                onChange={(e) => setRegisteringAddress(e.target.value)}
                disabled={registerPrimaryMutation.isPending}
              />
              <Button
                onClick={handleRegisterPrimary}
                disabled={registerPrimaryMutation.isPending || !registeringAddress || !isAddress(registeringAddress)}
              >
                {registerPrimaryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Register
              </Button>
            </div>
          </div>
        )}

        {primarySafe && (
          <div className="flex items-center p-3 border rounded-md bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-sm text-green-800">Primary Account Connected</p>
              <p className="text-xs text-gray-600 truncate">{primarySafe.safeAddress}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 