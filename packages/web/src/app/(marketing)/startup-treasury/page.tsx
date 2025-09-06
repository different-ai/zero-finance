import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Building2,
  CheckCircle,
  Shield,
  TrendingUp,
  X,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Startup Treasury Management - 8% Yield, Zero Complexity | 0 Finance',
  description:
    'Modern treasury management for startups. Earn 8% on idle cash with the same boring banking experience. Built by the Gnosis Pay team.',
  keywords:
    'startup treasury management, startup cash management, business treasury account, startup banking, high yield treasury',
  openGraph: {
    title: 'Treasury Management Built for Startups | 0 Finance',
    description:
      'Stop choosing between safety and yield. Get 8% APY with full insurance and zero DeFi complexity.',
  },
};

export default function StartupTreasuryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Building2 className="h-4 w-4" />
            <span>Built for Ambitious Startups</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Treasury Management That{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Actually Works
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            We turned DeFi's 8% yields into a boring checking account. Same
            Mercury experience, double the yield, full insurance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Open Your Treasury Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Compare to Mercury & Brex
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>8% Target APY</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Smart Contract Insurance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Zero Minimums</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Same-Day Setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Your Treasury Shouldn't Be This Hard
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Startups told us their treasury options all have fatal flaws
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start gap-4">
                <X className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Traditional Banks (SVB, First Republic)
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Remember March 2023? Your "safe" bank can fail. Plus they
                    only yield 0.5%.
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>❌ Bank run risk</span>
                    <span>❌ 0.5% yield</span>
                    <span>❌ Slow wires</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start gap-4">
                <X className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Mercury Treasury (4% yield)
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Better than banks but still leaving money on the table.
                    $100K minimums lock out early startups.
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>❌ Only 4% yield</span>
                    <span>❌ $100K minimum</span>
                    <span>❌ Withdrawal limits</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start gap-4">
                <X className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Money Market Funds / ETFs
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Some founders open brokerage accounts to buy Treasury ETFs.
                    That's not treasury management.
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>❌ Settlement delays</span>
                    <span>❌ Tax complexity</span>
                    <span>❌ Not a bank account</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start gap-4">
                <X className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Raw DeFi Protocols
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    8%+ yields exist but managing wallets, gas fees, and smart
                    contract risk? That's a full-time job.
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>❌ Too complex</span>
                    <span>❌ No insurance</span>
                    <span>❌ Regulatory risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              We Built What Startups Actually Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              After talking to 50+ startups, we built the obvious solution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">8% Target Yield</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We use battle-tested DeFi protocols like Morpho and Aave. You
                get the yield without the complexity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Insured & Compliant
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Smart contract insurance covers technical failures. We handle
                all compliance so you don't have to.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Banking Features</h3>
              <p className="text-gray-600 dark:text-gray-400">
                ACH, wires, virtual cards. Everything you expect from Mercury or
                Brex, but with double the yield.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need, Nothing You Don't
          </h2>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">No Minimum Balance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start earning 8% from your first dollar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Same-Day ACH</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Move money in and out instantly
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Wire Transfers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Domestic and international wires
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Virtual Cards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unlimited virtual cards for online spending
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Smart Contract Insurance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Technical failures covered by Chainproof
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Real-Time Dashboard</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track yield earnings and transactions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">API Access</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Integrate with your existing tools
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Multi-User Access</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Role-based permissions for your team
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Built by the Team That Bridged DeFi & Banking
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              We're not DeFi tourists. We've done this before.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Our Track Record</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Founding team of Gnosis Pay - we scaled it to $50M in annual
                  transaction volume. We know how to bridge DeFi and traditional
                  banking infrastructure.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Why We Built This
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  After talking to 50 startups, we found half are desperately
                  trying to earn yield but their options suck. We built the
                  obvious solution: DeFi yields with banking UX.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Traction in 7 Days</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    LOIs secured:
                  </span>
                  <span className="font-bold text-2xl">$1M+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    YC startups onboarded:
                  </span>
                  <span className="font-bold text-2xl">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Startups interviewed:
                  </span>
                  <span className="font-bold text-2xl">50+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Preview Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How We Stack Up
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4"></th>
                  <th className="text-center py-4 px-4">
                    <div className="font-semibold">0 Finance</div>
                    <div className="text-sm text-gray-500">That's us</div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="font-semibold">Mercury</div>
                    <div className="text-sm text-gray-500">Treasury</div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="font-semibold">Brex</div>
                    <div className="text-sm text-gray-500">Cash</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Yield (APY)</td>
                  <td className="text-center py-4 px-4">
                    <span className="text-green-600 font-semibold">8%</span>
                  </td>
                  <td className="text-center py-4 px-4">4.81%</td>
                  <td className="text-center py-4 px-4">4.58%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Minimum Balance</td>
                  <td className="text-center py-4 px-4">
                    <span className="text-green-600 font-semibold">$0</span>
                  </td>
                  <td className="text-center py-4 px-4">$100K</td>
                  <td className="text-center py-4 px-4">$0</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Insurance</td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 inline" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 inline" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 inline" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Same-day ACH</td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 inline" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 inline" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 inline" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link href="/compare">
              <Button variant="outline">
                See Full Comparison
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Your Treasury Deserves Better Than 4%
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Join the startups already earning double the yield with zero extra
              complexity
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Open Your 8% Treasury Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-purple-200 mt-4">
              5-minute setup • No minimums • Start earning today
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
