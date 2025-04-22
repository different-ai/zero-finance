'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Info, DollarSign, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function InfoPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#111827] mb-3">Important Information</h2>
        <p className="text-[#6B7280] text-lg leading-relaxed">
          Before you start using your Primary Safe Wallet, here are some important things to know about how it works.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-[#10B981]/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <h3 className="font-medium text-[#111827] text-lg mb-2">Invoice Payments</h3>
                <p className="text-[#6B7280]">
                  When clients pay your invoices, the funds will be sent directly to your Primary Safe Wallet. 
                  We use the Request Network protocol to create and track payment status on the blockchain.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-[#10B981]/10 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <h3 className="font-medium text-[#111827] text-lg mb-2">Gas Fees</h3>
                <p className="text-[#6B7280]">
                  To withdraw funds from your Primary Safe Wallet or perform other transactions, you&apos;ll need to pay gas fees. 
                  These are small amounts of the network&apos;s native token required to process transactions on the blockchain.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-[#10B981]/10 p-2 rounded-full">
                <Info className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <h3 className="font-medium text-[#111827] text-lg mb-2">Safe Technology</h3>
                <p className="text-[#6B7280]">
                  Your Primary Safe Wallet is powered by Gnosis Safe, one of the most secure and trusted smart contract wallets
                  in the industry. It provides enhanced security through multi-signature capabilities and other safety features.
                </p>
                <p className="text-[#6B7280] mt-2">
                  In the future, we&apos;ll add more features to help you manage your funds, such as automated allocation for taxes
                  and the ability to add multiple signers to your Safe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] p-4">
        <div className="flex gap-2 items-center mb-2">
          <div className="bg-yellow-100 p-1 rounded-full">
            <Info className="h-4 w-4 text-yellow-600" />
          </div>
          <h4 className="font-medium text-[#111827]">Important Note</h4>
        </div>
        <p className="text-[#6B7280] text-sm">
          After setup, you&apos;ll be able to withdraw funds to any external wallet or exchange account. 
          Always verify addresses before sending transactions, as blockchain transactions cannot be reversed.
        </p>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          onClick={() => router.push('/onboarding/create-safe')}
          variant="outline"
          className="text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] px-5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={() => router.push('/onboarding/complete')}
          className="bg-[#111827] hover:bg-[#111827]/90 text-white px-6 py-2.5 rounded-md flex items-center gap-2 shadow-sm"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
