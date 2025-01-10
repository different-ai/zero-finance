'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useDetectionStore } from '@/stores/detection-store';

interface PaymentDetails {
  amount: string;
  currency: string;
  description: string;
}

export default function WisePreparePage() {
  const router = useRouter();
  const { selectedDetection } = useDetectionStore();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: '',
    currency: '',
    description: '',
  });

  useEffect(() => {
    if (!selectedDetection) {
      toast({
        title: 'Error',
        description: 'No detection selected',
        variant: 'destructive',
      });
      router.push('/auto-pay/detect/wise');
      return;
    }

    setPaymentDetails({
      amount: selectedDetection.amount,
      currency: selectedDetection.currency,
      description: selectedDetection.description,
    });
  }, [selectedDetection, router]);

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

    router.push(`/auto-pay/create/wise`);
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
            <Button onClick={() => router.push('/auto-pay/detect/wise')}>
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
          <CardTitle>Prepare Wise Payment</CardTitle>
          <CardDescription>
            Review and confirm the payment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  value={paymentDetails.amount}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={paymentDetails.currency}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, currency: e.target.value }))}
                  placeholder="Enter currency"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={paymentDetails.description}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Back
              </Button>
              <Button type="submit">
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
} 