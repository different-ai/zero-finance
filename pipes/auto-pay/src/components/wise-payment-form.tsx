'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { WisePaymentInfo } from '@/types/wise';

interface WisePaymentFormProps {
  paymentInfo: WisePaymentInfo;
  onChange: (info: WisePaymentInfo) => void;
}

export function WisePaymentForm({ paymentInfo, onChange }: WisePaymentFormProps) {
  const handleChange = (field: keyof WisePaymentInfo, value: string) => {
    onChange({
      ...paymentInfo,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Amount</Label>
        <div className="flex gap-2">
          <Input
            value={paymentInfo.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-20"
            required
          />
          <Input
            value={paymentInfo.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Recipient Name</Label>
        <Input
          value={paymentInfo.recipientName}
          onChange={(e) => handleChange('recipientName', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Account Number</Label>
        <Input
          value={paymentInfo.accountNumber}
          onChange={(e) => handleChange('accountNumber', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Routing Number</Label>
        <Input
          value={paymentInfo.routingNumber}
          onChange={(e) => handleChange('routingNumber', e.target.value)}
          required
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label className="text-sm font-medium">Reference</Label>
        <Input
          value={paymentInfo.reference || ''}
          onChange={(e) => handleChange('reference', e.target.value)}
          placeholder="Add a reference (optional)"
        />
      </div>
    </div>
  );
} 