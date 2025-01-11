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
import { usePaymentLifecycleStore } from '@/stores/payment-lifecycle-store';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePreparation, preparations } = usePaymentLifecycleStore();

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
      try {
        const result = await prepareTransfer(selectedDetection.snippet, selectedDetection.id);
        
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

        console.log('0xHypr', 'Preparation Result:', result);

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

        const newPaymentDetails = {
          amount: result.transfer.details.amount || selectedDetection.amount,
          currency: result.transfer.details.currency || selectedDetection.currency,
          description: result.transfer.details.reference || selectedDetection.description,
        };

        setPaymentDetails(newPaymentDetails);

        // Find the preparation for this detection
        const preparation = preparations.find(p => p.detectionId === selectedDetection.id);
        if (preparation) {
          updatePreparation(preparation.id, {
            status: 'prepared',
            recipientDetails: newRecipientDetails,
            paymentDetails: newPaymentDetails,
          });
        }

        toast({
          title: 'Payment Prepared',
          description: 'Payment details have been extracted successfully.',
        });
      } catch (error) {
        console.error('0xHypr', 'Error preparing payment:', error);
        toast({
          title: 'Preparation Error',
          description: error instanceof Error ? error.message : 'Failed to prepare payment details',
          variant: 'destructive',
        });
      }
    };
    prepare();
  }, [selectedDetection, router, prepareTransfer, setRecipientDetails, updatePreparation, preparations]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentDetails.amount || !paymentDetails.currency || !recipientDetails) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/createMercuryRecipient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipientDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.error || 'Failed to create recipient';
        
        // Handle specific Mercury API errors
        if (data.code === 'MERCURY_API_ERROR') {
          if (data.details?.message?.includes('ACH payments')) {
            errorMessage = 'This recipient is not configured to receive ACH payments. Please verify the account details and try again.';
          } else if (data.details?.message) {
            errorMessage = data.details.message;
          }
        }

        console.error('0xHypr', 'Mercury API Error:', data);
        toast({
          title: 'Recipient Creation Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }

      // Store recipient ID in payment details
      if (data.recipientId) {
        setPaymentDetails(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            method: 'mercury' as const,
            mercury: {
              recipientId: data.recipientId,
              amount: prev.amount ? parseFloat(prev.amount) : 0,
              paymentMethod: 'ach' as const,
              idempotencyKey: crypto.randomUUID(),
            }
          };
        });

        toast({
          title: 'Recipient Created',
          description: data.isExisting 
            ? 'Found existing recipient with matching details.' 
            : 'New recipient created successfully.',
        });
      }

      router.push(`/auto-pay/create/mercury`);
    } catch (error) {
      console.error('0xHypr', 'Error creating recipient:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create recipient',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [paymentDetails, recipientDetails, router, setPaymentDetails]);

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
                <div className="flex items-center gap-2">
                  <Input
                    value={paymentDetails.amount}
                    onChange={(e) => setPaymentDetails(prev => ({
                      ...prev,
                      amount: e.target.value,
                    }))}
                    placeholder="Amount"
                    className="w-32"
                    disabled={isSubmitting || isProcessing}
                  />
                  <div className="text-lg font-medium">{paymentDetails.currency}</div>
                </div>
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
                    disabled={isSubmitting || isProcessing}
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
                    disabled={isSubmitting || isProcessing}
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
                    disabled={isSubmitting || isProcessing}
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
                    disabled={isSubmitting || isProcessing}
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
                      disabled={isSubmitting || isProcessing}
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
                      disabled={isSubmitting || isProcessing}
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
                      disabled={isSubmitting || isProcessing}
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
                      disabled={isSubmitting || isProcessing}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting || isProcessing}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || isProcessing}>
                {isSubmitting ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Creating Recipient...
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