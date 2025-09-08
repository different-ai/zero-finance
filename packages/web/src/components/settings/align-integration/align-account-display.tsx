'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  CheckCircle,
  ClipboardCopy,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
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

    navigator.clipboard
      .writeText(value)
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
    <div className="mb-3">
      <div className="text-xs uppercase text-gray-500 font-medium mb-1">
        {label}
      </div>
      <div className="flex items-center justify-between bg-gray-50/50 rounded-lg p-3 border border-gray-300">
        <span className="font-mono text-sm text-gray-900 font-semibold truncate mr-2">
          {value || 'N/A'}
        </span>
        {value && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-6 w-6 text-gray-600 hover:text-primary"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <ClipboardCopy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

export function AlignAccountDisplay() {
  const {
    data: accountData,
    isLoading,
    error,
  } = api.align.getVirtualAccountDetails.useQuery();
  const accounts = accountData?.fundingSources || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-gradient-to-br from-red-50 to-red-100/40 border border-red-200/60 rounded-2xl p-6 shadow-sm">
        <CardHeader className="pb-2 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
          <CardTitle className="text-lg font-semibold text-red-700">
            Error Loading Accounts
          </CardTitle>
          <CardDescription className="text-sm text-red-600">
            Failed to load account details: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Card className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-gray-900">
            Virtual Bank Accounts
          </CardTitle>
          <CardDescription className="text-sm text-gray-700">
            You don&apos;t have any virtual bank accounts yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 border border-gray-200 rounded-xl bg-white/50 mt-4">
            <div className="rounded-full bg-blue-600/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto shadow-inner">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-9 h-9 flex items-center justify-center shadow-sm">
                <CreditCard className="h-5 w-5 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              No virtual accounts found. Complete KYC verification and request a
              virtual account to receive payments via bank transfer.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {accounts.map((account) => (
        <Card
          key={account.id}
          className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-1">
              <CardTitle className="text-xl font-bold text-gray-900">
                Virtual Bank Account
              </CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  'capitalize text-xs px-2 py-0.5',
                  account.sourceAccountType === 'iban'
                    ? 'border-violet-300 bg-violet-50 text-violet-700'
                    : 'border-blue-300 bg-blue-50 text-blue-700',
                )}
              >
                {account.sourceAccountType === 'iban'
                  ? 'IBAN (EUR)'
                  : 'ACH (USD)'}
              </Badge>
            </div>
            <CardDescription className="text-sm text-gray-700">
              Use these details to receive{' '}
              {account.sourceCurrency?.toUpperCase()} payments via bank
              transfer.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {/* IBAN Account Info */}
            {account.sourceAccountType === 'iban' && (
              <div className="space-y-3 mb-4">
                <FieldWithCopy
                  label="IBAN"
                  value={account.sourceIban || undefined}
                />
                <FieldWithCopy
                  label="BIC/SWIFT"
                  value={account.sourceBicSwift || undefined}
                />
              </div>
            )}

            {/* ACH Account Info */}
            {account.sourceAccountType === 'us_ach' && (
              <div className="space-y-3 mb-4">
                <FieldWithCopy
                  label="Account Number"
                  value={account.sourceAccountNumber || undefined}
                />
                <FieldWithCopy
                  label="Routing Number"
                  value={account.sourceRoutingNumber || undefined}
                />
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-3">
              <FieldWithCopy
                label="Bank Name"
                value={account.sourceBankName || undefined}
              />
              <FieldWithCopy
                label="Beneficiary Name"
                value={account.sourceBankBeneficiaryName || undefined}
              />
            </div>

            {/* Destination Info */}
            <div className="border-t border-gray-200 pt-4 mt-5">
              <h4 className="text-base font-semibold mb-2 text-gray-800">
                Destination Details
              </h4>
              <div className="space-y-2 text-sm bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Funds convert to:</span>
                  <span className="font-medium text-gray-900">
                    {account.destinationCurrency?.toUpperCase() || 'USDC'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {account.destinationPaymentRail || 'Base'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-600">Receiving Address:</span>
                  <span
                    className={cn(
                      'font-mono text-xs truncate ml-2',
                      account.destinationAddress
                        ? 'text-gray-700'
                        : 'text-gray-400',
                    )}
                  >
                    {account.destinationAddress || 'Not available'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
