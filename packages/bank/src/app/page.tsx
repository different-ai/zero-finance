'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useCreateWallet, useUser, useWallets } from '@privy-io/react-auth';
// Import Viem essentials
import { 
  createWalletClient, 
  createPublicClient, 
  custom, 
  http, 
  type Address,
  getAddress
} from 'viem';
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
import AllocationDisplay from '@/components/allocation-display';
import SwapForm from '@/components/swap-form';
import { UserPill } from '@privy-io/react-auth/ui';
import { Skeleton } from '@/components/ui/skeleton';
// Import the LI.FI function, comment out others
import { getLifiQuoteAndTxData } from '@/lib/swap-service'; 
// import { get1inchSwapData } from '@/lib/swap-service';
// import { encodeEthToUsdcSwapData } from '@/lib/swap-service';
import { logTransactionDebug } from '@/lib/debug-utils';


// Define constants for Safe setup
const SAFE_ADDRESS: Address = process.env.NEXT_PUBLIC_SAFE_ADDRESS as Address;
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL as string;

// Transaction debugging helper
const debugTransaction = async (txHash: string) => {
  if (!BASE_RPC_URL) {
    console.error("0xHypr BASE_RPC_URL not configured");
    return;
  }
  
  try {
    // Create a public client to query the blockchain
    const debugClient = createPublicClient({
      chain: base,
      transport: http(BASE_RPC_URL)
    });
    
    // Get transaction details and receipt
    const tx = await debugClient.getTransaction({ hash: txHash as `0x${string}` });
    const receipt = await debugClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
    
    console.log("0xHypr Transaction Debug Results:");
    console.log("Status:", receipt.status);
    console.log("From:", tx.from);
    console.log("To:", tx.to);
    console.log("Value:", tx.value.toString());
    console.log("Gas limit:", tx.gas.toString());
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("Gas price:", tx.gasPrice?.toString());
    console.log("Block number:", receipt.blockNumber);
    
    // Check for logs that might contain error information
    if (receipt.status === 'reverted') {
      console.log("0xHypr Transaction reverted!");
      
      try {
        // Try to simulate to get a more specific error
        const error = await debugClient.simulateContract({
          address: tx.to as Address,
          abi: [], // Empty ABI just to trigger the error
          functionName: '', 
          args: [],
          account: tx.from,
          value: tx.value
        }).catch(err => err);
        
        console.log("0xHypr Simulation error:", error);
      } catch (simError) {
        console.log("0xHypr Simulation failed:", simError);
      }
      
      // Log transaction logs which may contain error details
      if (receipt.logs.length > 0) {
        console.log("0xHypr Transaction logs:", receipt.logs);
      }
    }
    
    return { tx, receipt };
  } catch (error) {
    console.error("0xHypr Error debugging transaction:", error);
  }
};

