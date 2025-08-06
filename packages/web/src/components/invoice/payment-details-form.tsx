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
import { api } from '@/trpc/react';
import { Building2, Wallet, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentDetailsFormProps {
  formData: Record<string, any>;
  updateFormData: (field: string, value: any) => void;
}

const PAYMENT_TYPES = [
  { 
    value: 'fiat', 
    label: 'Bank Transfer',
    icon: Building2,
    description: 'Receive payments via ACH, SEPA, or wire transfer'
  },
  { 
    value: 'crypto', 
    label: 'Cryptocurrency',
    icon: Wallet,
    description: 'Receive payments in USDC, ETH, or other cryptocurrencies'
  },
];

const CRYPTO_OPTIONS = [
  { 
    value: 'usdc-solana', 
    label: 'USDC on Solana', 
    network: 'solana', 
    currency: 'USDC',
    logos: {
      currency: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Circle_USDC_Logo.svg',
      network: 'https://solana.com/src/img/branding/solanaLogo.svg'
    }
  },
  { 
    value: 'usdc-base', 
    label: 'USDC on Base', 
    network: 'base', 
    currency: 'USDC',
    logos: {
      currency: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Circle_USDC_Logo.svg',
      network: 'https://avatars.githubusercontent.com/u/108554348?s=200&v=4' // Base logo
    }
  },
  { 
    value: 'usdc-ethereum', 
    label: 'USDC on Ethereum', 
    network: 'ethereum', 
    currency: 'USDC',
    logos: {
      currency: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Circle_USDC_Logo.svg',
      network: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040'
    }
  },
  { 
    value: 'eth', 
    label: 'ETH on Ethereum', 
    network: 'ethereum', 
    currency: 'ETH',
    logos: {
      currency: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040',
      network: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040'
    }
  },
];

export function PaymentDetailsForm({ formData, updateFormData }: PaymentDetailsFormProps) {
  const [paymentType, setPaymentType] = useState<'fiat' | 'crypto'>('fiat');
  const [selectedVirtualAccount, setSelectedVirtualAccount] = useState<string>('');
  
  // Fetch user's virtual accounts
  const { data: virtualAccounts, isLoading: loadingAccounts } = api.align.getAllVirtualAccounts.useQuery();
  
  // We can fetch funding sources if needed later
  // const { data: fundingSources, isLoading: loadingFunding } = api.fundingSource.getUserFundingSources.useQuery();
  
  // Initialize payment type based on current payment method
  useEffect(() => {
    if (formData.paymentMethod === 'fiat' || !formData.paymentMethod) {
      setPaymentType('fiat');
      updateFormData('paymentMethod', 'fiat');
    } else {
      setPaymentType('crypto');
    }
  }, []);
  
  // Handle payment type change
  const handlePaymentTypeChange = (value: string) => {
    setPaymentType(value as 'fiat' | 'crypto');
    if (value === 'fiat') {
      updateFormData('paymentMethod', 'fiat');
      // Clear crypto-specific fields
      updateFormData('paymentAddress', '');
    } else {
      // Default to USDC on Solana for crypto
      updateFormData('paymentMethod', 'usdc-solana');
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
  
  // Handle virtual account selection
  const handleVirtualAccountSelect = (accountId: string) => {
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
    
    // Find the selected virtual account
    const account = virtualAccounts?.find((acc: any) => acc.id === accountId);
    if (account?.deposit_instructions) {
      const instructions = account.deposit_instructions;
      
      // Prefill bank details from virtual account
      updateFormData('bankAccountHolder', instructions.beneficiary_name || instructions.account_beneficiary_name || '');
      updateFormData('bankName', instructions.bank_name || '');
      updateFormData('bankAddress', instructions.bank_address || '');
      
      // Handle IBAN accounts (EUR)
      if (instructions.iban) {
        updateFormData('bankIban', instructions.iban.iban_number || '');
        updateFormData('bankBic', instructions.iban.bic || instructions.bic?.bic_code || '');
        updateFormData('bankAccountNumber', '');
        updateFormData('bankRoutingNumber', '');
      }
      // Handle US accounts (USD)
      else if (instructions.us) {
        updateFormData('bankAccountNumber', instructions.us.account_number || '');
        updateFormData('bankRoutingNumber', instructions.us.routing_number || '');
        updateFormData('bankIban', '');
        updateFormData('bankBic', '');
      }
      // Handle other account formats
      else {
        updateFormData('bankAccountNumber', instructions.account_number || '');
        updateFormData('bankRoutingNumber', instructions.routing_number || '');
        updateFormData('bankIban', '');
        updateFormData('bankBic', '');
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
                    "relative flex cursor-pointer rounded-lg border p-4 hover:bg-acceit/50 transition-colors",
                    paymentType === type.value && "border-[#0040FF]/10 bg-[#0040FF]/10 text-[#0040FF]"
                  )}
                >
                  <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                  <div className="flex items-start space-x-3">
                    <Icon className={cn("h-5 w-5 mt-0.5", paymentType === type.value ? "text-[#0040FF]" : "text-gray-500")} />
                    <div className="flex-1">
                      <div className="font-medium">{type.label}</div>
                      {/* use a much lighter blue and only if selected if not the grayish is fine */}
                      <div className={cn("text-sm", paymentType === type.value ? "text-[#0040FF]/50" : "text-gray-500")}>{type.description}</div>
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
            {paymentType === 'fiat' ? 'Bank Account Details' : 'Cryptocurrency Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentType === 'fiat' ? (
            <>
              {/* Virtual Account Selection for Bank Transfer */}
              {virtualAccounts && virtualAccounts.length > 0 && (
                <div>
                  <Label htmlFor="virtualAccount">Select Bank Account</Label>
                  <Select value={selectedVirtualAccount} onValueChange={handleVirtualAccountSelect}>
                    <SelectTrigger id="virtualAccount">
                      <SelectValue placeholder="Choose a bank account or enter manually" />
                    </SelectTrigger>
                    <SelectContent>
                      {virtualAccounts.map((account: any) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.deposit_instructions?.currency === 'eur' ? '🇪🇺' : '🇺🇸'}{' '}
                          {account.deposit_instructions?.currency?.toUpperCase()} Account -{' '}
                          {account.deposit_instructions?.beneficiary_name || 'Virtual Account'}
                        </SelectItem>
                      ))}
                      <SelectItem value="manual">Enter Manually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Bank Account Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankAccountHolder">Account Holder Name</Label>
                  <Input
                    id="bankAccountHolder"
                    value={formData.bankAccountHolder || ''}
                    onChange={(e) => updateFormData('bankAccountHolder', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName || ''}
                    onChange={(e) => updateFormData('bankName', e.target.value)}
                    placeholder="Bank of America"
                  />
                </div>
              </div>
              
              {/* US Account Details */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-muted-foreground">US Account (ACH/Wire)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankAccountNumber">Account Number</Label>
                    <Input
                      id="bankAccountNumber"
                      value={formData.bankAccountNumber || ''}
                      onChange={(e) => updateFormData('bankAccountNumber', e.target.value)}
                      placeholder="123456789"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bankRoutingNumber">Routing Number</Label>
                    <Input
                      id="bankRoutingNumber"
                      value={formData.bankRoutingNumber || ''}
                      onChange={(e) => updateFormData('bankRoutingNumber', e.target.value)}
                      placeholder="021000021"
                    />
                  </div>
                </div>
              </div>
              
              {/* European Account Details */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-muted-foreground">European Account (SEPA)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankIban">IBAN</Label>
                    <Input
                      id="bankIban"
                      value={formData.bankIban || ''}
                      onChange={(e) => updateFormData('bankIban', e.target.value)}
                      placeholder="DE89 3704 0044 0532 0130 00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bankBic">BIC/SWIFT</Label>
                    <Input
                      id="bankBic"
                      value={formData.bankBic || ''}
                      onChange={(e) => updateFormData('bankBic', e.target.value)}
                      placeholder="COBADEFF"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bankAddress">Bank Address</Label>
                <Textarea
                  id="bankAddress"
                  value={formData.bankAddress || ''}
                  onChange={(e) => updateFormData('bankAddress', e.target.value)}
                  placeholder="123 Main St, New York, NY 10001"
                  rows={2}
                />
              </div>
            </>
          ) : (
            <>
              {/* Cryptocurrency Options */}
              <div>
                <Label htmlFor="cryptoNetwork">Cryptocurrency & Network</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => updateFormData('paymentMethod', value)}
                >
                  <SelectTrigger id="cryptoNetwork" className="h-auto">
                    <SelectValue>
                      {(() => {
                        const selected = CRYPTO_OPTIONS.find(opt => opt.value === formData.paymentMethod);
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
                              className={cn(
                                "object-contain",
                                selected.network === 'solana' ? "h-4 w-16" : "h-5 w-5"
                              )}
                            />
                          </div>
                        );
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CRYPTO_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="h-auto">
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
                            className={cn(
                              "object-contain",
                              option.network === 'solana' ? "h-4 w-16" : 
                              option.network === 'base' ? "h-5 w-5 rounded" : "h-5 w-5"
                            )}
                          />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="paymentAddress">Wallet Address</Label>
                {formData.paymentMethod && formData.paymentMethod !== 'fiat' && (
                  <div className="mb-2 p-2 bg-muted/50 rounded-md">
                    {(() => {
                      const selected = CRYPTO_OPTIONS.find(opt => opt.value === formData.paymentMethod);
                      if (!selected) return null;
                      return (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Receiving:</span>
                          <img 
                            src={selected.logos.currency} 
                            alt={selected.currency}
                            className="h-4 w-4 object-contain"
                          />
                          <span className="font-medium">{selected.currency}</span>
                          <span className="text-muted-foreground">on</span>
                          <img 
                            src={selected.logos.network} 
                            alt={selected.network}
                            className={cn(
                              "object-contain",
                              selected.network === 'solana' ? "h-3 w-12" : "h-4 w-4"
                            )}
                          />
                          <span className="capitalize">{selected.network}</span>
                        </div>
                      );
                    })()}
                  </div>
                )}
                <Input
                  id="paymentAddress"
                  value={formData.paymentAddress}
                  onChange={(e) => updateFormData('paymentAddress', e.target.value)}
                  placeholder="Enter wallet address"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  <Info className="inline h-3 w-3 mr-1" />
                  Make sure to use the correct network for your wallet address
                </p>
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