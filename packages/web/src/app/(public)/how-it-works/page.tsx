'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Lock,
  ArrowRight,
  Building2,
  Wallet,
  TrendingUp,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProps {
  number: string;
  title: string;
  description: string;
  details: string[];
  technicalNote?: string;
}

function Step({
  number,
  title,
  description,
  details,
  technicalNote,
}: StepProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white border border-[#101010]/10 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
          <span className="text-[14px] font-medium text-[#1B29FF]">
            {number}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-[16px] font-medium text-[#101010]">{title}</h3>
          <p className="mt-2 text-[14px] text-[#101010]/70 leading-relaxed">
            {description}
          </p>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[#1B29FF] hover:underline"
          >
            {showDetails ? 'Hide details' : 'How does this work?'}
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 transition-transform',
                showDetails && 'rotate-180',
              )}
            />
          </button>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-[#101010]/10">
              <ul className="space-y-2">
                {details.map((detail, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[13px] text-[#101010]/70"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#1B29FF] mt-0.5 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
              {technicalNote && (
                <p className="mt-3 text-[12px] text-[#101010]/50 italic">
                  Technical note: {technicalNote}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <header className="border-b border-[#101010]/10 bg-[#F7F7F2]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/new-logo-bluer.png"
                alt="Zero Finance"
                width={24}
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
              <span className="text-[13px] sm:text-[14px] font-medium tracking-tight text-[#0050ff]">
                finance
              </span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/legal"
                className="text-[13px] text-[#101010]/70 hover:text-[#101010] transition-colors"
              >
                Security
              </Link>
              <Link
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1B29FF] hover:bg-[#1B29FF]/90 text-white text-[12px] sm:text-[13px] font-medium rounded-md transition-all"
                href="/signin"
              >
                Sign in
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="uppercase tracking-[0.18em] text-[12px] font-medium text-[#101010]/60">
            How It Works
          </p>
          <h1 className="mt-3 font-serif text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.1] tracking-[-0.015em] text-[#101010]">
            Your Money, <span className="text-[#1B29FF]">Explained Simply</span>
          </h1>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#101010]/70 max-w-[600px] mx-auto">
            Understand exactly how your funds are held, protected, and put to
            work. No jargon, just clear answers.
          </p>
        </div>
      </section>

      {/* Fund Flow */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#101010]/10">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-center font-serif text-[24px] sm:text-[30px] text-[#101010] mb-8">
            How Your Money Flows
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
            {[
              {
                icon: <Building2 className="w-6 h-6" />,
                title: 'Deposit',
                description: 'Send USD via wire or ACH to your account',
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: 'Convert',
                description: 'Funds become digital dollars (USDC)',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Earn',
                description: 'Allocated to institutional lending markets',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Protect',
                description: 'Covered by licensed insurance up to $1M',
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-[#F7F7F2] p-4 sm:p-5 text-center h-full">
                  <div className="w-10 h-10 rounded-full bg-[#1B29FF]/10 flex items-center justify-center mx-auto text-[#1B29FF]">
                    {step.icon}
                  </div>
                  <h3 className="mt-3 text-[14px] font-medium text-[#101010]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#101010]/60">
                    {step.description}
                  </p>
                </div>
                {i < 3 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-[#101010]/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[13px] text-[#101010]/50">
            Withdraw anytime — your funds remain fully liquid with no lock-up
            periods.
          </p>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-center font-serif text-[24px] sm:text-[30px] text-[#101010] mb-2">
            The Details
          </h2>
          <p className="text-center text-[14px] text-[#101010]/60 mb-8">
            Click each step to learn more about how it works.
          </p>

          <div className="space-y-4">
            <Step
              number="1"
              title="Your Secure Account"
              description="When you sign up, we create a secure digital account in your name. Only you can access and control the funds in this account — we cannot move your money."
              details={[
                'Your account is a self-custody vault that only responds to your authorization',
                'Protected by the same security technology used by institutions managing over $100 billion',
                'Login with your email — we handle the complex security infrastructure behind the scenes',
                'Multi-signature protection available for teams (coming soon)',
              ]}
              technicalNote="Your account is a Safe smart contract wallet on Base (an Ethereum L2), controlled via Privy authentication."
            />

            <Step
              number="2"
              title="Depositing Funds"
              description="Send USD from your bank account via wire transfer or ACH. Your funds are converted to digital dollars (USDC) — a regulated stablecoin backed 1:1 by US dollars."
              details={[
                'Receive your own US or EU bank account details for direct transfers',
                'Funds are converted to USDC through licensed payment providers',
                'USDC is issued by Circle and is fully backed by cash and short-term US Treasuries',
                'Conversion happens automatically — no action required from you',
              ]}
              technicalNote="Banking rails powered by Bridge (licensed money transmitter). USDC issued by Circle, audited monthly."
            />

            <Step
              number="3"
              title="How You Earn"
              description="Your digital dollars are allocated to institutional-grade lending markets where they earn yield from borrowers paying interest. Think of it like a high-yield money market, but for digital dollars."
              details={[
                'Funds are deployed to Morpho, a lending protocol with $3B+ in assets',
                'Borrowers include institutions seeking leverage and liquidity',
                'Interest rates fluctuate based on supply and demand (currently 4-7% APY)',
                'Your yield compounds daily — watch your balance grow in real-time',
              ]}
              technicalNote="Yield generated through Morpho vaults, audited by 23+ security firms including OpenZeppelin."
            />

            <Step
              number="4"
              title="Insurance Protection"
              description="Your deposits are protected by smart contract insurance from Chainproof, a licensed insurer. Coverage protects against technical failures and security vulnerabilities — up to $1M per account."
              details={[
                'Chainproof is a licensed insurance provider',
                'Coverage applies to technical risks: bugs, exploits, and vulnerabilities',
                'Claims process with defined terms and conditions',
                'This is NOT FDIC insurance — it protects against different risks',
              ]}
              technicalNote="Insurance underwritten by Chainproof. Full terms at /legal/insurance-terms."
            />

            <Step
              number="5"
              title="Withdrawing Funds"
              description="Withdraw any amount, any time. Your funds remain fully liquid — no lock-up periods, no penalties. Funds are converted back to USD and sent to your bank account."
              details={[
                'Initiate withdrawals from your dashboard anytime',
                'Wire transfers: same-day processing',
                'ACH transfers: 1-2 business days',
                'No early withdrawal penalties or lock-up requirements',
              ]}
              technicalNote="Withdrawals processed through Bridge payment rails to your linked bank account."
            />
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F7F2] border-t border-[#101010]/10">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-center font-serif text-[24px] sm:text-[30px] text-[#101010] mb-8">
            Important Things to Know
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-[#101010]/10 p-5">
              <h3 className="text-[15px] font-medium text-[#101010] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1B29FF]" />
                This is not a bank account
              </h3>
              <p className="mt-2 text-[13px] text-[#101010]/70 leading-relaxed">
                0 Finance is not a bank and your deposits are not FDIC insured.
                Instead, they are held in self-custody digital accounts and
                protected by smart contract insurance from a licensed insurer.
              </p>
            </div>

            <div className="bg-white border border-[#101010]/10 p-5">
              <h3 className="text-[15px] font-medium text-[#101010] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1B29FF]" />
                Yield is variable
              </h3>
              <p className="mt-2 text-[13px] text-[#101010]/70 leading-relaxed">
                The interest rate you earn fluctuates based on market
                conditions. Current rates are 4-7% APY, but this can change. We
                display your actual yield in real-time on your dashboard.
              </p>
            </div>

            <div className="bg-white border border-[#101010]/10 p-5">
              <h3 className="text-[15px] font-medium text-[#101010] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1B29FF]" />
                Insurance has limits
              </h3>
              <p className="mt-2 text-[13px] text-[#101010]/70 leading-relaxed">
                Smart contract insurance covers technical risks up to $1M per
                account. It does not cover market risks, regulatory changes, or
                stablecoin depegging events.{' '}
                <Link
                  href="/legal/insurance-terms"
                  className="text-[#1B29FF] underline"
                >
                  Full terms here
                </Link>
                .
              </p>
            </div>

            <div className="bg-white border border-[#101010]/10 p-5">
              <h3 className="text-[15px] font-medium text-[#101010] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#1B29FF]" />
                You control your funds
              </h3>
              <p className="mt-2 text-[13px] text-[#101010]/70 leading-relaxed">
                Your account is self-custody. 0 Finance cannot access, freeze,
                or move your funds without your authorization. You have full
                control at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#1B29FF]">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="font-serif text-[28px] sm:text-[36px] text-white leading-[1.1]">
            Ready to Start Earning?
          </h2>
          <p className="mt-4 text-[15px] text-white/80">
            Open an account in under 5 minutes. No minimums, no lock-ups.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#1B29FF] font-medium rounded-md hover:bg-white/90 transition-colors"
            >
              Open Account →
            </Link>
            <Link
              href="/legal"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              Review Security Details
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-[#101010]/50">
              © 2025 Different AI Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[12px] text-[#101010]/50">
              <Link href="/legal" className="hover:text-[#101010]">
                Legal & Security
              </Link>
              <Link
                href="/legal/insurance-terms"
                className="hover:text-[#101010]"
              >
                Insurance Terms
              </Link>
              <Link href="/privacy-policy" className="hover:text-[#101010]">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
