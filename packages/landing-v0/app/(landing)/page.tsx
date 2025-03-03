import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Wallet, FileText, CreditCard, BarChart4 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WaitlistForm } from './components/waitlist-form';
import { Suspense } from 'react';
import { Demo } from './demo/demo';

export const metadata: Metadata = {
  title: 'hyprsqrl - Your personal CFO for freelancers',
  description:
    'hyprsqrl creates your invoices, collects payments, and manages your crypto finances—powered by AI agents. The all-in-one crypto bank account that optimizes your financial life.',
  openGraph: {
    title: 'hyprsqrl - Your personal CFO—at your fingertips',
    description:
      'hyprsqrl creates your invoices, collects payments, and manages your crypto finances—powered by AI agents. The all-in-one crypto bank account that optimizes your financial life.',
  },
};

// Separate any components that use useSearchParams
function MainContent() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-24">
        <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white">
          The smart crypto bank for freelancers
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          hyprsqrl optimizes your crypto finances, maximizes your earnings, and handles your payments—all powered by AI agents.
        </p>
        <div className="flex flex-col items-center gap-6">
          <WaitlistForm />
        </div>
      </section>

      {/* Demo Section */}
      <section className="mb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Your crypto bank account</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how hyprsqrl helps freelancers manage their finances with an all-in-one crypto solution
          </p>
        </div>
        <Demo />
      </section>

      {/* Story Section */}
      <section className="mb-24">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            {/* First Part - The Problem */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Meet Sarah, a crypto freelancer.</h2>
                <p className="text-gray-300 mb-4">
                  Sarah just landed a new client paying her 2 ETH per month. She's excited, but now faces a familiar headache:
                </p>
                <p className="text-gray-300">
                  <span className="text-purple-400 font-medium">"I have crypto in five different wallets. I can't easily spend it on daily expenses. I know I should be staking it somewhere, but researching DeFi takes hours I don't have. And come tax season? Total nightmare."</span>
                </p>
              </div>
              <div className="md:w-1/2 bg-gray-900 p-6 rounded-xl border border-gray-800">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mt-1">
                      <span className="text-red-500">✗</span>
                    </div>
                    <p>Can't easily spend crypto on everyday purchases without complex conversions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mt-1">
                      <span className="text-red-500">✗</span>
                    </div>
                    <p>Missing out on yield while crypto sits idle across multiple wallets</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mt-1">
                      <span className="text-red-500">✗</span>
                    </div>
                    <p>Spending hours on financial admin instead of billable client work</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Part - The Solution */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">One crypto bank account.<br />With a debit card that changes everything.</h2>
                <p className="text-gray-300 mb-4">
                  hyprsqrl gives Sarah a smart crypto wallet with AI-powered optimization and a Gnosis Pay debit card. Now her story is different:
                </p>
                <p className="text-gray-300">
                  <span className="text-purple-400 font-medium">"My crypto earns 8.5% while sitting in my hyprsqrl account. I pay for coffee with my card—it just works. And when tax season comes, everything's organized. I have my life back."</span>
                </p>
              </div>
              <div className="md:w-1/2 bg-gray-900 p-6 rounded-xl border border-gray-800">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p>Gnosis Pay debit card for everyday spending—no conversions needed</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p>AI automatically puts idle crypto to work in best yield options</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p>Business operations fully automated, with tax reports ready to go</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">How hyprsqrl works</h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card/50 p-6 rounded-xl border border-gray-800">
              <div className="mb-4 text-purple-500">
                <Wallet className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Crypto Wallet</h3>
              <p className="text-gray-400">Your secure multi-chain wallet for storing, sending, and receiving cryptocurrencies—with AI-powered yield optimization that grows your money automatically.</p>
            </div>
            <div className="bg-card/50 p-6 rounded-xl border border-gray-800">
              <div className="mb-4 text-green-500">
                <CreditCard className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gnosis Pay Debit Card</h3>
              <p className="text-gray-400">Spend your crypto anywhere Visa is accepted. No manual conversions or transfers needed. Your crypto stays invested until the moment you swipe.</p>
            </div>
            <div className="bg-card/50 p-6 rounded-xl border border-gray-800">
              <div className="mb-4 text-blue-500">
                <BarChart4 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">All-in-One Finance Suite</h3>
              <p className="text-gray-400">Handles treasury management, invoicing, payments, expense tracking, and tax reporting—your complete financial system, powered by AI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/User Stories */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">From idle crypto to working capital</h2>
        <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-800">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-lg italic">"I had crypto sitting idle across five different wallets, earning nothing. hyprsqrl consolidated everything, found staking opportunities I didn't know existed, and increased my passive income by 11% while handling all my business finances."</p>
              <p className="text-right text-gray-400">— Alex, Blockchain Developer</p>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-xl font-semibold mb-4">What crypto freelancers get with hyprsqrl:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'AI-powered yield optimization',
                  'Multi-chain crypto management',
                  'DeFi staking & liquidity opportunities',
                  'Automated tax optimization',
                  'Business operations automation',
                  'One-click payment collection'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Simple */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
        <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-xl border border-gray-800">
          <h3 className="text-2xl font-bold mb-2">Early Access</h3>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-3xl font-bold">$19</span>
            <span className="text-gray-400">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            {[
              'Gnosis Pay debit card for everyday spending',
              'Smart crypto wallet with yield optimization',
              'Multi-chain support (ETH, Polygon, Solana)',
              'AI treasury management and financial advisor',
              'Automated business operations suite',
              'Tax preparation and reporting tools'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <WaitlistForm />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="text-center mb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Earn, spend, and grow your crypto
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the waitlist for early access to your crypto bank account with Gnosis Pay debit card.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </div>
  );
}

export default function RootPage() {
  return (
    <Suspense>
      <MainContent />
    </Suspense>
  );
}