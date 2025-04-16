'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, Shield, Wallet, Gauge } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();
  const { user } = usePrivy();

  // Format wallet address for display
  const walletAddress = user?.wallet?.address 
    ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
    : '...';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#111827] mb-3">Welcome to hyprsqrl</h2>
        <p className="text-[#6B7280] text-lg leading-relaxed">
          Let&apos;s set up your secure <span className="font-medium text-[#111827]">Primary Safe Wallet</span>. This wallet is where you&apos;ll receive invoice payments and manage your funds within HyprSQRL.
        </p>
      </div>
      
      <Card className="border border-[#E5E7EB] bg-gradient-to-r from-[#10B981]/5 to-[#10B981]/10">
        <CardContent className="p-6">
          <h3 className="font-medium text-[#111827] text-lg mb-4">What your Primary Safe enables:</h3>
          <div className="grid gap-4">
            <div className="flex items-start gap-3 group">
              <div className="mt-0.5 bg-white p-2 rounded-full shadow-sm border border-[#E5E7EB] group-hover:border-[#10B981] transition-colors">
                <Wallet className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="font-medium text-[#111827]">Receive Crypto Payments</h4>
                <p className="text-[#6B7280] mt-1">Accept invoice payments directly in USDC, EURe, and other stablecoins</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <div className="mt-0.5 bg-white p-2 rounded-full shadow-sm border border-[#E5E7EB] group-hover:border-[#10B981] transition-colors">
                <Shield className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="font-medium text-[#111827]">Enhanced Security</h4>
                <p className="text-[#6B7280] mt-1">Secure your funds with Safe multi-sig capabilities (future feature)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <div className="mt-0.5 bg-white p-2 rounded-full shadow-sm border border-[#E5E7EB] group-hover:border-[#10B981] transition-colors">
                <Gauge className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="font-medium text-[#111827]">Automated Allocations</h4>
                <p className="text-[#6B7280] mt-1">Automate allocations for taxes or other goals (coming soon)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] p-4">
        <p className="text-[#6B7280] text-sm">
          <span className="block font-medium text-[#111827] mb-1">Technical Details:</span>
          We use Gnosis Safe technology to provide you with a secure, smart contract wallet.
          You&apos;ll control this wallet using your connected account {walletAddress && (
            <code className="bg-white px-2 py-0.5 rounded text-xs font-mono border border-[#E5E7EB]">{walletAddress}</code>
          )}
        </p>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => router.push('/onboarding/create-safe')}
          className="bg-[#111827] hover:bg-[#111827]/90 text-white px-6 py-2.5 rounded-md flex items-center gap-2 shadow-sm"
        >
          Continue to Setup
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 