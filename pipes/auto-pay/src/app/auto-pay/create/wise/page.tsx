'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useDetectionStore } from '@/stores/detection-store';
import { useSettings } from '@/hooks/use-settings';
import { ReloadIcon } from '@radix-ui/react-icons';

export default function WiseCreatePage() {
  const router = useRouter();
  const { selectedDetection } = useDetectionStore();
  const { settings } = useSettings();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!selectedDetection) {
      toast({
        title: 'Error',
        description: 'No payment details found',
        variant: 'destructive',
      });
      router.push('/auto-pay/detect/wise');
      return;
    }

    // TODO: Add Wise settings check when implemented
  }, [selectedDetection, settings, router]);

  const handleCreate = useCallback(async () => {
    if (!selectedDetection) return;
    
    setIsCreating(true);
    try {
      // TODO: Implement Wise payment creation
      toast({
        title: 'Not Implemented',
        description: 'Wise payments are not yet supported',
        variant: 'destructive',
      });
      router.push('/auto-pay/payment-method');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create payment',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  }, [selectedDetection, router]);

  if (!selectedDetection) {
    return (
      <main className="container max-w-2xl mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="text-center space-y-2">
              <h3 className="font-medium">No Payment Details</h3>
              <p className="text-sm text-muted-foreground">
                Please detect and prepare a payment first
              </p>
            </div>
            <Button onClick={() => router.push('/auto-pay/detect/wise')}>
              Start Over
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
          <CardTitle>Create Wise Payment</CardTitle>
          <CardDescription>
            Review the payment details and create the transfer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Amount</div>
              <div className="text-sm text-muted-foreground">
                {selectedDetection.amount} {selectedDetection.currency}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium">Description</div>
              <div className="text-sm text-muted-foreground">
                {selectedDetection.description}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
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