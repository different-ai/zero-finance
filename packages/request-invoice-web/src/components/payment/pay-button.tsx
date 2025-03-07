'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PayButtonProps {
  requestId: string;
  decryptionKey: string;
  amount: string;
  currency: string;
  isLoading?: boolean;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PayButton({
  requestId,
  decryptionKey,
  amount,
  currency,
  isLoading = false,
  disabled = false,
  onSuccess,
  onError,
}: PayButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      console.log('0xHypr', 'Processing payment', { 
        requestId, 
        amount, 
        currency 
      });
      
      // Create cipher provider for decryption
      const { RequestNetwork, Types } = await import('@requestnetwork/request-client.js');
      const { EthereumPrivateKeyCipherProvider } = await import('@requestnetwork/epk-cipher');
      
      const cipherProvider = new EthereumPrivateKeyCipherProvider({
        key: decryptionKey,
        method: Types.Encryption.METHOD.ECIES,
      });
      
      // Create request client with the cipher provider
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: 'https://xdai.gateway.request.network/',
        },
        cipherProvider,
      });
      
      // Get the request
      const request = await requestClient.fromRequestId(requestId);
      
      // Here you would implement the actual payment processing
      // This would typically involve:
      // 1. Getting the payment details from the request
      // 2. Connecting to a wallet or payment provider
      // 3. Executing the payment transaction
      // 4. Updating the request with the payment information
      
      // For now, we'll simulate the payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On successful payment
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('0xHypr', 'Payment error', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handlePayment}
      disabled={disabled || isLoading || isProcessing}
    >
      {(isLoading || isProcessing) ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay ${amount} ${currency}`
      )}
    </Button>
  );
}