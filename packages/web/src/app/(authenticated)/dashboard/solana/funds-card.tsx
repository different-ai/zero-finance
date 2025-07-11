import React from 'react';
import { api } from '@/trpc/react';
import { FundsDisplay } from '@/components/funds/funds-display';

export default function FundsCard({wallet, token}: {wallet: string; token: 'sol' | 'usdc'}) {
  const { data, isError, error, isLoading} =
    api.solana.getBalance.useQuery({ address: wallet, token });
  if (isError) console.error('Error fetching Solana balance:', error);
  if (isLoading || !data) return null;
  return (
    <FundsDisplay
      totalBalance={data.totalBalance}
      walletAddress={wallet}
      network={data.network}
      currency={token === 'usdc' ? 'usd' : 'sol'}
    />
  );
} 