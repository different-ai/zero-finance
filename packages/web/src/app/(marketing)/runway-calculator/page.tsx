'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Calculator, TrendingUp } from 'lucide-react';

// export const metadata: Metadata = {
//   title: "Runway Calculator - See Your Extra Months | 0 Finance",
//   description: "Calculate how much runway you'll gain with 8% yield vs 4%. Free startup runway calculator shows months gained from higher treasury yields.",
//   keywords: "startup runway calculator, burn rate calculator, treasury yield calculator, extend runway calculator",
// }

export default function RunwayCalculatorPage() {
  const [treasury, setTreasury] = useState(2000000);
  const [monthlyBurn, setMonthlyBurn] = useState(150000);
  const [currentYield, setCurrentYield] = useState(4);

  // Calculate runway with current yield
  const monthlyYieldCurrent = (treasury * (currentYield / 100)) / 12;
  const netBurnCurrent = monthlyBurn - monthlyYieldCurrent;
  const runwayCurrent = treasury / netBurnCurrent;

  // Calculate runway with 0 Finance (8%)
  const monthlyYield0Finance = (treasury * 0.08) / 12;
  const netBurn0Finance = monthlyBurn - monthlyYield0Finance;
  const runway0Finance = treasury / netBurn0Finance;

  // Calculate the difference
  const runwayDifference = runway0Finance - runwayCurrent;
  const extraYearlyEarnings = treasury * 0.08 - treasury * (currentYield / 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Calculator className="h-4 w-4" />
            <span>Free Runway Calculator</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Calculate Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Extra Runway
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            See exactly how many months you'll gain by earning 8% instead of
            your current yield
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Your Numbers</h2>

              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="treasury"
                    className="text-sm font-medium mb-2 block"
                  >
                    Current Treasury Balance
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="treasury"
                      type="number"
                      value={treasury}
                      onChange={(e) => setTreasury(Number(e.target.value))}
                      className="pl-8"
                      placeholder="2000000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your total cash in bank
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="burn"
                    className="text-sm font-medium mb-2 block"
                  >
                    Monthly Burn Rate
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="burn"
                      type="number"
                      value={monthlyBurn}
                      onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                      className="pl-8"
                      placeholder="150000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total monthly expenses
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="yield"
                    className="text-sm font-medium mb-2 block"
                  >
                    Current APY
                  </Label>
                  <div className="relative">
                    <Input
                      id="yield"
                      type="number"
                      value={currentYield}
                      onChange={(e) => setCurrentYield(Number(e.target.value))}
                      step="0.1"
                      className="pr-8"
                      placeholder="4"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    What you earn now (Mercury ~4.8%)
                  </p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Current Situation */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-600 dark:text-gray-400">
                  Current Situation ({currentYield}% APY)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Monthly yield:
                    </span>
                    <span className="font-semibold">
                      $
                      {monthlyYieldCurrent.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Net burn:
                    </span>
                    <span className="font-semibold text-red-600">
                      -$
                      {netBurnCurrent.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold">Runway:</span>
                      <span className="text-xl font-bold">
                        {runwayCurrent.toFixed(1)} months
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* With 0 Finance */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-2xl p-6 border border-green-200 dark:border-green-700">
                <h3 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-400">
                  With 0 Finance (8% APY)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Monthly yield:
                    </span>
                    <span className="font-semibold text-green-600">
                      $
                      {monthlyYield0Finance.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Net burn:
                    </span>
                    <span className="font-semibold text-green-600">
                      -$
                      {netBurn0Finance.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-green-200 dark:border-green-700">
                    <div className="flex justify-between">
                      <span className="font-semibold">Runway:</span>
                      <span className="text-xl font-bold text-green-600">
                        {runway0Finance.toFixed(1)} months
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Difference */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Your Gain</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold mb-1">
                      +{runwayDifference.toFixed(1)} months
                    </div>
                    <div className="text-blue-100">
                      Extra runway without raising
                    </div>
                  </div>
                  <div className="pt-4 border-t border-blue-500">
                    <div className="text-2xl font-bold mb-1">
                      +$
                      {extraYearlyEarnings.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                      /year
                    </div>
                    <div className="text-blue-100">
                      Extra earnings at 8% vs {currentYield}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What {runwayDifference.toFixed(1)} Extra Months Means
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Hit Your Metrics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Reach that next revenue milestone or user target before
                fundraising
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Better Valuation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {runwayDifference.toFixed(1)} months more traction = 20-30%
                higher valuation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Skip a Round</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Maybe reach profitability without another dilutive fundraise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Add {runwayDifference.toFixed(1)} Months?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            That's $
            {extraYearlyEarnings.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}
            extra per year you're leaving on the table
          </p>
          <Link href="/signup">
            <Button size="lg">
              Start Earning 8% Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            5-minute setup • No minimums • Same-day ACH
          </p>
        </div>
      </section>
    </div>
  );
}
