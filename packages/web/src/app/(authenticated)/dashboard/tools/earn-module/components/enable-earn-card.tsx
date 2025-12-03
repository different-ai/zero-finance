'use client';

import { type Address } from 'viem';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnableEarnCardProps {
  safeAddress?: Address;
}

/**
 * EnableEarnCard - Previously used to manage Safe module setup for auto-earn.
 *
 * The auto-earn module system is temporarily retired. This component now just
 * shows informational status. The deposit/withdraw functionality works directly
 * without requiring module setup.
 */
export function EnableEarnCard({ safeAddress }: EnableEarnCardProps) {
  if (!safeAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earn (Vaults)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-500">
            No primary safe detected or selected.
          </p>
          <CardDescription className="text-xs text-gray-500 mt-2">
            Please ensure a primary safe is active to use this feature.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earn (Vaults)</CardTitle>
        <Badge variant="default" className="bg-green-500 text-white w-fit">
          Ready
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Deposit funds into yield-generating vaults. Use the tabs below to
          deposit or withdraw.
        </p>
        <CardDescription className="text-xs text-gray-500">
          Your Safe: {safeAddress}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
