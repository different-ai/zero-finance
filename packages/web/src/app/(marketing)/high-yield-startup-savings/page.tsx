import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'High Yield Startup Savings Account - 8% APY | 0 Finance',
  description:
    "Earn 8% on your startup's idle cash with 0 Finance. Double the yield of traditional treasury accounts. Fully insured, zero minimums, Mercury-like experience.",
  keywords:
    'high yield startup savings, startup treasury management, 8% APY business account, startup cash management, high yield business savings',
  openGraph: {
    title: "8% Yield for Your Startup's Cash | 0 Finance",
    description:
      "Stop earning 4% in treasury accounts. Get 8% yield on your startup's idle cash with full insurance and zero minimums.",
  },
};

export default function HighYieldStartupSavingsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#F6F5EF] border-b border-[#101010]/10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.18em] text-[12px] font-medium text-[#101010]/70">
            High Yield Startup Savings
          </p>
          <h1 className="mt-3 font-serif text-[48px] sm:text-[64px] lg:text-[72px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
            Stop Leaving Money on the Table
          </h1>
          <p className="mt-6 text-[18px] leading-[1.5] text-[#222] max-w-[65ch]">
            Earn 8% on your startup's treasury with smart contract insurance -
            double what traditional banks offer. No minimums, no lockups.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Link
              href="/signin"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
            >
              Open Account →
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center text-[15px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
            >
              Compare Options
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
            The Problem
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            The Hidden Cost of Low-Yield Banking
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#101010]/10">
            <div className="bg-white p-6">
              <div className="text-[40px] leading-none font-medium tabular-nums text-[#FF4444]">
                4%
              </div>
              <h3 className="mt-3 text-[16px] font-medium text-[#101010]">
                Mercury Treasury
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                $100K minimum, complex setup, still losing to inflation
              </p>
            </div>
            <div className="bg-white p-6">
              <div className="text-[40px] leading-none font-medium tabular-nums text-[#FF4444]">
                3.5%
              </div>
              <h3 className="mt-3 text-[16px] font-medium text-[#101010]">
                Traditional Banks
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Your money sits idle while VCs expect 10x returns
              </p>
            </div>
            <div className="bg-white p-6">
              <div className="text-[40px] leading-none font-medium tabular-nums text-[#1B29FF]">
                8%
              </div>
              <h3 className="mt-3 text-[16px] font-medium text-[#101010]">
                0 Finance
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Target yield with smart contract insurance, no minimums
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-[#F7F7F2] py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
            The Solution
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            DeFi Yields, Banking Experience
          </h2>
          <p className="mt-4 text-[16px] leading-[1.5] text-[#101010]/80 max-w-[65ch]">
            We turned DeFi into a checking account. Same Mercury-like
            experience, but with double the yield and full insurance coverage.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-[#101010]/10 p-6">
              <h3 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70">
                What You Get
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start text-[14px]">
                  <span className="text-[#1B29FF] mr-3 mt-0.5">✓</span>
                  <span className="text-[#101010]/80">
                    8% target APY with daily compounding
                  </span>
                </li>
                <li className="flex items-start text-[14px]">
                  <span className="text-[#1B29FF] mr-3 mt-0.5">✓</span>
                  <span className="text-[#101010]/80">
                    Smart contract insurance coverage
                  </span>
                </li>
                <li className="flex items-start text-[14px]">
                  <span className="text-[#1B29FF] mr-3 mt-0.5">✓</span>
                  <span className="text-[#101010]/80">
                    No minimum balance requirements
                  </span>
                </li>
                <li className="flex items-start text-[14px]">
                  <span className="text-[#1B29FF] mr-3 mt-0.5">✓</span>
                  <span className="text-[#101010]/80">
                    Instant withdrawals, no lockups
                  </span>
                </li>
                <li className="flex items-start text-[14px]">
                  <span className="text-[#1B29FF] mr-3 mt-0.5">✓</span>
                  <span className="text-[#101010]/80">
                    ACH, wire, and USDC transfers
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#101010]/10 p-6">
              <h3 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70">
                Built by Experts
              </h3>
              <p className="mt-4 text-[14px] leading-[1.5] text-[#101010]/80">
                Our founding team has deep experience in DeFi and traditional
                finance. We've built and scaled fintech products used by
                thousands of businesses worldwide.
              </p>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#101010]/80">
                In just 7 days after our launch, we secured $1M in LOIs from
                both crypto and non-crypto companies, including 2 YC startups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traction Section */}
      <section className="bg-white border-y border-[#101010]/10 py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
            Traction
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Startups Are Already Switching
          </h2>
          <p className="mt-4 text-[16px] text-[#101010]/70">
            In just 7 days after launch
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#101010]/10">
            <div className="bg-white p-6">
              <div className="text-[36px] leading-none font-medium tabular-nums text-[#1B29FF]">
                $1M+
              </div>
              <div className="mt-2 text-[14px] text-[#101010]/60">
                in LOIs secured
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="text-[36px] leading-none font-medium tabular-nums text-[#1B29FF]">
                2
              </div>
              <div className="mt-2 text-[14px] text-[#101010]/60">
                YC startups onboarded
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="text-[36px] leading-none font-medium tabular-nums text-[#1B29FF]">
                50+
              </div>
              <div className="mt-2 text-[14px] text-[#101010]/60">
                startups interviewed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#F7F7F2] py-12 sm:py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            FAQs
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 space-y-px bg-[#101010]/10">
            <div className="bg-white p-6">
              <h3 className="text-[16px] font-medium text-[#101010]">
                Is this actually insured like FDIC?
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                We provide smart contract insurance through Chainproof (a
                licensed insurer), with coverage up to $1M for technical risks
                and exploits. While not FDIC insurance, it protects against the
                primary risks in DeFi infrastructure.{' '}
                <a
                  href="/legal/insurance-terms"
                  className="text-[#1B29FF] underline"
                >
                  Learn more
                </a>
              </p>
            </div>

            <div className="bg-white p-6">
              <h3 className="text-[16px] font-medium text-[#101010]">
                How quickly can I withdraw funds?
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Instant withdrawals with no lockup periods. Wire transfers
                process same-day, ACH takes 1-2 business days, and USDC
                transfers are immediate.
              </p>
            </div>

            <div className="bg-white p-6">
              <h3 className="text-[16px] font-medium text-[#101010]">
                What's the minimum deposit?
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                Zero. Unlike Mercury Treasury's $100K minimum, we have no
                minimum balance requirements. Start earning from your first
                dollar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1B29FF] py-12 sm:py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-[36px] sm:text-[48px] leading-[1.1] text-white">
            The Most Ambitious Founders Make Money on Every Dollar
          </h2>
          <p className="mt-4 text-[16px] text-white/90 max-w-[55ch] mx-auto">
            Stop accepting low yields while your VCs expect 10x returns. Join
            startups earning 8% on their treasury.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/signin"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-[#1B29FF] bg-white hover:bg-white/90 rounded-md transition-colors"
            >
              Open Your Account →
            </Link>
            <Link
              href="https://cal.com/team/0finance/30"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white border-2 border-white hover:bg-white/10 rounded-md transition-colors"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            The Most Ambitious Founders Deserve Better
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Stop leaving money on the table. Your investors expect you to
            maximize every dollar.
          </p>
          <Link href="/signin">
            <Button size="lg">
              Get Started with 0 Finance
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No minimums. No lock-ups. Start earning 8% today.
          </p>
        </div>
      </section>
    </>
  );
}
