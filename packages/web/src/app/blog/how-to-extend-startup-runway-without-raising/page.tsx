import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema, FAQSchema } from '@/components/SEO/SchemaMarkup';

export const metadata: Metadata = {
  title:
    'How to Extend Your Startup Runway Without Raising Capital | 0 Finance',
  description:
    'Learn 5 proven strategies to add 3-6 months to your startup runway without dilution. Optimize treasury yield, reduce burn, and survive longer.',
  keywords:
    'extend startup runway, increase runway without raising, startup burn rate optimization, treasury yield optimization',
  openGraph: {
    title: 'How to Extend Your Startup Runway Without Raising Capital',
    description: 'Add 3-6 months to your runway with these proven strategies',
    type: 'article',
  },
};

const faqs = [
  {
    question: 'How much runway can I add by optimizing treasury yield?',
    answer:
      'By moving from 4% to 8% yield, a startup with $2M in treasury and $150K monthly burn can add approximately 0.7 months of runway. Larger treasuries see even bigger gains.',
  },
  {
    question: 'What is the fastest way to extend runway?',
    answer:
      'The fastest way is optimizing your treasury yield. Unlike cutting costs which takes time to implement, you can switch to a higher-yield account like 0 Finance in just 5 minutes.',
  },
  {
    question: 'Is earning 8% on treasury safe for startups?',
    answer:
      '0 Finance provides smart contract insurance (up to $1M coverage via Chainproof, a licensed insurer) on the 8% yield, protecting against technical risks. While not FDIC insured, it offers protection against the primary risks in DeFi infrastructure.',
  },
];

