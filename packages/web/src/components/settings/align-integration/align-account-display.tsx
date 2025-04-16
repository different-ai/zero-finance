'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, ClipboardCopy, CreditCard } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FieldWithCopyProps {
  label: string;
  value: string | undefined;
}

function FieldWithCopy({ label, value }: FieldWithCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(true);
        toast.success(`${label} copied to clipboard`);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  return (
    <div className="mb-4">
      <div className="text-sm font-medium mb-1 text-gray-500">{label}</div>
      <div className="flex items-center justify-between bg-gray-50 rounded-md border border-gray-100 p-2.5">
        <span className="font-mono text-xs truncate mr-2 text-gray-800">
          {value || 'Not available'}
        </span>
        {value && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-7 w-7"
                >
                  {copied ? (
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <ClipboardCopy className="h-3.5 w-3.5 text-gray-500" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">{copied ? 'Copied!' : 'Copy to clipboard'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

export function AlignAccountDisplay() {
  const { data: accounts, isLoading, error } = api.align.getVirtualAccountDetails.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p className="text-sm">Failed to load account details: {error.message}</p>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Card className="w-full bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Virtual Bank Accounts</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            You don&apos;t have any virtual bank accounts yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 border rounded-md bg-gray-50">
            <CreditCard className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              No virtual accounts found. Complete KYC verification and request a virtual account to receive payments via bank transfer.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {accounts.map((account) => (
        <Card key={account.id} className="w-full bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Virtual Bank Account</CardTitle>
              <Badge variant="outline" className="capitalize text-xs">
                {account.sourceAccountType === 'iban' ? 'IBAN' : 'ACH'}
              </Badge>
            </div>
            <CardDescription className="text-sm text-gray-500">
              Use these details to receive {account.sourceCurrency?.toUpperCase()} payments via bank transfer
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* IBAN Account Info */}
            {account.sourceAccountType === 'iban' && (
              <div className="space-y-3">
                <FieldWithCopy label="IBAN" value={account.sourceIban || undefined} />
                <FieldWithCopy label="BIC/SWIFT" value={account.sourceBicSwift || undefined} />
              </div>
            )}

            {/* ACH Account Info */}
            {account.sourceAccountType === 'us_ach' && (
              <div className="space-y-3">
                <FieldWithCopy label="Account Number" value={account.sourceAccountNumber || undefined} />
                <FieldWithCopy label="Routing Number" value={account.sourceRoutingNumber || undefined} />
              </div>
            )}

            {/* Common Fields */}
            <div className="mt-3 space-y-3">
              <FieldWithCopy label="Bank Name" value={account.sourceBankName || undefined} />
              <FieldWithCopy label="Beneficiary Name" value={account.sourceBankBeneficiaryName || undefined} />
            </div>
            
            {/* Destination Info */}
            <div className="border-t border-gray-100 pt-4 mt-5">
              <h4 className="text-sm font-medium mb-2 text-gray-700">Destination Details</h4>
              <div className="space-y-1.5 text-xs text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
                <p>
                  Funds will be converted to{' '}
                  <span className="font-medium text-gray-700">
                    {account.destinationCurrency?.toUpperCase() || 'USDC'}
                  </span>
                  {' '}on{' '}
                  <span className="font-medium text-gray-700 capitalize">
                    {account.destinationPaymentRail || 'Base'}
                  </span>
                </p>
                <p className="font-mono text-xs">
                  <span className="text-gray-500">Address:</span>{' '}
                  <span className={cn("truncate", account.destinationAddress ? "text-gray-700" : "text-gray-400")}>
                    {account.destinationAddress || 'Not available'}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 