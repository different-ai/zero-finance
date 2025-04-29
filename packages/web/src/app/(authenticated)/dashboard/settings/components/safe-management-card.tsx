'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserSafes } from '@/hooks/use-user-safes';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Building, Info, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { isAddress, createWalletClient, custom } from 'viem';
import Link from 'next/link';
import type { RouterOutputs } from '@/utils/trpc';
import { base } from 'viem/chains';
import { trpc } from '@/lib/trpc';

// Use inferred output type from tRPC
type UserSafeOutput = RouterOutputs['settings']['userSafes']['list'][number];
type SafeType = UserSafeOutput['safeType'];
const SECONDARY_SAFE_TYPES: Exclude<SafeType, 'primary'>[] = ['tax', 'liquidity', 'yield'];

function isSecondarySafeType(type: SafeType): type is Exclude<SafeType, 'primary'> {
    return (SECONDARY_SAFE_TYPES as ReadonlyArray<SafeType>).includes(type);
}

export function SafeManagementCard() {
  const queryClient = useQueryClient();
  const { data: safes, isLoading, isError, error: fetchError } = useUserSafes();
  const { wallets } = useWallets();
  const [creatingType, setCreatingType] = useState<Exclude<SafeType, 'primary'> | null>(null);
  const [registeringAddress, setRegisteringAddress] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [creationStatus, setCreationStatus] = useState<string | null>(null);

  const embeddedWallet = useMemo(() => wallets.find((w: any) => w.walletClientType === 'privy'), [wallets]);

  const utils = trpc.useUtils();

  const prepareCreateMutation = trpc.settings.userSafes.prepareCreate.useMutation({
    onSuccess: async (data) => {
      console.log('Safe creation prepared:', data);
      
      if (!embeddedWallet) {
        toast.error("Privy embedded wallet not found.");
        setIsPreparing(false);
        setCreatingType(null);
        setCreationStatus(null);
        return;
      }

      let toastId: string | number | undefined;
      try {
        setCreationStatus(`Preparing ${creatingType} Safe...`);
        toastId = toast.loading(`Preparing ${creatingType} Safe deployment...`);

        const connectedChainId = embeddedWallet.chainId;
        if (connectedChainId !== `eip155:${base.id}`) {
            toast.info('Requesting network switch to Base...', { id: toastId });
            setCreationStatus('Requesting network switch...');
            await embeddedWallet.switchChain(base.id);
            const newChainId = embeddedWallet.chainId;
            if (newChainId !== `eip155:${base.id}`) {
                toast.error(`Please switch to Base network (ID: ${base.id}) and try again.`, { id: toastId });
                setIsPreparing(false);
                setCreatingType(null);
                setCreationStatus(null);
                return;
            }
            toast.success('Switched to Base network.', { id: toastId });
            toastId = toast.loading(`Preparing ${creatingType} Safe deployment...`);
        }
        
        setCreationStatus('Requesting wallet signature...');
        toast.info('Please confirm the deployment transaction in your wallet.', { id: toastId });
        
        const provider = await embeddedWallet.getEthereumProvider();

        const walletClient = createWalletClient({
            account: embeddedWallet.address as `0x${string}`,
            chain: base,
            transport: custom(provider)
        });
        
        const transactionRequest = {
            account: walletClient.account,
            to: data.transaction.to as `0x${string}`,
            chain: base,
            data: data.transaction.data as `0x${string}`,
            value: BigInt(data.transaction.value),
        };

        setIsPreparing(false);
        setIsSending(true);
        setCreationStatus('Sending transaction...');

        const txHash = await walletClient.sendTransaction(transactionRequest);

        console.log('Safe deployment transaction sent:', txHash);
        toast.success(`Deployment transaction sent! Hash: ${txHash.slice(0, 10)}...`, { id: toastId });
        toastId = toast.loading(`Waiting for network confirmation for ${creatingType} safe...`);
        
        setIsSending(false);
        setIsConfirming(true);
        setCreationStatus('Confirming transaction on network...');

        confirmCreateMutation.mutate({
            safeType: creatingType!,
            predictedAddress: data.predictedAddress,
            transactionHash: txHash
        });

      } catch (error: any) {
          console.error('Error during safe deployment transaction:', error);
          let errorMessage = 'An unknown error occurred during deployment.';
          if (error.code === 4001) {
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
          setCreationStatus(null);
      }
    },
    onError: (error) => {
      console.error('Error preparing safe creation:', error);
      toast.error(`Failed to prepare Safe deployment: ${error.message}`);
      setIsPreparing(false);
      setCreatingType(null);
      setCreationStatus(null);
    },
  });

  const confirmCreateMutation = trpc.settings.userSafes.confirmCreate.useMutation({
    onSuccess: (data, variables) => {
      const explorerUrl = `https://basescan.org/tx/${variables.transactionHash}`;
      toast.success(
        <div className='flex flex-col'>
          <span>{data.message || `${creatingType} safe confirmed and saved!`}</span>
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-blue-600">
            View Transaction
          </a>
        </div>
      );
      utils.settings.userSafes.list.invalidate();
      queryClient.invalidateQueries({ queryKey: ['userSafes'] });
      queryClient.invalidateQueries({ queryKey: ['allocationState'] });
    },
    onError: (error, variables) => {
      console.error('Error confirming safe creation:', error);
      const explorerUrl = `https://basescan.org/tx/${variables.transactionHash}`;
      toast.error(
         <div className='flex flex-col'>
           <span>{`Failed to confirm deployment on server: ${error.message}.`}</span>
           <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-blue-600">
             Check transaction status manually
           </a>
           <span className="text-xs">Contact support if the issue persists.</span>
         </div>
      );
    },
    onSettled: () => {
      setIsConfirming(false);
      setCreatingType(null);
      setCreationStatus(null);
    },
  });

  const registerPrimaryMutation = trpc.settings.userSafes.registerPrimary.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || `Primary safe registered successfully!`);
      utils.settings.userSafes.list.invalidate();
      setRegisteringAddress('');
    },
    onError: (error) => {
      toast.error(`Error registering primary safe: ${error.message}`);
    },
  });

  const { primarySafe, existingSecondarySafes, missingSecondaryTypes } = useMemo(() => {
    if (!safes) {
      return { primarySafe: null, existingSecondarySafes: [], missingSecondaryTypes: SECONDARY_SAFE_TYPES };
    }
    const primary = safes.find(s => s.safeType === 'primary');
    const existingSecondary = safes.filter(s => isSecondarySafeType(s.safeType));
    
    const existingTypes = new Set(existingSecondary.map(s => s.safeType));
    const missing = SECONDARY_SAFE_TYPES.filter(type => !existingTypes.has(type));
    
    return { primarySafe: primary, existingSecondarySafes: existingSecondary, missingSecondaryTypes: missing }; 
  }, [safes]);

  const handleCreateClick = useCallback((safeType: Exclude<SafeType, 'primary'>) => {
    if (!primarySafe) {
        toast.error("Cannot create secondary safe without a registered primary safe.");
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
    setCreationStatus(null);
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

  const BASE_EXPLORER_URL = 'https://basescan.org/address/';

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Safe Management</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading your safes...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle>Safe Management</CardTitle></CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Safes</AlertTitle>
            <AlertDescription>
              {fetchError?.message || 'Could not fetch your safe details. Please try again later.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safe Management</CardTitle>
        <CardDescription>
          Manage your Gnosis Safes used for allocations. Primary safe needs manual setup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!primarySafe && (
          <div className="space-y-4">
            <Alert variant="default" className="border-blue-500/50 bg-blue-50 text-blue-800">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Register Your Primary Safe</AlertTitle>
              <AlertDescription className="text-blue-700 space-y-1">
                <p>We couldn&apos;t find a primary safe linked to your account.</p>
                <p>1. Create a new Safe on Base network via{' '}
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
                <p>3. Paste the new Safe address below and click Register.</p>
              </AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter Primary Safe Address (0x...)"
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
                <p className="font-medium text-sm text-green-800">Primary Safe Connected</p>
                <div className="flex items-center space-x-1">
                  <a 
                    href={`${BASE_EXPLORER_URL}${primarySafe.safeAddress}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-gray-600 hover:underline hover:text-blue-600 truncate font-mono"
                    title="View on Block Explorer"
                  >
                    {primarySafe.safeAddress}
                  </a>
                   <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-gray-700" onClick={() => copyToClipboard(primarySafe.safeAddress)}>
                     <Copy className="h-3 w-3" />
                   </Button>
                   <a href={`${BASE_EXPLORER_URL}${primarySafe.safeAddress}`} target="_blank" rel="noopener noreferrer" title="View on Block Explorer">
                      <ExternalLink className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                   </a>
                </div>
              </div>
            </div>

            {existingSecondarySafes.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium text-gray-600">Connected Secondary Safes:</h4>
                {existingSecondarySafes.map((safe) => (
                  <div key={safe.id} className="flex items-center p-2 border rounded-md text-sm">
                    <Building className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium capitalize mr-2">{safe.safeType} Safe:</span>
                    <div className="flex items-center space-x-1">
                        <a 
                           href={`${BASE_EXPLORER_URL}${safe.safeAddress}`} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="text-gray-500 hover:underline hover:text-blue-600 truncate font-mono text-xs"
                           title="View on Block Explorer"
                        >
                            {safe.safeAddress}
                        </a>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-gray-700" onClick={() => copyToClipboard(safe.safeAddress)}>
                           <Copy className="h-3 w-3" />
                        </Button>
                        <a href={`${BASE_EXPLORER_URL}${safe.safeAddress}`} target="_blank" rel="noopener noreferrer" title="View on Block Explorer">
                            <ExternalLink className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                        </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {missingSecondaryTypes.length > 0 && (
              <div className="space-y-3 pt-4">
                <h4 className="text-sm font-medium text-gray-600">Create Missing Safes:</h4>
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
                     `Create ${type.charAt(0).toUpperCase() + type.slice(1)} Safe`}
                  </Button>
                ))}
                {isProcessingCreation && creationStatus && (
                   <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
                     <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                     <span>{creationStatus}</span>
                   </div>
                 )}
                <p className="text-xs text-gray-500">These safes will be owned by your Primary Safe.</p>
              </div>
            )}

            {missingSecondaryTypes.length === 0 && existingSecondarySafes.length === SECONDARY_SAFE_TYPES.length && (
              <p className="text-sm text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1.5" /> All required secondary safes are connected.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 