export default function ExtendRunwayBlogPost() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://0.finance' },
          { name: 'Blog', url: 'https://0.finance/blog' },
          {
            name: 'How to Extend Runway',
            url: 'https://0.finance/blog/how-to-extend-startup-runway-without-raising',
          },
        ]}
      />
      <FAQSchema faqs={faqs} />

      <article className="bg-white">
        {/* Hero */}
        <header className="bg-[#F6F5EF] border-b border-[#101010]/10 py-12 sm:py-16">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/blog"
                className="text-[12px] text-[#101010]/60 hover:text-[#1B29FF]"
              >
                ← Back to Blog
              </Link>
              <span className="text-[12px] text-[#101010]/40">•</span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#1B29FF]">
                Runway Management
              </span>
            </div>

            <h1 className="font-serif text-[32px] sm:text-[48px] leading-[1.1] tracking-[-0.015em] text-[#101010]">
              How to Extend Your Startup Runway Without Raising Capital
            </h1>

            <div className="mt-6 flex items-center gap-4 text-[13px] text-[#101010]/60">
              <time>January 6, 2025</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-[18px] leading-[1.6] text-[#101010] font-medium">
              Every founder knows the runway calculation by heart: cash divided
              by burn rate equals months until zero. But what if you could add
              3-6 months without raising a dollar?
            </p>

            <p className="text-[16px] leading-[1.6] text-[#101010]/80 mt-6">
              After analyzing data from 50+ startups, we've identified five
              strategies that consistently extend runway without dilution. The
              best part? You can implement most of them next week.
            </p>

            <h2 className="font-serif text-[28px] mt-12 mb-4 text-[#101010]">
              1. Optimize Your Treasury Yield (Fastest Impact)
            </h2>

            <p className="text-[16px] leading-[1.6] text-[#101010]/80">
              This is the lowest-hanging fruit that most founders miss. If your
              startup has $2M in the bank earning 4% (or worse, 0.5% at a
              traditional bank), you're essentially burning an extra $80,000 per
              year.
            </p>

            <div className="bg-[#F6F5EF] border border-[#101010]/10 p-6 my-8">
              <h3 className="text-[14px] uppercase tracking-[0.14em] text-[#101010]/60 mb-3">
                Real Example
              </h3>
              <ul className="space-y-2 text-[15px] text-[#101010]/80">
                <li>• Treasury: $2,000,000</li>
                <li>• Monthly burn: $150,000</li>
                <li>• Current yield (4%): $6,667/month</li>
                <li>• Optimized yield (8%): $13,333/month</li>
                <li className="font-medium text-[#1B29FF]">
                  • Runway extension: +0.7 months
                </li>
              </ul>
            </div>

            <p className="text-[16px] leading-[1.6] text-[#101010]/80">
              Platforms like{' '}
              <Link href="/" className="text-[#1B29FF] hover:underline">
                0 Finance
              </Link>{' '}
              offer 8% yields with smart contract insurance (up to $1M coverage
              via a licensed insurer), effectively doubling what you'd get from
              Mercury Treasury or Brex.
            </p>

            <h2 className="font-serif text-[28px] mt-12 mb-4 text-[#101010]">
              2. Renegotiate Your Largest Vendors
            </h2>

            <p className="text-[16px] leading-[1.6] text-[#101010]/80">
              Your top 3-5 vendors likely represent 60-80% of your non-payroll
              burn. Schedule calls with each next week. The magic words: "We're
              optimizing spend across all vendors. Can you help us out with
              pricing?"
            </p>

            <ul className="mt-4 space-y-2 text-[15px] text-[#101010]/80">
              <li>
                • AWS/Cloud: Ask for startup credits or reserved instance
                pricing
              </li>
              <li>
                • SaaS tools: Request annual discounts (usually 20-30% off)
              </li>
              <li>
                • Office space: Negotiate reduced rent or sublease unused space
              </li>
            </ul>

            <h2 className="font-serif text-[28px] mt-12 mb-4 text-[#101010]">
              3. Implement a Hiring Freeze (With Exceptions)
            </h2>

            <p className="text-[16px] leading-[1.6] text-[#101010]/80">
              Before your next hire, ask: "Will this person directly increase
              revenue or dramatically reduce costs?" If the answer isn't an
              obvious yes, wait. Most startups can operate 20% leaner without
              impacting growth.
            </p>

            <h2 className="font-serif text-[28px] mt-12 mb-4 text-[#101010]">
              4. Convert Fixed Costs to Variable
            </h2>

            <p className="text-[16px] leading-[1.6] text-[#101010]/80">
              Look at every fixed monthly cost and ask if it could be
              usage-based instead:
            </p>

            <ul className="mt-4 space-y-2 text-[15px] text-[#101010]/80">
              <li>• Full-time contractors → Project-based work</li>
              <li>• Monthly retainers → Pay-per-deliverable</li>
              <li>• Fixed software seats → Usage-based pricing</li>
            </ul>

            <h2 className="font-serif text-[28px] mt-12 mb-4 text-[#101010]">
              5. Accelerate Revenue Collection
            </h2>

            <p className="text-[16px] leading-[1.6] text-[#101010]/80">
              If you have any customers on net-30 or net-60 terms, offer a 2%
              discount for immediate payment. For annual contracts, offer 10-15%
              off for upfront payment. This can add 1-2 months of runway
              instantly.
            </p>

            {/* Comparison Table */}
            <div className="my-12 overflow-x-auto">
              <table className="w-full text-[14px] border border-[#101010]/10">
                <thead>
                  <tr className="bg-[#F6F5EF]">
                    <th className="text-left p-4 font-medium text-[#101010]">
                      Strategy
                    </th>
                    <th className="text-center p-4 font-medium text-[#101010]">
                      Implementation Time
                    </th>
                    <th className="text-center p-4 font-medium text-[#101010]">
                      Runway Impact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#101010]/10">
                    <td className="p-4">Optimize Treasury Yield</td>
                    <td className="p-4 text-center">5 minutes</td>
                    <td className="p-4 text-center text-[#1B29FF] font-medium">
                      +0.5-1 month
                    </td>
                  </tr>
                  <tr className="border-t border-[#101010]/10">
                    <td className="p-4">Renegotiate Vendors</td>
                    <td className="p-4 text-center">1 week</td>
                    <td className="p-4 text-center">+1-2 months</td>
                  </tr>
                  <tr className="border-t border-[#101010]/10">
                    <td className="p-4">Hiring Freeze</td>
                    <td className="p-4 text-center">Immediate</td>
                    <td className="p-4 text-center">+2-3 months</td>
                  </tr>
                  <tr className="border-t border-[#101010]/10">
                    <td className="p-4">Variable Costs</td>
                    <td className="p-4 text-center">2 weeks</td>
                    <td className="p-4 text-center">+0.5-1 month</td>
                  </tr>
                  <tr className="border-t border-[#101010]/10">
                    <td className="p-4">Accelerate Revenue</td>
                    <td className="p-4 text-center">1 week</td>
                    <td className="p-4 text-center">+1-2 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-serif text-[28px] mt-12 mb-4 text-[#101010]">
              The Compound Effect
            </h2>

            <p className="text-[16px] leading-[1.6] text-[#101010]/80">
              Implementing all five strategies can realistically add 4-6 months
              to your runway. That's the difference between running out of cash
              in a down market versus reaching profitability or your next
              funding milestone.
            </p>

            <div className="bg-[#1B29FF] text-white p-8 my-12 rounded-lg">
              <h3 className="font-serif text-[24px] mb-3">
                Start With the Easiest Win
              </h3>
              <p className="text-[15px] text-white/90 mb-6">
                Optimizing your treasury yield takes 5 minutes and immediately
                extends runway. Calculate exactly how much runway you'd gain
                with our free tool.
              </p>
              <Link
                href="/runway-calculator"
                className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-[#1B29FF] bg-white hover:bg-white/90 rounded-md transition-colors"
              >
                Calculate Your Runway Extension →
              </Link>
            </div>

            <h2 className="font-serif text-[28px] mt-12 mb-4 text-[#101010]">
              Frequently Asked Questions
            </h2>

            {faqs.map((faq, index) => (
              <div
                key={index}
                className="mb-6 pb-6 border-b border-[#101010]/10 last:border-0"
              >
                <h3 className="text-[16px] font-medium text-[#101010] mb-2">
                  {faq.question}
                </h3>
                <p className="text-[15px] text-[#101010]/70">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Author Box */}
          <div className="mt-12 p-6 bg-[#F6F5EF] border border-[#101010]/10">
            <p className="text-[12px] uppercase tracking-[0.14em] text-[#101010]/60 mb-3">
              About 0 Finance
            </p>
            <p className="text-[14px] text-[#101010]/80">
              0 Finance helps startups earn 8% on their treasury with smart
              contract insurance. No minimums, instant withdrawals, full banking
              features.{' '}
              <Link href="/" className="text-[#1B29FF] hover:underline">
                Learn more →
              </Link>
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
