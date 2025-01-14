'use client'

import { cn } from '@/lib/utils';

type NetworkType = 'gnosis';

interface PaymentMethodSelectorProps {
  value: NetworkType;
  onChange: (value: NetworkType) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as NetworkType)}
      className="w-full p-2 border rounded"
    >
      <option value="gnosis">Gnosis Chain (EURe)</option>
    </select>
  );
}

