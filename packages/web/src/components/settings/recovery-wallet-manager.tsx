"use client";

import { useState, useCallback } from 'react';
import { Address, isAddress, encodeFunctionData, createPublicClient, http } from 'viem';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
import { base } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { api } from '@/trpc/react';

// Placeholder ABI - Replace with actual Gnosis Safe L2 ABI if different
const safeAbi = [
  {
    "constant": true,
    "inputs": [],
    "name": "getThreshold",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "_threshold",
        "type": "uint256"
      }
    ],
    "name": "addOwnerWithThreshold",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const; // Use 'as const' for better type inference with viem

// Define RPC URL - Consider moving to a shared config or env variable access pattern
const RPC_URL = getBaseRpcUrl();
const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

interface RecoveryWalletManagerProps {
  primarySafeAddress: Address | null | undefined;
}

export function RecoveryWalletManager({ primarySafeAddress }: RecoveryWalletManagerProps) {
  const [recoveryAddress, setRecoveryAddress] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { ready: isRelayReady, send: sendSponsoredTx } = useSafeRelay(primarySafeAddress ?? undefined);

  // Check if current user is owner of this Safe
  const { data: safes } = api.safe.list.useQuery();
  const currentSafe = safes?.find(s => s.safeAddress === primarySafeAddress);
  const isOwner = currentSafe?.isOwner ?? true; // Default to true for backward compatibility

  const handleAddRecoveryWallet = useCallback(async () => {
    if (!isRelayReady || !primarySafeAddress) {
      toast.error("Safe relay service not ready or Safe address missing.");
      return;
    }
    if (!isAddress(recoveryAddress)) {
      toast.error("Invalid recovery wallet address provided.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Preparing transaction...");

    try {
      // 1. Get current threshold
      toast.info("Fetching current Safe threshold...", { id: toastId });
      const currentThreshold = await publicClient.readContract({
        address: primarySafeAddress,
        abi: safeAbi,
        functionName: 'getThreshold',
      });

      // Keep the threshold the same when adding a recovery owner
      const newThreshold = currentThreshold;
      toast.info(`Current threshold is ${currentThreshold}. Adding owner with threshold ${newThreshold}.`, { id: toastId });

      // 2. Encode addOwnerWithThreshold transaction data
      const txData = encodeFunctionData({
        abi: safeAbi,
        functionName: 'addOwnerWithThreshold',
        args: [recoveryAddress as Address, newThreshold],
      });

      // 3. Prepare transaction for the relay hook
      const transactions: MetaTransactionData[] = [
        {
          to: primarySafeAddress,
          value: '0', // Value is 0 for this operation
          data: txData,
        },
      ];

      // 4. Send the sponsored transaction
      toast.loading("Sending sponsored transaction via relay...", { id: toastId });
      const txHash = await sendSponsoredTx(transactions);
      toast.success(`Recovery wallet addition submitted! Tx Hash: ${txHash.substring(0,10)}...`, {
         id: toastId,
         description: "It may take a moment to confirm onchain.",
         action: {
            label: 'View on Explorer',
            onClick: () => window.open(`https://basescan.org/tx/${txHash}`, '_blank'),
          },
       });
      setRecoveryAddress(''); // Clear input on success

    } catch (error: any) {
      console.error("Error adding recovery wallet:", error);
      // Attempt to parse privy error
      let message = "An unknown error occurred.";
       if (error?.message) {
         try {
             // Privy often wraps errors in a JSON string within the message
             const parsedError = JSON.parse(error.message.substring(error.message.indexOf('{')));
             message = parsedError.error?.message || parsedError.message || error.message;
         } catch (parseError) {
             // If parsing fails, use the original message or a specific part
              message = error.shortMessage || error.message;
         }
       }
      toast.error(`Failed to add recovery wallet: ${message}`, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  }, [primarySafeAddress, recoveryAddress, isRelayReady, sendSponsoredTx]);

  const isLoading = isProcessing;

  if (!primarySafeAddress) {
    // Don't show the card if no primary safe is detected yet,
    // let the parent component handle loading/error states for safes.
    return null;
  }

  // Show read-only message if user is not an owner
  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recovery Wallet</CardTitle>
          <CardDescription>Add an additional owner wallet to your Safe.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to modify this Safe. Only Safe owners can add recovery wallets.
              {currentSafe?.createdBy && (
                <span className="block mt-1 text-xs text-muted-foreground">
                  This Safe is owned by another workspace member.
                </span>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery Wallet</CardTitle>
        <CardDescription>Add an additional owner wallet to your Safe. </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recovery-address">Recovery Wallet Address</Label>
          <Input
            id="recovery-address"
            placeholder="0x..."
            value={recoveryAddress}
            onChange={(e) => setRecoveryAddress(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button
          onClick={handleAddRecoveryWallet}
          disabled={isLoading || !isRelayReady || !recoveryAddress || !isAddress(recoveryAddress)}
        >
          {isLoading ? 'Processing...' : 'Add Recovery Wallet'}
        </Button>
         {!isRelayReady && primarySafeAddress && (
           <p className="text-xs text-destructive">Relay service not available. Ensure Privy wallet is connected and the selected wallet owns the Safe.</p>
         )}
      </CardContent>
    </Card>
  );
} 