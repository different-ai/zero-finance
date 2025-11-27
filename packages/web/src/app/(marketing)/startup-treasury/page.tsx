import { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Startup Treasury Management - 8% Yield, Full Banking | 0 Finance',
  description:
    'Complete treasury management for startups. 8% yield, corporate cards, ACH/wire transfers, multi-currency support. Built by experienced fintech founders.',
  keywords:
    'startup treasury management, business cash management, startup banking, corporate treasury, high yield business account',
  openGraph: {
    title: 'Modern Treasury Management for Startups | 0 Finance',
    description:
      'The only treasury platform that combines 8% yield with full banking features. No minimums, instant setup.',
  },
};

export default function StartupTreasuryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#F6F5EF] border-b border-[#101010]/10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.18em] text-[12px] font-medium text-[#101010]/70">
            Modern Treasury Management
          </p>
          <h1 className="mt-3 font-serif text-[48px] sm:text-[64px] lg:text-[72px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
            Your Startup's Complete
            <span className="block text-[#1B29FF]">Treasury Platform</span>
          </h1>
          <p className="mt-6 text-[18px] leading-[1.5] text-[#222] max-w-[65ch]">
            The only platform that combines 8% yield with full banking features.
            Built by experienced founders who understand both DeFi complexity
            and startup needs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Link
              href="/signin"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
            >
              Open Account in 5 Minutes →
            </Link>
            <Link
              href="https://cal.com/team/0finance/30"
              className="inline-flex items-center text-[15px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
            >
              Book Demo with Founders
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 text-[14px] text-[#101010]/70">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1B29FF]" />
              <span>No minimums</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1B29FF]" />
              <span>Smart contract insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1B29FF]" />
              <span>Same-day setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="bg-white py-12 sm:py-16 border-b border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            Complete Solution
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            Everything Your Treasury Needs
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#101010]/10">
            <div className="bg-white p-6">
              <div className="text-[32px] leading-none font-medium text-[#1B29FF]">
                8%
              </div>
              <h3 className="mt-3 text-[16px] font-medium text-[#101010]">
                Target APY
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Double traditional treasury yields with smart contract insurance
                coverage
              </p>
            </div>

            <div className="bg-white p-6">
              <div className="text-[32px] leading-none font-medium text-[#1B29FF]">
                $0
              </div>
              <h3 className="mt-3 text-[16px] font-medium text-[#101010]">
                Minimum Balance
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Start earning from your first dollar, unlike Mercury's $100K
                requirement
              </p>
            </div>

            <div className="bg-white p-6">
              <div className="text-[32px] leading-none font-medium text-[#1B29FF]">
                24/7
              </div>
              <h3 className="mt-3 text-[16px] font-medium text-[#101010]">
                Instant Access
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                No lockups or withdrawal limits. Your money when you need it
              </p>
            </div>

            <div className="bg-white p-6">
              <h3 className="text-[16px] font-medium text-[#101010] flex items-center gap-2">
                <span className="text-[#1B29FF]">✓</span> Corporate Cards
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Visa cards with customizable limits and real-time spend controls
              </p>
            </div>

            <div className="bg-white p-6">
              <h3 className="text-[16px] font-medium text-[#101010] flex items-center gap-2">
                <span className="text-[#1B29FF]">✓</span> ACH & Wire
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Full banking rails with same-day wires and standard ACH
                transfers
              </p>
            </div>

            <div className="bg-white p-6">
              <h3 className="text-[16px] font-medium text-[#101010] flex items-center gap-2">
                <span className="text-[#1B29FF]">✓</span> Multi-Currency
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Hold and transact in USD, EUR, and USDC seamlessly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#F7F7F2] py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            Simple Process
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            From Sign-up to Earning in Minutes
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-4 gap-px bg-[#101010]/10">
            <div className="bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                Step 1
              </div>
              <h3 className="mt-2 text-[15px] font-medium text-[#101010]">
                Sign Up
              </h3>
              <p className="mt-2 text-[13px] text-[#101010]/70">
                Email login, KYC verification in minutes
              </p>
            </div>

            <div className="bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                Step 2
              </div>
              <h3 className="mt-2 text-[15px] font-medium text-[#101010]">
                Get Account Numbers
              </h3>
              <p className="mt-2 text-[13px] text-[#101010]/70">
                Instant US routing and EU IBAN numbers
              </p>
            </div>

            <div className="bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                Step 3
              </div>
              <h3 className="mt-2 text-[15px] font-medium text-[#101010]">
                Deposit Funds
              </h3>
              <p className="mt-2 text-[13px] text-[#101010]/70">
                Wire, ACH, or USDC transfer from existing accounts
              </p>
            </div>

            <div className="bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                Step 4
              </div>
              <h3 className="mt-2 text-[15px] font-medium text-[#101010]">
                Start Earning
              </h3>
              <p className="mt-2 text-[13px] text-[#101010]/70">
                Automatic 8% yield from day one
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white py-12 sm:py-16 border-b border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            Security First
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            Built for Institutional Security
          </h2>

          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="border border-[#101010]/10 p-6">
              <h3 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70">
                Smart Contract Insurance
              </h3>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#101010]/80">
                Partnership with Chainproof (licensed insurer) provides coverage
                up to $1M against technical risks, exploits, and smart contract
                failures. While not FDIC, it protects against the primary risks
                in DeFi infrastructure.{' '}
                <a
                  href="/legal/insurance-terms"
                  className="text-[#1B29FF] underline"
                >
                  Learn more
                </a>
              </p>
            </div>

            <div className="border border-[#101010]/10 p-6">
              <h3 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70">
                Self-Custody Architecture
              </h3>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#101010]/80">
                Your funds are secured on-chain with institutional-grade
                protection. Multi-sig wallets via Safe (formerly Gnosis Safe)
                ensure you maintain control while we handle the complexity.
              </p>
            </div>

            <div className="border border-[#101010]/10 p-6">
              <h3 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70">
                Regulatory Compliance
              </h3>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#101010]/80">
                Full KYC/AML compliance, regulated banking partners, and
                transparent reporting. We handle the regulatory complexity so
                you can focus on building.
              </p>
            </div>

            <div className="border border-[#101010]/10 p-6">
              <h3 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70">
                Battle-Tested Team
              </h3>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#101010]/80">
                Our founding team has extensive experience building and scaling
                fintech products. We understand the complexities of both DeFi
                and traditional banking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-[#F6F5EF] py-12 sm:py-16 border-b border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            Use Cases
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            Perfect for Every Stage
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#101010]/10 p-6">
              <h3 className="text-[16px] font-medium text-[#101010]">
                Pre-Seed to Seed
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Extend runway by 2-3 months without raising. Every dollar counts
                when you're bootstrapping to product-market fit.
              </p>
              <div className="mt-4 text-[13px] text-[#1B29FF]">
                Average: $500K treasury → +$20K/year
              </div>
            </div>

            <div className="bg-white border border-[#101010]/10 p-6">
              <h3 className="text-[16px] font-medium text-[#101010]">
                Series A to B
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Optimize burn while scaling. Higher yields mean more
                experiments, more hires, or simply more time to hit metrics.
              </p>
              <div className="mt-4 text-[13px] text-[#1B29FF]">
                Average: $2M treasury → +$80K/year
              </div>
            </div>

            <div className="bg-white border border-[#101010]/10 p-6">
              <h3 className="text-[16px] font-medium text-[#101010]">
                Growth Stage
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Significant yield on large treasuries. An extra $200K+ annually
                funds entire initiatives without touching principal.
              </p>
              <div className="mt-4 text-[13px] text-[#1B29FF]">
                Average: $5M+ treasury → +$200K/year
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-12 sm:py-16 border-b border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            Traction
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            Trusted by Ambitious Startups
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-4 gap-px bg-[#101010]/10">
            <div className="bg-white p-6 text-center">
              <div className="text-[32px] leading-none font-medium tabular-nums text-[#1B29FF]">
                $1M+
              </div>
              <div className="mt-2 text-[13px] text-[#101010]/60">
                LOIs in 7 days
              </div>
            </div>
            <div className="bg-white p-6 text-center">
              <div className="text-[32px] leading-none font-medium tabular-nums text-[#1B29FF]">
                2
              </div>
              <div className="mt-2 text-[13px] text-[#101010]/60">
                YC companies onboarded
              </div>
            </div>
            <div className="bg-white p-6 text-center">
              <div className="text-[32px] leading-none font-medium tabular-nums text-[#1B29FF]">
                50+
              </div>
              <div className="mt-2 text-[13px] text-[#101010]/60">
                Startups interviewed
              </div>
            </div>
            <div className="bg-white p-6 text-center">
              <div className="text-[32px] leading-none font-medium tabular-nums text-[#1B29FF]">
                $50M
              </div>
              <div className="mt-2 text-[13px] text-[#101010]/60">
                Transaction volume processed
              </div>
            </div>
          </div>

          <div className="mt-10 max-w-[600px] mx-auto">
            <blockquote className="font-serif text-[20px] leading-[1.4] text-[#101010] text-center">
              "The best DeFi apps don't look like DeFi at all. 0 Finance made
              crypto yields accessible without the complexity."
            </blockquote>
            <cite className="mt-4 block text-[13px] text-[#101010]/60 text-center not-italic">
              — YC Founder, Fintech
            </cite>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1B29FF] py-12 sm:py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-[36px] sm:text-[48px] leading-[1.1] text-white">
            Your Treasury Deserves Better Than 4%
          </h2>
          <p className="mt-4 text-[16px] text-white/90 max-w-[50ch] mx-auto">
            Join startups earning 8% on their idle cash. Full banking features,
            no minimums, setup in minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/signin"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-[#1B29FF] bg-white hover:bg-white/90 rounded-md transition-colors"
            >
              Open Your Account →
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white border-2 border-white hover:bg-white/10 rounded-md transition-colors"
            >
              Compare Options
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
