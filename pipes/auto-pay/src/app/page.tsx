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
  type DetectedPayment,
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

  const mercuryInfo: MercuryPaymentInfo = {
    amount: details.amount,
    currency: details.currency,
    recipient: {
      accountId: details.targetAccount.accountNumber || '',
      memo: details.reference || '',
    },
    description: `Payment to ${details.targetAccount.accountHolderName}`,
  };

  // Get configuration status to determine default method
  const customSettings = settings?.customSettings?.['auto-pay'];
  const hasWise = !!(customSettings?.wiseApiKey && customSettings?.wiseProfileId);
  const hasMercury = !!(customSettings?.mercuryApiKey && customSettings?.mercuryAccountId);
  
  const defaultMethod = hasWise ? 'wise' : hasMercury ? 'mercury' : 'wise';

  return {
    method: defaultMethod,
    wise: wiseInfo,
    mercury: mercuryInfo,
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
  const [selectedPayment, setSelectedPayment] =
    useState<DetectedPayment | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [transferDetails, setTransferDetails] =
    useState<PaymentTransferDetails | null>(null);
  const [creatingTransfer, setCreatingTransfer] = useState(false);
  const [fundingTransfer, setFundingTransfer] = useState(false);
  const [recognizedItemId] = useState(() => crypto.randomUUID());
  const { settings, isLoading } = useSettings();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const config = getConfigurationStatus(settings);

  // Remove separate transferId state and use transferDetails.id instead
  const transferId = transferDetails?.id;

  // Use both agents with abort capability
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
    console.log('0xHypr', config);
    if (!isLoading) {
      if (!config.wise.isConfigured && !config.mercury.isConfigured) {
        console.log('0xHypr', 'Showing onboarding dialog');
        setShowOnboarding(true);
      }
    }
  }, [config, isLoading]);

  const handleDetect = async () => {

    setStep('detecting');
    useAgentStepsStore.getState().clearSteps(recognizedItemId);
    const result = await detectPayments();
    if (result.payments.length > 0) {
      setStep('detected');
    } else {
      setStep('idle');
    }
  };

  const handlePreparePayment = useCallback(
    async (payment: DetectedPayment) => {
      setSelectedPayment(payment);
      setStep('preparing');

      const result = await prepareTransfer(payment.vitalInfo);

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
          // If conversion fails, use the original payment info from detection
          console.log('0xHypr', 'Using detected payment info as fallback');
          const config = getConfigurationStatus();
          const defaultMethod = config.wise.isConfigured ? 'wise' : 'mercury';
          setPaymentDetails({
            method: defaultMethod,
            wise: payment.paymentInfo,
          });
          setStep('review');
        }
      } else {
        setStep('idle');
      }
    },
    [prepareTransfer, toast, settings]
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

      const endpoint = paymentDetails.method === 'wise' 
        ? '/api/createTransfer'
        : '/api/createMercuryPayment';

      const paymentInfo = paymentDetails.method === 'wise'
        ? paymentDetails.wise
        : paymentDetails.mercury;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentInfo }),
      });
      const data = await res.json();

      if (data.success) {
        const transferId = paymentDetails.method === 'wise' 
          ? data.transfer.id.toString()
          : data.payment.id;

        const status = paymentDetails.method === 'wise'
          ? data.transfer.status
          : data.payment.status;

        const trackingUrl = paymentDetails.method === 'wise'
          ? `${settings?.customSettings?.['auto-pay']?.enableProduction
              ? 'https://wise.com'
              : 'https://sandbox.transferwise.tech'}/transactions/activities/by-resource/TRANSFER/${transferId}`
          : data.mercuryUrl;

        setTransferDetails({
          id: transferId,
          status,
          trackingUrl,
          provider: paymentDetails.method,
        });

        setStep(paymentDetails.method === 'wise' ? 'funding' : 'idle');
        
        toast({
          title: 'Transfer Created',
          description: `Transfer #${transferId} has been created successfully.`,
        });

        if (paymentDetails.method === 'mercury') {
          // Reset the flow after a delay for Mercury payments
          setTimeout(() => {
            setStep('idle');
            setSelectedPayment(null);
            setPaymentDetails(null);
            setTransferDetails(null);
            useAgentStepsStore.getState().clearSteps(recognizedItemId);
          }, 3000);
        }
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
        setSelectedPayment(null);
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
              <CardTitle>Auto Pay</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOnboarding(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Automatically detect and process payments from your screen activity
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      setSelectedPayment(null);
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
                    Start Detection
                  </Button>
                </div>
              )}

              {step === 'detecting' && (
                <div className="flex items-center justify-center gap-2">
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  <span>Detecting payments...</span>
                </div>
              )}

              {step === 'detected' && detectionResult?.payments && (
                <div className="space-y-4">
                  <h3 className="font-medium">
                    Found {detectionResult.payments.length} potential payment
                    {detectionResult.payments.length === 1 ? '' : 's'}
                  </h3>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {detectionResult.payments.map((payment, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                {payment.paymentInfo.recipientName ||
                                  'Unknown Recipient'}
                              </CardTitle>
                              <Badge variant="outline">
                                {payment.paymentInfo.currency}{' '}
                                {payment.paymentInfo.amount}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {payment.paymentInfo.accountNumber && (
                                <div className="text-sm">
                                  Account: {payment.paymentInfo.accountNumber}
                                </div>
                              )}
                              {payment.paymentInfo.routingNumber && (
                                <div className="text-sm">
                                  Routing: {payment.paymentInfo.routingNumber}
                                </div>
                              )}
                              {payment.paymentInfo.reference && (
                                <div className="text-sm">
                                  Reference: {payment.paymentInfo.reference}
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className="ml-auto"
                              onClick={() => handlePreparePayment(payment)}
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
                <div className="flex items-center justify-center gap-2">
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  <span>Preparing payment details...</span>
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
                          <ToggleGroupItem value="wise">Wise</ToggleGroupItem>
                        )}
                        {getConfigurationStatus().mercury.isConfigured && (
                          <ToggleGroupItem value="mercury">Mercury</ToggleGroupItem>
                        )}
                      </ToggleGroup>
                    </div>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Review Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {paymentDetails.method === 'wise' && paymentDetails.wise && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Amount
                                </label>
                                <div>
                                  {paymentDetails.wise.currency}{' '}
                                  {paymentDetails.wise.amount}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Recipient
                                </label>
                                <div>{paymentDetails.wise.recipientName}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Account Number
                                </label>
                                <div>{paymentDetails.wise.accountNumber}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Routing Number
                                </label>
                                <div>{paymentDetails.wise.routingNumber}</div>
                              </div>
                              {paymentDetails.wise.reference && (
                                <div className="col-span-2">
                                  <label className="text-sm font-medium">
                                    Reference
                                  </label>
                                  <div>{paymentDetails.wise.reference}</div>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {paymentDetails.method === 'mercury' && paymentDetails.mercury && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Amount
                                </label>
                                <div>
                                  {paymentDetails.mercury.currency}{' '}
                                  {paymentDetails.mercury.amount}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Account ID
                                </label>
                                <div>{paymentDetails.mercury.recipient.accountId}</div>
                              </div>
                              {paymentDetails.mercury.recipient.memo && (
                                <div className="col-span-2">
                                  <label className="text-sm font-medium">
                                    Memo
                                  </label>
                                  <div>{paymentDetails.mercury.recipient.memo}</div>
                                </div>
                              )}
                              {paymentDetails.mercury.description && (
                                <div className="col-span-2">
                                  <label className="text-sm font-medium">
                                    Description
                                  </label>
                                  <div>{paymentDetails.mercury.description}</div>
                                </div>
                              )}
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
        </Card>
      </div>

      <OnboardingDialog
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
}
