'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Copy,
  DollarSign,
  Settings,
  ArrowRightCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatUsd } from '@/lib/utils';
import { useRealSavingsState } from '@/components/savings/hooks/use-real-savings-state';
import { useToast } from '@/components/ui/use-toast';
import { trpc } from '@/utils/trpc';

interface AccountCardProps {
  initialBalance: number;
  safeAddress: string;
}

export default function AccountCard({
  initialBalance,
  safeAddress,
}: AccountCardProps) {
  const { savingsState, isLoading, mainBalance, optimisticAllocation } =
    useRealSavingsState(safeAddress, initialBalance);
  const { toast } = useToast();

  const exampleNextDeposit = 100;

  const allocation = savingsState?.allocation ?? optimisticAllocation ?? 0;
  const isSavingsRuleActive = savingsState?.enabled && allocation > 0;
  const nextDepositSavings = exampleNextDeposit * (allocation / 100);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(safeAddress);
    toast({
      title: 'Address Copied!',
      description: `Safe address ${safeAddress.substring(0, 6)}...${safeAddress.substring(safeAddress.length - 4)} copied to clipboard.`,
      duration: 3000,
    });
  };

  const cardBackgroundColor = mainBalance > 0 ? 'bg-emerald-50' : 'bg-gray-100';
  const cardTextColor = mainBalance > 0 ? 'text-emerald-900' : 'text-gray-700';
  const savingsButtonText =
    allocation === 0 ? 'Set Savings Rule' : 'Savings Rule';
  const ruleText = isSavingsRuleActive
    ? `Savings Rule: ${allocation}% of incoming cash`
    : 'Savings Rule: Not active';
  const projectionText = isSavingsRuleActive
    ? `Next deposit of ${formatUsd(exampleNextDeposit)} → ${formatUsd(nextDepositSavings)} to savings`
    : `Tap 'Set Savings Rule' to start automatically saving.`;

  return (
    <>
      <Card
        className={cn(
          'w-full shadow-lg rounded-xl transition-colors duration-300',
          cardBackgroundColor,
          cardTextColor,
        )}
      >
        <CardContent className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center text-sm font-medium text-current/80">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-emerald-500 text-white mr-2">
                  <DollarSign className="h-4 w-4" />
                </div>
                Personal · USD
              </div>
              {isLoading && !savingsState ? (
                <Skeleton className="h-12 w-48 bg-current/10" />
              ) : (
                <h2 className="text-5xl font-bold text-current">
                  {formatUsd(mainBalance)}
                </h2>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-current hover:bg-black/5"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-current hover:bg-black/5"
                onClick={handleCopyAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="pt-2 space-y-1 border-t border-current/10">
            <div className="text-sm font-medium text-current/90 flex items-center">
              <ArrowRightCircle className="w-4 h-4 mr-1.5 text-current/70" />
              {ruleText}
            </div>
            <p className="text-xs text-current/70 pl-[22px]">
              {projectionText}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              className="w-full h-[44px] rounded-[12px] bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button
              asChild
              variant={isSavingsRuleActive ? 'default' : 'outline'}
              className={cn(
                'w-full h-[44px] rounded-[12px] transition-all duration-150 ease-out shadow-sm',
                isSavingsRuleActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
              )}
            >
              <Link href="/dashboard#savings">
                <Settings className="w-4 h-4 mr-2" />
                {savingsButtonText}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
