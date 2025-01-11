'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ReloadIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { usePaymentDetector } from '@/agents/payment-detector-agent';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { useDetectionStore } from '@/stores/detection-store';
import { AgentStepsView } from '@/components/agent-steps-view';

export default function MercuryDetectPage() {
  const router = useRouter();
  const [step, setStep] = useState<'idle' | 'detecting' | 'detected'>('idle');
  const { result: detectionResult, detectPayments, isProcessing: isDetecting } = usePaymentDetector('mercury-detect');
  const { detections, selectedDetection, setDetections, setSelectedDetection, clearDetections } = useDetectionStore();
  const [recognizedItemId] = useState(() => crypto.randomUUID());

  // Effect to update UI when detection result changes
  useEffect(() => {
    console.log('0xHypr', 'Detection result:', detectionResult);
    if (detectionResult?.detections?.length && detectionResult.detections.length > 0) {
      const mappedDetections = detectionResult.detections.map(detection => ({
        ...detection,
        id: detection.id || crypto.randomUUID(),
        amount: detection.amount || '',
        currency: detection.currency || '',
        description: detection.description || detection.label || '',
      }));
      console.log('0xHypr', 'Mapped detections:', mappedDetections);
      setDetections(mappedDetections);
      setSelectedDetection(mappedDetections[0]); // Auto-select first detection
      setStep('detected');
    }
  }, [detectionResult, setDetections, setSelectedDetection]);

  const handleDetect = useCallback(async () => {
    try {
      setStep('detecting');
      clearDetections(); // Clear previous detections
      setSelectedDetection(null); // Clear selected detection
      
      const result = await detectPayments();
      console.log('0xHypr', 'Detection completed:', result);
      
      if (result.error) {
        console.error('0xHypr', 'Detection error:', result.error);
        toast({
          title: 'Detection Error',
          description: result.error,
          variant: 'destructive',
        });
        setStep('idle');
        return;
      }

      if (result.detections.length === 0) {
        toast({
          title: 'No Payments Found',
          description: 'No payment-related content was detected.',
        });
        setStep('idle');
        return;
      }

    } catch (error) {
      console.error('0xHypr', 'Unexpected error during detection:', error);
      toast({
        title: 'Detection Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      setStep('idle');
    }
  }, [detectPayments, clearDetections, setSelectedDetection]);

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      clearDetections();
      setSelectedDetection(null);
    };
  }, [clearDetections, setSelectedDetection]);

  return (
    <main className="container max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Detect Payments</CardTitle>
          <CardDescription>
            Scan your screen for payment-related information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={handleDetect}
              disabled={isDetecting}
              className="w-full"
            >
              {isDetecting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                  Scan for Payments
                </>
              )}
            </Button>
          </div>

          {step === 'detecting' && (
            <div className="space-y-2">
              <Progress value={isDetecting ? 50 : 100} />
              <p className="text-sm text-muted-foreground text-center">
                Scanning for payment information...
              </p>
            </div>
          )}

          {step === 'detected' && detections.length > 0 && (
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {detections.map((detection) => (
                  <Card
                    key={detection.id}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-accent',
                      selectedDetection?.id === detection.id && 'bg-accent'
                    )}
                    onClick={() => setSelectedDetection(detection)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {detection.label}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {detection.description}
                          </CardDescription>
                          {detection.source && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Source: {detection.source.app} - {detection.source.window}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {detection.amount} {detection.currency}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          {selectedDetection && (
            <div className="flex justify-end">
              <Button
                onClick={() => router.push('/auto-pay/prepare/mercury')}
                disabled={!selectedDetection}
              >
                Continue with Selected
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <AgentStepsView recognizedItemId={recognizedItemId} />
    </main>
  );
} 