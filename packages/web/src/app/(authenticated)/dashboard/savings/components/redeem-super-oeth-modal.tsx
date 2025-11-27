'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import type { Address } from 'viem';
import {
  parseUnits,
  formatUnits,
  encodeFunctionData,
  encodePacked,
  createPublicClient,
  http,
} from 'viem';
import { base } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

// Contract addresses on Base
const SUPER_OETH_ADDRESS: Address =
  '0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3';
const WETH_ADDRESS: Address = '0x4200000000000000000000000000000000000006';
// Aerodrome SlipStream Router for Concentrated Liquidity pools
const SLIPSTREAM_ROUTER: Address = '0xBE6D8f0d05cC4be24d5167a3eF062215bE6D18a5';
// superOETHb/WETH CL Pool (tick spacing = 1)
const SUPER_OETH_WETH_POOL: Address =
  '0x6446021F4E396dA3df4235C62537431372195D38';
const TICK_SPACING: number = 1; // 0.01% fee tier for the CL pool
const MIN_SQRT_RATIO = BigInt('4295128739') + BigInt(1);
const MAX_SQRT_RATIO =
  BigInt('1461446703485210103287273052203988822378723970342') - BigInt(1);

// ABIs
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'allowance',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

const WETH_ABI = [
  {
    name: 'withdraw',
    type: 'function',
    inputs: [{ name: 'wad', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

// Aerodrome SlipStream Router ABI (exactInput for auto-limit handling)
const SLIPSTREAM_ROUTER_ABI = [
  {
    name: 'exactInput',
    type: 'function',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'path', type: 'bytes' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
        ],
      },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
  },
] as const;

// CL Pool ABI for getting current price (slot0)
const CL_POOL_ABI = [
  {
    name: 'slot0',
    type: 'function',
    inputs: [],
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160' },
      { name: 'tick', type: 'int24' },
      { name: 'observationIndex', type: 'uint16' },
      { name: 'observationCardinality', type: 'uint16' },
      { name: 'observationCardinalityNext', type: 'uint16' },
      { name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    name: 'token0',
    type: 'function',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    name: 'token1',
    type: 'function',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
] as const;

interface RedeemSuperOethModalProps {
  safeAddress: Address;
  superOethBalance: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

type RedeemStep = 'idle' | 'quoting' | 'processing' | 'success' | 'error';

interface RedeemState {
  step: RedeemStep;
  txHash?: string;
  errorMessage?: string;
}

export function RedeemSuperOethModal({
  safeAddress,
  superOethBalance,
  onSuccess,
  onClose,
}: RedeemSuperOethModalProps) {
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<{
    wethOut: string;
    priceImpact: number;
  } | null>(null);
  const [redeemState, setRedeemState] = useState<RedeemState>({ step: 'idle' });
  const [unwrapToEth, setUnwrapToEth] = useState(true);

  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(
    safeAddress,
    SUPPORTED_CHAINS.BASE,
  );

  // Debug logging for relay readiness
  useEffect(() => {
    console.log('[RedeemSuperOeth] Component mounted/updated:', {
      isRelayReady,
      safeAddress,
      superOethBalance,
      canRedeem: parseFloat(amount || '0') > 0 && isRelayReady && !!quote,
    });
  }, [isRelayReady, safeAddress, superOethBalance, amount, quote]);

  // Fetch quote when amount changes - uses pool's sqrtPriceX96 to estimate output
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setQuote(null);
      return;
    }

    const fetchQuote = async () => {
      try {
        setRedeemState({ step: 'quoting' });

        const publicClient = createPublicClient({
          chain: base,
          transport: http(),
        });

        const amountIn = parseUnits(amount, 18);

        // Get the current pool state (sqrtPriceX96 and token order)
        const [slot0Result, token0] = await Promise.all([
          publicClient.readContract({
            address: SUPER_OETH_WETH_POOL,
            abi: CL_POOL_ABI,
            functionName: 'slot0',
          }),
          publicClient.readContract({
            address: SUPER_OETH_WETH_POOL,
            abi: CL_POOL_ABI,
            functionName: 'token0',
          }),
        ]);

        const sqrtPriceX96 = slot0Result[0];

        // Calculate price from sqrtPriceX96
        // price = (sqrtPriceX96 / 2^96)^2
        // This gives price of token1 in terms of token0
        const Q96 = BigInt(2) ** BigInt(96);
        const priceX192 = sqrtPriceX96 * sqrtPriceX96;

        // Determine swap direction based on token order
        // token0 < token1 by address
        const superOethIsToken0 =
          token0.toLowerCase() === SUPER_OETH_ADDRESS.toLowerCase();

        let estimatedOut: bigint;
        if (superOethIsToken0) {
          // superOETH is token0, WETH is token1
          // Selling token0 for token1: amountOut = amountIn * price
          // price = (sqrtPriceX96)^2 / 2^192
          estimatedOut = (amountIn * priceX192) / (Q96 * Q96);
        } else {
          // WETH is token0, superOETH is token1
          // Selling token1 for token0: amountOut = amountIn / price
          // price = (sqrtPriceX96)^2 / 2^192
          // So amountOut = amountIn * 2^192 / (sqrtPriceX96)^2
          estimatedOut = (amountIn * Q96 * Q96) / priceX192;
        }

        // Apply a small buffer for slippage estimation (0.1% conservative estimate)
        const wethOut = (estimatedOut * BigInt(999)) / BigInt(1000);
        const wethOutFormatted = formatUnits(wethOut, 18);

        // Calculate price impact (superOETH should be ~1:1 with ETH)
        const inputValue = parseFloat(amount);
        const outputValue = parseFloat(wethOutFormatted);
        const priceImpact = ((inputValue - outputValue) / inputValue) * 100;

        setQuote({
          wethOut: wethOutFormatted,
          priceImpact: Math.max(0, priceImpact),
        });
        setRedeemState({ step: 'idle' });
      } catch (error) {
        console.error('Failed to fetch quote:', error);
        setQuote(null);
        setRedeemState({ step: 'idle' });
      }
    };

    const debounce = setTimeout(fetchQuote, 500);
    return () => clearTimeout(debounce);
  }, [amount]);

  const handleRedeem = async () => {
    console.log('[RedeemSuperOeth] Starting redeem:', {
      amount,
      isRelayReady,
      quote,
      safeAddress,
    });

    if (!amount || !isRelayReady || !quote) {
      console.warn('[RedeemSuperOeth] Not ready:', {
        hasAmount: !!amount,
        isRelayReady,
        hasQuote: !!quote,
      });
      return;
    }

    try {
      setRedeemState({ step: 'processing' });
      const amountIn = parseUnits(amount, 18);

      // Calculate minimum output with 1% slippage
      const minOut = (parseUnits(quote.wethOut, 18) * BigInt(99)) / BigInt(100);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800); // 30 min deadline

      // Build multicall transactions
      const transactions: Array<{
        to: Address;
        value: string;
        data: `0x${string}`;
      }> = [];

      // 1. Approve superOETH to SlipStream Router
      const approveData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [SLIPSTREAM_ROUTER, amountIn],
      });
      transactions.push({
        to: SUPER_OETH_ADDRESS,
        value: '0',
        data: approveData,
      });

      // 2. Swap superOETH -> WETH via Aerodrome SlipStream (CL pool)
      // Using exactInput with encoded path (tokenIn + tickSpacing + tokenOut)
      // This allows the router to handle sqrtPriceLimitX96 automatically
      const path = encodePacked(
        ['address', 'uint24', 'address'],
        [SUPER_OETH_ADDRESS, TICK_SPACING, WETH_ADDRESS],
      );

      const swapParams = {
        path,
        recipient: safeAddress,
        deadline: deadline,
        amountIn: amountIn,
        amountOutMinimum: minOut,
      };

      const swapData = encodeFunctionData({
        abi: SLIPSTREAM_ROUTER_ABI,
        functionName: 'exactInput',
        args: [swapParams],
      });
      transactions.push({
        to: SLIPSTREAM_ROUTER,
        value: '0',
        data: swapData,
      });

      // 3. Optionally unwrap WETH to ETH
      if (unwrapToEth) {
        const unwrapData = encodeFunctionData({
          abi: WETH_ABI,
          functionName: 'withdraw',
          args: [minOut], // Unwrap the minimum expected amount
        });
        transactions.push({
          to: WETH_ADDRESS,
          value: '0',
          data: unwrapData,
        });
      }

      // Execute multicall via Safe relay
      console.log('[RedeemSuperOeth] Sending transactions:', {
        count: transactions.length,
        transactions: transactions.map((t) => ({
          to: t.to,
          value: t.value,
          dataLength: t.data.length,
        })),
      });

      const txHash = await sendTxViaRelay(transactions, 500_000n);

      console.log('[RedeemSuperOeth] Transaction result:', txHash);

      if (!txHash) throw new Error('Transaction failed');

      setRedeemState({
        step: 'success',
        txHash,
      });

      const outputToken = unwrapToEth ? 'ETH' : 'WETH';
      toast.success(`Super OETH → ${outputToken} swap completed`, {
        description: `Converted ${amount} superOETH to ~${parseFloat(quote.wethOut).toFixed(6)} ${outputToken}`,
      });

      setAmount('');
      // Don't call onSuccess automatically - let user see the success screen
    } catch (error) {
      console.error('Redeem error:', error);
      setRedeemState({
        step: 'error',
        errorMessage:
          error instanceof Error ? error.message : 'Redemption failed',
      });
    }
  };

  const handleMax = () => {
    if (superOethBalance > 0) {
      setAmount(superOethBalance.toFixed(18).replace(/\.?0+$/, ''));
    }
  };

  const amountValue = parseFloat(amount) || 0;
  const insufficientBalance = amountValue > superOethBalance;
  const canRedeem =
    amountValue > 0 &&
    !insufficientBalance &&
    isRelayReady &&
    quote &&
    redeemState.step !== 'processing';

  if (redeemState.step === 'success') {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-6 w-6 text-[#10B981]" />
        </div>
        <div>
          <h3 className="text-[18px] font-semibold text-[#101010] mb-2">
            Redemption Complete
          </h3>
          <p className="text-[14px] text-[#101010]/70">
            Successfully converted Super OETH to {unwrapToEth ? 'ETH' : 'WETH'}.
          </p>
        </div>
        <Button onClick={() => onSuccess?.() ?? onClose?.()} className="w-full">
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-[18px] font-semibold text-[#101010] mb-1">
          Redeem Super OETH
        </h3>
        <p className="text-[13px] text-[#101010]/60">
          Convert your Super OETH back to ETH via Aerodrome.
        </p>
      </div>

      {redeemState.step === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{redeemState.errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Super OETH Input */}
      <div className="space-y-2">
        <Label className="text-[12px] text-[#101010]/60">From</Label>
        <div className="rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-medium text-[#101010]">
              Super OETH
            </span>
            <span className="text-[12px] text-[#101010]/60">
              Balance: {superOethBalance.toFixed(6)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-0 bg-transparent text-[20px] font-semibold p-0 h-auto focus-visible:ring-0"
              step="any"
              min="0"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleMax}
              className="h-6 px-2 text-[11px] text-[#1B29FF]"
            >
              MAX
            </Button>
          </div>
        </div>
        {insufficientBalance && (
          <p className="text-[11px] text-red-500">Insufficient balance</p>
        )}
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full border border-[#101010]/20 flex items-center justify-center">
          <ArrowDown className="h-4 w-4 text-[#101010]/60" />
        </div>
      </div>

      {/* Output */}
      <div className="space-y-2">
        <Label className="text-[12px] text-[#101010]/60">To (estimated)</Label>
        <div className="rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-medium text-[#101010]">
              {unwrapToEth ? 'ETH' : 'WETH'}
            </span>
          </div>
          <div className="text-[20px] font-semibold text-[#101010]">
            {redeemState.step === 'quoting' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[14px] text-[#101010]/50">
                  Getting quote...
                </span>
              </span>
            ) : quote ? (
              parseFloat(quote.wethOut).toFixed(6)
            ) : (
              '0.0'
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="unwrap-eth"
          checked={unwrapToEth}
          onChange={(e) => setUnwrapToEth(e.target.checked)}
          className="rounded border-[#101010]/20"
        />
        <label
          htmlFor="unwrap-eth"
          className="text-[12px] text-[#101010]/70 cursor-pointer"
        >
          Unwrap to native ETH (recommended)
        </label>
      </div>

      {/* Quote Info */}
      {quote && (
        <div className="rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2]/50 p-3 space-y-2 text-[12px]">
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Rate</span>
            <span className="text-[#101010]">
              1 superOETH ≈{' '}
              {(parseFloat(quote.wethOut) / amountValue).toFixed(6)} ETH
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Price Impact</span>
            <span
              className={
                quote.priceImpact > 1 ? 'text-red-500' : 'text-[#101010]'
              }
            >
              {quote.priceImpact.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Min. received (1% slip)</span>
            <span className="text-[#101010]">
              {(parseFloat(quote.wethOut) * 0.99).toFixed(6)}{' '}
              {unwrapToEth ? 'ETH' : 'WETH'}
            </span>
          </div>
        </div>
      )}

      {/* Redeem Button */}
      <Button
        onClick={handleRedeem}
        disabled={!canRedeem}
        className="w-full"
        size="lg"
      >
        {redeemState.step === 'processing' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing (3 transactions)...
          </>
        ) : (
          `Convert to ${unwrapToEth ? 'ETH' : 'WETH'}`
        )}
      </Button>

      <p className="text-[11px] text-[#101010]/50 text-center">
        This executes a multicall: approve → swap via Aerodrome SlipStream
        {unwrapToEth ? ' → unwrap WETH' : ''}. All in one Safe transaction.
      </p>

      {/* Debug info */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-[10px] font-mono text-gray-600">
        <div>
          Safe: {safeAddress?.slice(0, 10)}...{safeAddress?.slice(-8)}
        </div>
        <div>Relay Ready: {isRelayReady ? '✓' : '✗'}</div>
        <div>Quote: {quote ? '✓' : '✗'}</div>
        <div>Can Redeem: {canRedeem ? '✓' : '✗'}</div>
      </div>
    </div>
  );
}
