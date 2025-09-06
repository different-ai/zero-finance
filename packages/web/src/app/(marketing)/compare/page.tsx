import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, X } from 'lucide-react';

export const metadata: Metadata = {
  title: '0 Finance vs Mercury vs Brex - Treasury Account Comparison',
  description:
    "Compare 0 Finance's 8% yield treasury account to Mercury Treasury and Brex Cash. See why startups are switching for double the yield.",
  keywords:
    '0 finance vs mercury, 0 finance vs brex, treasury account comparison, startup banking comparison',
  openGraph: {
    title: '0 Finance vs Mercury vs Brex | Treasury Comparison',
    description:
      '8% yield vs 4%. Zero minimums vs $100K. See why startups choose 0 Finance.',
  },
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            0 Finance vs{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              The Competition
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            See why ambitious startups choose 0 Finance over Mercury Treasury
            and Brex Cash
          </p>
        </div>
      </section>

      {/* Main Comparison Table */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-6 px-6 bg-gray-50 dark:bg-gray-900"></th>
                    <th className="text-center py-6 px-6 bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
                      <div className="font-bold text-xl">0 Finance</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Recommended
                      </div>
                    </th>
                    <th className="text-center py-6 px-6 bg-gray-50 dark:bg-gray-900">
                      <div className="font-bold text-xl">Mercury</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Treasury
                      </div>
                    </th>
                    <th className="text-center py-6 px-6 bg-gray-50 dark:bg-gray-900">
                      <div className="font-bold text-xl">Brex</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Cash
                      </div>
                    </th>
                    <th className="text-center py-6 px-6 bg-gray-50 dark:bg-gray-900">
                      <div className="font-bold text-xl">Traditional Bank</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Chase, BoA, etc
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Yield Section */}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td
                      colSpan={5}
                      className="py-4 px-6 bg-gray-50 dark:bg-gray-900 font-semibold text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400"
                    >
                      Yield & Returns
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6 font-medium">
                      Annual Yield (APY)
                    </td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <span className="text-2xl font-bold text-green-600">
                        8%
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="text-xl font-semibold">4.81%</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="text-xl font-semibold">4.58%</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="text-xl font-semibold text-red-600">
                        0.5%
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6 font-medium">
                      Earnings on $2M/year
                    </td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <span className="font-bold text-green-600">$160,000</span>
                    </td>
                    <td className="text-center py-4 px-6">$96,200</td>
                    <td className="text-center py-4 px-6">$91,600</td>
                    <td className="text-center py-4 px-6 text-red-600">
                      $10,000
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">
                      Extra runway vs 4%
                    </td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <span className="font-bold text-green-600">
                        +2-3 months
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">—</td>
                    <td className="text-center py-4 px-6">—</td>
                    <td className="text-center py-4 px-6 text-red-600">
                      -6 months
                    </td>
                  </tr>

                  {/* Requirements Section */}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td
                      colSpan={5}
                      className="py-4 px-6 bg-gray-50 dark:bg-gray-900 font-semibold text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400"
                    >
                      Requirements & Limits
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6 font-medium">Minimum Balance</td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <span className="font-bold text-green-600">$0</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="text-red-600">$100,000</span>
                    </td>
                    <td className="text-center py-4 px-6">$0</td>
                    <td className="text-center py-4 px-6">$1,500</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6 font-medium">Withdrawal Limits</td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <Check className="h-5 w-5 text-green-600 inline" />
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        None
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <X className="h-5 w-5 text-red-600 inline" />
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        Limited
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        None
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <X className="h-5 w-5 text-red-600 inline" />
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        6/month
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">Setup Time</td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <span className="font-bold text-green-600">
                        5 minutes
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">1-2 days</td>
                    <td className="text-center py-4 px-6">1-2 days</td>
                    <td className="text-center py-4 px-6">1-2 weeks</td>
                  </tr>

                  {/* Features Section */}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td
                      colSpan={5}
                      className="py-4 px-6 bg-gray-50 dark:bg-gray-900 font-semibold text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400"
                    >
                      Banking Features
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6 font-medium">ACH Transfers</td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6 font-medium">Wire Transfers</td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6 font-medium">Virtual Cards</td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <X className="h-5 w-5 text-red-600 inline" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">API Access</td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <Check className="h-5 w-5 text-green-600 inline" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <X className="h-5 w-5 text-red-600 inline" />
                    </td>
                  </tr>

                  {/* Protection Section */}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td
                      colSpan={5}
                      className="py-4 px-6 bg-gray-50 dark:bg-gray-900 font-semibold text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400"
                    >
                      Protection & Insurance
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6 font-medium">Insurance Type</td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <span className="font-medium">Smart Contract</span>
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        Technical failures
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="font-medium">FDIC</span>
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        Bank failures
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="font-medium">FDIC</span>
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        Bank failures
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="font-medium">FDIC</span>
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        $250K limit
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">Bank Run Risk</td>
                    <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                      <Check className="h-5 w-5 text-green-600 inline" />
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        No banks
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <X className="h-5 w-5 text-yellow-600 inline" />
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        Partner banks
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <X className="h-5 w-5 text-yellow-600 inline" />
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        Partner banks
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <X className="h-5 w-5 text-red-600 inline" />
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        SVB, FRB...
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differences Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Key Differences That Matter
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">
                0 Finance Advantages
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Double the yield:</strong> 8% vs 4% means $80K extra
                    per year on $2M
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>No minimums:</strong> Start earning from your first
                    dollar, not after $100K
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>No bank run risk:</strong> DeFi protocols can't have
                    SVB-style collapses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant setup:</strong> Start earning in 5 minutes,
                    not 2 days
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">
                When to Choose Others
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Mercury:</strong> If you need physical check
                    deposits or are required to use FDIC-insured accounts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Brex:</strong> If you need corporate credit cards
                    with rewards programs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Traditional banks:</strong> If you enjoy waiting in
                    line and earning 0.5%
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Common Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">
                How does 0 Finance achieve 8% yield?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We use battle-tested DeFi protocols like Morpho and Aave that
                consistently yield 10-12%. We pass through 8% to you and keep
                the spread for operations and insurance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                Is it really as safe as Mercury or Brex?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Different risks, similar safety. Mercury/Brex have bank failure
                risk (remember SVB?). We have smart contract risk, which we
                insure against. Both are regulated and compliant.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                Can I switch back if I don't like it?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes. No lock-ups, no penalties. Withdraw anytime via ACH or
                wire. Most startups never switch back once they see the extra
                runway from 8% yields.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                Do I need to understand DeFi to use 0 Finance?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No. We handle all the complexity. You get a familiar banking
                interface with ACH, wires, and virtual cards. The DeFi happens
                invisibly in the background.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Double Your Treasury Yield?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join the YC startups already earning 8% instead of 4%
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary">
                  Switch to 0 Finance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/runway-calculator">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  Calculate Your Extra Runway
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
