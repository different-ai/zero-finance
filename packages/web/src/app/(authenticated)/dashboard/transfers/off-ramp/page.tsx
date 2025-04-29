import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Separator } from '@/components/ui/separator';
import OffRampFlow from '@/components/transfers/off-ramp-flow'; // Component to be created

export default function OffRampPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Send to Bank Account"
        description="Send funds from your digital account directly to your bank account."
      />
      <Separator />
      <OffRampFlow />
    </div>
  );
} 