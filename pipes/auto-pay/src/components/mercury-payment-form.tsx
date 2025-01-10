'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MercuryPaymentRequest } from '@/types/mercury';

interface MercuryPaymentFormProps {
  paymentInfo: MercuryPaymentRequest;
  onChange: (info: MercuryPaymentRequest) => void;
}

export function MercuryPaymentForm({ paymentInfo, onChange }: MercuryPaymentFormProps) {
  const handleChange = (field: keyof MercuryPaymentRequest, value: string | number) => {
    onChange({
      ...paymentInfo,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Amount</Label>
        <Input
          type="number"
          value={paymentInfo.amount}
          onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Recipient ID</Label>
        <Input
          value={paymentInfo.recipientId}
          onChange={(e) => handleChange('recipientId', e.target.value)}
          required
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label className="text-sm font-medium">Payment Method</Label>
        <Input
          value={paymentInfo.paymentMethod}
          disabled
          className="bg-muted"
        />
      </div>
    </div>
  );
} 