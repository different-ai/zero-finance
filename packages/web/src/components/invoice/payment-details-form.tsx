'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/trpc/react';
import {
  Building2,
  Wallet,
  Info,
  DollarSign,
  Euro,
  Lock,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

interface PaymentDetailsFormProps {
  formData: Record<string, any>;
  updateFormData: (field: string, value: any) => void;
}

const PAYMENT_TYPES = [
  {
    value: 'fiat',
    label: 'Bank Transfer',
    icon: Building2,
    description: 'Receive payments via ACH, SEPA, or wire transfer',
  },
  {
    value: 'crypto',
    label: 'Cryptocurrency',
    icon: Wallet,
    description: 'Receive payments in USDC, ETH, or other cryptocurrencies',
  },
];

const CRYPTO_OPTIONS = [
  {
    value: 'usdc-solana',
    label: 'USDC on Solana',
    network: 'solana',
    currency: 'USDC',
    logos: {
      currency:
        'https://upload.wikimedia.org/wikipedia/commons/4/4a/Circle_USDC_Logo.svg',
      network: '/logos/solana-sol-logo-horizontal.svg',
    },
  },
  {
    value: 'usdc-base',
    label: 'USDC on Base',
    network: 'base',
    currency: 'USDC',
    logos: {
      currency:
        'https://upload.wikimedia.org/wikipedia/commons/4/4a/Circle_USDC_Logo.svg',
      network: '/logos/_base-logo.svg', // Base logo
    },
  },
];

export function PaymentDetailsForm({
  formData,
  updateFormData,
}: PaymentDetailsFormProps) {
  const [paymentType, setPaymentType] = useState<'fiat' | 'crypto'>('fiat');
  const [copied, setCopied] = useState(false);

  // Fetch user's Safe address for crypto payments
  const { data: positions } = api.earn.getMultiChainPositions.useQuery();
  const baseSafe = positions?.safes?.find(
    (s: { chainId: number }) => s.chainId === SUPPORTED_CHAINS.BASE,
  );
  const userSafeAddress = baseSafe?.address || '';
  const [selectedVirtualAccount, setSelectedVirtualAccount] =
    useState<string>('');
  const [bankTransferType, setBankTransferType] = useState<'ach' | 'sepa'>(
    'ach',
  );

  // Fetch user's bank accounts from the database (same source as BankingInstructionsDisplay)
  const { data: accountData, isLoading: loadingAccounts } =
    api.align.getVirtualAccountDetails.useQuery();

  // Filter to only show US ACH and IBAN accounts, prioritizing full tier over starter
  // Only show ONE account per type (the best tier available)
  const bankAccounts = React.useMemo(() => {
    if (!accountData?.fundingSources) return [];

    const sources = accountData.fundingSources;

    // Filter for us_ach and iban types only
    const achAndIbanSources = sources.filter(
      (source: any) =>
        source.sourceAccountType === 'us_ach' ||
        source.sourceAccountType === 'iban',
    );

    // Get the best account for each type (full tier preferred over starter)
    const result: any[] = [];

    // Find best US ACH account (full tier first, then starter)
    const fullAch = achAndIbanSources.find(
      (acc: any) =>
        acc.sourceAccountType === 'us_ach' && acc.accountTier === 'full',
    );
    const starterAch = achAndIbanSources.find(
      (acc: any) =>
        acc.sourceAccountType === 'us_ach' && acc.accountTier === 'starter',
    );
    if (fullAch) {
      result.push(fullAch);
    } else if (starterAch) {
      result.push(starterAch);
    }

    // Find best IBAN account (full tier first, then starter)
    const fullIban = achAndIbanSources.find(
      (acc: any) =>
        acc.sourceAccountType === 'iban' && acc.accountTier === 'full',
    );
    const starterIban = achAndIbanSources.find(
      (acc: any) =>
        acc.sourceAccountType === 'iban' && acc.accountTier === 'starter',
    );
    if (fullIban) {
      result.push(fullIban);
    } else if (starterIban) {
      result.push(starterIban);
    }

    return result;
  }, [accountData?.fundingSources]);

  // Initialize payment type based on current payment method
  useEffect(() => {
    if (formData.paymentMethod === 'ach' || formData.paymentMethod === 'sepa') {
      setPaymentType('fiat');
      setBankTransferType(formData.paymentMethod as 'ach' | 'sepa');
    } else if (formData.paymentMethod === 'crypto') {
      setPaymentType('crypto');
      // Set default crypto option if not already set
      if (!formData.cryptoOption) {
        updateFormData('cryptoOption', 'usdc-base');
        updateFormData('currency', 'USDC');
        updateFormData('network', 'base');
      }
    } else {
      // Default to ACH if no payment method set
      setPaymentType('fiat');
      setBankTransferType('ach');
      updateFormData('paymentMethod', 'ach');
    }
  }, []);

  // Auto-prefill Safe address when crypto is selected and Safe is available
  useEffect(() => {
    if (
      paymentType === 'crypto' &&
      userSafeAddress &&
      !formData.paymentAddress
    ) {
      updateFormData('paymentAddress', userSafeAddress);
    }
  }, [paymentType, userSafeAddress]);

  // Handle payment type change
  const handlePaymentTypeChange = (value: string) => {
    setPaymentType(value as 'fiat' | 'crypto');
    if (value === 'fiat') {
      // Set payment method to current bank transfer type
      updateFormData('paymentMethod', bankTransferType);
      // Clear crypto-specific fields
      updateFormData('paymentAddress', '');
      updateFormData('cryptoOption', '');
    } else {
      // Set payment method to crypto
      updateFormData('paymentMethod', 'crypto');
      // Default to USDC on Base for crypto
      updateFormData('cryptoOption', 'usdc-base');
      updateFormData('currency', 'USDC');
      updateFormData('network', 'base');
      // Clear bank-specific fields
      updateFormData('bankAccountHolder', '');
      updateFormData('bankAccountNumber', '');
      updateFormData('bankRoutingNumber', '');
      updateFormData('bankIban', '');
      updateFormData('bankBic', '');
      updateFormData('bankName', '');
      updateFormData('bankAddress', '');
    }
  };

  // Handle bank transfer type change
  const handleBankTransferTypeChange = (value: string) => {
    setBankTransferType(value as 'ach' | 'sepa');

    // Update payment method to the new bank transfer type
    updateFormData('paymentMethod', value);

    // Clear fields specific to the other type
    if (value === 'ach') {
      updateFormData('bankIban', '');
      updateFormData('bankBic', '');
      updateFormData('currency', 'USD');
    } else {
      updateFormData('bankAccountNumber', '');
      updateFormData('bankRoutingNumber', '');
      updateFormData('currency', 'EUR');
    }
  };

  // Handle bank account selection (using database-stored funding sources)
  const handleBankAccountSelect = (accountId: string) => {
    setSelectedVirtualAccount(accountId);

    if (accountId === 'manual') {
      // Clear all bank fields for manual entry
      updateFormData('bankAccountHolder', '');
      updateFormData('bankAccountNumber', '');
      updateFormData('bankRoutingNumber', '');
      updateFormData('bankIban', '');
      updateFormData('bankBic', '');
      updateFormData('bankName', '');
      updateFormData('bankAddress', '');
      return;
    }

    // Find the selected bank account from our filtered list
    const account = bankAccounts?.find((acc: any) => acc.id === accountId);
    if (account) {
      // Prefill bank details from userFundingSource (database schema)
      updateFormData(
        'bankAccountHolder',
        account.sourceBankBeneficiaryName || '',
      );
      updateFormData('bankName', account.sourceBankName || '');
      updateFormData('bankAddress', ''); // Not stored in userFundingSources

      // Handle IBAN accounts (EUR) - Switch to SEPA tab
      if (account.sourceAccountType === 'iban') {
        setBankTransferType('sepa');
        updateFormData('paymentMethod', 'sepa');
        updateFormData('bankIban', account.sourceIban || '');
        updateFormData('bankBic', account.sourceBicSwift || '');
        updateFormData('bankAccountNumber', '');
        updateFormData('bankRoutingNumber', '');
        updateFormData('currency', 'EUR');
      }
      // Handle US accounts (USD) - Switch to ACH tab
      else if (account.sourceAccountType === 'us_ach') {
        setBankTransferType('ach');
        updateFormData('paymentMethod', 'ach');
        updateFormData('bankAccountNumber', account.sourceAccountNumber || '');
        updateFormData('bankRoutingNumber', account.sourceRoutingNumber || '');
        updateFormData('bankIban', '');
        updateFormData('bankBic', '');
        updateFormData('currency', 'USD');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection - Outside the card */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Payment Method</Label>
        <RadioGroup value={paymentType} onValueChange={handlePaymentTypeChange}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PAYMENT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <label
                  key={type.value}
                  htmlFor={type.value}
                  className={cn(
                    'relative flex cursor-pointer rounded-lg border p-4 hover:bg-acceit/50 transition-colors',
                    paymentType === type.value &&
                      'border-[#0040FF]/10 bg-[#0040FF]/10 text-[#0040FF]',
                  )}
                >
                  <RadioGroupItem
                    value={type.value}
                    id={type.value}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <Icon
                      className={cn(
                        'h-5 w-5 mt-0.5',
                        paymentType === type.value
                          ? 'text-[#0040FF]'
                          : 'text-gray-500',
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{type.label}</div>
                      {/* use a much lighter blue and only if selected if not the grayish is fine */}
                      <div
                        className={cn(
                          'text-sm',
                          paymentType === type.value
                            ? 'text-[#0040FF]/50'
                            : 'text-gray-500',
                        )}
                      >
                        {type.description}
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </RadioGroup>
      </div>

      {/* Payment Details Card - Content changes based on payment type */}
      <Card>
        <CardHeader>
          <CardTitle>
            {paymentType === 'fiat'
              ? 'Bank Account Details'
              : 'Cryptocurrency Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentType === 'fiat' ? (
            <>
              {/* Bank Account Selection - filtered to US ACH and IBAN only */}
              {bankAccounts && bankAccounts.length > 0 && (
                <div>
                  <Label htmlFor="virtualAccount">Select Bank Account</Label>
                  <Select
                    value={selectedVirtualAccount}
                    onValueChange={handleBankAccountSelect}
                  >
                    <SelectTrigger id="virtualAccount">
                      <SelectValue placeholder="Choose a bank account or enter manually" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map((account: any) => {
                        // Get last 4 digits of account number or IBAN
                        const accountNumber =
                          account.sourceAccountType === 'iban'
                            ? account.sourceIban
                            : account.sourceAccountNumber;
                        const lastFour = accountNumber
                          ? `••••${accountNumber.slice(-4)}`
                          : '';

                        return (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center gap-2">
                              {account.sourceAccountType === 'iban' ? (
                                <Euro className="h-4 w-4" />
                              ) : (
                                <DollarSign className="h-4 w-4" />
                              )}
                              <span>
                                {account.sourceBankName ||
                                  (account.sourceAccountType === 'iban'
                                    ? 'SEPA'
                                    : 'ACH')}{' '}
                                {lastFour}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                      <SelectItem value="manual">Enter Manually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Bank Transfer Type Tabs */}
              <Tabs
                value={bankTransferType}
                onValueChange={handleBankTransferTypeChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ach" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    ACH / Wire Transfer
                  </TabsTrigger>
                  <TabsTrigger value="sepa" className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    SEPA Transfer
                  </TabsTrigger>
                </TabsList>

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="bankAccountHolder">
                      Account Holder Name
                    </Label>
                    <Input
                      id="bankAccountHolder"
                      value={formData.bankAccountHolder || ''}
                      onChange={(e) =>
                        updateFormData('bankAccountHolder', e.target.value)
                      }
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName || ''}
                      onChange={(e) =>
                        updateFormData('bankName', e.target.value)
                      }
                      placeholder={
                        bankTransferType === 'ach'
                          ? 'Bank of America'
                          : 'Deutsche Bank'
                      }
                    />
                  </div>
                </div>

                <TabsContent value="ach" className="space-y-4">
                  {/* US Account Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankAccountNumber">Account Number</Label>
                      <Input
                        id="bankAccountNumber"
                        value={formData.bankAccountNumber || ''}
                        onChange={(e) =>
                          updateFormData('bankAccountNumber', e.target.value)
                        }
                        placeholder="123456789"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="bankRoutingNumber">
                        Routing Number (ABA)
                      </Label>
                      <Input
                        id="bankRoutingNumber"
                        value={formData.bankRoutingNumber || ''}
                        onChange={(e) =>
                          updateFormData('bankRoutingNumber', e.target.value)
                        }
                        placeholder="021000021"
                        required
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-3 text-sm">
                    <Info className="inline h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-blue-900">
                      For US bank transfers. The routing number is a 9-digit
                      code that identifies your bank.
                    </span>
                  </div>
                </TabsContent>

                <TabsContent value="sepa" className="space-y-4">
                  {/* European Account Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankIban">IBAN</Label>
                      <Input
                        id="bankIban"
                        value={formData.bankIban || ''}
                        onChange={(e) =>
                          updateFormData('bankIban', e.target.value)
                        }
                        placeholder="DE89 3704 0044 0532 0130 00"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="bankBic">BIC/SWIFT Code</Label>
                      <Input
                        id="bankBic"
                        value={formData.bankBic || ''}
                        onChange={(e) =>
                          updateFormData('bankBic', e.target.value)
                        }
                        placeholder="COBADEFF"
                        required
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-3 text-sm">
                    <Info className="inline h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-blue-900">
                      For European bank transfers. IBAN is the international
                      account number, BIC/SWIFT identifies the bank.
                    </span>
                  </div>
                </TabsContent>

                {/* Bank Address - Common for both */}
                <div className="mt-4">
                  <Label htmlFor="bankAddress">Bank Address</Label>
                  <Textarea
                    id="bankAddress"
                    value={formData.bankAddress || ''}
                    onChange={(e) =>
                      updateFormData('bankAddress', e.target.value)
                    }
                    placeholder={
                      bankTransferType === 'ach'
                        ? '123 Main St, New York, NY 10001'
                        : 'Taunusanlage 12, 60325 Frankfurt, Germany'
                    }
                    rows={2}
                  />
                </div>
              </Tabs>
            </>
          ) : (
            <>
              {/* Cryptocurrency Options */}
              <div>
                <Label className="mb-3 " htmlFor="cryptoNetwork">
                  Cryptocurrency & Network
                </Label>
                <Select
                  value={formData.cryptoOption || 'usdc-base'}
                  onValueChange={(value) => {
                    updateFormData('cryptoOption', value);
                    // Update currency and network based on selected crypto option
                    const selected = CRYPTO_OPTIONS.find(
                      (opt) => opt.value === value,
                    );
                    if (selected) {
                      updateFormData('currency', selected.currency);
                      updateFormData('network', selected.network);
                    }
                  }}
                >
                  <SelectTrigger id="cryptoNetwork" className="h-auto">
                    <SelectValue>
                      {(() => {
                        const selected = CRYPTO_OPTIONS.find(
                          (opt) =>
                            opt.value ===
                            (formData.cryptoOption || 'usdc-base'),
                        );
                        if (!selected) return 'Select cryptocurrency';
                        return (
                          <div className="flex items-center gap-2 py-1">
                            <img
                              src={selected.logos.currency}
                              alt={selected.currency}
                              className="h-5 w-5 object-contain"
                            />
                            {selected.network !== 'ethereum' && (
                              <span className="text-muted-foreground">on</span>
                            )}
                            <img
                              src={selected.logos.network}
                              alt={selected.network}
                              className={cn('object-contain', 'w-20')}
                            />
                          </div>
                        );
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CRYPTO_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="h-auto"
                      >
                        <div className="flex items-center gap-2 py-1">
                          <img
                            src={option.logos.currency}
                            alt={option.currency}
                            className="h-5 w-5 object-contain"
                          />
                          <span className="font-medium">{option.currency}</span>
                          {option.network !== 'ethereum' && (
                            <span className="text-muted-foreground">on</span>
                          )}
                          <img
                            src={option.logos.network}
                            alt={option.network}
                            className={cn('object-contain', 'h-5 w-20')}
                          />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentAddress">Receiving Address</Label>
                {userSafeAddress ? (
                  // Locked Safe address display
                  <div className="mt-2">
                    <div className="flex items-center gap-2 p-3 bg-[#fafafa] border border-[#101010]/10 rounded-sm">
                      <Lock className="h-4 w-4 text-[#101010]/40 flex-shrink-0" />
                      <code className="flex-1 font-mono text-[13px] text-[#101010] truncate">
                        {userSafeAddress}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(userSafeAddress);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-1 hover:bg-[#101010]/5 rounded transition-colors"
                        title="Copy address"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-[#101010]/40" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#101010]/60 mt-2 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Payments will be received in your 0 Finance account on
                      Base
                    </p>
                  </div>
                ) : (
                  // Fallback to manual input if no Safe address
                  <>
                    {formData.cryptoOption && (
                      <div className="mb-2 p-2 bg-[#fafafa] rounded-sm">
                        {(() => {
                          const selected = CRYPTO_OPTIONS.find(
                            (opt) => opt.value === formData.cryptoOption,
                          );
                          if (!selected) return null;
                          return (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-[#101010]/60">
                                Receiving:
                              </span>
                              <img
                                src={selected.logos.currency}
                                alt={selected.currency}
                                className="h-4 w-4 object-contain"
                              />
                              <span className="font-medium">
                                {selected.currency}
                              </span>
                              <span className="text-[#101010]/60">on</span>
                              <img
                                src={selected.logos.network}
                                alt={selected.network}
                                className={cn('object-contain', 'h-4 w-12')}
                              />
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    <Input
                      id="paymentAddress"
                      value={formData.paymentAddress}
                      onChange={(e) =>
                        updateFormData('paymentAddress', e.target.value)
                      }
                      placeholder="Enter wallet address"
                      required
                    />
                    <p className="text-xs text-[#101010]/60 mt-1">
                      <Info className="inline h-3 w-3 mr-1" />
                      Make sure to use the correct network for your wallet
                      address
                    </p>
                  </>
                )}
              </div>
            </>
          )}

          {/* Payment Terms - Common for both */}
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Textarea
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => updateFormData('paymentTerms', e.target.value)}
              placeholder="Payment due within 30 days"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
