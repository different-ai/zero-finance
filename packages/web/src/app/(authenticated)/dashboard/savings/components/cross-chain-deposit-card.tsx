'use client';

import { useState } from 'react';
import { type Address } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { useAcrossBridge } from '@/lib/hooks/use-across-bridge';
import { type CrossChainVault } from '@/server/earn/cross-chain-vaults';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatUsd } from '@/lib/utils';

export function CrossChainDepositCard({
  vault,
  safeAddress,
  onDepositSuccess,
}: {
  vault: CrossChainVault;
  safeAddress: Address;
  onDepositSuccess?: () => void;
}) {
  const { address } = useAccount();
  const { switchChain } = useSwitchChain();
  const { bridge, isLoading } = useAcrossBridge();

  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'bridge' | 'complete'>('input');

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setStep('bridge');

      // Bridge from Base to destination chain
      const result = await bridge({
        amount,
        fromChain: 8453, // Base
        toChain: vault.chainId,
        recipient: safeAddress,
      });

      toast.success(
        `Bridging ${amount} USDC to ${vault.chainName}. Funds will arrive in ~${result.estimatedFillTime}s.`
      );

      // Wait for estimated fill time
      await new Promise((resolve) =>
        setTimeout(resolve, result.estimatedFillTime * 1000)
      );

      setStep('complete');
      toast.success(
        `USDC arrived on ${vault.chainName}! Now deposit to vault manually.`
      );

      onDepositSuccess?.();
    } catch (error) {
      console.error('Bridge failed:', error);
      toast.error(
        error instanceof Error ? error.message : 'Bridge failed'
      );
      setStep('input');
    }
  };

  if (step === 'complete') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">
              Bridge Complete
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              Your USDC is now on {vault.chainName}
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <p className="text-sm font-medium text-blue-900">Next Steps:</p>
          <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
            <li>Switch to {vault.chainName} network</li>
            <li>Visit the vault on Morpho app</li>
            <li>Deposit your USDC to the vault</li>
          </ol>
          <a
            href={vault.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Open Morpho App <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <Button
          onClick={() => setStep('input')}
          variant="outline"
          className="w-full"
        >
          Bridge More Funds
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#101010]/70">
          Amount (USDC)
        </label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
          disabled={isLoading}
          className="text-lg"
        />
      </div>

      <div className="p-3 bg-[#F7F7F2] rounded-lg space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-[#101010]/60">Bridge from:</span>
          <span className="font-medium">Base</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#101010]/60">Bridge to:</span>
          <span className="font-medium">{vault.chainName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#101010]/60">Estimated fee:</span>
          <span className="font-medium text-[#1B29FF]">
            ~{formatUsd(Number(amount || 0) * 0.005)} (0.5%)
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#101010]/60">Estimated time:</span>
          <span className="font-medium">~20 seconds</span>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800">
          <p className="font-medium">Manual deposit required</p>
          <p className="mt-1 text-yellow-700">
            After bridging, you'll need to manually deposit to the vault on{' '}
            {vault.chainName} using the Morpho app.
          </p>
        </div>
      </div>

      <Button
        onClick={handleDeposit}
        disabled={isLoading || !amount || Number(amount) <= 0}
        className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white"
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Bridging to {vault.chainName}...
          </>
        ) : (
          <>
            Bridge to {vault.chainName}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-xs text-[#101010]/50 text-center">
        Powered by Across Protocol
      </p>
    </div>
  );
}
