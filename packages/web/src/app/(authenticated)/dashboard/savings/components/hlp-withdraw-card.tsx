'use client';

import { type Address } from 'viem';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function HLPWithdrawCard({
  safeAddress,
}: {
  safeAddress: Address;
}) {
  const handleContactTeam = () => {
    toast.info(
      'Contact our team at support@0finance.com to withdraw from HLP vault.'
    );
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
        <p className="text-sm font-medium text-blue-900">
          HLP Vault Withdrawal via Voucher Redemption
        </p>
        <p className="text-xs text-blue-800 leading-relaxed">
          To withdraw from HLP vault:
        </p>
        <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
          <li>Redeem your HLP Voucher NFT</li>
          <li>Our team processes the withdrawal on Hyperliquid</li>
          <li>USDC is bridged back to your Safe on Base</li>
        </ol>
      </div>

      <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800">
          <p className="font-medium">Manual processing required</p>
          <p className="mt-1 text-yellow-700">
            HLP withdrawals are processed manually and typically take 1-2 business
            days. You'll receive your USDC on Base once complete.
          </p>
        </div>
      </div>

      <Button
        onClick={handleContactTeam}
        className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white"
      >
        Contact Team to Withdraw
      </Button>

      <a
        href="https://app.hyperliquid.xyz/vaults"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-xs text-[#1B29FF] hover:text-[#1420CC] font-medium"
      >
        View on Hyperliquid <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
