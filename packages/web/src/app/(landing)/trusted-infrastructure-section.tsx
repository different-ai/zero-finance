'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ExternalLink,
  Shield,
  Building2,
  Lock,
  Wallet,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Partner {
  id: string;
  name: string;
  role: string;
  stat: string;
  statLabel: string;
  description: string;
  details: string[];
  href: string;
  icon: React.ReactNode;
}

const PARTNERS: Partner[] = [
  {
    id: 'morpho',
    name: 'Morpho',
    role: 'Yield Infrastructure',
    stat: '$3B+',
    statLabel: 'Total Value Secured',
    description: 'Institutional-grade lending protocol powering your yield.',
    details: [
      'Audited by 23+ security firms including OpenZeppelin and ChainSecurity',
      'Backed by a16z, Coinbase Ventures, and Pantera Capital',
      'Non-custodial: funds remain in your control at all times',
    ],
    href: 'https://morpho.org',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 'chainproof',
    name: 'Chainproof',
    role: 'Insurance Provider',
    stat: '$1M',
    statLabel: 'Coverage Per Account',
    description: 'Licensed insurer providing protection for your deposits.',
    details: [
      'Licensed and regulated insurance provider',
      'Covers technical risks and smart contract vulnerabilities',
      'Claims process with defined terms and conditions',
    ],
    href: 'https://chainproof.co',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: 'safe',
    name: 'Safe',
    role: 'Account Security',
    stat: '$100B+',
    statLabel: 'Assets Secured Globally',
    description:
      'Industry-standard secure accounts used by institutions worldwide.',
    details: [
      'Over 10 million deployed secure accounts',
      'Battle-tested infrastructure securing institutional treasuries',
      'Self-custody: only you control your funds',
    ],
    href: 'https://safe.global',
    icon: <Lock className="w-5 h-5" />,
  },
  {
    id: 'privy',
    name: 'Privy',
    role: 'Authentication',
    stat: '75M+',
    statLabel: 'Accounts Secured',
    description: 'Enterprise authentication powering secure login.',
    details: [
      'Trusted by 1,000+ companies across 180+ countries',
      'Bank-grade encryption and security standards',
      'Simple email login with institutional security',
    ],
    href: 'https://privy.io',
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    id: 'bridge',
    name: 'Bridge',
    role: 'Banking Rails',
    stat: '48 States',
    statLabel: 'Licensed Coverage',
    description: 'Licensed payment infrastructure for US and EU transfers.',
    details: [
      'Money transmitter licenses across US states',
      'EU licensed for SEPA transfers',
      'Part of Stripe — trusted by millions of businesses',
    ],
    href: 'https://bridge.xyz',
    icon: <CreditCard className="w-5 h-5" />,
  },
];

function PartnerCard({ partner }: { partner: Partner }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#101010]/10 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 sm:p-5 hover:bg-[#F7F7F2]/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-[#1B29FF]">{partner.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] sm:text-[15px] font-medium text-[#101010]">
                  {partner.name}
                </h3>
                <span className="text-[11px] uppercase tracking-[0.1em] text-[#101010]/50 bg-[#F7F7F2] px-1.5 py-0.5 rounded">
                  {partner.role}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[#101010]/70">
                {partner.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-[18px] font-medium text-[#1B29FF] tabular-nums">
                {partner.stat}
              </div>
              <div className="text-[11px] text-[#101010]/50 uppercase tracking-[0.1em]">
                {partner.statLabel}
              </div>
            </div>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-[#101010]/40 transition-transform',
                isExpanded && 'rotate-180',
              )}
            />
          </div>
        </div>
        {/* Mobile stat display */}
        <div className="mt-2 sm:hidden">
          <span className="text-[16px] font-medium text-[#1B29FF] tabular-nums">
            {partner.stat}
          </span>
          <span className="text-[11px] text-[#101010]/50 uppercase tracking-[0.1em] ml-2">
            {partner.statLabel}
          </span>
        </div>
      </button>

      {/* Expanded details */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[300px]' : 'max-h-0',
        )}
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-[#101010]/5">
          <ul className="mt-3 space-y-2">
            {partner.details.map((detail, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[13px] text-[#101010]/70"
              >
                <span className="text-[#1B29FF] mt-1">•</span>
                {detail}
              </li>
            ))}
          </ul>
          <a
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-[13px] text-[#1B29FF] hover:underline"
          >
            Learn more about {partner.name}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function TrustedInfrastructureSection() {
  return (
    <section className="relative bg-white border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            Trusted Infrastructure
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Built on Battle-Tested Technology
          </h2>
          <p className="mt-3 text-[14px] sm:text-[15px] text-[#101010]/70 max-w-[600px] mx-auto">
            Your funds are secured by the same infrastructure trusted by
            institutions managing billions. Click to learn more about each
            partner.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[#101010]/10">
          {PARTNERS.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>

        {/* Trust summary */}
        <div className="mt-8 pt-6 border-t border-[#101010]/10">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-center">
            <div>
              <div className="text-[20px] sm:text-[24px] font-medium text-[#1B29FF] tabular-nums">
                $100B+
              </div>
              <div className="text-[11px] text-[#101010]/50 uppercase tracking-[0.1em]">
                Combined Assets Secured
              </div>
            </div>
            <div>
              <div className="text-[20px] sm:text-[24px] font-medium text-[#1B29FF] tabular-nums">
                23+
              </div>
              <div className="text-[11px] text-[#101010]/50 uppercase tracking-[0.1em]">
                Security Audits
              </div>
            </div>
            <div>
              <div className="text-[20px] sm:text-[24px] font-medium text-[#1B29FF] tabular-nums">
                Licensed
              </div>
              <div className="text-[11px] text-[#101010]/50 uppercase tracking-[0.1em]">
                Insurance & Banking
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
