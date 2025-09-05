'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedYieldCounterProps {
  principal: number; // Principal amount in USD
  apy: number; // APY as percentage (e.g., 8 for 8%)
  startDate?: Date; // When yield started accumulating
  className?: string;
  showDaily?: boolean;
  showMonthly?: boolean;
  showYearly?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  isPaused?: boolean;
}

export function AnimatedYieldCounter({
  principal,
  apy,
  startDate = new Date(),
  className,
  showDaily = true,
  showMonthly = true,
  showYearly = false,
  formatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  isPaused = false,
}: AnimatedYieldCounterProps) {
  const [currentYield, setCurrentYield] = useState(0);
  const [dailyYield, setDailyYield] = useState(0);
  const [monthlyYield, setMonthlyYield] = useState(0);
  const [yearlyYield, setYearlyYield] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (principal <= 0 || apy <= 0) {
      setCurrentYield(0);
      setDailyYield(0);
      setMonthlyYield(0);
      setYearlyYield(0);
      return;
    }

    // Calculate yields
    const apyDecimal = apy / 100;
    const dailyRate = apyDecimal / 365;
    const daily = principal * dailyRate;
    const monthly = principal * (apyDecimal / 12);
    const yearly = principal * apyDecimal;

    setDailyYield(daily);
    setMonthlyYield(monthly);
    setYearlyYield(yearly);

    // Calculate initial yield based on time elapsed
    const now = new Date();
    const timeElapsed = now.getTime() - startDate.getTime();
    const daysElapsed = timeElapsed / (1000 * 60 * 60 * 24);
    const initialYield = daily * daysElapsed;
    setCurrentYield(Math.max(0, initialYield));

    // Animate yield accumulation
    if (!isPaused) {
      const animate = () => {
        setCurrentYield((prev) => {
          // Add yield for 100ms (0.1 second)
          const yieldPer100ms = daily / (24 * 60 * 60 * 10);
          return prev + yieldPer100ms;
        });
        animationRef.current = requestAnimationFrame(animate);
      };

      // Start animation after a short delay
      const timeoutId = setTimeout(() => {
        animate();
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [principal, apy, startDate, isPaused]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      ...formatOptions,
    }).format(value);
  };

  if (principal <= 0 || apy <= 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Live Yield Counter */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-900 dark:text-green-100">
            Total Earned
          </span>
          {!isPaused && (
            <span className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs text-green-600 dark:text-green-400">
                Live
              </span>
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400 font-mono">
          {formatCurrency(currentYield)}
        </div>
      </div>

      {/* Yield Projections */}
      <div className="grid gap-2">
        {showDaily && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Daily</span>
            <span className="text-sm font-semibold font-mono">
              +{formatCurrency(dailyYield)}
            </span>
          </div>
        )}

        {showMonthly && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Next Month</span>
            <span className="text-sm font-semibold font-mono text-green-600 dark:text-green-400">
              +{formatCurrency(monthlyYield)}
            </span>
          </div>
        )}

        {showYearly && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Annual</span>
            <span className="text-sm font-semibold font-mono">
              +{formatCurrency(yearlyYield)}
            </span>
          </div>
        )}
      </div>

      {/* APY Display */}
      <div className="text-center pt-2 border-t">
        <span className="text-xs text-muted-foreground">Current APY: </span>
        <span className="text-sm font-bold text-green-600 dark:text-green-400">
          {apy.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

// Compact version for sidebars
export function AnimatedYieldBadge({
  principal,
  apy,
  className,
}: {
  principal: number;
  apy: number;
  className?: string;
}) {
  const [dailyYield, setDailyYield] = useState(0);

  useEffect(() => {
    if (principal > 0 && apy > 0) {
      const daily = (principal * (apy / 100)) / 365;
      setDailyYield(daily);
    }
  }, [principal, apy]);

  if (principal <= 0 || apy <= 0) return null;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium',
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span>+${dailyYield.toFixed(2)}/day</span>
    </div>
  );
}
