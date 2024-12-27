import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import type { PaymentInfo } from '@/types/wise';

export default function Home() {
    const [analyzing, setAnalyzing] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [transferId, setTransferId] = useState<string | null>(null);

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
        }
    };

    const handleFundTransfer = async () => {
        if (!transferId) return;
        try {
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
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Auto-Pay Pipe</h1>
            <Button onClick={handleAnalyze} disabled={analyzing}>
                {analyzing ? 'Analyzing...' : 'Analyze Screen Data'}
            </Button>

            {paymentInfo && (
                <Card className="mt-4 p-4">
                    <h2 className="text-xl font-semibold mb-2">Payment Information</h2>
                    <pre className="bg-gray-100 p-2 rounded">
                        {JSON.stringify(paymentInfo, null, 2)}
                    </pre>
                    <Button onClick={handleCreateTransfer} className="mt-2" disabled={!paymentInfo}>
                        Create Transfer
                    </Button>
                    {transferId && (
                        <Button onClick={handleFundTransfer} className="mt-2 ml-2" variant="secondary">
                            Fund Transfer #{transferId}
                        </Button>
                    )}
                </Card>
            )}
        </div>
    );
}
