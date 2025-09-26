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
    setEarned(initialEarned);
  }, [initialEarned]);

  useEffect(() => {
    if (apy <= 0 || balance <= 0) {
      return;
    }

    const earningsPerSecond = (balance * apy) / (365 * 24 * 60 * 60);

    if (!Number.isFinite(earningsPerSecond) || earningsPerSecond === 0) {
      return;
    }

    const interval = setInterval(() => {
      setEarned((prev) => {
        const next = prev + earningsPerSecond * 0.1;
        return Math.abs(next) < 1e-9 ? 0 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [balance, apy]);

  const sanitizedEarned = Math.abs(earned) < 1e-9 ? 0 : earned;
  const sign = sanitizedEarned >= 0 ? '+' : '-';
  const amount = Math.abs(sanitizedEarned).toFixed(9);

  return <span className={className}>{`${sign}$${amount}`}</span>;
}
