import * as React from "react";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon } from "@radix-ui/react-icons";
import type { PaymentInfo } from '@/types/wise';

export default function Home() {
    const [analyzing, setAnalyzing] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [transferId, setTransferId] = useState<string | null>(null);
    const [creatingTransfer, setCreatingTransfer] = useState(false);
    const [fundingTransfer, setFundingTransfer] = useState(false);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        try {
            const res = await fetch('/api/analyze');
            const { data } = await res.json();

            const processRes = await fetch('/api/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ screenData: data })
            });
            const { paymentInfo } = await processRes.json();

            setPaymentInfo(paymentInfo);
            if (!paymentInfo) {
                toast({
                    title: 'No payment information found',
                    description: 'No payment-related content was detected in the recent screen activity.'
                });
            }
        } catch (error) {
            console.error('Failed to analyze:', error);
            toast({
                title: 'Error',
                description: 'Failed to analyze screen data',
                variant: 'destructive'
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const handleCreateTransfer = async () => {
        if (!paymentInfo) return;
        try {
            setCreatingTransfer(true);
            const res = await fetch('/api/createTransfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentInfo })
            });
            const data = await res.json();
            if (data.id) {
                setTransferId(data.id);
                toast({
                    title: 'Transfer Created',
                    description: `Transfer #${data.id} has been created`
                });
            }
        } catch (error) {
            console.error('Failed to create transfer:', error);
            toast({
                title: 'Error',
                description: 'Failed to create transfer',
                variant: 'destructive'
            });
        } finally {
            setCreatingTransfer(false);
        }
    };

    const handleFundTransfer = async () => {
        if (!transferId) return;
        try {
            setFundingTransfer(true);
            const res = await fetch('/api/fundTransfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transferId })
            });
            const data = await res.json();
            toast({
                title: 'Transfer Funded',
                description: 'The transfer has been funded successfully'
            });
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

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Auto-Pay Pipe</CardTitle>
                    <CardDescription>
                        Automatically detect and process payments from screen captures
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="w-full mb-4 flex items-center justify-center"
                    >
                        {analyzing && <ReloadIcon className="h-4 w-4 animate-spin mr-2" />}
                        {analyzing ? 'Analyzing...' : 'Analyze Screen Data'}
                    </Button>

                    {paymentInfo && (
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Payment Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-secondary/50 p-4 rounded-lg overflow-auto">
                                    {JSON.stringify(paymentInfo, null, 2)}
                                </pre>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button
                                    onClick={handleCreateTransfer}
                                    disabled={!paymentInfo || creatingTransfer}
                                    className="flex items-center justify-center"
                                >
                                    {creatingTransfer && <ReloadIcon className="h-4 w-4 animate-spin mr-2" />}
                                    {creatingTransfer ? 'Creating...' : 'Create Transfer'}
                                </Button>
                                {transferId && (
                                    <Button
                                        onClick={handleFundTransfer}
                                        variant="secondary"
                                        disabled={fundingTransfer}
                                        className="flex items-center justify-center"
                                    >
                                        {fundingTransfer && <ReloadIcon className="h-4 w-4 animate-spin mr-2" />}
                                        {fundingTransfer ? 'Funding...' : `Fund Transfer #${transferId}`}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
