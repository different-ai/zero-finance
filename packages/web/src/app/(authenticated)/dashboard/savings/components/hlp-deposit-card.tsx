'use client';

import { useState } from 'react';
import { type Address } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function HLPDepositCard({
  safeAddress,
  onDepositSuccess,
}: {
  safeAddress: Address;
  onDepositSuccess?: () => void;
}) {
  const [amount, setAmount] = useState('');

  const handleContactTeam = () => {
    toast.info(
      'Contact our team at support@0finance.com to set up HLP vault access.'
    );
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
        <p className="text-sm font-medium text-blue-900">
          HLP Vault Access via Voucher System
        </p>
        <p className="text-xs text-blue-800 leading-relaxed">
          Hyperliquid HLP vault uses a voucher NFT system. Your deposits are
          represented as NFTs on Base that you can redeem to withdraw from HLP.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#101010]/70">
          Amount (USDC)
        </label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="5000"
          className="text-lg"
        />
      </div>

      <div className="p-3 bg-[#F7F7F2] rounded-lg space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-[#101010]/60">Vault:</span>
          <span className="font-medium">Hyperliquid HLP</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#101010]/60">Expected APY:</span>
          <span className="font-medium text-green-600">~25%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#101010]/60">Risk Level:</span>
          <span className="font-medium text-orange-600">High</span>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800">
          <p className="font-medium">Manual Process Required</p>
          <p className="mt-1 text-yellow-700">
            HLP vault deposits require manual processing by our team. This
            typically takes 1-2 business days. You'll receive an HLP Voucher NFT
            representing your position.
          </p>
        </div>
      </div>

      <Button
        onClick={handleContactTeam}
        className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white"
      >
        Contact Team to Deposit
      </Button>

      <a
        href="https://app.hyperliquid.xyz/vaults"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-xs text-[#1B29FF] hover:text-[#1420CC] font-medium"
      >
        Learn More About HLP <ExternalLink className="h-3 w-3" />
      </a>

      <p className="text-xs text-[#101010]/50 text-center">
        High-performance trading vault with advanced strategies
      </p>
    </div>
  );
}
