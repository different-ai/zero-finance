'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Type matching the data structure passed from OffRampFlow
interface DepositInfo {
    depositAddress: string;
    depositAmount: string;
    depositNetwork: string;
    depositToken: string;
    fee: string;
    expiresAt?: string | null;
}

interface DepositDetailsProps {
    depositInfo: DepositInfo;
}

export function DepositDetails({ depositInfo }: DepositDetailsProps) {

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`${label} copied to clipboard!`);
        }, (err) => {
            toast.error(`Failed to copy ${label}`);
            console.error('Clipboard copy failed: ', err);
        });
    };

    const { 
        depositAddress, 
        depositAmount, 
        depositNetwork, 
        depositToken, 
        fee, 
        expiresAt 
    } = depositInfo;

    const tokenUpper = depositToken.toUpperCase();
    const networkUpper = depositNetwork.toUpperCase();

    return (
        <div className="bg-muted/40 p-4 rounded-lg border border-gray-200 space-y-3">
            <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Amount to Send:</span>
                <span className="font-semibold text-gray-900">{depositAmount} {tokenUpper}</span>
            </div>
             <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Fee:</span>
                <span className="font-semibold text-gray-900">{fee} {tokenUpper}</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Network:</span>
                <span className="font-semibold text-gray-900">{networkUpper}</span>
            </div>
            <div className="space-y-1 pt-2">
                 <span className="text-sm text-gray-600">Deposit Address:</span>
                <div className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-300">
                     <code className="font-mono text-xs break-all flex-grow text-gray-700">{depositAddress}</code>
                     <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleCopy(depositAddress, 'Address')}
                        className="h-6 w-6 text-gray-500 hover:text-gray-700"
                    >
                        <CopyIcon className="h-4 w-4" />
                         <span className="sr-only">Copy Address</span>
                    </Button>
                </div>
            </div>
             {expiresAt && (
                <p className="text-xs text-center text-gray-500 pt-2">
                    Quote expires at: {new Date(expiresAt).toLocaleString()}
                </p>
            )}
        </div>
    );
} 