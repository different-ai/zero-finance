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
      <section className="text-center my-20 md:my-28 relative">
        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="flex flex-col items-center mb-10">
            <div className="glitch-text mb-8" data-text="The smart crypto bank for freelancers">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text">
                The smart crypto bank for freelancers
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-secondary mb-16 max-w-3xl mx-auto">
              hyprsqrl optimizes your crypto finances, maximizes your earnings, and handles your payments—all powered by AI agents.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-6 relative">
            <div className="pixel-gradient absolute inset-0 -z-10 rounded-3xl"></div>
            <WaitlistForm />
          </div>
        </div>
        <div className="dotted-divider mt-20"></div>
      </section>

      {/* Demo Section */}
      <section className="mb-24 relative">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Your Crypto Bank Account</h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            See how hyprsqrl helps freelancers manage their finances with an all-in-one crypto solution
          </p>
        </div>
        <div className="digital-card overflow-hidden relative z-10 blue-overlay">
          <div className="absolute inset-0 pointer-events-none z-20 digital-effect"></div>
          <Demo />
        </div>
        <div className="dotted-divider mt-16"></div>
      </section>

      {/* Story Section */}
      <section className="mb-24 relative">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            {/* First Part - The Problem */}
            <div className="flex flex-col md:flex-row items-start gap-12">
              <div className="md:w-1/2">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 wavy-underline">
                    Meet Sarah, a crypto freelancer
                  </h2>
                </div>
                <p className="text-secondary mb-6">
                  Sarah just landed a new client paying her 2 ETH per month. She's excited, but now faces a familiar headache:
                </p>
                <div className="pl-4 border-l-2 border-accent mb-8">
                  <p className="text-primary italic">
                    "I have crypto in five different wallets. I can't easily spend it on daily expenses. I know I should be staking it somewhere, but researching DeFi takes hours I don't have. And come tax season? Total nightmare."
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 nostalgic-container p-6 rounded-xl">
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <span className="text-accent text-xl">✗</span>
                    </div>
                    <p className="text-secondary">Can't easily spend crypto on everyday purchases without complex conversions</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <span className="text-accent text-xl">✗</span>
                    </div>
                    <p className="text-secondary">Missing out on yield while crypto sits idle across multiple wallets</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <span className="text-accent text-xl">✗</span>
                    </div>
                    <p className="text-secondary">Spending hours on financial admin instead of billable client work</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Part - The Solution */}
            <div className="flex flex-col md:flex-row-reverse items-start gap-12">
              <div className="md:w-1/2">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 wavy-underline">
                    One crypto bank account<br />with a debit card
                  </h2>
                </div>
                <p className="text-secondary mb-6">
                  hyprsqrl gives Sarah a smart crypto wallet with AI-powered optimization and a Gnosis Pay debit card. Now her story is different:
                </p>
                <div className="pl-4 border-l-2 border-primary mb-8">
                  <p className="text-primary italic">
                    "My crypto earns 8.5% while sitting in my hyprsqrl account. I pay for coffee with my card—it just works. And when tax season comes, everything's organized. I have my life back."
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 nostalgic-container p-6 rounded-xl">
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-secondary">Gnosis Pay debit card for everyday spending—no conversions needed</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-secondary">AI automatically puts idle crypto to work in best yield options</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-secondary">Business operations fully automated, with tax reports ready to go</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dotted-divider mt-16"></div>
      </section>

      {/* How It Works Section */}
      <section className="mb-24 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary accent-break inline-block">
            How hyprsqrl works
          </h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="framed-content p-6 digital-effect">
              <div className="mb-6 text-primary">
                <Wallet className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Smart Crypto Wallet</h3>
              <p className="text-secondary">Your secure multi-chain wallet for storing, sending, and receiving cryptocurrencies—with AI-powered yield optimization that grows your money automatically.</p>
            </div>
            <div className="framed-content p-6 digital-effect">
              <div className="mb-6 text-accent">
                <CreditCard className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Gnosis Pay Debit Card</h3>
              <p className="text-secondary">Spend your crypto anywhere Visa is accepted. No manual conversions or transfers needed. Your crypto stays invested until the moment you swipe.</p>
            </div>
            <div className="framed-content p-6 digital-effect">
              <div className="mb-6 text-primary">
                <BarChart4 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">All-in-One Finance Suite</h3>
              <p className="text-secondary">Handles treasury management, invoicing, payments, expense tracking, and tax reporting—your complete financial system, powered by AI.</p>
            </div>
          </div>
        </div>
        <div className="section-divider mt-16"></div>
      </section>

      {/* Testimonials/User Stories */}
      <section className="mb-24 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary accent-break inline-block">
            From idle crypto to working capital
          </h2>
        </div>
        <div className="max-w-4xl mx-auto framed-content p-8 blue-filter">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-lg italic text-primary relative">
                <span className="absolute -left-2 top-0 text-4xl text-accent opacity-80">"</span>
                I had crypto sitting idle across five different wallets, earning nothing. hyprsqrl consolidated everything, found staking opportunities I didn't know existed, and increased my passive income by 11% while handling all my business finances.
                <span className="absolute -bottom-5 right-0 text-4xl text-accent opacity-80">"</span>
              </p>
              <p className="text-right text-primary font-medium">— Alex, Blockchain Developer</p>
            </div>
            <div className="pt-6 mt-2 border-t border-primary/10">
              <h3 className="text-xl font-semibold mb-6 text-primary">What crypto freelancers get with hyprsqrl:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'AI-powered yield optimization',
                  'Multi-chain crypto management',
                  'DeFi staking & liquidity opportunities',
                  'Automated tax optimization',
                  'Business operations automation',
                  'One-click payment collection'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="section-divider mt-16"></div>
      </section>

      {/* Pricing Section - Simple */}
      <section className="mb-24 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary accent-break inline-block">
            Simple, transparent pricing
          </h2>
        </div>
        <div className="max-w-md mx-auto framed-content p-8 digital-effect">
          <div className="mb-4">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Early Access</h3>
          </div>
          <div className="flex items-end gap-2 mb-8">
            <span className="text-5xl font-bold text-primary">$19</span>
            <span className="text-secondary">/month</span>
          </div>
          <ul className="space-y-4 mb-10">
            {[
              'Gnosis Pay debit card for everyday spending',
              'Smart crypto wallet with yield optimization',
              'Multi-chain support (ETH, Polygon, Solana)',
              'AI treasury management and financial advisor',
              'Automated business operations suite',
              'Tax preparation and reporting tools'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="text-secondary">{feature}</span>
              </li>
            ))}
          </ul>
          <WaitlistForm />
        </div>
        <div className="section-divider mt-16"></div>
      </section>

      {/* Final CTA Section */}
      <section className="text-center py-24 relative">
        <div className="framed-content max-w-4xl mx-auto p-12 pb-16 blue-filter">
          <div className="glitch-text mb-8" data-text="Earn, spend, and grow your crypto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary accent-break inline-block">
              Earn, spend, and grow your crypto
            </h2>
          </div>
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">
            Join the waitlist for early access to your crypto bank account with Gnosis Pay debit card.
          </p>
          <div className="relative mb-12 max-w-md mx-auto">
            <WaitlistForm />
          </div>
          <div className="mt-12 text-sm text-secondary flex flex-col sm:flex-row items-center justify-center gap-4">
            <span>Secured by</span>
            <div className="flex items-center gap-4">
              <span className="text-primary font-medium">Gnosis Pay</span>
              <span className="text-accent font-bold text-xs">•</span>
              <span className="text-primary font-medium">Request Network</span>
              <span className="text-accent font-bold text-xs">•</span>
              <span className="text-primary font-medium">Monerium</span>
            </div>
          </div>
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