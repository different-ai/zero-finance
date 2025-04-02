'use client';

import { useState } from 'react';
import { usePrivy, useCreateWallet, useUser, useWallets } from '@privy-io/react-auth';
// Update imports based on documentation pattern
import Safe from '@safe-global/protocol-kit';
import { ethers } from 'ethers'; 
import { base } from 'viem/chains';
import { type Address } from 'viem';
// Define OperationType enum directly if not exported
// This matches the definition in the Safe SDK documentation
enum OperationTypes {
  Call = 0,
  DelegateCall = 1
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LiveBalance from '@/components/live-balance';
import AllocationPlaceholders from '@/components/allocation-placeholders';
import SwapForm from '@/components/swap-form';
import { UserPill } from '@privy-io/react-auth/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { encodeEthToUsdcSwapData } from '@/lib/swap-service';


// Define constants for Safe setup
const SAFE_ADDRESS: Address = process.env.NEXT_PUBLIC_SAFE_ADDRESS as Address;
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL as string;

export default function HomePage() {
  const { ready, authenticated, user, login } = usePrivy();
  const { wallets } = useWallets(); 
  const { refreshUser } = useUser();
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [swapStatus, setSwapStatus] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);

  const { createWallet } = useCreateWallet({
    onSuccess: (wallet) => {
      console.log('0xHypr Wallet created/found:', wallet);
      setIsCreatingWallet(false);
      setWalletError(null);
      refreshUser();
    },
    onError: (error) => {
      console.error('0xHypr Failed to create wallet:', error);
      setWalletError('Failed to create or retrieve wallet. Please try again.');
      setIsCreatingWallet(false);
    }
  });

  const handleCreateWalletClick = async () => {
    setIsCreatingWallet(true);
    setWalletError(null);
    await createWallet();
  };

  // Updated swap handler based on documentation pattern
  const handleInitiateSwap = async (ethAmount: string) => {
    setSwapStatus('Processing...');
    setSwapError(null);
    
    if (!SAFE_ADDRESS) {
      setSwapError('Safe address is not configured.');
      setSwapStatus(null);
      return;
    }

    if (!BASE_RPC_URL) {
      setSwapError('Base RPC URL is not configured.');
      setSwapStatus(null);
      return;
    }

    const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
    if (!embeddedWallet) {
      setSwapError('Privy embedded wallet not found.');
      setSwapStatus(null);
      return;
    }

    try {
      setSwapStatus('Connecting wallet...');
      await embeddedWallet.switchChain(base.id);
      const provider = await embeddedWallet.getEthereumProvider();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      const signerAddress = await signer.getAddress();
      
      setSwapStatus('Initializing Safe SDK...');
      console.log('0xHypr Safe setup:', { 
        provider: BASE_RPC_URL,
        signer: signerAddress,
        safeAddress: SAFE_ADDRESS
      });
      
      // Initialize Protocol Kit with Safe.init pattern
      const protocolKit = await Safe.init({
        provider: BASE_RPC_URL,
        signer: signerAddress, 
        safeAddress: SAFE_ADDRESS
      });
      
      console.log('0xHypr Protocol Kit initialized');
      
      // Encode the swap data
      setSwapStatus('Encoding swap data...');
      const swapData = encodeEthToUsdcSwapData(ethAmount, SAFE_ADDRESS);
      console.log('0xHypr Swap data:', swapData);
      
      // Convert bigint to string for transaction value
      const valueString = swapData.value.toString();
      
      // Create transaction data
      // Use a type assertion to bypass the type checking since we know the structure
      // is correct but the enum is causing issues
      const safeTransactionData = {
        to: swapData.to,
        value: valueString, // Include the ETH value directly in the transaction
        data: swapData.data,
        operation: 0 // Call operation (0)
      };
      
      setSwapStatus('Creating transaction...');
      // Create the transaction with the pattern from docs
      const safeTransaction = await protocolKit.createTransaction({
        transactions: [safeTransactionData]
      });
      
      console.log('0xHypr Safe transaction created:', safeTransaction);
      
      // Execute the transaction
      setSwapStatus('Executing transaction...');
      const executeTxResponse = await protocolKit.executeTransaction(
        safeTransaction,
        { gasLimit: 1000000 } // Add appropriate gas limit
      );
      
      setSwapStatus('Waiting for confirmation...');
      console.log('0xHypr Transaction response:', executeTxResponse);
      
      // Handle transaction response - adjust based on actual response shape
      // Cast to any temporarily until we know the exact structure
      const txResponse = (executeTxResponse as any).transactionResponse;
      if (txResponse && typeof txResponse.wait === 'function') {
        const receipt = await txResponse.wait();
        console.log('0xHypr Transaction receipt:', receipt);
        setSwapStatus(`Swap completed! Hash: ${receipt.transactionHash}`);
      } else {
        console.log('0xHypr Transaction executed:', executeTxResponse);
        setSwapStatus('Swap completed!');
      }
      
      setTimeout(() => setSwapStatus(null), 5000);
      
    } catch (error: any) {
      console.error('0xHypr Swap error:', error);
      setSwapError(`Swap failed: ${error.message || 'Unknown error'}`);
      setSwapStatus(null);
    }
  };


  // Wait until Privy is ready before rendering
  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center">Loading authentication...</div>;
  }

  // Determine the primary identifier to display
  const displayIdentifier = user?.wallet?.address
    ?? user?.email?.address
    ?? user?.phone?.number
    ?? 'Not available';

  const identifierType = user?.wallet?.address ? 'Wallet'
    : user?.email?.address ? 'Email'
    : user?.phone?.number ? 'Phone'
    : 'Account';

  const hasEmbeddedWallet = !!user?.wallet;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute top-4 right-4">
        <UserPill />
      </div>

      <Card className="w-full max-w-lg shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 p-6">
          <CardTitle className="text-center text-2xl font-bold text-gray-800">My Automated Treasury</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center space-y-6">
          {authenticated ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full mb-6">
                <LiveBalance />
              </div>
              <div className="w-full mb-6">
                <AllocationPlaceholders />
              </div>

              {hasEmbeddedWallet && (
                  <div className="w-full mb-6">
                      <SwapForm onInitiateSwap={handleInitiateSwap} />
                      {swapStatus && <p className="text-xs text-blue-600 mt-2 text-center">{swapStatus}</p>}
                      {swapError && <p className="text-xs text-red-600 mt-2 text-center">{swapError}</p>}
                  </div>
              )}

              <div className="w-full text-center border-t pt-4 mt-4">
                 <p className="text-xs text-gray-500 mb-1">Connected {identifierType}:</p>
                 {isCreatingWallet ? (
                   <Skeleton className="h-5 w-3/4 mx-auto" />
                 ) : (
                   <p className="text-sm font-mono text-gray-700 break-all">{displayIdentifier}</p>
                 )}
                 {!hasEmbeddedWallet && !isCreatingWallet && (
                   <Button
                     onClick={handleCreateWalletClick}
                     variant="link"
                     size="sm"
                     className="mt-2 text-blue-600"
                   >
                     Create / View Embedded Wallet
                   </Button>
                 )}
                 {walletError && <p className="text-xs text-red-500 mt-1">{walletError}</p>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 py-8">
               <p className="text-gray-600 text-center">Log in to view your treasury balance.</p>
               <Button onClick={login} size="lg">Log In</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}