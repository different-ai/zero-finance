'use client';

import { useState } from 'react';
import { usePrivy, useCreateWallet, useUser, useWallets } from '@privy-io/react-auth';
// Import Viem essentials
import { createWalletClient, createPublicClient, custom, http, type Address } from 'viem';
import { base } from 'viem/chains';
// Keep Safe import
import Safe from '@safe-global/protocol-kit';
// Remove ethers
// import { ethers } from 'ethers'; 

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

  // Refactored swap handler using Viem
  const handleInitiateSwap = async (ethAmount: string) => {
    setSwapStatus('Processing...');
    setSwapError(null);
    
    if (!SAFE_ADDRESS || !BASE_RPC_URL) {
      setSwapError('Configuration error: Safe address or RPC URL missing.');
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
      setSwapStatus('Connecting wallet & creating Viem clients...');
      await embeddedWallet.switchChain(base.id);
      const ethereumProvider = await embeddedWallet.getEthereumProvider();
      
      // Create Viem Wallet Client from Privy provider - following the Privy Signer doc pattern
      const walletClient = createWalletClient({
        account: embeddedWallet.address as Address, // Use the embedded wallet's address
        chain: base,
        transport: custom(ethereumProvider)
      });

      // Create Viem Public Client for reading chain data / waiting for receipts
      const publicClient = createPublicClient({
        chain: base,
        transport: http(BASE_RPC_URL)
      });
      
      console.log('0xHypr Viem Clients created', { 
        walletClientAccount: walletClient.account,
        publicClientChain: publicClient.chain.id
      });

      setSwapStatus('Initializing Safe SDK with Viem...');
      
      // Initialize Safe following the Privy Signer pattern
      // We'll pass the raw ethereumProvider which satisfies the Eip1193Provider type
      const safeSdk = await Safe.init({
        provider: ethereumProvider, // Raw provider instead of walletClient
        signer: embeddedWallet.address as Address,
        safeAddress: SAFE_ADDRESS
      });
      
      console.log('0xHypr Protocol Kit initialized with Viem');
      
      // Encode the swap data
      setSwapStatus('Encoding swap data...');
      const swapData = encodeEthToUsdcSwapData(ethAmount, SAFE_ADDRESS);
      console.log('0xHypr Swap data:', swapData);
      
      // Create transaction data (Viem uses bigint for value)
      const safeTransactionData = {
        to: swapData.to,
        value: swapData.value.toString(), // Convert bigint to string as Safe SDK might expect
        data: swapData.data,
        operation: 0 // Use number directly instead of enum to avoid type mismatch
      };
      
      setSwapStatus('Creating transaction...');
      const safeTransaction = await safeSdk.createTransaction({
        transactions: [safeTransactionData]
      });
      
      console.log('0xHypr Safe transaction created:', safeTransaction);
      
      // Execute the transaction
      setSwapStatus('Executing transaction...');
      const executeTxResponse = await safeSdk.executeTransaction(
        safeTransaction,
        { gasLimit: 1000000 } 
      );
      
      setSwapStatus('Waiting for confirmation...');
      console.log('0xHypr Transaction response:', executeTxResponse);
      
      // Handle transaction confirmation - type-safe approach
      // Since we don't know the exact structure, use type assertions carefully
      let txHash: `0x${string}` | undefined;
      
      // Try different possibilities based on potential response structures
      if (typeof executeTxResponse === 'string') {
        // Check it's a valid hex string starting with 0x
        const stringResponse = executeTxResponse as string;
        if (stringResponse.startsWith('0x')) {
          txHash = stringResponse as `0x${string}`;
        }
      } else if (executeTxResponse && typeof executeTxResponse === 'object') {
        const txResponse = executeTxResponse as Record<string, any>;
        
        // Try common hash property names
        if (txResponse.hash && typeof txResponse.hash === 'string') {
          txHash = txResponse.hash as `0x${string}`;
        } else if (txResponse.transactionResponse && 
                  typeof txResponse.transactionResponse === 'object' && 
                  txResponse.transactionResponse.hash) {
          txHash = txResponse.transactionResponse.hash as `0x${string}`;
        }
      }
      
      if (txHash) {
        console.log('0xHypr Transaction hash:', txHash);
        // Wait for transaction receipt using Viem Public Client
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log('0xHypr Transaction receipt:', receipt);
        setSwapStatus(`Swap completed! Hash: ${receipt.transactionHash}`);
      } else {
        // If we couldn't extract a hash, the transaction might already be confirmed
        console.log('0xHypr Transaction executed but hash not found in response:', executeTxResponse);
        setSwapStatus('Swap executed successfully.');
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