'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Wallet, Copy, Check } from 'lucide-react';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface FundsDisplayProps {
  totalBalance?: number;
  walletAddress?: string;
}

export function FundsDisplay({ totalBalance = 0, walletAddress }: FundsDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Handle copying address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy:', err));
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/60 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Your Funds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-green-800">{formatCurrency(totalBalance)}</div>
        
        {walletAddress && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="advanced"
              className="border border-green-200/40 rounded-md overflow-hidden bg-white/50"
            >
              <AccordionTrigger className="px-3 py-3 hover:bg-green-50/50">
                <span className="text-sm font-medium text-green-700">
                  Advanced account info
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-3">
                <div className="flex items-center justify-between bg-green-50/50 rounded p-2">
                  <code className="text-xs font-mono overflow-auto flex-1 text-green-800">
                    {walletAddress}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(walletAddress)}
                    className="h-7 w-7 p-0 ml-2 hover:bg-green-100"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-green-600/80 mt-2">
                  This is your account&apos;s unique wallet address on the Base network.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
} 