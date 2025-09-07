'use client';

import { useEffect, useState } from 'react';

interface AnimatedTotalEarnedProps {
  initialEarned: number;
  apy: number;
  balance: number;
  className?: string;
}

export function AnimatedTotalEarned({
  initialEarned,
  apy,
  balance,
  className = '',
}: AnimatedTotalEarnedProps) {
  const [earned, setEarned] = useState(initialEarned);

  useEffect(() => {
    const earningsPerSecond = (balance * apy) / (365 * 24 * 60 * 60);
    const animationSpeedMultiplier = 10;

    const interval = setInterval(() => {
      setEarned(
        (prev) => prev + (earningsPerSecond * animationSpeedMultiplier) / 10,
      );
    }, 100);

    return () => clearInterval(interval);
  }, [balance, apy]);

  return <span className={className}>${earned.toFixed(9)}</span>;
}
