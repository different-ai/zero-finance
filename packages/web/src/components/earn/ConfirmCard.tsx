'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { formatCurrency, formatPercentage } from '@/lib/earn-utils';
import { api } from '@/trpc/react';
import { useSafeId } from '@/hooks/use-safe-id';

interface ConfirmCardProps {
  onFinish: () => void;
  isLoading: boolean;
  allocation?: number; // Make optional for backward compatibility
}

export default function ConfirmCard({
  onFinish,
  isLoading,
  allocation = 30, // Default if not provided
}: ConfirmCardProps) {
  const springMotion = { type: 'spring', stiffness: 320, damping: 30 };
  const [iUnderstandChecked, setIUnderstandChecked] = useState(false);
  const safeId = useSafeId();

  // Get current state for calculating examples
  const { data: earnState } = api.earn.getState.useQuery(
    { safeId: safeId! },
    { enabled: !!safeId }
  );

  // Example calculation for 1000 USDC deposit
  const exampleDepositAmount = 1000; // 1000 USDC
  const exampleDepositWei = BigInt(exampleDepositAmount) * BigInt(1000000); // 6 decimals
  const allocationBigInt = BigInt(allocation);
  const exampleSweepAmountWei = (exampleDepositWei * allocationBigInt) / BigInt(100);

  return (
    <div className="p-4 my-4 border rounded-xl shadow-md bg-white">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={springMotion}
        className="p-4 sm:p-8 w-full"
      >
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 p-6">
            <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
              Confirm Your Settings
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3 mb-6 text-gray-700 dark:text-gray-300">
              <p>
                You&apos;re about to set{' '}
                <strong className="text-primary-500 dark:text-primary-400">
                  {formatPercentage(allocation)}
                </strong>
                {' '}of every new deposit to be automatically swept into your earnings
                account.
              </p>
              <p>
                This means if you deposit{' '}
                <strong className="text-gray-900 dark:text-white">
                  {formatCurrency(exampleDepositWei.toString(), 6, 'USDC')}
                </strong>
                , approximately{' '}
                <strong className="text-primary-500 dark:text-primary-400">
                  {formatCurrency(exampleSweepAmountWei.toString(), 6, 'USDC')}
                </strong>
                {' '}will go to earnings.
              </p>
              <p>
                You can change this setting or pause Auto-Earn at any time from
                your dashboard.
              </p>
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <Checkbox
                id="i-understand-confirm"
                checked={iUnderstandChecked}
                onCheckedChange={(checked) =>
                  setIUnderstandChecked(checked === true)
                }
                className="data-[state=checked]:bg-primary-500 dark:data-[state=checked]:bg-primary-400 data-[state=checked]:border-primary-500 dark:data-[state=checked]:border-primary-400"
              />
              <label
                htmlFor="i-understand-confirm"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I get it, let&apos;s earn!
              </label>
            </div>
            <Button
              onClick={onFinish}
              disabled={isLoading || !iUnderstandChecked}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-base shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Confirming...' : 'Confirm & Activate'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 