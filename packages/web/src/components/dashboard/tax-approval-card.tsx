"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';

interface Props {
  suggestedAmount: number; // in USDC units
  safeAddress: `0x${string}`;
  taxVaultAddress: `0x${string}`;
  tokenAddress: `0x${string}`; // USDC address on Base
}

export function TaxApprovalCard({ suggestedAmount, safeAddress, taxVaultAddress, tokenAddress }: Props) {
  const [clicked, setClicked] = useState(false);
  const sweep = trpc.tax.sweep.useMutation();

  const handleApprove = async () => {
    setClicked(true);
    await sweep.mutateAsync({
      safeAddress,
      taxVaultAddress,
      tokenAddress,
      amountWei: (BigInt(Math.floor(suggestedAmount * 1e6))).toString(), // 6 decimals
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withhold {suggestedAmount.toLocaleString()} USDC for upcoming taxes</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleApprove} disabled={sweep.isPending || clicked}>
          {sweep.isPending ? 'Submitting…' : sweep.data ? 'Sent!' : 'Approve'}
        </Button>
        {sweep.error && <p className="text-rose-600 text-sm mt-2">{sweep.error.message}</p>}
      </CardContent>
    </Card>
  );
}