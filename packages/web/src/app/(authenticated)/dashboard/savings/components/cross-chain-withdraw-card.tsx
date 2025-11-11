'use client';

import { useState, useEffect } from 'react';
import {
  type Address,
  type Hex,
  formatUnits,
  parseUnits,
  encodeFunctionData,
  createPublicClient,
  http,
} from 'viem';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { type CrossChainVault } from '@/server/earn/cross-chain-vaults';
import { arbitrum } from 'viem/chains';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';

type WithdrawStep =
  | 'idle'
  | 'preparing'
  | 'approving'
  | 'withdrawing'
  | 'waiting'
  | 'complete'
  | 'error';

export function CrossChainWithdrawCard({
  vault,
  safeAddress,
}: {
  vault: CrossChainVault;
  safeAddress: Address;
}) {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<bigint>(0n);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [step, setStep] = useState<WithdrawStep>('idle');
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { getClientForChain } = useSmartWallets();

  const manualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const client = createPublicClient({
        chain: arbitrum,
        transport: http(
          process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
            'https://arb1.arbitrum.io/rpc',
        ),
      });

      const userShares = await client.readContract({
        address: vault.address,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
        functionName: 'balanceOf',
        args: [safeAddress],
      });

      if (userShares > 0n) {
        const assets = await client.readContract({
          address: vault.address,
          abi: [
            {
              name: 'convertToAssets',
              type: 'function',
              stateMutability: 'view',
              inputs: [{ name: 'shares', type: 'uint256' }],
              outputs: [{ name: '', type: 'uint256' }],
            },
          ],
          functionName: 'convertToAssets',
          args: [userShares],
        });
        setBalance(assets as bigint);
      } else {
        setBalance(0n);
      }
    } catch (err) {
      console.error('[CrossChainWithdraw] Error refreshing:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch vault balance on Arbitrum
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        console.log(
          `[CrossChainWithdraw] Fetching balance for Safe ${safeAddress} on vault ${vault.address}`,
        );

        const client = createPublicClient({
          chain: arbitrum,
          transport: http(
            process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
              'https://arb1.arbitrum.io/rpc',
          ),
        });

        // Read shares (ERC-4626 vault tokens)
        const userShares = await client.readContract({
          address: vault.address,
          abi: [
            {
              name: 'balanceOf',
              type: 'function',
              stateMutability: 'view',
              inputs: [{ name: 'account', type: 'address' }],
              outputs: [{ name: '', type: 'uint256' }],
            },
          ],
          functionName: 'balanceOf',
          args: [safeAddress],
        });

        console.log(
          `[CrossChainWithdraw] Shares balance: ${userShares.toString()}`,
        );

        // Convert shares to assets
        if (userShares > 0n) {
          const assets = await client.readContract({
            address: vault.address,
            abi: [
              {
                name: 'convertToAssets',
                type: 'function',
                stateMutability: 'view',
                inputs: [{ name: 'shares', type: 'uint256' }],
                outputs: [{ name: '', type: 'uint256' }],
              },
            ],
            functionName: 'convertToAssets',
            args: [userShares],
          });
          console.log(
            `[CrossChainWithdraw] Assets value: $${formatUnits(assets as bigint, 6)}`,
          );
          setBalance(assets as bigint);
        } else {
          console.log(`[CrossChainWithdraw] No shares found - balance is $0`);
          setBalance(0n);
        }
      } catch (err) {
        console.error('[CrossChainWithdraw] Error fetching balance:', err);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // Check every 10s instead of 30s
    return () => clearInterval(interval);
  }, [vault.address, safeAddress]);

  const handleWithdraw = async () => {
    if (!amount) return;

    try {
      setError('');
      setStep('preparing');

      const withdrawAmount = parseUnits(amount, 6); // USDC has 6 decimals

      // Get Arbitrum wallet client
      const arbitrumClient = await getClientForChain({ id: 42161 });
      if (!arbitrumClient) {
        throw new Error('Arbitrum wallet not available');
      }

      setStep('withdrawing');

      // Encode withdraw call (ERC-4626)
      const withdrawData = encodeFunctionData({
        abi: [
          {
            name: 'withdraw',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'assets', type: 'uint256' },
              { name: 'receiver', type: 'address' },
              { name: 'owner', type: 'address' },
            ],
            outputs: [{ name: 'shares', type: 'uint256' }],
          },
        ],
        functionName: 'withdraw',
        args: [withdrawAmount, safeAddress, safeAddress],
      });

      // Send transaction via Arbitrum Safe
      const hash = await arbitrumClient.sendTransaction({
        to: vault.address,
        data: withdrawData,
        value: 0n,
        chain: arbitrum,
      });

      setTxHash(hash);
      setStep('waiting');

      // Wait for confirmation
      const client = createPublicClient({
        chain: arbitrum,
        transport: http(
          process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
            'https://arb1.arbitrum.io/rpc',
        ),
      });

      await client.waitForTransactionReceipt({
        hash: hash as Hex,
        confirmations: 1,
      });

      setStep('complete');
      setAmount('');
    } catch (err: any) {
      console.error('[CrossChainWithdraw] Error:', err);
      setError(err.message || 'Withdrawal failed');
      setStep('error');
    }
  };

  const handleMax = () => {
    setAmount(formatUnits(balance, 6));
  };

  const balanceDisplay = formatUnits(balance, 6);

  if (step === 'complete') {
    return (
      <div className="space-y-4 text-center py-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Withdrawal Complete!</h3>
          <p className="text-sm text-gray-600 mt-1">
            Your funds are now in your Safe on Arbitrum
          </p>
        </div>
        {txHash && (
          <a
            href={`https://arbiscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            View on Arbiscan <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <Button
          onClick={() => setStep('idle')}
          variant="outline"
          className="w-full"
        >
          Make Another Withdrawal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">
          Amount (USDC)
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
            disabled={step !== 'idle' || isLoadingBalance}
          />
          <Button
            onClick={handleMax}
            variant="outline"
            size="sm"
            disabled={step !== 'idle' || isLoadingBalance || balance === 0n}
          >
            Max
          </Button>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">
            Available: {isLoadingBalance ? '...' : `$${balanceDisplay}`}
          </p>
          <button
            onClick={manualRefresh}
            disabled={isRefreshing}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {balance === 0n && !isLoadingBalance && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900 font-medium">
            Deposit still processing?
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Cross-chain deposits take 20-60 seconds to complete. Your balance
            will appear here once the Across bridge settles on Arbitrum.
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Click "Refresh" above to check for updates.
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button
        onClick={handleWithdraw}
        disabled={
          !amount ||
          parseFloat(amount) === 0 ||
          step !== 'idle' ||
          balance === 0n
        }
        className="w-full bg-[#1B29FF] hover:bg-[#1420CC]"
      >
        {step === 'idle' && 'Withdraw from Arbitrum'}
        {step === 'preparing' && (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing...
          </>
        )}
        {step === 'withdrawing' && (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Withdrawing...
          </>
        )}
        {step === 'waiting' && (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Confirming...
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Funds will remain on Arbitrum. Bridge to Base separately if needed.
      </p>
    </div>
  );
}
