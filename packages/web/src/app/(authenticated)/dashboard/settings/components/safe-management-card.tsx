'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserSafes } from '@/hooks/use-user-safes';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Building, Info, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { isAddress, createWalletClient, custom } from 'viem';
import Link from 'next/link';
import type { RouterOutputs } from '@/utils/trpc';
import { base } from 'viem/chains';
import { trpc } from '@/lib/trpc';
import type { Address, Hex } from 'viem';

// Use inferred output type from tRPC
type UserSafeOutput = RouterOutputs['settings']['userSafes']['list'][number];
type SafeType = UserSafeOutput['safeType'];
// Supported secondary account types
const ALLOWED_SECONDARY_SAFE_TYPES_FOR_CREATION: Exclude<SafeType, 'primary'>[] = ['liquidity', 'yield'];

function isSecondarySafeType(type: SafeType): type is Exclude<SafeType, 'primary'> {
    // Check against all possible types for filtering existing safes
    return ['liquidity', 'yield'].includes(type);
}

export function SafeManagementCard() {
  const queryClient = useQueryClient();
  const { data: safes, isLoading, isError, error: fetchError } = useUserSafes();
  const { wallets } = useWallets();
  const { getClientForChain } = useSmartWallets();
  const [creatingType, setCreatingType] = useState<Exclude<SafeType, 'primary'> | null>(null);
  const [registeringAddress, setRegisteringAddress] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const embeddedWallet = useMemo(() => wallets.find((w: any) => w.walletClientType === 'privy'), [wallets]);

  const utils = trpc.useUtils();

  const prepareCreateMutation = trpc.settings.userSafes.prepareCreate.useMutation({
    onSuccess: async (data) => {
      console.log('Safe creation prepared:', data);
      
      let toastId: string | number | undefined;

      if (!embeddedWallet) {
        toast.error("Privy embedded wallet not found.");
        setIsPreparing(false);
        setCreatingType(null);
        return;
      }

      let smartWalletClient: Awaited<ReturnType<typeof getClientForChain>> | null = null;
      try {
         smartWalletClient = await getClientForChain({ id: base.id });
         if (!smartWalletClient) {
           throw new Error('Failed to get Privy Smart Wallet client for Base.');
         }
      } catch (clientError: any) {
         console.error("Error getting Privy Smart Wallet client:", clientError);
         toast.error(`Failed to initialize Smart Wallet: ${clientError.message}`);
         setIsPreparing(false);
         setCreatingType(null);
         return;
      }

      try {
        toastId = toast.loading(`Preparing ${creatingType} Account deployment...`);

        const connectedChainId = embeddedWallet.chainId;
        if (connectedChainId !== `eip155:${base.id}`) {
            toast.info('Requesting network switch to Base...', { id: toastId });
            await embeddedWallet.switchChain(base.id);
            const newChainId = embeddedWallet.chainId;
            if (newChainId !== `eip155:${base.id}`) {
                toast.error(`Please switch to Base network (ID: ${base.id}) in your wallet and try again.`, { id: toastId });
                setIsPreparing(false);
                setCreatingType(null);
                return;
            }
            toast.success('Switched to Base network.', { id: toastId });
            toastId = toast.loading(`Preparing ${creatingType} Account deployment...`);
        }
        
        const transactionRequest = {
            account: smartWalletClient.account,
            to: data.transaction.to as Address,
            chain: base,
            data: data.transaction.data as Hex,
            value: BigInt(data.transaction.value),
        };

        setIsPreparing(false);
        setIsSending(true);
        toast.loading('Sending deployment transaction (sponsored)... Please wait', { id: toastId });

        const txHash = await smartWalletClient.sendTransaction(transactionRequest);

        console.log(`Safe deployment UserOperation submitted for ${creatingType} safe:`, txHash);
        toast.success(`Deployment UserOperation submitted! Hash: ${txHash.slice(0, 10)}...`, { id: toastId });
        toastId = toast.loading(`Waiting for network confirmation for ${creatingType} account...`);
        
        setIsSending(false);
        setIsConfirming(true);

        confirmCreateMutation.mutate({
            safeType: creatingType!,
            predictedAddress: data.predictedAddress,
            transactionHash: txHash
        });

      } catch (error: any) {
          console.error('Error during safe deployment transaction:', error);
          let errorMessage = 'An unknown error occurred during deployment.';
          if (error.message?.includes('User rejected')) { 
             errorMessage = 'Transaction rejected by user.';
          } else if (error.message?.includes('switchChain')) {
             errorMessage = 'Failed to switch network. Please switch manually in your wallet.';
          } else {
             errorMessage = `Transaction failed: ${error?.shortMessage || error?.message || 'Unknown error'}`;
          }
          toast.error(errorMessage, { id: toastId });

          setIsPreparing(false);
          setIsSending(false);
          setCreatingType(null);
      }
    },
    onError: (error) => {
      console.error('Error preparing safe creation:', error);
      toast.error(`Failed to prepare deployment: ${error.message}`);
      setIsPreparing(false);
      setCreatingType(null);
    },
  });

  const confirmCreateMutation = trpc.settings.userSafes.confirmCreate.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || `${creatingType} account confirmed and saved!`);
      utils.settings.userSafes.list.invalidate();
    },
    onError: (error) => {
      console.error('Error confirming safe creation:', error);
      toast.error(`Failed to confirm deployment on server: ${error.message}. Please check the transaction on a block explorer or contact support if the issue persists.`);
    },
    onSettled: () => {
      setIsConfirming(false);
      setCreatingType(null);
    },
  });

  const registerPrimaryMutation = trpc.settings.userSafes.registerPrimary.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || `Primary account registered successfully!`);
      utils.settings.userSafes.list.invalidate();
      setRegisteringAddress('');
    },
    onError: (error) => {
      toast.error(`Error registering primary account: ${error.message}`);
    },
  });

  const { primarySafe, existingSecondarySafes, missingSecondaryTypes } = useMemo(() => {
    if (!safes) {
      return { primarySafe: null, existingSecondarySafes: [], missingSecondaryTypes: ALLOWED_SECONDARY_SAFE_TYPES_FOR_CREATION };
    }
    const primary = safes.find(s => s.safeType === 'primary');
    const existingSecondary = safes.filter(s => isSecondarySafeType(s.safeType));
    
    const existingTypes = new Set(existingSecondary.map(s => s.safeType));
    // Calculate missing types based on the ALLOWED types for creation
    const missing = ALLOWED_SECONDARY_SAFE_TYPES_FOR_CREATION.filter(type => !existingTypes.has(type));
    return { primarySafe: primary, existingSecondarySafes: existingSecondary, missingSecondaryTypes: missing }; 
  }, [safes]);

  const handleCreateClick = useCallback((safeType: Exclude<SafeType, 'primary'>) => {
    if (!primarySafe) {
        toast.error("Cannot create secondary account without a registered primary account.");
        return;
    }
    if (creatingType || isPreparing || isSending || isConfirming) {
        toast.warning("Please wait for the current operation to complete.");
        return;
    }
    setCreatingType(safeType);
    setIsPreparing(true);
    setIsSending(false);
    setIsConfirming(false);
    prepareCreateMutation.mutate({ safeType });
  }, [primarySafe, creatingType, isPreparing, isSending, isConfirming, prepareCreateMutation]);

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

  const isProcessingCreation = isPreparing || isSending || isConfirming;

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Account Management</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading your accounts...</span>
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
            <AlertTitle>Error Loading Accounts</AlertTitle>
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
          Manage your accounts. Primary account needs manual setup.
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
          <>
            <div className="flex items-center p-3 border rounded-md bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-sm text-green-800">Primary Account Connected</p>
                <p className="text-xs text-gray-600 truncate">{primarySafe.safeAddress}</p>
              </div>
            </div>

            {existingSecondarySafes.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium text-gray-600">Connected Secondary Accounts:</h4>
                {existingSecondarySafes.map((safe) => (
                  <div key={safe.id} className="flex items-center p-2 border rounded-md text-sm">
                    <Building className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium capitalize mr-2">{safe.safeType} Account:</span>
                    <span className="text-gray-500 truncate">{safe.safeAddress}</span>
                  </div>
                ))}
              </div>
            )}

            {missingSecondaryTypes.length > 0 && (
              <div className="space-y-3 pt-4">
                <h4 className="text-sm font-medium text-gray-600">Create Missing Accounts:</h4>
                {missingSecondaryTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => handleCreateClick(type)}
                    disabled={isProcessingCreation}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    {isProcessingCreation && creatingType === type ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Building className="mr-2 h-4 w-4" />
                    )}
                    {isPreparing && creatingType === type ? 'Preparing...' : 
                     isSending && creatingType === type ? 'Sending Tx...' : 
                     isConfirming && creatingType === type ? 'Confirming...' : 
                     `Create ${type.charAt(0).toUpperCase() + type.slice(1)} Account`}
                  </Button>
                ))}
                <p className="text-xs text-muted-foreground text-center pt-2">
                    This action will initiate a sponsored transaction via your Smart Wallet.
                </p>
              </div>
            )}

            {missingSecondaryTypes.length === 0 &&
             existingSecondarySafes.length > 0 &&
             ALLOWED_SECONDARY_SAFE_TYPES_FOR_CREATION.length > 0 && (
              <p className="text-sm text-green-600 flex items-center pt-4"><CheckCircle className="h-4 w-4 mr-1.5" /> All secondary accounts are connected.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 