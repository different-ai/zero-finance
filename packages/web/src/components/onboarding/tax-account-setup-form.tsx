'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWallets } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Building } from 'lucide-react';
import { toast } from 'sonner';
import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';
import { trpc } from '@/lib/trpc';
import { useUserSafes } from '@/hooks/use-user-safes'; // Reuse hook to check if tax safe already exists
import type { Address, Hex } from 'viem'; // Import Address type

interface TaxAccountSetupFormProps {
  onSetupComplete: () => void;
}

export function TaxAccountSetupForm({ onSetupComplete }: TaxAccountSetupFormProps) {
  const queryClient = useQueryClient();
  const { data: safes, isLoading: isLoadingSafes } = useUserSafes();
  const { wallets } = useWallets();
  const { getClientForChain } = useSmartWallets(); // Use smart wallet hook
  
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [creationStatus, setCreationStatus] = useState<string | null>(null);

  const embeddedWallet = useMemo(() => wallets.find((w: any) => w.walletClientType === 'privy'), [wallets]);
  const utils = trpc.useUtils();

  const taxSafeExists = useMemo(() => {
     return safes?.some(s => s.safeType === 'tax');
  }, [safes]);

  // --- tRPC Mutations (similar to SafeManagementCard) ---

  const prepareCreateMutation = trpc.settings.userSafes.prepareCreate.useMutation({
     onSuccess: async (data) => {
       console.log('Tax Safe creation prepared:', data);
       let toastId: string | number | undefined;
       
       if (!embeddedWallet) {
         toast.error("Privy embedded wallet not found.");
         setIsPreparing(false);
         setCreationStatus(null);
         return;
       }

       // --- Start using Smart Wallet Client ---
       let smartWalletClient: ReturnType<typeof createWalletClient> | null = null;
       try {
          setCreationStatus('Initializing Smart Wallet Client...');
          smartWalletClient = await getClientForChain({ id: base.id });
          if (!smartWalletClient) {
            throw new Error('Failed to get Privy Smart Wallet client for Base.');
          }
          // Optional: Ensure smart wallet is deployed (though it should be by this point)
          // const smartWalletAddress = smartWalletClient.account.address;
          // console.log(`Using Privy Smart Wallet: ${smartWalletAddress}`);

       } catch (clientError: any) {
          console.error("Error getting Privy Smart Wallet client:", clientError);
          toast.error(`Failed to initialize Smart Wallet: ${clientError.message}`);
          setIsPreparing(false);
          setCreationStatus(null);
          return;
       }
       // --- End Smart Wallet Client Init ---

       try {
         setCreationStatus('Preparing Tax Safe...');
         toastId = toast.loading('Preparing Tax Safe deployment...');

         // Check EOA wallet chain, not smart wallet client's chain
         const connectedChainId = embeddedWallet.chainId; 
         if (connectedChainId !== `eip155:${base.id}`) {
           toast.info('Requesting network switch to Base...', { id: toastId });
           setCreationStatus('Requesting network switch...');
           await embeddedWallet.switchChain(base.id);
           const newChainId = embeddedWallet.chainId;
           if (newChainId !== `eip155:${base.id}`) {
             toast.error(`Please switch to Base network (ID: ${base.id}) and try again.`, { id: toastId });
             setIsPreparing(false);
             setCreationStatus(null);
             return;
           }
           toast.success('Switched to Base network.', { id: toastId });
           toastId = toast.loading('Preparing Tax Safe deployment...');
         }
         
         // No need for explicit confirmation toast here, 
         // sendTransaction with smart wallet client handles it.
         // toast.info('Please confirm the deployment transaction in your wallet.', { id: toastId });
         
         // REMOVED: Don't need EOA walletClient anymore
         // const provider = await embeddedWallet.getEthereumProvider();
         // const walletClient = createWalletClient({
         //   account: embeddedWallet.address as `0x${string}`,
         //   chain: base,
         //   transport: custom(provider)
         // });
         
         // Transaction data from backend is correct
         const transactionRequest = {
           // account: smartWalletClient.account, // Not needed for sendTransaction call
           to: data.transaction.to as Address,
           chain: base,
           data: data.transaction.data as Hex,
           value: BigInt(data.transaction.value),
         };

         setIsPreparing(false);
         setIsSending(true);
         setCreationStatus('Sending transaction via Smart Wallet...');
         toast.loading('Sending deployment transaction (sponsored)... Please wait', { id: toastId });

         // Send using the Privy Smart Wallet client for sponsorship
         const txHash = await smartWalletClient.sendTransaction(transactionRequest);

         console.log('Tax Safe deployment UserOperation submitted:', txHash); // This is likely a UserOp hash
         // Update toast for UserOp submission
         toast.success(`Deployment UserOperation submitted! Hash: ${txHash.slice(0, 10)}...`, { id: toastId });
         toastId = toast.loading('Waiting for network confirmation for Tax safe...');
         
         setIsSending(false);
         setIsConfirming(true);
         setCreationStatus('Confirming transaction on network...');

         // TODO: Polling/Waiting for UserOperation receipt might be needed here 
         //       to get the actual transaction hash before calling confirmCreate.
         //       For now, optimistically assuming UserOp hash is sufficient, 
         //       but backend confirm might fail if it needs the real tx hash.
         //       See create-safe/page.tsx for polling/waitForUserOp examples.

         confirmCreateMutation.mutate({
           safeType: 'tax', // Hardcoded to 'tax'
           predictedAddress: data.predictedAddress,
           transactionHash: txHash // Pass UserOp hash for now
         });

       } catch (error: any) {
         console.error('Error during Tax Safe deployment transaction:', error);
         let errorMessage = 'An unknown error occurred during deployment.';
         // Check for common Privy/Smart Wallet errors if possible
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
         setCreationStatus(null);
       }
     },
     onError: (error) => {
       console.error('Error preparing Tax Safe creation:', error);
       toast.error(`Failed to prepare Tax Safe deployment: ${error.message}`);
       setIsPreparing(false);
       setCreationStatus(null);
     },
   });

   const confirmCreateMutation = trpc.settings.userSafes.confirmCreate.useMutation({
     onSuccess: (data, variables) => {
       const explorerUrl = `https://basescan.org/tx/${variables.transactionHash}`;
       toast.success(
         <div className='flex flex-col'>
           <span>{data.message || 'Tax Reserve account confirmed and saved!'}</span>
           <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-blue-600">
             View Transaction
           </a>
         </div>
       );
       utils.settings.userSafes.list.invalidate(); // Invalidate safes list
       queryClient.invalidateQueries({ queryKey: ['userSafes'] }); // Invalidate hook
       queryClient.invalidateQueries({ queryKey: ['allocationState'] });
       onSetupComplete(); // Call the callback to proceed
     },
     onError: (error, variables) => {
       console.error('Error confirming Tax Safe creation:', error);
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
       setCreationStatus(null);
     },
   });

   // --- Action Handler ---

   const handleCreateTaxSafe = useCallback(() => {
     if (isPreparing || isSending || isConfirming) {
       toast.warning("Please wait for the current operation to complete.");
       return;
     }
     setIsPreparing(true);
     setIsSending(false);
     setIsConfirming(false);
     setCreationStatus(null);
     prepareCreateMutation.mutate({ safeType: 'tax' }); // Always 'tax'
   }, [isPreparing, isSending, isConfirming, prepareCreateMutation]);

   const isProcessingCreation = isPreparing || isSending || isConfirming;

   // --- Render Logic ---

   if (isLoadingSafes) {
     return (
       <div className="flex items-center justify-center p-4">
         <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
         <span className="ml-2 text-sm text-muted-foreground">Checking account status...</span>
       </div>
     );
   }

   if (taxSafeExists) {
     return (
       <div className='space-y-4'>
          <Alert variant='default' className='border-green-500/50 bg-green-50 text-green-800'>
             <CheckCircle className='h-4 w-4 text-green-600' />
             <AlertTitle className='text-green-900'>Tax Reserve Ready</AlertTitle>
             <AlertDescription className='text-green-700'>
               Your Tax Reserve account is already set up.
             </AlertDescription>
          </Alert>
          <Button onClick={onSetupComplete} className='w-full'>Continue</Button>
       </div>
     );
   }

   return (
     <div className="space-y-4">
       <Button
         onClick={handleCreateTaxSafe}
         disabled={isProcessingCreation}
         className="w-full"
       >
         {isProcessingCreation ? (
           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
         ) : (
           <Building className="mr-2 h-4 w-4" />
         )}
         {isPreparing ? 'Preparing...' : 
          isSending ? 'Sending Tx...' : 
          isConfirming ? 'Confirming...' : 
          'Create Tax Reserve Account'}
       </Button>

       {isProcessingCreation && creationStatus && (
         <div className="flex items-center justify-center text-xs text-muted-foreground pt-2">
           <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
           <span>{creationStatus}</span>
         </div>
       )}

       {!isProcessingCreation && (
          <p className="text-xs text-center text-muted-foreground">
            This action will initiate a sponsored transaction via your Smart Wallet.
          </p>
       )}
     </div>
   );
} 