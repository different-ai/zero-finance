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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  CheckCircle,
  ClipboardCopy,
  CreditCard,
  AlertCircle,
  Building2,
  Globe,
  ArrowRight,
  Wallet,
  TrendingUp,
  Info,
  DollarSign,
  Euro,
} from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FieldWithCopyProps {
  label: string;
  value: string | null | undefined;
  className?: string;
}

function FieldWithCopy({ label, value, className }: FieldWithCopyProps) {
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
    <div className={cn('mb-3', className)}>
      <div className="text-xs uppercase text-muted-foreground font-medium mb-1">
        {label}
      </div>
      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border">
        <span className="font-mono text-sm font-medium truncate mr-2">
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
                  className="h-6 w-6"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
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

export function VirtualAccountsDisplaySimple() {
  const {
    data: accounts,
    isLoading,
    error,
  } = api.align.getAllVirtualAccounts.useQuery();
  const [selectedCurrency, setSelectedCurrency] = useState<
    'all' | 'eur' | 'usd'
  >('all');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
          <CardTitle className="text-lg text-destructive">
            Error Loading Accounts
          </CardTitle>
          <CardDescription>
            Failed to load virtual accounts: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg">
        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Complete KYC verification to create virtual accounts and receive
          payments via bank transfer.
        </p>
      </div>
    );
  }

  const filteredAccounts =
    selectedCurrency === 'all'
      ? accounts
      : accounts.filter(
          (acc) => acc.deposit_instructions?.currency === selectedCurrency,
        );

  return (
    <div className="space-y-6">
      {/* Currency filter tabs */}
      <Tabs
        value={selectedCurrency}
        onValueChange={(value) => setSelectedCurrency(value as any)}
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">All Accounts</TabsTrigger>
          <TabsTrigger value="eur">EUR Only</TabsTrigger>
          <TabsTrigger value="usd">USD Only</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCurrency} className="mt-6">
          <div className="grid gap-6">
            {filteredAccounts.map((account) => (
              <Card
                key={account.id}
                className={cn(
                  'overflow-hidden transition-all hover:shadow-lg',
                  account.status === 'active'
                    ? 'border-green-200'
                    : 'border-gray-200',
                )}
              >
                <div
                  className={cn(
                    'h-2',
                    account.deposit_instructions?.currency === 'eur'
                      ? 'bg-blue-500'
                      : 'bg-green-500',
                  )}
                />

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Virtual Bank Account
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Receive{' '}
                        {account.deposit_instructions?.currency?.toUpperCase()}{' '}
                        payments and auto-convert to crypto
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge
                        variant={
                          account.status === 'active' ? 'default' : 'secondary'
                        }
                        className={cn(
                          account.status === 'active' && 'bg-green-600',
                        )}
                      >
                        {account.status === 'active' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          'Inactive'
                        )}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {account.deposit_instructions?.currency === 'eur'
                          ? 'SEPA/SWIFT'
                          : 'ACH/Wire'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Source Account Details */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Bank Account Details
                    </h4>

                    <div className="grid md:grid-cols-2 gap-3">
                      {/* EUR Account Details */}
                      {account.deposit_instructions?.currency === 'eur' &&
                        account.deposit_instructions.iban && (
                          <>
                            <FieldWithCopy
                              label="IBAN"
                              value={
                                account.deposit_instructions.iban.iban_number
                              }
                            />
                            <FieldWithCopy
                              label="BIC/SWIFT"
                              value={account.deposit_instructions.iban.bic}
                            />
                          </>
                        )}

                      {/* USD Account Details */}
                      {account.deposit_instructions?.currency === 'usd' &&
                        account.deposit_instructions.us && (
                          <>
                            <FieldWithCopy
                              label="Account Number"
                              value={
                                account.deposit_instructions.us.account_number
                              }
                            />
                            <FieldWithCopy
                              label="Routing Number"
                              value={
                                account.deposit_instructions.us.routing_number
                              }
                            />
                          </>
                        )}

                      <FieldWithCopy
                        label="Bank Name"
                        value={account.deposit_instructions?.bank_name}
                      />
                      <FieldWithCopy
                        label="Beneficiary Name"
                        value={
                          account.deposit_instructions?.beneficiary_name ??
                          account.deposit_instructions
                            ?.account_beneficiary_name ??
                          undefined
                        }
                      />
                    </div>

                    {account.deposit_instructions?.bank_address && (
                      <div className="mt-3">
                        <div className="text-xs uppercase text-muted-foreground font-medium mb-1">
                          Bank Address
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 border text-sm">
                          {account.deposit_instructions.bank_address}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Conversion Flow */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Auto-Conversion Flow
                    </h4>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-center">
                          <div
                            className={cn(
                              'h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2',
                              account.deposit_instructions?.currency === 'eur'
                                ? 'bg-blue-100'
                                : 'bg-green-100',
                            )}
                          >
                            {account.deposit_instructions?.currency ===
                            'eur' ? (
                              <Euro className="h-6 w-6 text-blue-600" />
                            ) : (
                              <DollarSign className="h-6 w-6 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm font-medium">
                            {account.deposit_instructions?.currency?.toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Bank Transfer
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-muted-foreground" />

                      <div className="flex-1">
                        <div className="text-center">
                          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Wallet className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium">
                            {account.destination_token?.toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {account.destination_network}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Destination Details */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Destination Details
                    </h4>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs uppercase text-muted-foreground font-medium mb-1">
                            Token
                          </div>
                          <Badge
                            variant="outline"
                            className="w-full justify-center"
                          >
                            {account.destination_token?.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-xs uppercase text-muted-foreground font-medium mb-1">
                            Network
                          </div>
                          <Badge
                            variant="outline"
                            className="w-full justify-center capitalize"
                          >
                            {account.destination_network}
                          </Badge>
                        </div>
                      </div>

                      <FieldWithCopy
                        label="Receiving Address"
                        value={account.destination_address}
                        className="mb-0"
                      />
                    </div>
                  </div>

                  {/* Payment Rails Info */}
                  {account.deposit_instructions?.payment_rails &&
                    account.deposit_instructions.payment_rails.length > 0 && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Info className="h-3 w-3" />
                          <span>
                            Supported payment methods:{' '}
                            {account.deposit_instructions.payment_rails
                              .join(', ')
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
