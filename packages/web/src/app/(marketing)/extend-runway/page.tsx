import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Calculator,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Clock className="h-4 w-4" />
            <span>No Dilution Required</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Add{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              6 Months
            </span>{' '}
            to Your Runway
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Without raising a dollar. Your treasury earning 4% less than it
            could is the same as burning extra cash every month.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Calculate Your Extra Runway
                <Calculator className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#runway-math">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                See the Math
              </Button>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  $2M
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Average startup treasury
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">+$80K</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Extra per year at 8% vs 4%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Math Section */}
      <section
        id="runway-math"
        className="container mx-auto px-4 py-20 border-t"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Runway Extension Math
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">
                Your Current Situation
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Cash in bank:
                    </span>
                    <span className="font-semibold">$2,000,000</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Monthly burn:
                    </span>
                    <span className="font-semibold">$150,000</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Current yield (4%):
                    </span>
                    <span className="font-semibold">$6,667/mo</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Net burn:</span>
                    <span className="font-bold text-red-600">-$143,333/mo</span>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    13.9 months
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current runway
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">
                With 0 Finance (8% APY)
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Cash in bank:
                    </span>
                    <span className="font-semibold">$2,000,000</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Monthly burn:
                    </span>
                    <span className="font-semibold">$150,000</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      0 Finance yield (8%):
                    </span>
                    <span className="font-semibold text-green-600">
                      $13,333/mo
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Net burn:</span>
                    <span className="font-bold text-green-600">
                      -$136,667/mo
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    14.6 months
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Extended runway
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-2xl text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              +0.7 months runway
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              That's 3 extra weeks to hit your next milestone without dilution
            </p>
          </div>
        </div>
      </section>

      {/* Scenarios Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Runway Extension by Treasury Size
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 mb-2">$500K Treasury</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                +$20K/year
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    At $50K burn:
                  </span>
                  <span className="font-semibold">+0.4 months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    At $100K burn:
                  </span>
                  <span className="font-semibold">+0.2 months</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-sm text-blue-600 mb-2">$2M Treasury</div>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                +$80K/year
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    At $150K burn:
                  </span>
                  <span className="font-semibold">+0.7 months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    At $200K burn:
                  </span>
                  <span className="font-semibold">+0.4 months</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 mb-2">$5M Treasury</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                +$200K/year
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    At $300K burn:
                  </span>
                  <span className="font-semibold">+0.8 months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    At $500K burn:
                  </span>
                  <span className="font-semibold">+0.4 months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Every Month Counts for Startups
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Hit Your Next Milestone
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Extra runway means reaching product-market fit or the next
                    revenue milestone before raising.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Raise at Better Terms</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    More traction = higher valuation. That extra month could
                    mean 20% less dilution.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Weather Market Downturns
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    When funding dries up, companies with longer runways
                    survive. Don't be caught short.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Real Founder Math</h3>
              <blockquote className="italic text-gray-600 dark:text-gray-400 mb-4">
                "We had 10 months runway at 4% yield. Switching to 0 Finance
                gave us an extra month. That month let us close two enterprise
                deals before our Series A, increasing our valuation by $5M."
              </blockquote>
              <div className="text-sm font-semibold">
                — Series A Founder, B2B SaaS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Calculate Your Exact Runway Extension
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              See how much runway you'd gain with your specific treasury and
              burn rate
            </p>
            <Link href="/runway-calculator">
              <Button size="lg" variant="secondary">
                Use Our Runway Calculator
                <Calculator className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stop Burning Extra Cash on Low Yields
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Every day at 4% instead of 8% is money left on the table. Your
            investors expect better.
          </p>
          <Link href="/signup">
            <Button size="lg">
              Extend Your Runway Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Takes 5 minutes. No minimums. Same-day setup.
          </p>
        </div>
      </section>
    </div>
  );
}
