import { NetworkType } from '@/types/payment';

interface PaymentSelectorProps {
  value: NetworkType;
  onChange: (value: NetworkType) => void;
}

const NETWORK_OPTIONS = {
  gnosis: {
    label: 'Gnosis Chain (EURe)',
    description: 'Fast and low-cost transactions with Euro stablecoin',
  },
  ethereum: {
    label: 'Ethereum Mainnet (USDC)',
    description: 'Most widely accepted stablecoin on Ethereum',
  },
} as const;

export function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as NetworkType)}
        className="w-full p-2 border rounded-md bg-background"
      >
        {Object.entries(NETWORK_OPTIONS).map(([network, { label }]) => (
          <option key={network} value={network}>
            {label}
          </option>
        ))}
      </select>
      <p className="text-sm text-muted-foreground">
        {NETWORK_OPTIONS[value].description}
      </p>
    </div>
  );
} 