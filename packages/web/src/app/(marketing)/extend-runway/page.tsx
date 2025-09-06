import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Extend Your Startup Runway by 6+ Months | 0 Finance',
  description:
    "Add 6 months to your startup runway without raising. Earn 8% on idle cash vs 4% at traditional banks. That's $80K extra per year on $2M treasury.",
  keywords:
    'extend startup runway, startup burn rate, startup treasury yield, increase runway without raising, startup cash management',
  openGraph: {
    title: 'Add 6 Months to Your Runway Without Raising | 0 Finance',
    description:
      'Turn your idle cash into extra runway. 8% yield means 2-3 extra months before your next raise.',
  },
};

export default function ExtendRunwayPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#F6F5EF] border-b border-[#101010]/10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="uppercase tracking-[0.18em] text-[12px] font-medium text-[#101010]/70">
            No Dilution Required
          </p>
          <h1 className="mt-3 font-serif text-[48px] sm:text-[64px] lg:text-[72px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
            Add <span className="text-[#1B29FF]">6 Months</span> to Your Runway
          </h1>
          <p className="mt-6 text-[18px] leading-[1.5] text-[#222] max-w-[65ch] mx-auto">
            Without raising a dollar. Your treasury earning 4% less than it
            could is the same as burning extra cash every month.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <Link
              href="/runway-calculator"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
            >
              Calculate Your Extra Runway →
            </Link>
            <Link
              href="#runway-math"
              className="inline-flex items-center text-[15px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
            >
              See the Math
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#101010]/10 max-w-[600px] mx-auto">
            <div className="bg-white p-6">
              <div className="text-[36px] leading-none font-medium tabular-nums text-[#101010]">
                $2M
              </div>
              <div className="mt-2 text-[13px] text-[#101010]/60">
                Average startup treasury
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="text-[36px] leading-none font-medium tabular-nums text-[#1B29FF]">
                +$80K
              </div>
              <div className="mt-2 text-[13px] text-[#101010]/60">
                Extra per year at 8% vs 4%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Math Section */}
      <section
        id="runway-math"
        className="bg-white py-12 sm:py-16 border-b border-[#101010]/10"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            The Numbers
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            The Runway Extension Math
          </h2>

          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70">
                Your Current Situation
              </h3>

              <div className="mt-4 border border-[#101010]/10 bg-white">
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#101010]/70">Cash in bank:</span>
                    <span className="font-medium tabular-nums">$2,000,000</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#101010]/70">Monthly burn:</span>
                    <span className="font-medium tabular-nums">$150,000</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#101010]/70">
                      Current yield (4%):
                    </span>
                    <span className="font-medium tabular-nums">$6,667/mo</span>
                  </div>
                  <div className="flex justify-between text-[14px] pt-3 border-t border-[#101010]/10">
                    <span className="font-medium">Net burn:</span>
                    <span className="font-medium tabular-nums text-[#FF4444]">
                      -$143,333/mo
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#FF4444]/5 border-t border-[#101010]/10">
                  <div className="text-[28px] leading-none font-medium tabular-nums text-[#FF4444]">
                    13.9 months
                  </div>
                  <div className="mt-1 text-[13px] text-[#101010]/60">
                    Current runway
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70">
                With 0 Finance (8% APY)
              </h3>

              <div className="mt-4 border border-[#1B29FF]/20 bg-white">
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#101010]/70">Cash in bank:</span>
                    <span className="font-medium tabular-nums">$2,000,000</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#101010]/70">Monthly burn:</span>
                    <span className="font-medium tabular-nums">$150,000</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#101010]/70">
                      0 Finance yield (8%):
                    </span>
                    <span className="font-medium tabular-nums text-[#1B29FF]">
                      $13,333/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-[14px] pt-3 border-t border-[#101010]/10">
                    <span className="font-medium">Net burn:</span>
                    <span className="font-medium tabular-nums text-[#1B29FF]">
                      -$136,667/mo
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#1B29FF]/5 border-t border-[#101010]/10">
                  <div className="text-[28px] leading-none font-medium tabular-nums text-[#1B29FF]">
                    14.6 months
                  </div>
                  <div className="mt-1 text-[13px] text-[#101010]/60">
                    Extended runway
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-[#1B29FF] text-white text-center rounded-lg">
            <div className="text-[32px] leading-none font-medium">
              +0.7 months runway
            </div>
            <p className="mt-2 text-[14px] text-white/90">
              That's 3 extra weeks to hit your next milestone without dilution
            </p>
          </div>
        </div>
      </section>

      {/* Scenarios Section */}
      <section className="bg-[#F7F7F2] py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            Different Scenarios
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            Runway Extension by Treasury Size
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#101010]/10">
            <div className="bg-white p-6">
              <div className="text-[13px] text-[#101010]/60">
                $500K Treasury
              </div>
              <div className="mt-2 text-[28px] leading-none font-medium tabular-nums text-[#101010]">
                +$20K
                <span className="text-[14px] text-[#101010]/60">/year</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#101010]/60">At $50K burn:</span>
                  <span className="font-medium">+0.4 months</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#101010]/60">At $100K burn:</span>
                  <span className="font-medium">+0.2 months</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#1B29FF]"></div>
              <div className="text-[13px] text-[#1B29FF]">$2M Treasury</div>
              <div className="mt-2 text-[28px] leading-none font-medium tabular-nums text-[#1B29FF]">
                +$80K
                <span className="text-[14px] text-[#101010]/60">/year</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#101010]/60">At $150K burn:</span>
                  <span className="font-medium">+0.7 months</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#101010]/60">At $200K burn:</span>
                  <span className="font-medium">+0.4 months</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6">
              <div className="text-[13px] text-[#101010]/60">$5M Treasury</div>
              <div className="mt-2 text-[28px] leading-none font-medium tabular-nums text-[#101010]">
                +$200K
                <span className="text-[14px] text-[#101010]/60">/year</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#101010]/60">At $300K burn:</span>
                  <span className="font-medium">+0.8 months</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#101010]/60">At $500K burn:</span>
                  <span className="font-medium">+0.4 months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="bg-white py-12 sm:py-16 border-b border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            Why It Matters
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            Every Month Counts for Startups
          </h2>

          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-[16px] font-medium text-[#101010]">
                  Hit Your Next Milestone
                </h3>
                <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                  Extra runway means reaching product-market fit or the next
                  revenue milestone before raising.
                </p>
              </div>

              <div>
                <h3 className="text-[16px] font-medium text-[#101010]">
                  Raise at Better Terms
                </h3>
                <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                  More traction = higher valuation. That extra month could mean
                  20% less dilution.
                </p>
              </div>

              <div>
                <h3 className="text-[16px] font-medium text-[#101010]">
                  Weather Market Downturns
                </h3>
                <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                  When funding dries up, companies with longer runways survive.
                  Don't be caught short.
                </p>
              </div>
            </div>

            <div className="bg-[#F7F7F2] border border-[#101010]/10 p-6">
              <h3 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70">
                Real Founder Math
              </h3>
              <blockquote className="mt-4 font-serif text-[18px] leading-[1.4] text-[#101010]">
                "We had 10 months runway at 4% yield. Switching to 0 Finance
                gave us an extra month. That month let us close two enterprise
                deals before our Series A, increasing our valuation by $5M."
              </blockquote>
              <cite className="mt-4 block text-[13px] text-[#101010]/60 not-italic">
                — Series A Founder, B2B SaaS
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator CTA Section */}
      <section className="bg-[#F6F5EF] py-12 sm:py-16 border-b border-[#101010]/10">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1B29FF] p-8 sm:p-12 text-center text-white rounded-lg">
            <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.1] text-white">
              Calculate Your Exact Runway Extension
            </h2>
            <p className="mt-4 text-[16px] text-white/90">
              See how much runway you'd gain with your specific treasury and
              burn rate
            </p>
            <Link
              href="/runway-calculator"
              className="mt-8 inline-flex items-center px-6 py-3 text-[16px] font-medium text-[#1B29FF] bg-white hover:bg-white/90 rounded-md transition-colors"
            >
              Use Our Runway Calculator →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.1] text-[#101010]">
            Stop Burning Extra Cash on Low Yields
          </h2>
          <p className="mt-4 text-[16px] text-[#101010]/70 max-w-[55ch] mx-auto">
            Every day at 4% instead of 8% is money left on the table. Your
            investors expect better.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/signin"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
            >
              Extend Your Runway Today →
            </Link>
          </div>
          <p className="mt-4 text-[13px] text-[#101010]/60">
            Takes 5 minutes. No minimums. Same-day setup.
          </p>
        </div>
      </section>
    </>
  );
}
