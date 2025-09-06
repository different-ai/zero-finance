'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  const runwayExtension = runway0Finance - runwayCurrent;
  const extraYearlyYield = treasury * 0.08 - treasury * (currentYield / 100);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#F6F5EF] border-b border-[#101010]/10 py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.18em] text-[12px] font-medium text-[#101010]/70 text-center">
            Interactive Calculator
          </p>
          <h1 className="mt-3 font-serif text-[36px] sm:text-[48px] lg:text-[56px] leading-[0.96] tracking-[-0.015em] text-[#101010] text-center">
            Calculate Your Runway Extension
          </h1>
          <p className="mt-6 text-[16px] leading-[1.5] text-[#222] max-w-[65ch] mx-auto text-center">
            See exactly how much runway you'd gain by earning 8% instead of your
            current yield. Adjust the numbers to match your situation.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h2 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70 mb-6">
                Your Numbers
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[14px] font-medium text-[#101010] mb-2">
                    Current Treasury
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#101010]/60">
                      $
                    </span>
                    <input
                      type="number"
                      value={treasury}
                      onChange={(e) => setTreasury(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-[#101010]/10 bg-white text-[16px] tabular-nums focus:border-[#1B29FF] focus:outline-none transition-colors"
                      step="100000"
                    />
                  </div>
                  <p className="mt-1 text-[12px] text-[#101010]/60">
                    Your total cash balance
                  </p>
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#101010] mb-2">
                    Monthly Burn Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#101010]/60">
                      $
                    </span>
                    <input
                      type="number"
                      value={monthlyBurn}
                      onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-[#101010]/10 bg-white text-[16px] tabular-nums focus:border-[#1B29FF] focus:outline-none transition-colors"
                      step="10000"
                    />
                  </div>
                  <p className="mt-1 text-[12px] text-[#101010]/60">
                    Your monthly operating expenses
                  </p>
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#101010] mb-2">
                    Current Yield (APY)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={currentYield}
                      onChange={(e) => setCurrentYield(Number(e.target.value))}
                      className="w-full pr-8 pl-4 py-3 border border-[#101010]/10 bg-white text-[16px] tabular-nums focus:border-[#1B29FF] focus:outline-none transition-colors"
                      step="0.5"
                      min="0"
                      max="10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#101010]/60">
                      %
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-[#101010]/60">
                    What you're earning now (Mercury = 4%, Banks = 0.5%)
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-px bg-[#101010]/10">
                <button
                  onClick={() => {
                    setTreasury(500000);
                    setMonthlyBurn(50000);
                    setCurrentYield(4);
                  }}
                  className="bg-white p-3 text-[13px] text-[#101010] hover:bg-[#F7F7F2] transition-colors"
                >
                  Seed Stage
                </button>
                <button
                  onClick={() => {
                    setTreasury(2000000);
                    setMonthlyBurn(150000);
                    setCurrentYield(4);
                  }}
                  className="bg-white p-3 text-[13px] text-[#101010] hover:bg-[#F7F7F2] transition-colors"
                >
                  Series A
                </button>
                <button
                  onClick={() => {
                    setTreasury(5000000);
                    setMonthlyBurn(300000);
                    setCurrentYield(4);
                  }}
                  className="bg-white p-3 text-[13px] text-[#101010] hover:bg-[#F7F7F2] transition-colors"
                >
                  Growth
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <h2 className="uppercase tracking-[0.14em] text-[13px] text-[#101010]/70 mb-6">
                Your Results
              </h2>

              <div className="space-y-4">
                {/* Current Situation */}
                <div className="border border-[#101010]/10 bg-white">
                  <div className="p-4 border-b border-[#101010]/10">
                    <h3 className="text-[14px] font-medium text-[#101010]/70">
                      Current Situation ({currentYield}% yield)
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#101010]/60">Monthly yield:</span>
                      <span className="tabular-nums">
                        $
                        {monthlyYieldCurrent.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#101010]/60">Net burn:</span>
                      <span className="tabular-nums text-[#FF4444]">
                        -$
                        {netBurnCurrent.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#101010]/10">
                      <div className="text-[24px] font-medium tabular-nums text-[#101010]">
                        {runwayCurrent.toFixed(1)} months
                      </div>
                      <div className="text-[12px] text-[#101010]/60">
                        runway
                      </div>
                    </div>
                  </div>
                </div>

                {/* With 0 Finance */}
                <div className="border border-[#1B29FF]/20 bg-white">
                  <div className="p-4 border-b border-[#1B29FF]/20 bg-[#1B29FF]/5">
                    <h3 className="text-[14px] font-medium text-[#1B29FF]">
                      With 0 Finance (8% yield)
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#101010]/60">Monthly yield:</span>
                      <span className="tabular-nums text-[#1B29FF]">
                        $
                        {monthlyYield0Finance.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#101010]/60">Net burn:</span>
                      <span className="tabular-nums text-[#1B29FF]">
                        -$
                        {netBurn0Finance.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#101010]/10">
                      <div className="text-[24px] font-medium tabular-nums text-[#1B29FF]">
                        {runway0Finance.toFixed(1)} months
                      </div>
                      <div className="text-[12px] text-[#101010]/60">
                        extended runway
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extension Summary */}
                <div className="bg-[#1B29FF] text-white p-6 rounded-lg">
                  <div className="text-[32px] leading-none font-medium">
                    +{runwayExtension.toFixed(1)} months
                  </div>
                  <p className="mt-2 text-[14px] text-white/90">
                    runway extension
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-[13px] text-white/80">
                      That's{' '}
                      <span className="font-medium text-white">
                        $
                        {extraYearlyYield.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}
                      </span>{' '}
                      extra per year
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-12 border border-[#101010]/10 bg-white">
            <div className="p-4 bg-[#F7F7F2] border-b border-[#101010]/10">
              <h3 className="text-[14px] font-medium text-[#101010]">
                Detailed Comparison
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#101010]/10">
                    <th className="text-left p-4 font-medium text-[#101010]/70">
                      Metric
                    </th>
                    <th className="text-right p-4 font-medium text-[#101010]/70">
                      Current ({currentYield}%)
                    </th>
                    <th className="text-right p-4 font-medium text-[#1B29FF]">
                      0 Finance (8%)
                    </th>
                    <th className="text-right p-4 font-medium text-[#1B29FF]">
                      Difference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#101010]/5">
                    <td className="p-4 text-[#101010]/70">Annual Yield</td>
                    <td className="p-4 text-right tabular-nums">
                      $
                      {((treasury * currentYield) / 100).toLocaleString(
                        'en-US',
                        { maximumFractionDigits: 0 },
                      )}
                    </td>
                    <td className="p-4 text-right tabular-nums">
                      $
                      {(treasury * 0.08).toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="p-4 text-right tabular-nums font-medium text-[#1B29FF]">
                      +$
                      {extraYearlyYield.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                  <tr className="border-b border-[#101010]/5">
                    <td className="p-4 text-[#101010]/70">Monthly Yield</td>
                    <td className="p-4 text-right tabular-nums">
                      $
                      {monthlyYieldCurrent.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="p-4 text-right tabular-nums">
                      $
                      {monthlyYield0Finance.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="p-4 text-right tabular-nums font-medium text-[#1B29FF]">
                      +$
                      {(
                        monthlyYield0Finance - monthlyYieldCurrent
                      ).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                  <tr className="border-b border-[#101010]/5">
                    <td className="p-4 text-[#101010]/70">Net Monthly Burn</td>
                    <td className="p-4 text-right tabular-nums">
                      $
                      {netBurnCurrent.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="p-4 text-right tabular-nums">
                      $
                      {netBurn0Finance.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="p-4 text-right tabular-nums font-medium text-[#1B29FF]">
                      -$
                      {(netBurnCurrent - netBurn0Finance).toLocaleString(
                        'en-US',
                        { maximumFractionDigits: 0 },
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#101010]">
                      Runway (months)
                    </td>
                    <td className="p-4 text-right tabular-nums font-medium">
                      {runwayCurrent.toFixed(1)}
                    </td>
                    <td className="p-4 text-right tabular-nums font-medium">
                      {runway0Finance.toFixed(1)}
                    </td>
                    <td className="p-4 text-right tabular-nums font-bold text-[#1B29FF]">
                      +{runwayExtension.toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1B29FF] py-12 sm:py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.1] text-white">
            Ready to Extend Your Runway?
          </h2>
          <p className="mt-4 text-[16px] text-white/90 max-w-[50ch] mx-auto">
            Stop leaving money on the table. Open an account in 5 minutes and
            start earning 8% on your treasury.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/signin"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-[#1B29FF] bg-white hover:bg-white/90 rounded-md transition-colors"
            >
              Open Account Now →
            </Link>
            <Link
              href="/high-yield-startup-savings"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white border-2 border-white hover:bg-white/10 rounded-md transition-colors"
            >
              Learn More
            </Link>
          </div>
          <p className="mt-6 text-[13px] text-white/70">
            $1M+ in LOIs secured in our first week
          </p>
        </div>
      </section>
    </>
  );
}
