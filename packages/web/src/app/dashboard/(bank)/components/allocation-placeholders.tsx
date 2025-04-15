'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderSectionProps {
  title: string;
}

function PlaceholderSection({ title }: PlaceholderSectionProps) {
  return (
    <Card className="w-full bg-gray-50 border-dashed border-gray-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold text-gray-400">$0.00 <span className="text-sm font-normal">USDC</span></p>
        <p className="text-xs text-gray-400 mt-1">(Allocation Pending)</p>
      </CardContent>
    </Card>
  );
}

export default function AllocationPlaceholders() {
  return (
    <div className="w-full space-y-4 mt-6">
      <PlaceholderSection title="Tax Reserve" />
      <PlaceholderSection title="Liquidity Pool" />
      <PlaceholderSection title="Yield Strategies" />
    </div>
  );
} 