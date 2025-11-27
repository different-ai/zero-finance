import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare 0 Finance vs Banks, ETFs, Stocks | Treasury Options',
  description:
    'Compare 0 Finance 8% yield against Mercury, Brex, traditional banks, money market ETFs, T-Bills, and stocks. See which treasury option is best for your startup.',
  keywords:
    '0 finance vs mercury, startup treasury comparison, high yield vs etfs, business savings comparison',
};

export default function CompareExtendedPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Hero Section */}
      <section className="bg-[#F6F5EF] border-b border-[#101010]/10 py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.18em] text-[12px] font-medium text-[#101010]/70 text-center">
            Complete Comparison
          </p>
          <h1 className="mt-3 font-serif text-[36px] sm:text-[48px] lg:text-[56px] leading-[0.96] tracking-[-0.015em] text-[#101010] text-center">
            Every Treasury Option, Side by Side
          </h1>
          <p className="mt-6 text-[16px] leading-[1.5] text-[#222] max-w-[65ch] mx-auto text-center">
            From traditional banks to ETFs to stocks - see how 0 Finance's 8%
            yield compares to every option for your startup's treasury.
          </p>
        </div>
      </section>

      {/* Key Insight Boxes */}
      <section className="bg-white py-8 border-b border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#101010]/10">
            <div className="bg-white p-6">
              <h3 className="text-[14px] font-medium text-[#1B29FF]">
                Best Yield + Safety
              </h3>
              <p className="mt-2 font-serif text-[24px] text-[#101010]">
                0 Finance: 8%
              </p>
              <p className="mt-1 text-[13px] text-[#101010]/60">
                From DeFi yields. We insure the underlying funds.
              </p>
            </div>
            <div className="bg-white p-6">
              <h3 className="text-[14px] font-medium text-[#101010]/60">
                Traditional Safe
              </h3>
              <p className="mt-2 font-serif text-[24px] text-[#101010]">
                T-Bills: 5.3%
              </p>
              <p className="mt-1 text-[13px] text-[#101010]/60">
                Government backed, requires brokerage
              </p>
            </div>
            <div className="bg-white p-6">
              <h3 className="text-[14px] font-medium text-[#FF4444]">
                High Risk
              </h3>
              <p className="mt-2 font-serif text-[24px] text-[#101010]">
                S&P 500: ~10%
              </p>
              <p className="mt-1 text-[13px] text-[#101010]/60">
                Can lose 30%+ in bad years
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Comparison Table */}
      <section className="py-12 bg-[#F7F7F2]">
        <div className="max-w-[1400px] mx-auto px-4">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 mb-4">
            Detailed Comparison
          </p>

          <div className="overflow-x-auto bg-white border border-[#101010]/10">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#101010]/10">
                  <th className="text-left p-4 font-medium bg-[#F7F7F2] sticky left-0">
                    Option
                  </th>
                  <th className="p-4 text-center bg-[#1B29FF] text-white min-w-[120px]">
                    <div className="font-bold">0 Finance</div>
                    <div className="text-[11px] opacity-90">DeFi Banking</div>
                  </th>
                  <th className="p-4 text-center min-w-[120px]">
                    <div>Mercury</div>
                    <div className="text-[11px] text-[#101010]/60">
                      Treasury
                    </div>
                  </th>
                  <th className="p-4 text-center min-w-[120px]">
                    <div>Brex</div>
                    <div className="text-[11px] text-[#101010]/60">Cash</div>
                  </th>
                  <th className="p-4 text-center min-w-[120px]">
                    <div>Chase</div>
                    <div className="text-[11px] text-[#101010]/60">
                      Business
                    </div>
                  </th>
                  <th className="p-4 text-center min-w-[120px]">
                    <div>VMFXX</div>
                    <div className="text-[11px] text-[#101010]/60">
                      Money Market ETF
                    </div>
                  </th>
                  <th className="p-4 text-center min-w-[120px]">
                    <div>T-Bills</div>
                    <div className="text-[11px] text-[#101010]/60">3-month</div>
                  </th>
                  <th className="p-4 text-center min-w-[120px]">
                    <div>SPY</div>
                    <div className="text-[11px] text-[#101010]/60">
                      S&P 500 ETF
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Yield Section */}
                <tr className="bg-[#F7F7F2]">
                  <td
                    colSpan={8}
                    className="p-3 font-medium uppercase tracking-wider text-[11px] text-[#101010]/60"
                  >
                    Yield & Returns
                  </td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Annual Yield
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <span className="font-bold text-[#1B29FF]">8%</span>
                  </td>
                  <td className="p-4 text-center">4%</td>
                  <td className="p-4 text-center">4.5%</td>
                  <td className="p-4 text-center text-[#FF4444]">0.5%</td>
                  <td className="p-4 text-center">5.2%</td>
                  <td className="p-4 text-center">5.3%</td>
                  <td className="p-4 text-center">~10%*</td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    On $1M (Annual)
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <span className="font-bold text-[#1B29FF]">$80,000</span>
                  </td>
                  <td className="p-4 text-center">$40,000</td>
                  <td className="p-4 text-center">$45,000</td>
                  <td className="p-4 text-center text-[#FF4444]">$5,000</td>
                  <td className="p-4 text-center">$52,000</td>
                  <td className="p-4 text-center">$53,000</td>
                  <td className="p-4 text-center">~$100,000*</td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Volatility
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <span className="text-[#1B29FF]">Low</span>
                  </td>
                  <td className="p-4 text-center">None</td>
                  <td className="p-4 text-center">None</td>
                  <td className="p-4 text-center">None</td>
                  <td className="p-4 text-center">Very Low</td>
                  <td className="p-4 text-center">Low</td>
                  <td className="p-4 text-center text-[#FF4444]">Very High</td>
                </tr>
                <tr className="border-b border-[#101010]/10">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Worst Year Risk
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">-2%**</td>
                  <td className="p-4 text-center">0%</td>
                  <td className="p-4 text-center">0%</td>
                  <td className="p-4 text-center">0%</td>
                  <td className="p-4 text-center">0%</td>
                  <td className="p-4 text-center">0%</td>
                  <td className="p-4 text-center text-[#FF4444]">-37%</td>
                </tr>

                {/* Access Section */}
                <tr className="bg-[#F7F7F2]">
                  <td
                    colSpan={8}
                    className="p-3 font-medium uppercase tracking-wider text-[11px] text-[#101010]/60"
                  >
                    Access & Requirements
                  </td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Minimum
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <span className="font-bold text-[#1B29FF]">$0</span>
                  </td>
                  <td className="p-4 text-center text-[#FF4444]">$100,000</td>
                  <td className="p-4 text-center">$0</td>
                  <td className="p-4 text-center">$1,500</td>
                  <td className="p-4 text-center">$1</td>
                  <td className="p-4 text-center">$1,000</td>
                  <td className="p-4 text-center">$1</td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Setup Time
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <span className="font-bold text-[#1B29FF]">5 min</span>
                  </td>
                  <td className="p-4 text-center">2-3 days</td>
                  <td className="p-4 text-center">1-2 days</td>
                  <td className="p-4 text-center">5-10 days</td>
                  <td className="p-4 text-center">1 day***</td>
                  <td className="p-4 text-center">1 day***</td>
                  <td className="p-4 text-center">1 day***</td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Withdrawal Speed
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <span className="font-bold text-[#1B29FF]">Instant</span>
                  </td>
                  <td className="p-4 text-center">1-2 days</td>
                  <td className="p-4 text-center">1-2 days</td>
                  <td className="p-4 text-center">Instant</td>
                  <td className="p-4 text-center">T+1</td>
                  <td className="p-4 text-center">T+1</td>
                  <td className="p-4 text-center">T+2</td>
                </tr>
                <tr className="border-b border-[#101010]/10">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Lockup
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <Check className="w-4 h-4 text-[#1B29FF] mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-4 h-4 text-[#FF4444] mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                </tr>

                {/* Features Section */}
                <tr className="bg-[#F7F7F2]">
                  <td
                    colSpan={8}
                    className="p-3 font-medium uppercase tracking-wider text-[11px] text-[#101010]/60"
                  >
                    Banking Features
                  </td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Corporate Cards
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <Check className="w-4 h-4 text-[#1B29FF] mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    ACH/Wire
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <Check className="w-4 h-4 text-[#1B29FF] mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-[#101010]/10">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Multi-currency
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <span className="text-[11px] font-medium">
                      USD/EUR/USDC
                    </span>
                  </td>
                  <td className="p-4 text-center">USD</td>
                  <td className="p-4 text-center">USD</td>
                  <td className="p-4 text-center">Multi</td>
                  <td className="p-4 text-center">USD</td>
                  <td className="p-4 text-center">USD</td>
                  <td className="p-4 text-center">USD</td>
                </tr>

                {/* Protection Section */}
                <tr className="bg-[#F7F7F2]">
                  <td
                    colSpan={8}
                    className="p-3 font-medium uppercase tracking-wider text-[11px] text-[#101010]/60"
                  >
                    Protection & Insurance
                  </td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Insurance Type
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <span className="text-[11px]">Smart Contract</span>
                  </td>
                  <td className="p-4 text-center">FDIC</td>
                  <td className="p-4 text-center">FDIC</td>
                  <td className="p-4 text-center">FDIC</td>
                  <td className="p-4 text-center">SIPC</td>
                  <td className="p-4 text-center">Gov Backed</td>
                  <td className="p-4 text-center">SIPC</td>
                </tr>
                <tr className="border-b border-[#101010]/10">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Principal Risk
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">Very Low</td>
                  <td className="p-4 text-center">None</td>
                  <td className="p-4 text-center">None</td>
                  <td className="p-4 text-center">None</td>
                  <td className="p-4 text-center">Very Low</td>
                  <td className="p-4 text-center">None</td>
                  <td className="p-4 text-center text-[#FF4444]">High</td>
                </tr>

                {/* Tax Section */}
                <tr className="bg-[#F7F7F2]">
                  <td
                    colSpan={8}
                    className="p-3 font-medium uppercase tracking-wider text-[11px] text-[#101010]/60"
                  >
                    Tax & Compliance
                  </td>
                </tr>
                <tr className="border-b border-[#101010]/5">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Tax Forms
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">1099-INT</td>
                  <td className="p-4 text-center">1099-INT</td>
                  <td className="p-4 text-center">1099-INT</td>
                  <td className="p-4 text-center">1099-INT</td>
                  <td className="p-4 text-center">1099-DIV</td>
                  <td className="p-4 text-center">1099-INT</td>
                  <td className="p-4 text-center">1099-B</td>
                </tr>
                <tr className="border-b border-[#101010]/10">
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Tax Complexity
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">Simple</td>
                  <td className="p-4 text-center">Simple</td>
                  <td className="p-4 text-center">Simple</td>
                  <td className="p-4 text-center">Simple</td>
                  <td className="p-4 text-center">Moderate</td>
                  <td className="p-4 text-center">Simple</td>
                  <td className="p-4 text-center text-[#FF4444]">Complex</td>
                </tr>

                {/* Best For Section */}
                <tr className="bg-[#F7F7F2]">
                  <td
                    colSpan={8}
                    className="p-3 font-medium uppercase tracking-wider text-[11px] text-[#101010]/60"
                  >
                    Best For
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium sticky left-0 bg-white">
                    Ideal Use Case
                  </td>
                  <td className="p-4 text-center bg-[#1B29FF]/5">
                    <span className="text-[11px] font-medium">
                      Operating Cash + Max Yield
                    </span>
                  </td>
                  <td className="p-4 text-center text-[11px]">
                    Large Balances
                  </td>
                  <td className="p-4 text-center text-[11px]">Expense Mgmt</td>
                  <td className="p-4 text-center text-[11px]">
                    Traditional Ops
                  </td>
                  <td className="p-4 text-center text-[11px]">Parking Cash</td>
                  <td className="p-4 text-center text-[11px]">
                    Risk-Free Yield
                  </td>
                  <td className="p-4 text-center text-[11px]">
                    Long-term Growth
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#101010]/10 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#101010]/60 mt-0.5" />
                <div>
                  <p className="text-[12px] font-medium text-[#101010]">
                    * Historical Average
                  </p>
                  <p className="text-[11px] text-[#101010]/60 mt-1">
                    S&P 500 returns vary widely. Past performance doesn't
                    guarantee future results.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#101010]/10 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#101010]/60 mt-0.5" />
                <div>
                  <p className="text-[12px] font-medium text-[#101010]">
                    ** Smart Contract Risk
                  </p>
                  <p className="text-[11px] text-[#101010]/60 mt-1">
                    Covered by insurance (up to $1M via licensed insurer) but
                    not FDIC. Theoretical protocol risk exists.{' '}
                    <a
                      href="/legal/insurance-terms"
                      className="text-[#1B29FF] underline"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#101010]/10 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#101010]/60 mt-0.5" />
                <div>
                  <p className="text-[12px] font-medium text-[#101010]">
                    *** Requires Brokerage
                  </p>
                  <p className="text-[11px] text-[#101010]/60 mt-1">
                    ETFs and stocks need a separate brokerage account setup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Decision Guide */}
      <section className="bg-white border-y border-[#101010]/10 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 text-center">
            Quick Guide
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010] text-center">
            Which Option Is Right for You?
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-[#1B29FF] p-6 rounded-lg">
              <h3 className="font-medium text-[16px] text-[#1B29FF]">
                Choose 0 Finance If:
              </h3>
              <ul className="mt-4 space-y-2 text-[14px] text-[#101010]/80">
                <li>• You want maximum yield on operating cash</li>
                <li>• You need banking features (cards, ACH)</li>
                <li>• You're comfortable with smart contract insurance</li>
                <li>• You want instant access to funds</li>
              </ul>
            </div>

            <div className="border border-[#101010]/20 p-6 rounded-lg">
              <h3 className="font-medium text-[16px] text-[#101010]">
                Choose Traditional Banks If:
              </h3>
              <ul className="mt-4 space-y-2 text-[14px] text-[#101010]/80">
                <li>• You prioritize FDIC insurance above yield</li>
                <li>• You have complex banking needs</li>
                <li>• You're okay with minimal returns</li>
                <li>• You need physical branch access</li>
              </ul>
            </div>

            <div className="border border-[#101010]/20 p-6 rounded-lg">
              <h3 className="font-medium text-[16px] text-[#101010]">
                Choose ETFs/Stocks If:
              </h3>
              <ul className="mt-4 space-y-2 text-[14px] text-[#101010]/80">
                <li>• This is long-term capital (5+ years)</li>
                <li>• You can handle 30%+ drawdowns</li>
                <li>• You don't need banking features</li>
                <li>• You want potential for higher returns</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1B29FF] py-12 sm:py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.1] text-white">
            Stop Choosing Between Yield and Access
          </h2>
          <p className="mt-4 text-[16px] text-white/90 max-w-[50ch] mx-auto">
            Get 8% yield with the banking features you need. No lockups, no
            minimums, no complexity.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/signin"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-[#1B29FF] bg-white hover:bg-white/90 rounded-md transition-colors"
            >
              Open Account in 5 Minutes →
            </Link>
            <Link
              href="/runway-calculator"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white border-2 border-white hover:bg-white/10 rounded-md transition-colors"
            >
              Calculate Your Extra Runway
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
