'use client';

import React, { useState } from 'react';
import { SimplifiedOffRamp } from './simplified-off-ramp';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Demo funding sources with different account types
const DEMO_FUNDING_SOURCES = {
  ach: [
    {
      id: 'demo-ach-1',
      accountType: 'us_ach' as const,
      currency: 'USD',
      bankName: 'Chase Bank',
      beneficiaryName: 'Demo User',
      accountHolder: 'John Smith',
      accountNumber: '****1234',
      routingNumber: '021000021',
      iban: null,
      bic: null,
    },
  ],
  iban: [
    {
      id: 'demo-iban-1',
      accountType: 'iban' as const,
      currency: 'EUR',
      bankName: 'Deutsche Bank',
      beneficiaryName: 'Demo European User',
      accountHolder: 'Hans Mueller',
      accountNumber: null,
      routingNumber: null,
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX',
    },
  ],
  both: [
    {
      id: 'demo-ach-2',
      accountType: 'us_ach' as const,
      currency: 'USD',
      bankName: 'Bank of America',
      beneficiaryName: 'Demo Business',
      accountHolder: 'Acme Corp',
      accountNumber: '****5678',
      routingNumber: '026009593',
      iban: null,
      bic: null,
    },
    {
      id: 'demo-iban-2',
      accountType: 'iban' as const,
      currency: 'EUR',
      bankName: 'BNP Paribas',
      beneficiaryName: 'Demo FR User',
      accountHolder: 'Pierre Dupont',
      accountNumber: null,
      routingNumber: null,
      iban: 'FR1420041010050500013M02606',
      bic: 'BNPAFRPPXXX',
    },
  ],
  none: [],
};

// Pre-filled form data for different scenarios
const DEMO_FORM_DATA = {
  achTransfer: {
    destinationType: 'ach' as const,
    amount: '1000',
    accountHolderType: 'individual' as const,
    accountHolderFirstName: 'John',
    accountHolderLastName: 'Smith',
    bankName: 'Chase Bank',
    country: 'US',
    city: 'New York',
    streetLine1: '123 Main Street',
    streetLine2: 'Apt 4B',
    postalCode: '10001',
    accountNumber: '123456789',
    routingNumber: '021000021',
  },
  ibanTransfer: {
    destinationType: 'iban' as const,
    amount: '500',
    accountHolderType: 'individual' as const,
    accountHolderFirstName: 'Hans',
    accountHolderLastName: 'Mueller',
    bankName: 'Deutsche Bank',
    country: 'DE',
    city: 'Berlin',
    streetLine1: 'Unter den Linden 13',
    postalCode: '10117',
    iban: 'DE89370400440532013000',
    bic: 'COBADEFFXXX',
  },
  businessTransfer: {
    destinationType: 'ach' as const,
    amount: '25000',
    accountHolderType: 'business' as const,
    accountHolderBusinessName: 'Acme Corporation',
    bankName: 'Bank of America',
    country: 'US',
    city: 'San Francisco',
    streetLine1: '555 California Street',
    streetLine2: 'Suite 2000',
    postalCode: '94104',
    accountNumber: '987654321',
    routingNumber: '026009593',
  },
  cryptoTransfer: {
    destinationType: 'crypto' as const,
    amount: '100',
    cryptoAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
  },
};

export function SimplifiedOffRampDemo() {
  const [selectedDemo, setSelectedDemo] = useState<
    'achTransfer' | 'ibanTransfer' | 'businessTransfer' | 'cryptoTransfer'
  >('achTransfer');
  const [fundingSourceType, setFundingSourceType] = useState<
    'both' | 'ach' | 'iban' | 'none'
  >('both');

  const getDemoDescription = () => {
    switch (selectedDemo) {
      case 'achTransfer':
        return 'US bank transfer via ACH for an individual account';
      case 'ibanTransfer':
        return 'European bank transfer via SEPA for an individual account';
      case 'businessTransfer':
        return 'Large business transfer to a corporate account';
      case 'cryptoTransfer':
        return 'Direct USDC transfer to another wallet address';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Off-Ramp Transfer Demo</CardTitle>
          <CardDescription>
            Test different transfer scenarios with pre-filled data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scenario Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Transfer Scenario
            </label>
            <Tabs
              value={selectedDemo}
              onValueChange={(v) => setSelectedDemo(v as any)}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="achTransfer">US Bank (ACH)</TabsTrigger>
                <TabsTrigger value="ibanTransfer">EU Bank (SEPA)</TabsTrigger>
                <TabsTrigger value="businessTransfer">Business</TabsTrigger>
                <TabsTrigger value="cryptoTransfer">Crypto</TabsTrigger>
              </TabsList>
              <TabsContent value={selectedDemo} className="mt-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    {getDemoDescription()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">
                      Amount: ${DEMO_FORM_DATA[selectedDemo].amount}
                    </Badge>
                    {selectedDemo !== 'cryptoTransfer' && (
                      <Badge variant="outline">
                        Type: {DEMO_FORM_DATA[selectedDemo].accountHolderType}
                      </Badge>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Funding Source Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Available Virtual Accounts
            </label>
            <div className="flex gap-2">
              <Button
                variant={fundingSourceType === 'both' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFundingSourceType('both')}
              >
                Both ACH & IBAN
              </Button>
              <Button
                variant={fundingSourceType === 'ach' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFundingSourceType('ach')}
              >
                ACH Only
              </Button>
              <Button
                variant={fundingSourceType === 'iban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFundingSourceType('iban')}
              >
                IBAN Only
              </Button>
              <Button
                variant={fundingSourceType === 'none' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFundingSourceType('none')}
              >
                None (Crypto Only)
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This controls which transfer methods are available based on user's
              virtual accounts
            </p>
          </div>
        </CardContent>
      </Card>

      {/* The actual off-ramp component with demo data */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Component</CardTitle>
          <CardDescription>
            The form below is pre-filled with demo data. Try changing the
            scenarios above.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimplifiedOffRamp
            fundingSources={DEMO_FUNDING_SOURCES[fundingSourceType]}
            defaultValues={DEMO_FORM_DATA[selectedDemo]}
            key={`${selectedDemo}-${fundingSourceType}`} // Force re-render on scenario change
          />
        </CardContent>
      </Card>

      {/* Info Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Current Scenario:</strong> {selectedDemo}
            </div>
            <div>
              <strong>Virtual Accounts:</strong>{' '}
              {fundingSourceType === 'none'
                ? 'None'
                : fundingSourceType.toUpperCase()}
            </div>
            <div>
              <strong>Pre-filled Data:</strong>
              <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(DEMO_FORM_DATA[selectedDemo], null, 2)}
              </pre>
            </div>
            <div>
              <strong>Available Accounts:</strong>
              <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(
                  DEMO_FUNDING_SOURCES[fundingSourceType],
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
