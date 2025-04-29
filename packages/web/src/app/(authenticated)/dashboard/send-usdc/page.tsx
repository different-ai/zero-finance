'use client';
// helper to generate a 65‑byte pre‑validated sig accepted by Safe
const buildPrevalidatedSig = (owner: `0x${string}`): `0x${string}` => {
  return ('0x' +
    '00'.repeat(12) + // 12 bytes zero‑padding
    owner.slice(2).toLowerCase() + // 20‑byte owner
    '00'.repeat(32) + // 32‑byte s = 0
    '01') as  // v = 1
  `0x${string}`;
};

import { useState, useCallback, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import {
  isAddress,
  formatUnits,
  parseUnits,
  createPublicClient,
  http,
  type Address,
  encodeFunctionData,
  Hex,
} from 'viem';
import { erc20Abi } from 'viem';
import { base } from 'viem/chains';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { api } from '@/trpc/react';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';

// Use the Base USDC address
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;
const USDC_DECIMALS = 6;

// Simple viem client setup for reading chain data
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export default function SendUsdcPage() {
  const { wallets } = useWallets();

  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const { data: safesList } = api.settings.userSafes.list.useQuery();
  const primarySafe = safesList?.find((safe) => safe.safeType === 'primary');
  const primarySafeAddress = primarySafe?.safeAddress
    ? (primarySafe.safeAddress as Address)
    : undefined;

  const { ready: isRelayReady, send: sendWithRelay } = useSafeRelay(
    primarySafeAddress,
  );

  useEffect(() => {
    const fetchUsdcBalance = async () => {
      if (!primarySafeAddress) {
        setBalance(null);
        return;
      }
      setBalanceLoading(true);
      setBalanceError(null);
      try {
        const fetchedBalance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [primarySafeAddress],
        });
        setBalance(formatUnits(fetchedBalance, USDC_DECIMALS));
      } catch (err: any) {
        console.error('Failed to fetch USDC balance:', err);
        setBalanceError('Could not fetch USDC balance.');
        setBalance(null);
      } finally {
        setBalanceLoading(false);
      }
    };
    fetchUsdcBalance();
  }, [primarySafeAddress]);

  const handleSendUsdc = useCallback(async () => {
    setError(null);
    setTxHash(null);

    if (!isRelayReady) {
      setError(
        'Relay service not ready. Ensure you are logged in and Safe is configured.',
      );
      return;
    }

    if (!isAddress(toAddress)) {
      setError('Invalid recipient address.');
      return;
    }

    let valueInUnits: bigint;
    try {
      valueInUnits = parseUnits(amount, USDC_DECIMALS);
      if (valueInUnits <= 0n) {
        setError('Amount must be greater than 0.');
        return;
      }
    } catch (e) {
      setError('Invalid amount.');
      return;
    }

    setIsLoading(true);
    toast.loading('Preparing and sending transaction...', {
      id: 'send-usdc-loading',
    });

    try {
      const transferData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [toAddress as Address, valueInUnits],
      });
      const transactions: MetaTransactionData[] = [
        {
          to: USDC_ADDRESS,
          value: '0',
          data: transferData,
        },
      ];

      const relayTxHash = await sendWithRelay(transactions);
      setTxHash(relayTxHash);
      toast.success('Transaction submitted successfully!', {
        id: 'send-usdc-success',
      });

      toast.dismiss('send-usdc-loading');
      toast.loading('Waiting for network confirmation...', {
        id: 'send-usdc-confirm',
      });
      let receipt: any = null;
      let attempts = 0;
      while (!receipt && attempts < 30) {
        try {
          receipt = await publicClient.getTransactionReceipt({
            hash: relayTxHash,
          });
        } catch (e) {
          /* ignore until mined */
        }
        if (receipt) break;
        attempts += 1;
        await new Promise((r) => setTimeout(r, 2000));
      }

      if (receipt) {
        toast.success('Transaction confirmed!', { id: 'send-usdc-confirm' });
      } else {
        toast.info('Transaction sent, confirmation pending.', { id: 'send-usdc-confirm' });
      }

      setToAddress('');
      setAmount('');
      if (primarySafeAddress) {
        const newBal = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [primarySafeAddress],
        });
        setBalance(formatUnits(newBal, USDC_DECIMALS));
      }
    } catch (err: any) {
      console.error('Transaction failed:', err);
      let errorMessage = 'Could not send transaction.';
      if (err instanceof Error) {
        if (err.message?.includes('User rejected')) {
          errorMessage = 'Transaction was rejected by the user.';
        } else if ((err as any).shortMessage) {
          errorMessage = (err as any).shortMessage;
        } else {
          errorMessage = err.message;
        }
      } else {
        errorMessage = String(err);
      }
      setError(`Transaction failed: ${errorMessage}`);
      toast.error('Transaction Failed', {
        description: errorMessage,
        id: 'send-usdc-error',
      });
    } finally {
      setIsLoading(false);
      toast.dismiss('send-usdc-loading');
      toast.dismiss('send-usdc-success');
      toast.dismiss('send-usdc-confirm');
    }
  }, [
    isRelayReady,
    sendWithRelay,
    toAddress,
    amount,
    primarySafeAddress,
  ]);

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Send USDC</CardTitle>
          <CardDescription>
            Send USDC from your primary account on the Base network. Transactions are sponsored.
            {balanceLoading && (
              <span className="ml-2 text-xs text-muted-foreground">
                Loading balance...
              </span>
            )}
            {balanceError && (
              <span className="ml-2 text-xs text-red-500">{balanceError}</span>
            )}
            {balance !== null && !balanceLoading && !balanceError && (
              <span className="ml-2 text-xs text-muted-foreground">
                Your account balance: {parseFloat(balance).toFixed(6)} USDC
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toAddress">Recipient Address</Label>
            <Input
              id="toAddress"
              type="text"
              placeholder="0x..."
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDC)</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {txHash && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Transaction Sent</AlertTitle>
              <AlertDescription>
                Transaction hash:{' '}
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-700"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </a>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch space-y-4">
          <Button
            onClick={handleSendUsdc}
            disabled={isLoading || !isRelayReady || !primarySafeAddress}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send USDC <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          {!primarySafeAddress && (
            <Alert>
              <AlertTitle>Primary Account Needed</AlertTitle>
              <AlertDescription>
                You need to register your primary account in Settings before sending funds.
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {txHash && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Transaction Sent</AlertTitle>
              <AlertDescription>
                Transaction hash:{' '}
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-700"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </a>
              </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
