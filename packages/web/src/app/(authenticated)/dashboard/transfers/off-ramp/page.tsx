import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Separator } from '@/components/ui/separator';
import OffRampFlow from '@/components/transfers/off-ramp-flow'; // Component to be created

export default function OffRampPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdraw Funds (Off-Ramp)"
        description="Convert crypto from your Safe to fiat in your bank account."
      />
      <Separator />
      <OffRampFlow />
    </div>
  );
} 