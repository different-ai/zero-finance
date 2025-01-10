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
import type { PaymentInfo as WisePaymentInfo } from '@/types/wise';
import type { MercuryPaymentInfo } from '@/types/mercury';
import type { PaymentDetails, PaymentMethod, TransferDetails as PaymentTransferDetails } from '@/types/payment';
import {
  usePaymentDetector,
  type DetectionSnippet,
} from '@/agents/payment-detector-agent';
import {
  usePaymentPreparer,
  type TransferDetails,
} from '@/agents/payment-preparer-agent';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { useSettings } from '@/hooks/use-settings';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { OnboardingDialog } from '@/components/onboarding-dialog';
import { getConfigurationStatus } from '@/lib/auto-pay-settings';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Convert TransferDetails to PaymentInfo
function transferDetailsToPaymentInfo(details: TransferDetails, settings: any): PaymentDetails {
  const wiseInfo: WisePaymentInfo = {
    amount: details.amount,
    currency: details.currency,
    recipientName: details.targetAccount.accountHolderName || '',
    accountNumber: details.targetAccount.accountNumber || '',
    routingNumber: details.targetAccount.routingNumber || '',
    reference: details.reference || '',
  };

  return {
    method: 'wise',
    wise: wiseInfo,
  };
}

export default function Home() {
  const [step, setStep] = useState<
    | 'idle'
    | 'detecting'
    | 'detected'
    | 'preparing'
    | 'review'
    | 'creating'
    | 'funding'
  >('idle');
  const [selectedDetection, setSelectedDetection] = useState<DetectionSnippet | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [transferDetails, setTransferDetails] = useState<PaymentTransferDetails | null>(null);
  const [creatingTransfer, setCreatingTransfer] = useState(false);
  const [fundingTransfer, setFundingTransfer] = useState(false);
  const [recognizedItemId] = useState(() => crypto.randomUUID());
  const { settings, isLoading } = useSettings();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const config = getConfigurationStatus(settings);

  const {
    result: detectionResult,
    detectPayments,
    isProcessing: isDetecting,
    abort: abortDetection,
  } = usePaymentDetector(recognizedItemId);
  const {
    result: preparationResult,
    prepareTransfer,
    isProcessing: isPreparing,
    abort: abortPreparation,
  } = usePaymentPreparer(recognizedItemId);

  // Clear steps when component unmounts
  useEffect(() => {
    return () => {
      useAgentStepsStore.getState().clearSteps(recognizedItemId);
    };
  }, [recognizedItemId]);

  // Show onboarding dialog when no provider is configured
  useEffect(() => {
    if (!isLoading) {
      if (!config.wise.isConfigured && !config.mercury.isConfigured) {
        setShowOnboarding(true);
      }
    }
  }, [config, isLoading]);

  const handleDetect = async () => {
    setStep('detecting');
    useAgentStepsStore.getState().clearSteps(recognizedItemId);
    const result = await detectPayments();
    if (result.detections.length > 0) {
      setStep('detected');
    } else {
      setStep('idle');
    }
  };

  const handlePreparePayment = useCallback(
    async (detection: DetectionSnippet) => {
      setSelectedDetection(detection);
      setStep('preparing');

      const result = await prepareTransfer(detection.snippet);

      if ('error' in result) {
        toast({
          title: 'Preparation Failed',
          description: result.error,
          variant: 'destructive',
        });
        setStep('idle');
        return;
      }

      if (result.transfer) {
        try {
          // Try to convert transfer details to payment info
          const paymentDetails = transferDetailsToPaymentInfo(
            result.transfer.details,
            settings
          );
          setPaymentDetails(paymentDetails);
          setStep('review');
        } catch (error) {
          console.error('0xHypr', 'Error converting transfer details:', error);
          setStep('idle');
          toast({
            title: 'Error',
            description: 'Failed to prepare payment details',
            variant: 'destructive',
          });
        }
      } else {
        setStep('idle');
      }
    },
    [prepareTransfer, settings]
  );

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    if (!paymentDetails) return;
    
    const config = getConfigurationStatus();
    if (!config.availableMethods.includes(method)) {
      toast({
        title: 'Provider Not Configured',
        description: `${method === 'wise' ? 'Wise' : 'Mercury'} is not configured. Please configure it in settings first.`,
        variant: 'destructive',
      });
      return;
    }

    setPaymentDetails({
      ...paymentDetails,
      method,
    });
  };

  const handleCreateTransfer = async () => {
    if (!paymentDetails) return;

    try {
      setCreatingTransfer(true);
      setStep('creating');

      const res = await fetch('/api/createTransfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentInfo: paymentDetails.wise }),
      });
      const data = await res.json();

      if (data.success) {
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
        
        toast({
          title: 'Transfer Created',
          description: `Transfer #${transferId} has been created successfully.`,
        });
      }
    } catch (error) {
      console.error('Failed to create transfer:', error);
      toast({
        title: 'Error',
        description: 'Failed to create transfer',
        variant: 'destructive',
      });
      setStep('review');
    } finally {
      setCreatingTransfer(false);
    }
  };

  const handleFundTransfer = async () => {
    if (!transferDetails) return;
    try {
      setFundingTransfer(true);
      await fetch('/api/fundTransfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferId: transferDetails.id }),
      });
      toast({
        title: 'Success!',
        description: 'Transfer has been funded and is being processed.',
      });
      // Reset the flow
      setTimeout(() => {
        setStep('idle');
        setSelectedDetection(null);
        setPaymentDetails(null);
        setTransferDetails(null);
        useAgentStepsStore.getState().clearSteps(recognizedItemId);
      }, 3000);
    } catch (error) {
      console.error('Failed to fund transfer:', error);
      toast({
        title: 'Error',
        description: 'Failed to fund transfer',
        variant: 'destructive',
      });
    } finally {
      setFundingTransfer(false);
    }
  };

  const getStepProgress = () => {
    switch (step) {
      case 'idle':
        return 0;
      case 'detecting':
        return 15;
      case 'detected':
        return 30;
      case 'preparing':
        return 45;
      case 'review':
        return 60;
      case 'creating':
        return 75;
      case 'funding':
        return 90;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-5xl mx-auto p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>auto pay</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOnboarding(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              hey! auto pay helps you handle payments instantly by spotting them on your screen (with your permission!)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-none">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <MagnifyingGlassIcon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">1. spot & scan</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      your zero-effort sidekick that notices payment info from invoices, emails, and docs while you work
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-none">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <CheckCircledIcon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">2. quick check</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      take a peek to make sure it looks good. we'll handle the rest with wise
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-none">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <ArrowRightIcon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">3. done!</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      that's it! payment goes through your preferred provider. no extra steps needed
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p><span className="font-medium">quick heads up:</span> hit the settings icon up top to connect your wise account first. mercury integration coming soon!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Progress value={getStepProgress()} className="flex-1" />
                {step !== 'idle' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      abortDetection();
                      abortPreparation();
                      setStep('idle');
                      setSelectedDetection(null);
                      setPaymentDetails(null);
                      setTransferDetails(null);
                      useAgentStepsStore
                        .getState()
                        .clearSteps(recognizedItemId);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {step === 'idle' && (
                <div className="flex justify-center">
                  <Button 
                    onClick={handleDetect}
                    disabled={!config.isAnyConfigured}
                  >
                    <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                    start scanning
                  </Button>
                </div>
              )}

              {step === 'detecting' && (
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <ReloadIcon className="h-4 w-4 animate-spin" />
                    <span>looking for payments...</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      abortDetection();
                      handleDetect();
                    }}
                  >
                    Retry Detection
                  </Button>
                </div>
              )}

              {step === 'detected' && detectionResult?.detections && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      Found {detectionResult.detections.length} potential payment
                      {detectionResult.detections.length === 1 ? '' : 's'}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDetect}
                    >
                      Scan Again
                    </Button>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {detectionResult.detections.map((detection, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                {detection.label}
                              </CardTitle>
                              <Badge variant="outline">
                                {detection.confidence}% confident
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="text-sm text-muted-foreground">
                                {detection.snippet}
                              </div>
                              {detection.source && (
                                <div className="text-xs text-muted-foreground">
                                  Found in: {detection.source.app} {detection.source.window && `- ${detection.source.window}`}
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className="ml-auto"
                              onClick={() => handlePreparePayment(detection)}
                            >
                              <ArrowRightIcon className="mr-2 h-4 w-4" />
                              Prepare Payment
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {step === 'preparing' && (
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <ReloadIcon className="h-4 w-4 animate-spin" />
                    <span>Preparing payment details...</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      abortPreparation();
                      if (selectedDetection) {
                        handlePreparePayment(selectedDetection);
                      }
                    }}
                  >
                    Retry Preparation
                  </Button>
                </div>
              )}

              {step === 'review' && paymentDetails && (
                <div className="space-y-4">
                  {getConfigurationStatus().availableMethods.length > 1 && (
                    <div className="flex justify-center">
                      <ToggleGroup
                        type="single"
                        value={paymentDetails.method}
                        onValueChange={(value: PaymentMethod) =>
                          handlePaymentMethodChange(value)
                        }
                      >
                        {getConfigurationStatus().wise.isConfigured && (
                          <ToggleGroupItem value="wise">wise</ToggleGroupItem>
                        )}
                        <ToggleGroupItem value="mercury" disabled className="opacity-50">
                          mercury (coming soon)
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  )}

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Review Payment Details</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (selectedDetection) {
                              handlePreparePayment(selectedDetection);
                            }
                          }}
                        >
                          <ReloadIcon className="mr-2 h-4 w-4" />
                          Refresh Details
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {paymentDetails.method === 'wise' && paymentDetails.wise && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Amount
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    value={paymentDetails.wise.currency}
                                    onChange={(e) => {
                                      const newWiseInfo = {
                                        ...paymentDetails.wise!,
                                        currency: e.target.value
                                      };
                                      setPaymentDetails({
                                        ...paymentDetails,
                                        wise: newWiseInfo
                                      });
                                    }}
                                    className="w-20"
                                    required
                                  />
                                  <Input
                                    value={paymentDetails.wise.amount}
                                    onChange={(e) => {
                                      const newWiseInfo = {
                                        ...paymentDetails.wise!,
                                        amount: e.target.value
                                      };
                                      setPaymentDetails({
                                        ...paymentDetails,
                                        wise: newWiseInfo
                                      });
                                    }}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Recipient
                                </Label>
                                <Input
                                  value={paymentDetails.wise.recipientName}
                                  onChange={(e) => {
                                    const newWiseInfo = {
                                      ...paymentDetails.wise!,
                                      recipientName: e.target.value
                                    };
                                    setPaymentDetails({
                                      ...paymentDetails,
                                      wise: newWiseInfo
                                    });
                                  }}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Account Number
                                </Label>
                                <Input
                                  value={paymentDetails.wise.accountNumber}
                                  onChange={(e) => {
                                    const newWiseInfo = {
                                      ...paymentDetails.wise!,
                                      accountNumber: e.target.value
                                    };
                                    setPaymentDetails({
                                      ...paymentDetails,
                                      wise: newWiseInfo
                                    });
                                  }}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Routing Number
                                </Label>
                                <Input
                                  value={paymentDetails.wise.routingNumber}
                                  onChange={(e) => {
                                    const newWiseInfo = {
                                      ...paymentDetails.wise!,
                                      routingNumber: e.target.value
                                    };
                                    setPaymentDetails({
                                      ...paymentDetails,
                                      wise: newWiseInfo
                                    });
                                  }}
                                  required
                                />
                              </div>
                              <div className="col-span-2 space-y-2">
                                <Label className="text-sm font-medium">
                                  Reference
                                </Label>
                                <Input
                                  value={paymentDetails.wise.reference || ''}
                                  onChange={(e) => {
                                    const newWiseInfo = {
                                      ...paymentDetails.wise!,
                                      reference: e.target.value || undefined
                                    };
                                    setPaymentDetails({
                                      ...paymentDetails,
                                      wise: newWiseInfo
                                    });
                                  }}
                                  placeholder="Add a reference (optional)"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {paymentDetails.method === 'mercury' && paymentDetails.mercury && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Amount
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    value={paymentDetails.mercury.currency}
                                    onChange={(e) => {
                                      const newMercuryInfo = {
                                        ...paymentDetails.mercury!,
                                        currency: e.target.value
                                      };
                                      setPaymentDetails({
                                        ...paymentDetails,
                                        mercury: newMercuryInfo
                                      });
                                    }}
                                    className="w-20"
                                    required
                                  />
                                  <Input
                                    value={paymentDetails.mercury.amount}
                                    onChange={(e) => {
                                      const newMercuryInfo = {
                                        ...paymentDetails.mercury!,
                                        amount: e.target.value
                                      };
                                      setPaymentDetails({
                                        ...paymentDetails,
                                        mercury: newMercuryInfo
                                      });
                                    }}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Account ID
                                </Label>
                                <Input
                                  value={paymentDetails.mercury.recipient.accountId}
                                  onChange={(e) => {
                                    const newMercuryInfo = {
                                      ...paymentDetails.mercury!,
                                      recipient: {
                                        ...paymentDetails.mercury!.recipient,
                                        accountId: e.target.value
                                      }
                                    };
                                    setPaymentDetails({
                                      ...paymentDetails,
                                      mercury: newMercuryInfo
                                    });
                                  }}
                                  required
                                />
                              </div>
                              <div className="col-span-2 space-y-2">
                                <Label className="text-sm font-medium">
                                  Memo
                                </Label>
                                <Input
                                  value={paymentDetails.mercury.recipient.memo || ''}
                                  onChange={(e) => {
                                    const newMercuryInfo = {
                                      ...paymentDetails.mercury!,
                                      recipient: {
                                        ...paymentDetails.mercury!.recipient,
                                        memo: e.target.value || undefined
                                      }
                                    };
                                    setPaymentDetails({
                                      ...paymentDetails,
                                      mercury: newMercuryInfo
                                    });
                                  }}
                                  placeholder="Add a memo (optional)"
                                />
                              </div>
                              <div className="col-span-2 space-y-2">
                                <Label className="text-sm font-medium">
                                  Description
                                </Label>
                                <Input
                                  value={paymentDetails.mercury.description || ''}
                                  onChange={(e) => {
                                    const newMercuryInfo = {
                                      ...paymentDetails.mercury!,
                                      description: e.target.value || undefined
                                    };
                                    setPaymentDetails({
                                      ...paymentDetails,
                                      mercury: newMercuryInfo
                                    });
                                  }}
                                  placeholder="Add a description (optional)"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="ml-auto"
                        onClick={handleCreateTransfer}
                        disabled={creatingTransfer}
                      >
                        {creatingTransfer && (
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Transfer
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {step === 'creating' && (
                <div className="flex items-center justify-center gap-2">
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  <span>Creating transfer...</span>
                </div>
              )}

              {step === 'funding' &&
                transferDetails &&
                transferDetails.provider === 'wise' && (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Fund Transfer</CardTitle>
                          <Badge variant="outline">
                            {transferDetails.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p>
                            Transfer #{transferDetails.id} has been created and is
                            ready to be funded.
                          </p>
                          <div className="flex items-center gap-2">
                            <a
                              href={transferDetails.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              View on {transferDetails.provider}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="ml-auto"
                          onClick={handleFundTransfer}
                          disabled={fundingTransfer}
                        >
                          {fundingTransfer && (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Fund Transfer
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}

              <Separator className="my-4" />

              <AgentStepsView recognizedItemId={recognizedItemId} />
            </div>
          </CardContent>

          {/* Feedback Section */}
          <div className="px-6 pb-6">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex flex-col items-center space-y-3 text-center">
                <h4 className="font-medium">Something not quite right?</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Drop me a line at{' '}
                    <a href="mailto:benjamin.shafii@gmail.com" className="text-primary hover:underline">
                      benjamin.shafii@gmail.com
                    </a>
                  </p>
                  <p>or{' '}
                    <a 
                      href="https://cal.com/team/different-ai/auto-pay-feature-request" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      grab a quick call
                    </a>
                    {' '}and we'll make it work for your setup
                  </p>
                </div>
              </div>
            </div>
          </div>

            {/*  push at the right */}
          <div className="ml-auto flex p-2 items-center w-full justify-end gap-2">
            <div className="text-xs text-muted-foreground">made by folks @</div>
            <a 
              href="https://hyprsqrl.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <img 
                src="/hyprsqrl-long-logo.png" 
                alt="Made by hyprsqrl" 
                className="h-10 opacity-30 hover:opacity-60 transition-opacity rounded-md"
              />
            </a>
          </div>
        </Card>
      </div>

      <OnboardingDialog
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
}
