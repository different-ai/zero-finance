import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon, ArrowRightIcon, CheckCircledIcon, CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { PaymentInfo } from '@/types/wise';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentStepsView } from '@/components/agent-steps-view';
import { useAsyncPaymentDetection } from '@/agents/async-payment-agent';
import { useAgentStepsStore } from '@/stores/agent-steps-store';

export default function Home() {
    const [analyzing, setAnalyzing] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [transferId, setTransferId] = useState<string | null>(null);
    const [creatingTransfer, setCreatingTransfer] = useState(false);
    const [fundingTransfer, setFundingTransfer] = useState(false);
    const [step, setStep] = useState<'idle' | 'analyzing' | 'review' | 'creating' | 'funding'>('idle');
    const [recognizedItemId] = useState(() => crypto.randomUUID());

    // Use the async payment detection
    const { result, processPayment, isProcessing } = useAsyncPaymentDetection(recognizedItemId);

    // Clear steps when component unmounts
    useEffect(() => {
        return () => {
            useAgentStepsStore.getState().clearSteps(recognizedItemId);
        };
    }, [recognizedItemId]);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setStep('analyzing');
        try {
            // Process the payment using the agent
            const detectionResult = await processPayment("Looking for recent payment information in screen activity");

            if (!detectionResult?.success) {
                toast({
                    title: 'No payment information found',
                    description: detectionResult?.error || 'No payment-related content was detected.',
                    variant: 'destructive'
                });
                setStep('idle');
                return;
            }

            const payment = detectionResult?.data?.payment;
            if (!payment) {
                toast({
                    title: 'No payment information found',
                    description: 'Failed to extract payment details.',
                    variant: 'destructive'
                });
                setStep('idle');
                return;
            }

            setPaymentInfo(payment);
            setStep('review');
        } catch (error) {
            console.error('Failed to analyze:', error);
            toast({
                title: 'Error',
                description: 'Failed to analyze screen data',
                variant: 'destructive'
            });
            setStep('idle');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleCreateTransfer = async () => {
        if (!paymentInfo) return;
        try {
            setCreatingTransfer(true);
            setStep('creating');
            const res = await fetch('/api/createTransfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentInfo })
            });
            const data = await res.json();
            if (data.id) {
                setTransferId(data.id);
                setStep('funding');
                toast({
                    title: 'Transfer Created',
                    description: `Transfer #${data.id} has been created successfully.`
                });
            }
        } catch (error) {
            console.error('Failed to create transfer:', error);
            toast({
                title: 'Error',
                description: 'Failed to create transfer',
                variant: 'destructive'
            });
            setStep('review');
        } finally {
            setCreatingTransfer(false);
        }
    };

    const handleFundTransfer = async () => {
        if (!transferId) return;
        try {
            setFundingTransfer(true);
            await fetch('/api/fundTransfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transferId })
            });
            toast({
                title: 'Success!',
                description: 'Transfer has been funded and is being processed.',
            });
            // Reset the flow
            setTimeout(() => {
                setStep('idle');
                setPaymentInfo(null);
                setTransferId(null);
                useAgentStepsStore.getState().clearSteps(recognizedItemId);
            }, 3000);
        } catch (error) {
            console.error('Failed to fund transfer:', error);
            toast({
                title: 'Error',
                description: 'Failed to fund transfer',
                variant: 'destructive'
            });
        } finally {
            setFundingTransfer(false);
        }
    };

    const getStepProgress = () => {
        switch (step) {
            case 'idle': return 0;
            case 'analyzing': return 25;
            case 'review': return 50;
            case 'creating': return 75;
            case 'funding': return 90;
            default: return 0;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container max-w-5xl mx-auto p-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Auto-Pay</h1>
                        <p className="text-muted-foreground">
                            Automatically process payments from your screen activity
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <Progress value={getStepProgress()} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Detect</span>
                            <span>Review</span>
                            <span>Create</span>
                            <span>Fund</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="col-span-2 space-y-6">
                            {step === 'idle' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Start New Payment</CardTitle>
                                        <CardDescription>
                                            We'll analyze your recent screen activity to detect payment information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            onClick={handleAnalyze}
                                            disabled={analyzing || isProcessing}
                                            size="lg"
                                            className="w-full"
                                        >
                                            {(analyzing || isProcessing) ? (
                                                <>
                                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                                                    Start Detection
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {step === 'analyzing' && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center justify-center space-y-4 py-6">
                                            <ReloadIcon className="h-8 w-8 animate-spin text-primary" />
                                            <div className="text-center">
                                                <h3 className="font-semibold">Analyzing Screen Data</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Looking for payment information...
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {step === 'review' && paymentInfo && (
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Review Payment Details</CardTitle>
                                            <Badge variant="outline" className="font-mono">
                                                {paymentInfo.currency}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            Please verify the detected payment information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Payment Amount */}
                                        <div className="rounded-lg bg-primary/5 p-4">
                                            <div className="text-3xl font-bold text-primary">
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: paymentInfo.currency
                                                }).format(Number(paymentInfo.amount))}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                Total Amount
                                            </div>
                                        </div>

                                        {/* Bank Details */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium">Bank Account Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-sm text-muted-foreground">
                                                        Account Number
                                                    </label>
                                                    <div className="font-mono bg-muted p-2 rounded">
                                                        {paymentInfo.accountNumber}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm text-muted-foreground">
                                                        Routing Number
                                                    </label>
                                                    <div className="font-mono bg-muted p-2 rounded">
                                                        {paymentInfo.routingNumber}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Additional Details */}
                                        {paymentInfo.recipientName && (
                                            <div className="space-y-2">
                                                <label className="text-sm text-muted-foreground">
                                                    Recipient
                                                </label>
                                                <div className="font-medium">
                                                    {paymentInfo.recipientName}
                                                </div>
                                            </div>
                                        )}
                                        {paymentInfo.reference && (
                                            <div className="space-y-2">
                                                <label className="text-sm text-muted-foreground">
                                                    Reference
                                                </label>
                                                <div className="font-mono text-sm">
                                                    {paymentInfo.reference}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setStep('idle');
                                                setPaymentInfo(null);
                                            }}
                                        >
                                            <CrossCircledIcon className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleCreateTransfer}
                                            disabled={creatingTransfer}
                                        >
                                            <CheckCircledIcon className="mr-2 h-4 w-4" />
                                            Confirm & Create Transfer
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}

                            {(step === 'creating' || step === 'funding') && transferId && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {step === 'creating' ? 'Creating Transfer' : 'Processing Payment'}
                                        </CardTitle>
                                        <CardDescription>
                                            Transfer #{transferId}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center py-6">
                                                <ReloadIcon className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                            {step === 'funding' && (
                                                <Button
                                                    onClick={handleFundTransfer}
                                                    disabled={fundingTransfer}
                                                    className="w-full"
                                                >
                                                    {fundingTransfer ? (
                                                        <>
                                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowRightIcon className="mr-2 h-4 w-4" />
                                                            Complete Payment
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Agent Steps Sidebar */}
                        <div className="col-span-1">
                            <Card className="h-[calc(100vh-12rem)] flex flex-col">
                                <CardHeader className="flex-shrink-0">
                                    <CardTitle>Detection Progress</CardTitle>
                                    <CardDescription>
                                        Real-time payment detection steps
                                    </CardDescription>
                                </CardHeader>
                                <ScrollArea className="flex-1">
                                    <AgentStepsView
                                        recognizedItemId={recognizedItemId}
                                        className="p-4"
                                    />
                                </ScrollArea>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
