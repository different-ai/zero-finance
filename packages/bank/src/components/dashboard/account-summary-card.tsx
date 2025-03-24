'use client'

import { CreditCard, ArrowUpRight, Wallet, PiggyBank, LineChart, Coins } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Account } from "@/src/types/account";
import { formatCurrency, truncateAddress } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";

interface AccountSummaryCardProps {
  account: Account;
}

export function AccountSummaryCard({ account }: AccountSummaryCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const accountTypeIcons = {
    checking: <CreditCard className="h-3 w-3" />,
    savings: <PiggyBank className="h-3 w-3" />,
    investment: <LineChart className="h-3 w-3" />,
    yield: <Coins className="h-3 w-3" />,
    crypto: <Wallet className="h-3 w-3" />,
  };

  const isCrypto = account.type === 'crypto';

  return (
    <div className="nostalgic-container hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
      <div className="px-2 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-primary">{accountTypeIcons[account.type]}</span>
          <span className="text-xs font-medium truncate max-w-[120px]">{account.name}</span>
        </div>
        <div className="text-xs font-medium">
          {formatCurrency(account.balance, account.currency)}
        </div>
      </div>
      
      {showDetails && (
        <div className="px-2 pb-1.5 pt-0 text-xs border-t border-primary/10">
          {isCrypto && account.walletAddress && (
            <div className="text-[10px] text-secondary mt-1 flex justify-between">
              <span>Address:</span>
              <span>{truncateAddress(account.walletAddress, 6)}</span>
            </div>
          )}
          {isCrypto && account.currency !== 'USDC' && account.currency !== 'USDT' && (
            <div className="text-[10px] text-secondary flex justify-between">
              <span>USD Value:</span>
              <span>≈ {formatCurrency(
                account.currency === 'BTC' ? account.balance * 65000 : account.balance * 3000, 
                'USD'
              )}</span>
            </div>
          )}
          <div className="text-[10px] text-secondary flex justify-between">
            <span>Type:</span>
            <span>{account.type.charAt(0).toUpperCase() + account.type.slice(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
}