import {
  ArrowRight,
  Wallet,
  CreditCard,
  Send,
  Receipt,
  TrendingUp,
  Landmark,
  ArrowDownLeft,
  Percent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#f5f7ff] py-20">
      {/* Background elements */}
      <div className="absolute -top-24 -left-10 h-64 w-64 rounded-full bg-[#2038E5]/10 blur-3xl"></div>
      <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#FF4500]/5 blur-3xl"></div>

      <div className="container px-4 md:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center rounded-full border border-[#2038E5]/20 bg-[#2038E5]/5 px-3 py-1 text-sm text-[#2038E5]">
              <Wallet className="mr-1 h-3.5 w-3.5" />
              <span>hyprsqrl</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Get Paid. <span className="text-[#FF4500]">Earn More.</span> Spend Freely.
              </h1>

              <p className="max-w-[600px] text-[#2038E5]/80 md:text-xl">
                A crypto bank account with a <span className="font-bold">real IBAN</span> that turns your salary into a{" "}
                <span className="font-bold">wealth-building engine</span> with 5-10x higher returns than traditional
                banks.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 max-w-sm">
                <Input type="email" placeholder="Your email address" className="h-12 border-[#2038E5]/20" />
              </div>
              <Button size="lg" className="bg-[#2038E5] hover:bg-[#1830c0]">
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-[#2038E5]/60">Join 300+ freelancers already on the waitlist</p>
          </div>

          <div className="relative">
            {/* Main account card */}
            <div className="relative z-10 rounded-xl border border-[#2038E5]/10 bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#2038E5]/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Your Crypto Bank Account</h3>
                  <span className="px-2 py-0.5 bg-[#29D788]/10 rounded-full text-[#29D788] text-sm">8.5% APY</span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Balance with visual earnings breakdown */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm text-[#2038E5]/60">Total Balance</p>
                      <p className="text-3xl font-bold">€14,682.00</p>
                    </div>
                  </div>

                  {/* Visual earnings comparison - Simplified */}
                  <div className="bg-[#f5f7ff] rounded-lg p-4 border border-[#2038E5]/10">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-[#2038E5]/80">This Month's Earnings</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-[#29D788]" />
                        <span className="text-[#29D788] font-medium">+€312.00</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-24 text-xs text-[#2038E5]/60">Your Salary</div>
                        <div className="flex-1 h-6 bg-[#2038E5]/10 rounded flex items-center px-2 text-xs font-medium text-[#2038E5]">
                          €4,250.00
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-24 text-xs text-[#2038E5]/60">hyprsqrl (8.5%)</div>
                        <div className="flex-1 h-6 bg-[#29D788]/10 rounded flex items-center px-2 text-xs font-medium text-[#29D788]">
                          +€30.10 / month
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Statement */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-[#2038E5]/80">Account Statement</p>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-[#2038E5]">
                      View All
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden border-[#2038E5]/10">
                    {/* Salary Deposit with Integrated IBAN Details */}
                    <div className="border-b border-[#2038E5]/10">
                      {/* Main transaction row */}
                      <div className="p-3 flex items-center bg-[#2038E5]/5">
                        <div className="h-8 w-8 rounded-full bg-[#2038E5]/10 flex items-center justify-center text-[#2038E5] mr-3">
                          <ArrowDownLeft className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p className="text-sm font-medium">Salary Deposit</p>
                            <span className="ml-2 px-1.5 py-0.5 bg-[#2038E5]/10 text-[#2038E5] text-xs rounded">IBAN</span>
                          </div>
                          <p className="text-xs text-[#2038E5]/60">Mar 15, 2024</p>
                        </div>
                        <div className="text-[#2038E5] font-medium">+€4,250.00</div>
                      </div>

                      {/* IBAN Details (X-Ray View) */}
                      <div className="px-3 py-2 bg-white border-t border-[#2038E5]/10">
                        <div className="flex items-center pl-11">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <p className="text-xs text-[#2038E5]/60">From: ACME Corp • Reference: MAR2024SALARY</p>
                            </div>
                            <div className="mt-1 text-xs bg-[#f5f7ff] p-1.5 rounded border border-[#2038E5]/20 font-mono">
                              DE89 3704 0044 0532 0130 00
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tax Allocation */}
                    <div className="p-3 border-b border-[#2038E5]/10 flex items-center bg-[#f5f7ff]">
                      <div className="h-8 w-8 rounded-full bg-[#FFC940]/20 flex items-center justify-center text-[#FFC940] mr-3">
                        <Landmark className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium">Tax Allocation</p>
                          <span className="ml-2 px-1.5 py-0.5 bg-[#FFC940]/10 text-[#FFC940] text-xs rounded">
                            Automatic
                          </span>
                        </div>
                        <p className="text-xs text-[#2038E5]/60">Mar 15, 2024</p>
                      </div>
                      <div className="text-[#FFC940] font-medium">-€1,062.50</div>
                    </div>

                    {/* Yield Earned */}
                    <div className="p-3 border-b border-[#2038E5]/10 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#29D788]/10 flex items-center justify-center text-[#29D788] mr-3">
                        <Percent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Yield Earned</p>
                        <p className="text-xs text-[#2038E5]/60">Mar 15-31, 2024</p>
                      </div>
                      <div className="text-[#29D788] font-medium">+€30.10</div>
                    </div>

                    {/* Coffee Shop Transaction */}
                    <div className="p-3 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#2038E5]/10 flex items-center justify-center text-[#2038E5]/60 mr-3">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium">Coffee Shop</p>
                          <span className="ml-2 px-1.5 py-0.5 bg-[#2038E5]/5 text-[#2038E5]/70 text-xs rounded">Card</span>
                        </div>
                        <p className="text-xs text-[#2038E5]/60">Today, 10:45 AM</p>
                      </div>
                      <div className="text-[#2038E5]/80 font-medium">-€4.50</div>
                    </div>
                  </div>
                </div>

                {/* Spending options */}
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="h-auto py-2 flex flex-col items-center gap-1 border-[#2038E5]/20 text-[#2038E5]">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs">Pay</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-2 flex flex-col items-center gap-1 border-[#2038E5]/20 text-[#2038E5]">
                    <Send className="h-4 w-4" />
                    <span className="text-xs">Send</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-2 flex flex-col items-center gap-1 border-[#2038E5]/20 text-[#2038E5]">
                    <Receipt className="h-4 w-4" />
                    <span className="text-xs">Bills</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
