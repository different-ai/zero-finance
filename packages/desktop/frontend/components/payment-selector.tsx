import { NetworkType } from '@/types/payment';

interface PaymentSelectorProps {
  value: NetworkType;
  onChange: (value: NetworkType) => void;
}

export function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as NetworkType)}
      className="w-full p-2 border rounded"
    >
      <option value="gnosis">Gnosis Chain (EURe)</option>
      <option value="ethereum">Ethereum Mainnet (USDC)</option>
    </select>
  );
} 