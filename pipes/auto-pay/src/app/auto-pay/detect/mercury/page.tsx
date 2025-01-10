'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
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
  const [recognizedItemId, setRecognizedItemId] = useState<string | null>(null);

  const handleDetect = useCallback(async () => {
    setStep('detecting');
    const newRecognizedItemId = crypto.randomUUID();
    setRecognizedItemId(newRecognizedItemId);
    
    await detectPayments();
    
    if (detectionResult && !detectionResult.error && detectionResult.detections.length > 0) {
      const mappedDetections = detectionResult.detections.map(detection => ({
        ...detection,
        id: detection.id || crypto.randomUUID(),
        amount: detection.amount || '',
        currency: detection.currency || '',
        description: detection.description || detection.label || '',
      }));
      setDetections(mappedDetections);
      setStep('detected');
    } else {
      setStep('idle');
      if (detectionResult?.error) {
        toast({
          title: 'Detection Error',
          description: detectionResult.error,
          variant: 'destructive',
        });
      }
    }
  }, [detectPayments, detectionResult, setDetections]);

  const handleSelect = useCallback((detection: typeof detections[0]) => {
    setSelectedDetection(detection);
    router.push(`/auto-pay/prepare/mercury`);
  }, [router, setSelectedDetection]);

  return (
    <main className="container max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Detect Mercury Payments</CardTitle>
          <CardDescription>
            Scan your screen for payment-like content to process with Mercury
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={step === 'idle' ? 0 : step === 'detecting' ? 50 : 100} className="flex-1" />
              {step !== 'idle' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep('idle');
                    clearDetections();
                    setRecognizedItemId(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
            {step === 'idle' ? (
              <Button onClick={handleDetect} disabled={isDetecting} className="w-full">
                {isDetecting ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                    Start Detection
                  </>
                )}
              </Button>
            ) : (
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="p-4 space-y-4">
                  {detections.map((detection) => (
                    <Card
                      key={detection.id}
                      className={cn(
                        'cursor-pointer transition-colors hover:bg-accent',
                        selectedDetection?.id === detection.id && 'bg-accent'
                      )}
                      onClick={() => handleSelect(detection)}
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{detection.label}</p>
                            <p className="text-sm text-muted-foreground">{detection.snippet}</p>
                          </div>
                          <Badge variant="secondary">
                            {detection.confidence}% match
                          </Badge>
                        </div>
                        {(detection.amount || detection.currency) && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{detection.amount}</span>
                            <span>{detection.currency}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>

      {recognizedItemId && (
        <Card>
          <CardHeader>
            <CardTitle>Detection Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentStepsView recognizedItemId={recognizedItemId} />
          </CardContent>
        </Card>
      )}
    </main>
  );
} 