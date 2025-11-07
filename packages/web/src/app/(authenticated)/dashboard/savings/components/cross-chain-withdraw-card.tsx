'use client';

import { type Address } from 'viem';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { type CrossChainVault } from '@/server/earn/cross-chain-vaults';

export function CrossChainWithdrawCard({
  vault,
  safeAddress,
}: {
  vault: CrossChainVault;
  safeAddress: Address;
}) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
        <p className="text-sm font-medium text-blue-900">
          Withdraw from {vault.chainName}
        </p>
        <p className="text-xs text-blue-800 leading-relaxed">
          To withdraw from this vault, you'll need to:
        </p>
        <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
          <li>Switch to {vault.chainName} network in your wallet</li>
          <li>Visit the vault on Morpho app</li>
          <li>Withdraw your funds directly</li>
          <li>(Optional) Bridge back to Base using Across</li>
        </ol>
      </div>

      <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800">
          <p className="font-medium">Manual withdrawal required</p>
          <p className="mt-1 text-yellow-700">
            Withdrawals from {vault.chainName} must be done manually through the
            Morpho app. Your Safe wallet works on all chains.
          </p>
        </div>
      </div>

      <a
        href={vault.appUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <Button className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white">
          Open Morpho App <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </a>

      <p className="text-xs text-[#101010]/50 text-center">
        Your Safe address: {safeAddress.slice(0, 6)}...{safeAddress.slice(-4)}
      </p>
    </div>
  );
}
