import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface CryptoManualPaymentDetailsProps {
  address: string | null;
  currency: string;
  network: string;
  amount: string | null;
}

export const CryptoManualPaymentDetails: React.FC<CryptoManualPaymentDetailsProps> = ({
  address,
  currency,
  network,
  amount,
}) => {
  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
        .then(() => console.log('Address copied!')) // Replace with toast later
        .catch(err => console.error('Failed to copy address:', err));
    }
  };

  if (!address) {
    return (
       <p className="text-sm text-orange-600">
         Seller&apos;s crypto payment address is not available. Please contact the seller.
       </p>
    );
  }

  return (
    <div className="text-left bg-gray-50 p-4 rounded border text-sm space-y-1">
      <h4 className="font-medium mb-2 text-gray-800">Manual Crypto Payment:</h4>
      <p>
        Please send{' '}
        <strong>{amount ? `${amount} ${currency}` : `the total amount in ${currency}`}</strong>{' '}
        on the <strong>{network.toUpperCase()}</strong> network to the address below:
      </p>
      <div className="flex items-center space-x-2 pt-1">
         <p className="font-mono break-all flex-1 bg-white p-1 border rounded">{address}</p>
         <Button variant="ghost" size="sm" onClick={handleCopy} aria-label="Copy address">
             <Copy className="h-4 w-4" />
         </Button>
      </div>
      <p className="mt-2 pt-2 border-t text-xs text-orange-600">
        <strong>Warning:</strong> Ensure you are sending on the correct network ({network.toUpperCase()}).
        Sending assets on the wrong network may result in permanent loss of funds.
      </p>
    </div>
  );
};

CryptoManualPaymentDetails.displayName = 'CryptoManualPaymentDetails'; 