export default function HomePage() {
  const { ready, authenticated, user, login } = usePrivy();
  const { wallets } = useWallets(); 
  const { refreshUser } = useUser();
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [swapStatus, setSwapStatus] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [safeBalance, setSafeBalance] = useState<string | null>(null);

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

  // Function to debug a transaction by hash
  const handleDebugTransaction = async () => {
    const txHash = prompt("Enter transaction hash to debug:");
    if (!txHash) return;
    
    setSwapStatus('Debugging transaction...');
    await logTransactionDebug(txHash);
    setSwapStatus(null);
  };

  // Refactored swap handler using LI.FI Aggregator API
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
    
    // Ensure SAFE_ADDRESS is checksummed
    const checksummedSafeAddress = getAddress(SAFE_ADDRESS);
    const fromAddress = embeddedWallet.address as Address;

    try {
      setSwapStatus('Connecting wallet & creating Viem clients...');
      await embeddedWallet.switchChain(base.id);
      const ethereumProvider = await embeddedWallet.getEthereumProvider();
      
      // Create Viem Wallet Client (needed for SDK init)
      const walletClient = createWalletClient({
        account: fromAddress,
        chain: base,
        transport: custom(ethereumProvider)
      });

      // Create Viem Public Client (for waiting for receipts)
      const publicClient = createPublicClient({
        chain: base,
        transport: http(BASE_RPC_URL)
      });
      
      console.log('0xHypr Viem Clients created');

      setSwapStatus('Initializing Safe SDK with Viem...');
      
      // Initialize Safe
      const safeSdk = await Safe.init({
        provider: ethereumProvider,
        signer: fromAddress,
        safeAddress: checksummedSafeAddress
      });
      
      console.log('0xHypr Protocol Kit initialized with Viem');
      
      // Get swap data from LI.FI API
      setSwapStatus('Fetching swap data from LI.FI...');
      const swapTxDataFromLifi = await getLifiQuoteAndTxData(
        ethAmount, 
        fromAddress, // EOA performs the swap actions
        checksummedSafeAddress // Safe address is the final recipient
      );
      console.log('0xHypr Swap data from LI.FI:', swapTxDataFromLifi);
      
      // Create Safe transaction data using the response from LI.FI
      const safeTransactionData = {
        to: swapTxDataFromLifi.to,
        value: swapTxDataFromLifi.value.toString(), // Convert bigint to string
        data: swapTxDataFromLifi.data,
        operation: 0 // Call operation (0)
      };
      
      setSwapStatus('Creating Safe transaction...');
      const safeTransaction = await safeSdk.createTransaction({
        transactions: [safeTransactionData]
      });
      
      console.log('0xHypr Safe transaction created:', safeTransaction);
      
      // Execute the transaction via the Safe
      setSwapStatus('Executing Safe transaction...');
      
      try {
        const executeTxResponse = await safeSdk.executeTransaction(
          safeTransaction,
          { gasLimit: swapTxDataFromLifi.estimatedGas ? BigInt(swapTxDataFromLifi.estimatedGas) : 1000000n } // Use LI.FI gas estimate if available
        );
        
        console.log('0xHypr Safe Transaction response:', executeTxResponse);
        setSwapStatus('Waiting for confirmation...');
        
        // Extract transaction hash
        let txHash: `0x${string}` | undefined;
        
        if (typeof executeTxResponse === 'string') {
          const stringResponse = executeTxResponse as string;
          if (stringResponse.startsWith('0x')) {
            txHash = stringResponse as `0x${string}`;
          }
        } else if (executeTxResponse && typeof executeTxResponse === 'object') {
          const txResponse = executeTxResponse as Record<string, any>;
          
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
          
          try {
            // Wait for transaction receipt
            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
            
            if (receipt.status === 'success') {
              console.log('0xHypr Transaction receipt:', receipt);
              setSwapStatus(`Swap via Safe completed! Hash: ${receipt.transactionHash}`);
            } else {
              console.error('0xHypr Transaction reverted!');
              setSwapError(`Swap failed: Transaction reverted via Safe. See console.`);
              setSwapStatus(null);
              await logTransactionDebug(txHash);
            }
          } catch (waitError) {
            console.error('0xHypr Error waiting for transaction:', waitError);
            setSwapError(`Error confirming Safe transaction: ${waitError instanceof Error ? waitError.message : 'Unknown error'}`);
            setSwapStatus(null);
          }
        } else {
          console.log('0xHypr Safe transaction executed but hash not found:', executeTxResponse);
          setSwapStatus('Swap via Safe executed (confirmation pending).');
          setTimeout(() => setSwapStatus(null), 5000);
        }
      } catch (execError) {
        console.error('0xHypr Safe Transaction execution error:', execError);
        let errorMessage = 'Unknown error executing Safe transaction';
        if (execError instanceof Error) errorMessage = execError.message;
        setSwapError(`Swap via Safe failed: ${errorMessage}`);
        setSwapStatus(null);
      }
    } catch (error: any) {
      console.error('0xHypr Swap setup error:', error);
      setSwapError(`Swap failed during setup: ${error.message || 'Unknown error'}`);
      setSwapStatus(null);
    }
  };

  // Function to fetch Safe ETH balance
  const fetchSafeBalance = async () => {
    if (!BASE_RPC_URL || !SAFE_ADDRESS) {
      console.error("0xHypr BASE_RPC_URL or SAFE_ADDRESS not configured");
      return;
    }

    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http(BASE_RPC_URL)
      });
      
      const balance = await publicClient.getBalance({
        address: SAFE_ADDRESS
      });
      
      // Format balance in ETH with 4 decimal places
      const formattedBalance = (Number(balance) / 10**18).toFixed(4);
      console.log(`0xHypr Safe ETH balance: ${formattedBalance} ETH`);
      
      setSafeBalance(formattedBalance);
    } catch (error) {
      console.error("0xHypr Error fetching Safe balance:", error);
      setSafeBalance(null);
    }
  };

  // Fetch Safe balance when component mounts or wallets change
  useEffect(() => {
    if (authenticated && ready && SAFE_ADDRESS) {
      fetchSafeBalance();
    }
  }, [authenticated, ready, wallets]);

  // Refetch balance after a successful swap
  useEffect(() => {
    if (swapStatus && swapStatus.includes("completed")) {
      // Add a small delay to allow blockchain to update
      const timer = setTimeout(() => {
        fetchSafeBalance();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [swapStatus]);

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
                <AllocationDisplay />
              </div>

              {hasEmbeddedWallet && (
                  <div className="w-full mb-6">
                      <SwapForm 
                        onInitiateSwap={handleInitiateSwap} 
                        safeBalance={safeBalance}
                      />
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