import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { requestService } from '../services/request-service';
import { RequestDetails, PaymentMethod } from '../lib/types';
import { formatAddress, formatAmount } from '../lib/utils';
import { useState } from 'react';
import { Types } from '@requestnetwork/request-client.js';

export function InvoiceViewer() {
  const { requestId } = useParams<{ requestId: string }>();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: invoice, isLoading, error } = useQuery<Types.IRequestData & RequestDetails>({
    queryKey: ['invoice', requestId],
    queryFn: () => requestService.getRequestById(requestId!),
    enabled: !!requestId,
  });

  const { data: paymentMethods } = useQuery<PaymentMethod[]>({
    queryKey: ['paymentMethods', invoice],
    queryFn: () => requestService.getPaymentMethods(invoice!),
    enabled: !!invoice,
  });

  const handlePayment = async () => {
    if (!invoice || !selectedMethod) return;
    
    try {
      setIsProcessing(true);
      const result = await requestService.processPayment(
        invoice.requestId,
        selectedMethod.id,
        invoice.amount
      );
      
      if (result.success) {
        // Show success message
        console.log('Payment successful:', result.transactionHash);
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="text-gray-600">Failed to load invoice details.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-block mb-6 text-blue-500 hover:text-blue-600">
        &larr; Back to Home
      </Link>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Invoice Details</h1>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Amount</label>
              <p className="text-lg font-semibold">
                {formatAmount(invoice.amount)} {invoice.currency.value}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-lg font-semibold capitalize">{invoice.status}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Payee</label>
            <p className="text-lg font-mono">{formatAddress(invoice.payee.value)}</p>
          </div>

          {invoice.payer && (
            <div>
              <label className="text-sm font-medium text-gray-600">Payer</label>
              <p className="text-lg font-mono">{formatAddress(invoice.payer.value)}</p>
            </div>
          )}

          {invoice.description && (
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-lg">{invoice.description}</p>
            </div>
          )}
        </div>

        {paymentMethods && paymentMethods.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={`w-full p-4 rounded-lg border ${
                    selectedMethod?.id === method.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </button>
              ))}
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className="mt-6 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
