'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { trpc } from '@/utils/trpc';
import type { EarningsEvent } from '@/lib/utils/event-based-earnings';
import { initializeEarningsAnimation } from '@/lib/utils/event-based-earnings';

interface AnimatedTotalEarnedV2Props {
  safeAddress: string;
  fallbackApy?: number;
  fallbackBalance?: number;
  className?: string;
}

/**
 * Improved earnings animation component that:
 * 1. Fetches historical deposit/withdrawal events
 * 2. Calculates accumulated earnings based on actual deposit times
 * 3. Never starts from 0 if there are historical deposits
 * 4. Handles mounting properly with suspense boundaries
 */
export function AnimatedTotalEarnedV2({
  safeAddress,
  fallbackApy = 8,
  fallbackBalance = 0,
  className = '',
}: AnimatedTotalEarnedV2Props) {
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const initialValueRef = useRef<number>(0);
  const earningsPerSecondRef = useRef<number>(0);

  // Fetch earnings events
  const { data: eventsData, isLoading } = trpc.earn.getEarningsEvents.useQuery(
    { safeAddress },
    {
      enabled: !!safeAddress,
      staleTime: 5 * 60 * 1000, // keep data warm for five minutes
      gcTime: 10 * 60 * 1000,
      refetchInterval: false,
    },
  );

  // Calculate initial value and rate from events
  const { initialValue, earningsPerSecond } = useMemo(() => {
    if (!eventsData || eventsData.length === 0) {
      // Fallback calculation
      if (fallbackBalance > 0 && fallbackApy > 0) {
        // Estimate 14 days of earnings as initial value
        const estimatedInitial =
          ((fallbackBalance * fallbackApy) / 100 / 365) * 14;
        const rate =
          (fallbackBalance * fallbackApy) / 100 / (365 * 24 * 60 * 60);
        return { initialValue: estimatedInitial, earningsPerSecond: rate };
      }
      return { initialValue: 0, earningsPerSecond: 0 };
    }

    // Convert events to the expected format
    const events: EarningsEvent[] = eventsData.map((e) => ({
      id: e.id,
      type: e.type,
      timestamp: e.timestamp,
      amount: BigInt(e.amount),
      vaultAddress: e.vaultAddress,
      apy: e.apy,
      shares: e.shares ? BigInt(e.shares) : undefined,
      decimals: e.decimals,
    }));

    return initializeEarningsAnimation(events);
  }, [eventsData, fallbackBalance, fallbackApy]);

  // Initialize display value immediately when data is available
  useEffect(() => {
    if (initialValue > 0 || earningsPerSecond > 0) {
      initialValueRef.current = initialValue;
      earningsPerSecondRef.current = earningsPerSecond;

      // Set initial display value immediately (no starting from 0!)
      if (displayValue === null) {
        setDisplayValue(initialValue);
      }

      // Start animation timer
      startTimeRef.current = Date.now();
    }
  }, [initialValue, earningsPerSecond, displayValue]);

  // Animation loop
  useEffect(() => {
    if (displayValue === null || earningsPerSecondRef.current <= 0) {
      return;
    }

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000; // seconds
      const accumulated =
        initialValueRef.current + elapsed * earningsPerSecondRef.current;

      setDisplayValue(accumulated);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [displayValue]);

  // Format for display
  const formatValue = (value: number) => {
    // Handle very small values
    if (Math.abs(value) < 0.000001) {
      return '$0.00';
    }

    // For small values, show more decimals
    if (value < 1) {
      return `+$${value.toFixed(6)}`;
    }

    // For larger values, show fewer decimals
    if (value < 100) {
      return `+$${value.toFixed(4)}`;
    }

    return `+$${value.toFixed(2)}`;
  };

  // Show loading state while fetching events
  if (isLoading) {
    return <span className={className}>Calculating...</span>;
  }

  // Show the animated value
  if (displayValue !== null) {
    return <span className={className}>{formatValue(displayValue)}</span>;
  }

  // Initial state
  return <span className={className}>$0.00</span>;
}
