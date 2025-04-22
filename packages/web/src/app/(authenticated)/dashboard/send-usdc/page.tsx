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
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  isAddress,
  formatUnits,
  parseUnits,
  createPublicClient,
  http,
  type Address,
  encodeFunctionData,
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
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import Safe from '@safe-global/protocol-kit';
import { api } from '@/trpc/react';

// Use the Base USDC address
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_DECIMALS = 6;

// Simple viem client setup for reading chain data
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export default function SendUsdcPage() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy',
  );
  const { client: smartClient } = useSmartWallets();

  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [step, setStep] = useState<string>('');

  // Get the list of user's Safe addresses
  const { data: safesList } = api.settings.userSafes.list.useQuery();
  const primarySafe = safesList?.find((safe) => safe.safeType === 'primary');

  // Fetch USDC balance when the primary Safe address is available
  useEffect(() => {
    const fetchUsdcBalance = async () => {
      if (!primarySafe?.safeAddress) {
        setBalance(null);
        return;
      }

      setBalanceLoading(true);
      setBalanceError(null);

      try {
        const fetchedBalance = (await publicClient.readContract({
          address: USDC_ADDRESS as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [primarySafe.safeAddress as Address],
        })) as bigint;

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
  }, [primarySafe?.safeAddress]);

  const handleSendUsdc = useCallback(async () => {
    setError(null);
    setTxHash(null);
    setIsLoading(true);
    setStep('Initializing');

    if (!smartClient) {
      setError(
        'Smart wallet client not available. Please ensure you are logged in.',
      );
      setIsLoading(false);
      return;
    }

    if (!primarySafe?.safeAddress) {
      setError('Primary Safe not found. Please complete onboarding first.');
      setIsLoading(false);
      return;
    }

    if (!isAddress(toAddress)) {
      setError('Invalid recipient address.');
      setIsLoading(false);
      return;
    }

    let valueInUnits: bigint;
    try {
      valueInUnits = parseUnits(amount, USDC_DECIMALS);
      if (valueInUnits <= 0n) {
        setError('Amount must be greater than 0.');
        setIsLoading(false);
        return;
      }
    } catch (e) {
      setError('Invalid amount.');
      setIsLoading(false);
      return;
    }

    try {
      // step 1: encode the erc‑20 transfer
      toast.loading('preparing transaction…');
      setStep('encoding transaction');
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [toAddress as Address, valueInUnits],
      });

      // step 2: init safe sdk (read‑only rpc url)
      setStep('initializing safe sdk');
      const safeSdk = await Safe.init({
        provider:
          process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
        safeAddress: primarySafe.safeAddress as string,
      });

      // step 3: build safe transaction
      setStep('creating safe tx');
      const safeTx = await safeSdk.createTransaction({
        transactions: [
          {
            to: USDC_ADDRESS as string,
            value: '0', // protocol‑kit expects a string here
            data: data as `0x${string}`,
          },
        ],
      });

      // estimate gas for the safe tx to avoid 0 gas reverts
      safeTx.data.safeTxGas = '220000'; // ~200k is enough for an erc‑20 transfer

      // step 4: add pre-validated signature (owner == msg.sender, no EOA sig required)
      setStep('signing');
      const ownerAddr = smartClient.account!.address as `0x${string}`;
      const prevalidatedSig = buildPrevalidatedSig(ownerAddr);
      safeTx.addSignature({ signer: ownerAddr, data: prevalidatedSig } as any);

      // step 5: encode execTransaction calldata
      const contractManager = await safeSdk.getContractManager();
      const safeContract = contractManager.safeContract;
      if (!safeContract) {
        throw new Error('Failed to get Safe contract instance.');
      }
      const execData = safeContract.encode('execTransaction', [
        safeTx.data.to,
        safeTx.data.value,
        safeTx.data.data,
        safeTx.data.operation,
        safeTx.data.safeTxGas,
        safeTx.data.baseGas,
        safeTx.data.gasPrice,
        safeTx.data.gasToken,
        safeTx.data.refundReceiver,
        safeTx.encodedSignatures(),
      ]) as `0x${string}`;

      // step 6: relay via privy smart wallet (gas sponsored)
      setStep('submitting');
      toast.loading('submitting user operation…');
      const txHash = await smartClient.sendTransaction({
        chain: base,
        to: primarySafe.safeAddress as Address,
        data: execData as `0x${string}`,
        value: 0n,
      });
      setTxHash(txHash);

      // optional: poll for receipt
      setStep('waiting for confirmation');
      toast.loading('waiting for confirmation…');
      let receipt: any = null;
      let attempts = 0;
      while (!receipt && attempts < 30) {
        try {
          receipt = await publicClient.getTransactionReceipt({
            hash: txHash as `0x${string}`,
          });
        } catch (e) {
          /* ignore until mined */
        }
        if (receipt) break;
        attempts += 1;
        await new Promise((r) => setTimeout(r, 2000));
      }

      if (receipt) {
        toast.success('transaction confirmed', { id: 'send-usdc-success' });
      } else {
        toast.success('transaction submitted', { id: 'send-usdc-pending' });
      }

      // reset form & refresh balance
      setToAddress('');
      setAmount('');
      if (primarySafe?.safeAddress) {
        const newBal = (await publicClient.readContract({
          address: USDC_ADDRESS as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [primarySafe.safeAddress as Address],
        })) as bigint;
        setBalance(formatUnits(newBal, USDC_DECIMALS));
      }
      setStep('');
    } catch (err: any) {
      console.error('Transaction failed:', err);
      let errorMessage = 'Could not send transaction.';
      if (err.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected by the user.';
      } else if (err.shortMessage) {
        errorMessage = err.shortMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(`Transaction failed: ${errorMessage}`);
      toast.error('Transaction Failed', {
        description: errorMessage,
        id: 'send-usdc-error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toAddress, amount, smartClient, primarySafe?.safeAddress]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Send USDC (via Safe Relay)</CardTitle>
          <CardDescription>
            Send USDC tokens from your Safe wallet on the Base network using
            gas-less transactions.
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
                Your Safe balance: {parseFloat(balance).toFixed(6)} USDC
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
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {txHash && (
            <Alert className="border-green-500/50 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">
                Transaction Submitted
              </AlertTitle>
              <AlertDescription>
                User operation hash: {txHash}
                <br />
                <span className="text-xs text-green-700">
                  The transaction has been submitted to the bundler. Check
                  BaseScan for confirmation.
                </span>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button
            onClick={handleSendUsdc}
            disabled={
              isLoading ||
              !smartClient ||
              !primarySafe?.safeAddress ||
              !toAddress ||
              !amount
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step || 'Sending...'}
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Send USDC
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
