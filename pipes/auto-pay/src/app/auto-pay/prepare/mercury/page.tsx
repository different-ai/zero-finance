'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useDetectionStore } from '@/stores/detection-store';
import type { RecipientDetails } from '@/stores/detection-store';
import { usePaymentPreparer } from '@/agents/payment-preparer-agent';
import { AgentStepsView } from '@/components/agent-steps-view';
import { ReloadIcon } from '@radix-ui/react-icons';
import type { PaymentPreparationResult } from '@/agents/payment-preparer-agent';

interface PaymentDetails {
  amount: string;
  currency: string;
  description: string;
}

export default function MercuryPreparePage() {
  const router = useRouter();
  const { selectedDetection, recipientDetails, setRecipientDetails } = useDetectionStore();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: '',
    currency: '',
    description: '',
  });
  const [recognizedItemId] = useState(() => crypto.randomUUID());
  const { prepareTransfer, isProcessing } = usePaymentPreparer(recognizedItemId);

  useEffect(() => {
    if (!selectedDetection) {
      toast({
        title: 'Error',
        description: 'No detection selected',
        variant: 'destructive',
      });
      router.push('/auto-pay/detect/mercury');
      return;
    }

    // When detection is loaded, prepare the payment
    const prepare = async () => {
      const result = await prepareTransfer(selectedDetection.snippet);
      
      // Handle error case
      if ('error' in result) {
        toast({
          title: 'Preparation Error',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      // Handle case where no transfer details were extracted
      if (!result.transfer) {
        toast({
          title: 'Preparation Error',
          description: 'No payment details could be extracted',
          variant: 'destructive',
        });
        return;
      }

      // Extract recipient details from the transfer
      const newRecipientDetails: RecipientDetails = {
        name: result.transfer.details.targetAccount.accountHolderName || '',
        email: '',  // Email needs to be collected from user
        routingNumber: result.transfer.details.targetAccount.routingNumber || '',
        accountNumber: result.transfer.details.targetAccount.accountNumber || '',
        accountType: 'businessChecking' as const,
        address: {
          country: 'US',
          postalCode: '',
          region: '',
          city: '',
          address1: '',
        },
      };

      // Store recipient details in the store
      setRecipientDetails(newRecipientDetails);

      setPaymentDetails({
        amount: result.transfer.details.amount || selectedDetection.amount,
        currency: result.transfer.details.currency || selectedDetection.currency,
        description: result.transfer.details.reference || selectedDetection.description,
      });
    };
    prepare();
  }, [selectedDetection, router, prepareTransfer, setRecipientDetails]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentDetails.amount || !paymentDetails.currency) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    router.push(`/auto-pay/create/mercury`);
  }, [paymentDetails, router]);

  if (!selectedDetection) {
    return (
      <main className="container max-w-2xl mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="text-center space-y-2">
              <h3 className="font-medium">Detection Not Found</h3>
              <p className="text-sm text-muted-foreground">
                The selected payment detection could not be found
              </p>
            </div>
            <Button onClick={() => router.push('/auto-pay/detect/mercury')}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Prepare Mercury Payment</CardTitle>
          <CardDescription>
            Review and confirm the payment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Payment Amount</Label>
                <div className="text-lg font-medium">{paymentDetails.amount} {paymentDetails.currency}</div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="text-lg font-medium">{paymentDetails.description || 'No description'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recipient Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={recipientDetails?.name || ''}
                    onChange={(e) => {
                      if (!recipientDetails) return;
                      setRecipientDetails({ ...recipientDetails, name: e.target.value });
                    }}
                    placeholder="Recipient name"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={recipientDetails?.email || ''}
                    onChange={(e) => {
                      if (!recipientDetails) return;
                      setRecipientDetails({ ...recipientDetails, email: e.target.value });
                    }}
                    placeholder="Recipient email"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    value={recipientDetails?.routingNumber || ''}
                    onChange={(e) => {
                      if (!recipientDetails) return;
                      setRecipientDetails({ ...recipientDetails, routingNumber: e.target.value });
                    }}
                    placeholder="Bank routing number"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={recipientDetails?.accountNumber || ''}
                    onChange={(e) => {
                      if (!recipientDetails) return;
                      setRecipientDetails({ ...recipientDetails, accountNumber: e.target.value });
                    }}
                    placeholder="Bank account number"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address1">Street Address</Label>
                    <Input
                      id="address1"
                      value={recipientDetails?.address.address1 || ''}
                      onChange={(e) => {
                        if (!recipientDetails) return;
                        setRecipientDetails({
                          ...recipientDetails,
                          address: { ...recipientDetails.address, address1: e.target.value }
                        });
                      }}
                      placeholder="Street address"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={recipientDetails?.address.city || ''}
                      onChange={(e) => {
                        if (!recipientDetails) return;
                        setRecipientDetails({
                          ...recipientDetails,
                          address: { ...recipientDetails.address, city: e.target.value }
                        });
                      }}
                      placeholder="City"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">State</Label>
                    <Input
                      id="region"
                      value={recipientDetails?.address.region || ''}
                      onChange={(e) => {
                        if (!recipientDetails) return;
                        setRecipientDetails({
                          ...recipientDetails,
                          address: { ...recipientDetails.address, region: e.target.value }
                        });
                      }}
                      placeholder="State"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP Code</Label>
                    <Input
                      id="postalCode"
                      value={recipientDetails?.address.postalCode || ''}
                      onChange={(e) => {
                        if (!recipientDetails) return;
                        setRecipientDetails({
                          ...recipientDetails,
                          address: { ...recipientDetails.address, postalCode: e.target.value }
                        });
                      }}
                      placeholder="ZIP code"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()} disabled={isProcessing}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preparation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentStepsView recognizedItemId={recognizedItemId} />
        </CardContent>
      </Card>
    </main>
  );
} 