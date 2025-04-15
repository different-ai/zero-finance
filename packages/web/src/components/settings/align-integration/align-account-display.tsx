'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, ClipboardCopy, CreditCard, ExternalLink } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

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
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
        <span className="font-mono text-sm truncate mr-2">
          {value || 'Not available'}
        </span>
        {value && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <ClipboardCopy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Copied!' : 'Copy to clipboard'}</p>
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
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-600">
        <p>Failed to load account details: {error.message}</p>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Virtual Bank Accounts</CardTitle>
          <CardDescription>
            You don&apos;t have any virtual bank accounts yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 border rounded-md bg-gray-50">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
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
        <Card key={account.id} className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Virtual Bank Account</CardTitle>
              <Badge variant="outline" className="capitalize">
                {account.sourceAccountType === 'iban' ? 'IBAN' : 'ACH'}
              </Badge>
            </div>
            <CardDescription>
              Use these details to receive {account.sourceCurrency?.toUpperCase()} payments via bank transfer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* IBAN Account Info */}
            {account.sourceAccountType === 'iban' && (
              <>
                <FieldWithCopy label="IBAN" value={account.sourceIban} />
                <FieldWithCopy label="BIC/SWIFT" value={account.sourceBicSwift} />
              </>
            )}

            {/* ACH Account Info */}
            {account.sourceAccountType === 'us_ach' && (
              <>
                <FieldWithCopy label="Account Number" value={account.sourceAccountNumber} />
                <FieldWithCopy label="Routing Number" value={account.sourceRoutingNumber} />
              </>
            )}

            {/* Common Fields */}
            <FieldWithCopy label="Bank Name" value={account.sourceBankName || undefined} />
            <FieldWithCopy label="Beneficiary Name" value={account.sourceBankBeneficiaryName || undefined} />
            
            {/* Destination Info */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium mb-2">Destination Details</h4>
              <div className="space-y-1 text-sm text-gray-500">
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
                <p className="font-mono text-xs truncate">
                  Address: {account.destinationAddress || 'Not available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 