'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  const router = useRouter();
  const { user } = usePrivy();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-foreground">Welcome to hyprsqrl!</h3>
      <p className="mb-4 text-muted-foreground">
        Let&apos;s set up your secure <strong>Primary Safe Wallet</strong>. This wallet is where you&apos;ll receive invoice payments
        and manage your funds within HyprSQRL.
      </p>
      
      <div className="bg-primary/10 p-4 rounded-lg mb-6 border border-primary/20">
        <h4 className="font-medium text-primary mb-2">What your Primary Safe enables:</h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-primary/90">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>Receive crypto payments directly from invoices (USDC, EURe, etc.)</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-primary/90">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>Securely manage funds with Safe multi-sig capabilities (future feature)</span>
          </li>
            <li className="flex items-start gap-2 text-sm text-primary/90">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>Automate allocations for taxes or other goals (coming soon)</span>
          </li>
        </ul>
      </div>
      
      <div className="text-sm text-muted-foreground mb-6">
        <p>
          We use Gnosis Safe technology to provide you with a secure, smart contract wallet.
          You&apos;ll control this wallet using your connected account {user?.wallet?.address ? 
            `(${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)})` : '(...)'}
        </p>
      </div>

      <div className="flex justify-end mt-8">
        <Link
          href="/onboarding/create-safe"
          className="px-4 py-2 bg-primary text-white rounded-md inline-flex items-center font-medium hover:bg-primary/90 transition-colors"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
} 