'use client'

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import {
  ReloadIcon,
  ArrowRightIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AgentStepsView } from '@/components/agent-steps-view';
import { PaymentReview } from '@/components/payment-review';
import { cn } from '@/lib/utils';
import type { WisePaymentInfo } from '@/types/wise';
import type { MercuryPaymentRequest } from '@/types/mercury';
import type { PaymentDetails, PaymentMethod, TransferDetails } from '@/types/payment';
import {
  usePaymentDetector,
  type DetectionSnippet,
} from '@/agents/payment-detector-agent';
import {
  usePaymentPreparer,
  type PreparedTransferDetails,
} from '@/agents/payment-preparer-agent';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { useSettings } from '@/hooks/use-settings';
import { OnboardingDialog } from '@/components/onboarding-dialog';
import { getConfigurationStatus } from '@/lib/auto-pay-settings';

interface ExtendedDetectionSnippet extends DetectionSnippet {
  id: string;
  amount: string;
  currency: string;
  description: string;
}

// Convert TransferDetails to PaymentInfo
function transferDetailsToPaymentInfo(details: PreparedTransferDetails, settings: any): PaymentDetails {
  const wiseInfo: WisePaymentInfo = {
    amount: details.amount,
    currency: details.currency,
    recipientName: details.targetAccount.accountHolderName || '',
    accountNumber: details.targetAccount.accountNumber || '',
    routingNumber: details.targetAccount.routingNumber || '',
    reference: details.reference || '',
  };

  const mercuryInfo: MercuryPaymentRequest = {
    recipientId: details.recipient?.id || details.targetAccount.accountId || '',
    amount: parseFloat(details.amount),
    paymentMethod: 'ach',
    idempotencyKey: crypto.randomUUID(),
  };

  return {
    method: 'wise', // Default to wise, can be changed by user
    wise: wiseInfo,
    mercury: mercuryInfo,
  };
}

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [detections, setDetections] = useState<ExtendedDetectionSnippet[]>([]);
  const [selectedDetection, setSelectedDetection] = useState<ExtendedDetectionSnippet | null>(null);
  const [recognizedItemId] = useState(() => crypto.randomUUID());
  const { steps: agentSteps, clearSteps } = useAgentStepsStore();
  const [step, setStep] = useState<'idle' | 'detecting' | 'detected' | 'preparing' | 'review' | 'creating' | 'funding'>('idle');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [transferDetails, setTransferDetails] = useState<TransferDetails | null>(null);
  const [creatingTransfer, setCreatingTransfer] = useState(false);
  const { settings } = useSettings();

  const { result: detectionResult, detectPayments, isProcessing: isDetecting } = usePaymentDetector(recognizedItemId);
  const { result: preparationResult, prepareTransfer, isProcessing: isPreparing } = usePaymentPreparer(recognizedItemId);
  const config = getConfigurationStatus(settings);

  // Show onboarding dialog when no provider is configured
  useEffect(() => {
    if (!config.isAnyConfigured) {
      setShowSettings(true);
    }
  }, [config.isAnyConfigured]);

  // Clear steps when component unmounts
  useEffect(() => {
    return () => {
      clearSteps(recognizedItemId);
    };
  }, [recognizedItemId, clearSteps]);

  const handleDetectionSelect = useCallback((detection: ExtendedDetectionSnippet) => {
    setSelectedDetection(detection);
    handlePreparePayment(detection);
  }, []);

  const handlePreparePayment = useCallback(async (detection: ExtendedDetectionSnippet) => {
    setSelectedDetection(detection);
    setStep('preparing');

    const result = await prepareTransfer(detection.snippet);
    if ('transfer' in result && result.transfer) {
      const details = transferDetailsToPaymentInfo(result.transfer.details, settings);
      setPaymentDetails(details);
      setStep('review');
    } else {
      toast({
        title: 'Preparation Error',
        description: 'error' in result ? result.error : 'Failed to prepare payment details',
        variant: 'destructive',
      });
      setStep('detected');
    }
  }, [prepareTransfer, settings]);

  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    if (paymentDetails) {
      setPaymentDetails({ ...paymentDetails, method });
    }
  }, [paymentDetails]);

  const handleCreateTransfer = async () => {
    if (!paymentDetails) return;

    try {
      setCreatingTransfer(true);
      setStep('creating');

      let response;
      if (paymentDetails.method === 'wise' && paymentDetails.wise) {
        response = await fetch('/api/createTransfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentInfo: paymentDetails.wise }),
        });
      } else if (paymentDetails.method === 'mercury' && paymentDetails.mercury) {
        response = await fetch('/api/createMercuryPayment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentInfo: paymentDetails.mercury }),
        });
      } else {
        throw new Error('Invalid payment method or missing payment details');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      if (data.success) {
        if (paymentDetails.method === 'wise') {
          const transferId = data.transfer.id.toString();
          const status = data.transfer.status;
          const trackingUrl = `${settings?.customSettings?.['auto-pay']?.enableProduction
            ? 'https://wise.com'
            : 'https://sandbox.transferwise.tech'}/transactions/activities/by-resource/TRANSFER/${transferId}`;

          setTransferDetails({
            id: transferId,
            status,
            trackingUrl,
            provider: 'wise',
          });

          setStep('funding');
        } else {
          // Mercury payment
          setTransferDetails({
            id: data.paymentId,
            status: data.payment.status,
            trackingUrl: data.dashboardLink,
            provider: 'mercury',
          });

          // Reset the flow after successful Mercury payment
          setTimeout(() => {
            setStep('idle');
            setSelectedDetection(null);
            setPaymentDetails(null);
            setTransferDetails(null);
            clearSteps(recognizedItemId);
          }, 3000);
        }
        
        toast({
          title: 'Payment Created',
          description: `Payment has been created successfully.`,
        });
      }
    } catch (error) {
      console.error('0xHypr', 'Error creating transfer:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to create payment',
        variant: 'destructive',
      });
    } finally {
      setCreatingTransfer(false);
    }
  };

  const handleDetect = useCallback(async () => {
    setStep('detecting');
    await detectPayments();
    if (detectionResult && !detectionResult.error && detectionResult.detections.length > 0) {
      const detections = detectionResult.detections.map(detection => ({
        ...detection,
        id: detection.id || crypto.randomUUID(),
        amount: detection.amount || '',
        currency: detection.currency || '',
        description: detection.description || detection.label || '',
      }));
      setDetections(detections);
      setStep('detected');
    } else {
      setStep('idle');
    }
  }, [detectPayments, detectionResult]);

  return (
    <main className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Auto Pay</h1>
        <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Detection</CardTitle>
          <CardDescription>
            Detected payment-like content from your screen
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
                    setSelectedDetection(null);
                    setPaymentDetails(null);
                    setTransferDetails(null);
                    clearSteps(recognizedItemId);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>

            {step === 'idle' && (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Ready to Detect Payments</h3>
                  {config.isAnyConfigured ? (
                    <p className="text-sm text-muted-foreground">
                      Click the button below to start scanning your screen for payment-like content
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Please configure at least one payment provider in settings to start scanning
                    </p>
                  )}
                </div>
                <Button 
                  onClick={handleDetect} 
                  disabled={isDetecting || !config.isAnyConfigured}
                >
                  {isDetecting ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                      {config.isAnyConfigured ? 'Start Scanning' : 'Configure Provider'}
                    </>
                  )}
                </Button>
              </div>
            )}

            {step === 'detecting' && (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <ReloadIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Scanning for Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Looking for payment-like content in your recent screen activity...
                  </p>
                </div>
              </div>
            )}

            {(step === 'detected' || step === 'review') && (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {detections.map((detection) => (
                    <div
                      key={detection.id}
                      className={cn(
                        'p-4 rounded-lg border',
                        selectedDetection?.id === detection.id
                          ? 'bg-muted border-primary'
                          : 'hover:bg-muted/50 cursor-pointer'
                      )}
                      onClick={() => handleDetectionSelect(detection)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {detection.amount} {detection.currency}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {detection.description}
                          </div>
                        </div>
                        <Badge variant="outline">{detection.confidence}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {step === 'preparing' && (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <ReloadIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Preparing Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Extracting and verifying payment details...
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {step === 'review' && paymentDetails && (
        <PaymentReview
          paymentDetails={paymentDetails}
          onPaymentMethodChange={handlePaymentMethodChange}
          onPaymentDetailsChange={setPaymentDetails}
          onRefresh={() => {
            if (selectedDetection) {
              handlePreparePayment(selectedDetection);
            }
          }}
          onSubmit={handleCreateTransfer}
          isSubmitting={creatingTransfer}
          availableMethods={getConfigurationStatus().availableMethods}
        />
      )}

      {step === 'funding' && transferDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer Created</CardTitle>
            <CardDescription>
              Your transfer has been created and is awaiting funding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Transfer ID</div>
                  <div className="text-sm text-muted-foreground">
                    {transferDetails.id}
                  </div>
                </div>
                <Badge variant="outline">{transferDetails.status}</Badge>
              </div>
              <Button
                className="w-full"
                onClick={() => window.open(transferDetails.trackingUrl, '_blank')}
              >
                <ArrowRightIcon className="mr-2 h-4 w-4" />
                View Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <AgentStepsView
        recognizedItemId={recognizedItemId}
        className="mt-4"
      />

      <OnboardingDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </main>
  );
}
