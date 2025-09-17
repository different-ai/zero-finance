'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Euro,
  Building2,
  Loader2,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatUsd } from '@/lib/utils';

interface DemoTransferDialogProps {
  fundingSources: any[];
}

export function DemoTransferDialog({
  fundingSources,
}: DemoTransferDialogProps) {
  const [amount, setAmount] = useState('10000');
  const [destinationType, setDestinationType] = useState('ach');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [step, setStep] = useState(1);

  const achAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'us_ach',
  );
  const ibanAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'iban',
  );

  const handleTransfer = async () => {
    setIsProcessing(true);

    // Simulate processing steps
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep(2);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep(3);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleReset = () => {
    setAmount('10000');
    setDestinationType('ach');
    setIsComplete(false);
    setStep(1);
  };

  const processingSteps = [
    'Verifying account details...',
    'Initiating transfer...',
    'Processing payment...',
  ];

  if (isComplete) {
    return (
      <div className="bg-white">
        {/* Header */}
        <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            TRANSFER COMPLETE
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              <CheckCircle2 className="relative h-12 w-12 text-green-500" />
            </div>

            {/* Success Message */}
            <div className="text-center space-y-2">
              <h3 className="font-serif text-[28px] sm:text-[32px] leading-[1.1] text-[#101010]">
                Transfer Initiated
              </h3>
              <p className="text-[14px] text-[#101010]/60 max-w-md">
                Your transfer of {formatUsd(Number(amount))} has been
                successfully initiated. Funds will arrive in 1-2 business days.
              </p>
            </div>

            {/* Transaction Details Card */}
            <div className="w-full max-w-md bg-[#F7F7F2] border border-[#101010]/10 rounded-[12px] p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                    AMOUNT
                  </span>
                  <span className="font-serif text-[20px] tabular-nums text-[#101010]">
                    {formatUsd(Number(amount))}
                  </span>
                </div>
                <div className="border-t border-[#101010]/10 pt-3 space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#101010]/60">Destination</span>
                    <span className="text-[#101010]">
                      {destinationType === 'ach'
                        ? 'USD Bank Account'
                        : 'EUR Bank Account'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#101010]/60">Reference</span>
                    <span className="font-mono text-[12px] text-[#101010]">
                      DEMO-{Date.now()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#101010]/60">Status</span>
                    <span className="text-green-600 font-medium">
                      Processing
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleReset}
              className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-2.5 text-[14px] font-medium transition-all"
            >
              Make Another Transfer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-white">
        {/* Header */}
        <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            PROCESSING
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            {/* Animated Loader */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#1B29FF]/20 rounded-full animate-ping" />
              <div className="relative bg-[#1B29FF]/10 rounded-full p-4">
                <Loader2 className="h-8 w-8 text-[#1B29FF] animate-spin" />
              </div>
            </div>

            {/* Processing Message */}
            <div className="space-y-2 text-center">
              <h3 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] text-[#101010]">
                Processing Transfer
              </h3>
              <p className="text-[14px] text-[#1B29FF] animate-pulse">
                {processingSteps[step - 1]}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="w-full max-w-xs">
              <div className="h-1 bg-[#101010]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1B29FF] transition-all duration-500"
                  style={{ width: `${(step / processingSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
        <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
          MOVE FUNDS
        </p>
        <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] text-[#101010]">
          Transfer to Bank Account
        </h2>
      </div>

      {/* Form Content */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Amount Input Card */}
        <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-[12px] p-4 sm:p-5">
          <Label
            htmlFor="amount"
            className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3 block"
          >
            TRANSFER AMOUNT
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#101010]/40" />
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 text-[20px] font-serif tabular-nums h-12 border-[#101010]/10 bg-white"
              placeholder="0.00"
            />
          </div>
          <div className="mt-3 flex justify-between text-[12px]">
            <span className="text-[#101010]/60">Available balance</span>
            <span className="font-medium tabular-nums text-[#101010]">
              {formatUsd(2500000)}
            </span>
          </div>
        </div>

        {/* Destination Selection */}
        <div>
          <Label className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3 block">
            SELECT DESTINATION
          </Label>
          <RadioGroup
            value={destinationType}
            onValueChange={setDestinationType}
            className="space-y-3"
          >
            {achAccount && (
              <label
                htmlFor="ach"
                className="flex items-start gap-3 bg-white border border-[#101010]/10 rounded-[12px] p-4 hover:bg-[#F7F7F2]/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value="ach" id="ach" className="mt-1" />
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#101010]">
                        USD Bank Account
                      </p>
                      <p className="text-[12px] text-[#101010]/60">
                        {achAccount.sourceBankName} • ****
                        {achAccount.sourceAccountNumber?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                      ACH
                    </p>
                    <p className="text-[12px] text-[#101010]/60">1-2 days</p>
                  </div>
                </div>
              </label>
            )}

            {ibanAccount && (
              <label
                htmlFor="iban"
                className="flex items-start gap-3 bg-white border border-[#101010]/10 rounded-[12px] p-4 hover:bg-[#F7F7F2]/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value="iban" id="iban" className="mt-1" />
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Euro className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#101010]">
                        EUR Bank Account
                      </p>
                      <p className="text-[12px] text-[#101010]/60">
                        {ibanAccount.sourceBankName} •{' '}
                        {ibanAccount.sourceIban?.slice(0, 4)}****
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                      SEPA
                    </p>
                    <p className="text-[12px] text-[#101010]/60">1-2 days</p>
                  </div>
                </div>
              </label>
            )}

            <label
              htmlFor="external"
              className="flex items-start gap-3 bg-white border border-[#101010]/10 rounded-[12px] p-4 hover:bg-[#F7F7F2]/50 transition-colors cursor-pointer"
            >
              <RadioGroupItem value="external" id="external" className="mt-1" />
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#101010]">
                      External Account
                    </p>
                    <p className="text-[12px] text-[#101010]/60">
                      Send to any bank account
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                    WIRE
                  </p>
                  <p className="text-[12px] text-[#101010]/60">Same day</p>
                </div>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* Fee Summary */}
        <div className="bg-[#FFF8E6] border border-[#FFA500]/20 rounded-[12px] p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#101010]/60">Transfer amount</span>
              <span className="tabular-nums text-[#101010]">
                {formatUsd(Number(amount))}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#101010]/60">Processing fee</span>
              <span className="tabular-nums text-[#101010]">$0.00</span>
            </div>
            <div className="border-t border-[#FFA500]/20 pt-2 flex justify-between">
              <span className="text-[13px] font-medium text-[#101010]">
                Total to receive
              </span>
              <span className="font-serif text-[18px] tabular-nums text-[#101010]">
                {formatUsd(Number(amount))}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="text-center text-[11px] text-[#101010]/40 uppercase tracking-[0.14em]">
          Demo Mode • No actual funds will be transferred
        </div>

        {/* Transfer Button */}
        <Button
          onClick={handleTransfer}
          disabled={!amount || Number(amount) <= 0}
          className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-medium transition-all"
        >
          <span>Initiate Transfer</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
