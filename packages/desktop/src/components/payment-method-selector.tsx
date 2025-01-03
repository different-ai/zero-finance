'use client'

import { cn } from '@/lib/utils';

type NetworkType = 'ethereum' | 'gnosis';

interface PaymentMethodSelectorProps {
  value?: NetworkType;
  onChange?: (value: NetworkType) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const handleSelect = (network: NetworkType) => {
    onChange?.(network);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent",
            value === 'ethereum' && "bg-primary/10 border-primary"
          )}
          onClick={() => handleSelect('ethereum')}
        >
          <img src="/ethereum-logo.svg" alt="Ethereum" width={20} height={20} />
          Ethereum
        </button>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent",
            value === 'gnosis' && "bg-primary/10 border-primary"
          )}
          onClick={() => handleSelect('gnosis')}
        >
          <img src="/gnosis-logo.jpg" alt="Gnosis" width={20} height={20} />
          Gnosis Chain
        </button>
      </div>
    </div>
  );
}

