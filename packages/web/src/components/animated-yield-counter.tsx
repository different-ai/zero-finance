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
  const animationRef = useRef<number | undefined>(undefined);

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
      let lastTime = performance.now();

      const animate = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        setCurrentYield((prev) => {
          // Calculate yield per millisecond for smooth animation
          const yieldPerMs = daily / (24 * 60 * 60 * 1000);
          // Real-time accumulation (1x speed - actual earnings rate)
          const speedMultiplier = 1;
          return prev + yieldPerMs * deltaTime * speedMultiplier;
        });
        animationRef.current = requestAnimationFrame(animate);
      };

      // Start animation after a short delay
      const timeoutId = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [principal, apy, startDate, isPaused]);

  const formatCurrency = (value: number, useExtraDecimals = false) => {
    const options = useExtraDecimals
      ? formatOptions
      : {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        };

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      ...options,
    }).format(value);
  };

  if (principal <= 0 || apy <= 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Live Yield Counter - Following Design System */}

      {/* Yield Projections - Clean Design */}
      <div className="space-y-3">
        {showDaily && (
          <div className="flex items-center justify-between py-3 border-b border-[#101010]/10">
            <span className="text-[14px] text-[#101010]/70">Daily Yield</span>
            <span className="text-[16px] font-medium tabular-nums text-[#101010]">
              +{formatCurrency(dailyYield)}
            </span>
          </div>
        )}

        {showMonthly && (
          <div className="flex items-center justify-between py-3 border-b border-[#101010]/10">
            <span className="text-[14px] text-[#101010]/70">
              30-Day Projection
            </span>
            <span className="text-[16px] font-medium tabular-nums text-[#1B29FF]">
              +{formatCurrency(monthlyYield)}
            </span>
          </div>
        )}

        {showYearly && (
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] text-[#101010]/70">
              Annual Projection
            </span>
            <span className="text-[16px] font-medium tabular-nums text-[#101010]">
              +{formatCurrency(yearlyYield)}
            </span>
          </div>
        )}
      </div>

      {/* APY Display - Design System */}
      <div className="mt-4 pt-4 border-t border-[#101010]/10 flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-wider text-[#101010]/60">
          Current APY
        </span>
        <span className="text-[18px] font-medium tabular-nums text-[#1B29FF]">
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
