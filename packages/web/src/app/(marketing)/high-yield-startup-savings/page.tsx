import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="h-4 w-4" />
            <span>Double Your Treasury Yield</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            High Yield Savings for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Ambitious Startups
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your startup deserves better than 4% treasury yields. Get 8% APY on
            idle cash with the same boring banking experience you trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Earning 8% Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                8%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Target APY
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                $0
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Minimum Balance
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                100%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Insured
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Your Current Options Suck
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="absolute -top-3 left-6 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                Traditional Banks
              </div>
              <h3 className="text-xl font-semibold mb-2 mt-2">
                Treasury Accounts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Just 4% yield with $100K minimums. Your idle cash is barely
                beating inflation.
              </p>
              <div className="text-2xl font-bold text-red-600">4% APY</div>
            </div>

            <div className="relative p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="absolute -top-3 left-6 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                Risky Workarounds
              </div>
              <h3 className="text-xl font-semibold mb-2 mt-2">ETF Gambling</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Some founders buy ETFs in brokerage accounts. That's not
                treasury management.
              </p>
              <div className="text-2xl font-bold text-red-600">Too Risky</div>
            </div>

            <div className="relative p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="absolute -top-3 left-6 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                DeFi Casino
              </div>
              <h3 className="text-xl font-semibold mb-2 mt-2">Raw DeFi</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                8%+ yields exist in DeFi, but it feels like gambling with
                investor money.
              </p>
              <div className="text-2xl font-bold text-red-600">Too Complex</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section
        id="how-it-works"
        className="container mx-auto px-4 py-20 border-t"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              We Turned DeFi Into a Boring Checking Account
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Same Mercury experience. Double the yield. Full insurance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Smart Contract Insurance
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Technical failures covered. We handle all the DeFi
                      complexity.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Familiar Banking</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      ACH, wires, virtual cards. Everything you expect from
                      Mercury or Brex.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">8% Target Yield</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We use battle-tested DeFi protocols to consistently
                      deliver 8% APY.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Do the Math</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Your treasury balance:
                  </span>
                  <span className="font-semibold">$2,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Traditional bank (4%):
                  </span>
                  <span className="font-semibold">$80,000/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    0 Finance (8%):
                  </span>
                  <span className="font-semibold text-green-600">
                    $160,000/year
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Extra runway:</span>
                    <span className="font-bold text-green-600 text-xl">
                      +$80,000/year
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    That's 2-3 extra months of runway without raising
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traction Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Startups Are Already Switching
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            In just 7 days after launch
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-blue-600 mb-2">$1M+</div>
              <div className="text-gray-600 dark:text-gray-400">
                in LOIs secured
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <div className="text-gray-600 dark:text-gray-400">
                YC startups onboarded
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">
                startups interviewed
              </div>
            </div>
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
          <Link href="/signup">
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
    </div>
  );
}
