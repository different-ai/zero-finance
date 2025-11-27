'use client';

import { useState, useCallback } from 'react';
import {
  Address,
  isAddress,
  encodeFunctionData,
  createPublicClient,
  http,
} from 'viem';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
import { base } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Wallet, Link2 } from 'lucide-react';
import { api } from '@/trpc/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const safeAbi = [
  {
    constant: true,
    inputs: [],
    name: 'getThreshold',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: '_threshold',
        type: 'uint256',
      },
    ],
    name: 'addOwnerWithThreshold',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const RPC_URL = getBaseRpcUrl();
const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

interface RecoveryWalletManagerProps {
  primarySafeAddress: Address | null | undefined;
}

export function RecoveryWalletManager({
  primarySafeAddress,
}: RecoveryWalletManagerProps) {
  const [recoveryAddress, setRecoveryAddress] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [inputMethod, setInputMethod] = useState<'paste' | 'connect'>('paste');
  const { ready: isRelayReady, send: sendSponsoredTx } = useSafeRelay(
    primarySafeAddress ?? undefined,
  );
  const { connectWallet, user: privyUser } = usePrivy();

  const { data: safes } = api.settings.userSafes.list.useQuery();
  const currentSafe = safes?.find(
    (s: { safeAddress: string | null | undefined; isOwner?: boolean }) =>
      s.safeAddress === primarySafeAddress,
  );
  const isOwner = currentSafe?.isOwner ?? true;

  const handleConnectWallet = useCallback(async () => {
    try {
      await connectWallet();
      // After connecting, check for connected wallets
      if (privyUser?.wallet?.address) {
        setRecoveryAddress(privyUser.wallet.address);
        toast.success('External wallet linked', {
          description: `Address: ${privyUser.wallet.address.slice(0, 6)}...${privyUser.wallet.address.slice(-4)}`,
        });
      } else {
        toast.info(
          'External wallet linked. Please paste the address manually.',
        );
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to link external wallet');
    }
  }, [connectWallet, privyUser]);

  const handleAddRecoveryWallet = useCallback(async () => {
    if (!isRelayReady || !primarySafeAddress) {
      toast.error('Safe relay service not ready or Safe address missing.');
      return;
    }
    if (!isAddress(recoveryAddress)) {
      toast.error('Invalid recovery wallet address provided.');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Preparing transaction...');

    try {
      toast.info('Fetching current Safe threshold...', { id: toastId });
      const currentThreshold = await publicClient.readContract({
        address: primarySafeAddress,
        abi: safeAbi,
        functionName: 'getThreshold',
      });

      const newThreshold = currentThreshold;
      toast.info(
        `Current threshold is ${currentThreshold}. Adding owner with threshold ${newThreshold}.`,
        { id: toastId },
      );

      const txData = encodeFunctionData({
        abi: safeAbi,
        functionName: 'addOwnerWithThreshold',
        args: [recoveryAddress as Address, newThreshold],
      });

      const transactions: MetaTransactionData[] = [
        {
          to: primarySafeAddress,
          value: '0',
          data: txData,
        },
      ];

      toast.loading('Sending sponsored transaction via relay...', {
        id: toastId,
      });
      const txHash = await sendSponsoredTx(transactions);
      toast.success(
        `Recovery wallet addition submitted! Tx Hash: ${txHash.substring(0, 10)}...`,
        {
          id: toastId,
          description: 'It may take a moment to confirm onchain.',
          action: {
            label: 'View on Explorer',
            onClick: () =>
              window.open(`https://basescan.org/tx/${txHash}`, '_blank'),
          },
        },
      );
      setRecoveryAddress('');
    } catch (error: any) {
      console.error('Error adding recovery wallet:', error);
      let message = 'An unknown error occurred.';
      if (error?.message) {
        try {
          const parsedError = JSON.parse(
            error.message.substring(error.message.indexOf('{')),
          );
          message =
            parsedError.error?.message || parsedError.message || error.message;
        } catch (parseError) {
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
    return null;
  }

  if (!isOwner) {
    return (
      <Card className="border-[#101010]/10 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
        <CardHeader>
          <CardTitle className="text-[16px] font-medium">
            Recovery Wallet
          </CardTitle>
          <CardDescription className="text-[13px]">
            Add an additional owner wallet to your Safe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-[#ef4444]/20 bg-[#ef4444]/5">
            <AlertCircle className="h-4 w-4 text-[#ef4444]" />
            <AlertDescription className="text-[13px] text-[#101010]/70">
              You don&apos;t have permission to modify this Safe. Only Safe
              owners can add recovery wallets.
              {currentSafe?.createdBy && (
                <span className="block mt-1 text-[12px] text-[#101010]/60">
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
    <Card className="border-[#101010]/10 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
      <CardHeader>
        <CardTitle className="text-[16px] font-medium">
          Add Recovery Wallet
        </CardTitle>
        <CardDescription className="text-[13px]">
          Add an additional owner to your account for recovery purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Tabs
          value={inputMethod}
          onValueChange={(v) => setInputMethod(v as 'paste' | 'connect')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="paste" className="text-[13px] gap-2">
              <Link2 className="h-3.5 w-3.5" />
              Paste Address
            </TabsTrigger>
            <TabsTrigger value="connect" className="text-[13px] gap-2">
              <Wallet className="h-3.5 w-3.5" />
              Link External Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="recovery-address"
                className="text-[13px] font-medium text-[#101010]"
              >
                Recovery Wallet Address
              </Label>
              <Input
                id="recovery-address"
                placeholder="0x..."
                value={recoveryAddress}
                onChange={(e) => setRecoveryAddress(e.target.value)}
                disabled={isLoading}
                className="h-11 text-[13px] font-mono"
              />
              <p className="text-[12px] text-[#101010]/60">
                Enter the Ethereum address you want to use as a recovery wallet
              </p>
            </div>
          </TabsContent>

          <TabsContent value="connect" className="space-y-4 mt-4">
            <div className="space-y-3">
              <p className="text-[13px] text-[#101010]/70 leading-[1.5]">
                Link an external wallet to use as your recovery address
              </p>
              <Button
                onClick={handleConnectWallet}
                variant="outline"
                className="w-full h-11 text-[13px] gap-2"
                disabled={isLoading}
              >
                <Wallet className="h-4 w-4" />
                Link External Wallet
              </Button>
              {recoveryAddress && (
                <div className="p-3 bg-[#10b981]/5 border border-[#10b981]/20 rounded-md">
                  <p className="text-[12px] text-[#101010]/60 mb-1">
                    Connected Address
                  </p>
                  <code className="text-[12px] font-mono text-[#101010]/80 break-all">
                    {recoveryAddress}
                  </code>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleAddRecoveryWallet}
          disabled={
            isLoading ||
            !isRelayReady ||
            !recoveryAddress ||
            !isAddress(recoveryAddress)
          }
          className="w-full h-11 text-[13px] font-medium bg-[#1B29FF] hover:bg-[#1420CC]"
        >
          {isLoading ? 'Processing...' : 'Add Recovery Wallet'}
        </Button>

        {!isRelayReady && primarySafeAddress && (
          <Alert className="border-[#ef4444]/20 bg-[#ef4444]/5">
            <AlertCircle className="h-4 w-4 text-[#ef4444]" />
            <AlertDescription className="text-[12px] text-[#101010]/70">
              Relay service not available. Ensure your account is properly
              initialized and you have ownership of the Safe.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
