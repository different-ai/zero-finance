'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Wallet,
  CreditCard,
} from 'lucide-react';

export default function ToolsPage() {
  const router = useRouter();

  const tools = [
    {
      title: 'Earn Module',
      description:
        'Automatically earn yield on your idle funds with DeFi protocols',
      icon: TrendingUp,
      href: '/dashboard/tools/earn-module',
      color:
        'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900',
    },
    {
      title: 'Safeless Transfers',
      description:
        'Transfer funds without a Safe wallet using virtual accounts',
      icon: CreditCard,
      href: '/dashboard/tools/safeless',
      color:
        'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900',
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tools</h1>
        <p className="text-muted-foreground mt-2">
          Powerful financial tools to enhance your business operations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card
            key={tool.href}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(tool.href)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${tool.color}`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {tool.description}
              </CardDescription>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(tool.href);
                }}
              >
                Open Tool
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legacy Send Funds Card */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Send Funds</CardTitle>
                <CardDescription>
                  Quickly send ETH or tokens from your wallet
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SendFundsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Legacy send funds component
import { useState, useCallback, useEffect } from 'react';
import { useSendTransaction, usePrivy } from '@privy-io/react-auth';
import {
  parseEther,
  isAddress,
  formatEther,
  createPublicClient,
  http,
} from 'viem';
import { base } from 'viem/chains';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type HexString = `0x${string}`;

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

function SendFundsForm() {
  const { user } = usePrivy();
  const wallet = user?.wallet;
  const { sendTransaction } = useSendTransaction();
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<HexString | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet?.address) {
        setBalance(null);
        return;
      }

      setBalanceLoading(true);
      setBalanceError(null);
      try {
        const fetchedBalance = await publicClient.getBalance({
          address: wallet.address as HexString,
        });
        setBalance(formatEther(fetchedBalance));
      } catch (err: any) {
        console.error('Failed to fetch balance:', err);
        setBalanceError('Could not fetch balance.');
        setBalance(null);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, [wallet?.address]);

  const handleSend = useCallback(async () => {
    setError(null);
    setTxHash(null);
    setIsLoading(true);

    if (!isAddress(toAddress)) {
      setError('Invalid recipient address.');
      setIsLoading(false);
      return;
    }

    let valueBigInt: bigint;
    try {
      valueBigInt = parseEther(amount);
      if (valueBigInt <= 0n) {
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
      toast.loading('Sending transaction...');
      const result = await sendTransaction({
        to: toAddress as HexString,
        value: valueBigInt,
      });
      setTxHash(result.hash);
      toast.success('Transaction Sent', {
        description: `Transaction hash: ${result.hash}`,
        id: 'send-tx-success',
      });
      setToAddress('');
      setAmount('');
    } catch (err: any) {
      console.error('Transaction failed:', err);
      const errorMessage = err.message || 'Could not send transaction.';
      setError(`Transaction failed: ${errorMessage}`);
      toast.error('Transaction Failed', {
        description: errorMessage,
        id: 'send-tx-error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toAddress, amount, sendTransaction]);

  return (
    <div className="space-y-4">
      {balance !== null && !balanceLoading && !balanceError && (
        <p className="text-sm text-muted-foreground">
          Your balance: {parseFloat(balance).toFixed(6)} ETH
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
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
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="text"
            placeholder="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        onClick={handleSend}
        disabled={isLoading || !toAddress || !amount}
        className="w-full"
      >
        {isLoading ? 'Sending...' : 'Send Transaction'}
      </Button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {txHash && (
        <p className="text-green-600 text-sm break-all">
          Success! Transaction Hash: {txHash}
        </p>
      )}
    </div>
  );
}
