'use client';

import { useEffect, useState, useRef } from 'react';
import type { EarningsEvent } from '@/lib/utils/event-based-earnings';
import { initializeEarningsAnimation } from '@/lib/utils/event-based-earnings';

interface AnimatedEarningsV2Props {
  events: EarningsEvent[];
  className?: string;
  fallbackApy?: number;
  fallbackBalance?: number;
}

export function AnimatedEarningsV2({
  events,
  className = '',
  fallbackApy = 8,
  fallbackBalance = 0,
}: AnimatedEarningsV2Props) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const initialValueRef = useRef<number>(0);
  const earningsPerSecondRef = useRef<number>(0);

  useEffect(() => {
    // Initialize with event-based calculation
    if (events && events.length > 0) {
      const { initialValue, earningsPerSecond } =
        initializeEarningsAnimation(events);

      // Store the calculated values
      initialValueRef.current = initialValue;
      earningsPerSecondRef.current = earningsPerSecond;

      // Set initial display value immediately (no starting from 0!)
      setDisplayValue(initialValue);
      setIsInitialized(true);

      // Start animation from this point
      startTimeRef.current = Date.now();
    } else if (fallbackBalance > 0 && fallbackApy > 0) {
      // Fallback: estimate 14 days of earnings if no events
      const estimatedEarnings =
        ((fallbackBalance * fallbackApy) / 100 / 365) * 14;
      initialValueRef.current = estimatedEarnings;
      earningsPerSecondRef.current =
        (fallbackBalance * fallbackApy) / 100 / (365 * 24 * 60 * 60);

      setDisplayValue(estimatedEarnings);
      setIsInitialized(true);
      startTimeRef.current = Date.now();
    }
  }, [events, fallbackApy, fallbackBalance]);

  useEffect(() => {
    if (!isInitialized || earningsPerSecondRef.current <= 0) {
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
  }, [isInitialized]);

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

  // Show loading state if not initialized
  if (!isInitialized) {
    return <span className={className}>Calculating...</span>;
  }

  return <span className={className}>{formatValue(displayValue)}</span>;
}
