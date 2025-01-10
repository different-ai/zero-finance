'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useDetectionStore } from '@/stores/detection-store';
import { useSettings } from '@/hooks/use-settings';
import { ReloadIcon } from '@radix-ui/react-icons';

interface RecipientDetails {
  name: string;
  email: string;
  routingNumber: string;
  accountNumber: string;
  accountType: 'businessChecking' | 'personalChecking';
  address: {
    country: string;
    postalCode: string;
    region: string;
    city: string;
    address1: string;
  };
}

export default function MercuryCreatePage() {
  const router = useRouter();
  const { selectedDetection } = useDetectionStore();
  const { settings } = useSettings();
  const [isCreating, setIsCreating] = useState(false);
  const [recipientDetails, setRecipientDetails] = useState<RecipientDetails>({
    name: '',
    email: '',
    routingNumber: '',
    accountNumber: '',
    accountType: 'businessChecking',
    address: {
      country: 'US',
      postalCode: '',
      region: '',
      city: '',
      address1: '',
    },
  });

  useEffect(() => {
    if (!selectedDetection) {
      toast({
        title: 'Error',
        description: 'No payment details found',
        variant: 'destructive',
      });
      router.push('/auto-pay/detect/mercury');
      return;
    }

    if (!settings?.customSettings?.['auto-pay']?.mercuryApiKey || !settings?.customSettings?.['auto-pay']?.mercuryAccountId) {
      toast({
        title: 'Error',
        description: 'Mercury is not configured',
        variant: 'destructive',
      });
      router.push('/auto-pay/payment-method');
      return;
    }
  }, [selectedDetection, settings, router]);

  const handleCreate = useCallback(async () => {
    if (!selectedDetection) return;
    
    setIsCreating(true);
    try {
      // First create the recipient
      const recipientResponse = await fetch('/api/createMercuryRecipient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipientDetails),
      });

      if (!recipientResponse.ok) {
        const errorData = await recipientResponse.json();
        throw new Error(errorData.error || 'Failed to create recipient');
      }

      const recipientData = await recipientResponse.json();
      
      // Then create the payment using the recipient ID
      const paymentInfo = {
        recipientId: recipientData.recipientId,
        amount: parseFloat(selectedDetection.amount),
        paymentMethod: "ach",
        idempotencyKey: crypto.randomUUID()
      };

      const paymentResponse = await fetch('/api/createMercuryTransfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentInfo }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const paymentData = await paymentResponse.json();
      toast({
        title: 'Success',
        description: 'Payment created successfully',
      });

      router.push('/auto-pay/payment-method');
    } catch (error) {
      console.error('Payment creation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create payment',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  }, [selectedDetection, recipientDetails, router]);

  if (!selectedDetection) {
    return (
      <main className="container max-w-2xl mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="text-center space-y-2">
              <h3 className="font-medium">Payment Details Not Found</h3>
              <p className="text-sm text-muted-foreground">
                Please select a payment to process
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
          <CardTitle>Create Mercury Payment</CardTitle>
          <CardDescription>
            Enter recipient details and confirm payment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Payment Amount</Label>
                <div className="text-lg font-medium">{selectedDetection.amount} {selectedDetection.currency}</div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="text-lg font-medium">{selectedDetection.description || 'No description'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recipient Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={recipientDetails.name}
                    onChange={(e) => setRecipientDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Recipient name"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={recipientDetails.email}
                    onChange={(e) => setRecipientDetails(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Recipient email"
                    required
                    disabled={isCreating}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    value={recipientDetails.routingNumber}
                    onChange={(e) => setRecipientDetails(prev => ({ ...prev, routingNumber: e.target.value }))}
                    placeholder="Bank routing number"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={recipientDetails.accountNumber}
                    onChange={(e) => setRecipientDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Bank account number"
                    required
                    disabled={isCreating}
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
                      value={recipientDetails.address.address1}
                      onChange={(e) => setRecipientDetails(prev => ({
                        ...prev,
                        address: { ...prev.address, address1: e.target.value }
                      }))}
                      placeholder="Street address"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={recipientDetails.address.city}
                      onChange={(e) => setRecipientDetails(prev => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value }
                      }))}
                      placeholder="City"
                      required
                      disabled={isCreating}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">State</Label>
                    <Input
                      id="region"
                      value={recipientDetails.address.region}
                      onChange={(e) => setRecipientDetails(prev => ({
                        ...prev,
                        address: { ...prev.address, region: e.target.value }
                      }))}
                      placeholder="State"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP Code</Label>
                    <Input
                      id="postalCode"
                      value={recipientDetails.address.postalCode}
                      onChange={(e) => setRecipientDetails(prev => ({
                        ...prev,
                        address: { ...prev.address, postalCode: e.target.value }
                      }))}
                      placeholder="ZIP code"
                      required
                      disabled={isCreating}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()} disabled={isCreating}>
                Back
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Creating Payment...
                  </>
                ) : (
                  'Create Payment'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 