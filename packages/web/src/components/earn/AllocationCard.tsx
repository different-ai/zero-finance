'use client';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  formatPercentage,
  formatCurrency,
  calculateYearlyGain,
} from '@/lib/earn-utils';
import { api } from '@/trpc/react';
import { useSafeId } from '@/app/(authenticated)/dashboard/earn/use-safe-id';

interface AllocationCardProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  isLoading: boolean;
}

export default function AllocationCard(
  { value, onChange, onNext, isLoading }: AllocationCardProps
) {
  const springMotion = { type: 'spring', stiffness: 320, damping: 30 };
  const safeId = useSafeId();

  const { data: earnState } = api.earn.getState.useQuery(
    { safeId: safeId! },
    { enabled: !!safeId }
  );

  const currentAllocationForSlider = value;
  const estimatedYearlyGain = calculateYearlyGain(
    earnState?.totalBalance,
    currentAllocationForSlider,
    earnState?.apy,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={springMotion}
      className="p-4 sm:p-8 w-full"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700 p-6">
          <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Set Your Sweep
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-1">
            Choose how much of new deposits go to your earnings account.
          </p>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <motion.div
              key={currentAllocationForSlider}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="text-5xl font-bold text-primary-500 dark:text-primary-400"
            >
              {formatPercentage(currentAllocationForSlider)}
            </motion.div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              of incoming funds will be swept.
            </p>
          </div>
          <Slider
            value={[currentAllocationForSlider ?? 30]}
            max={100}
            min={0}
            step={1}
            onValueChange={(val) => onChange(val[0])}
            disabled={isLoading}
            className="my-6 [&>span:first-child]:h-3 [&>span:first-child>span]:bg-primary-500 [&>span:first-child>span]:dark:bg-primary-400 [&>span:first-child>span]:h-3"
          />
          {earnState && (
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-700/20 rounded-lg border border-primary-200 dark:border-primary-600/30">
              <p className="text-sm text-primary-700 dark:text-primary-300">
                Estimated yearly gain:
                <span className="font-semibold">
                  {formatCurrency(estimatedYearlyGain, 2, 'USDC')}
                </span>
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400">
                Based on current APY of {formatPercentage(earnState?.apy)} and
                total balance of {formatCurrency(earnState?.totalBalance)}.
              </p>
            </div>
          )}
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
          <Button
            onClick={onNext}
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 text-white dark:text-deep-navy font-semibold py-3 text-base shadow-md"
          >
            {isLoading ? 'Saving...' : 'Next'}
            {!isLoading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 