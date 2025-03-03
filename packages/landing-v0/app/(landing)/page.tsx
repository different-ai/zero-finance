import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Wallet, FileText, CreditCard, BarChart4 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WaitlistForm } from './components/waitlist-form';
import { Suspense } from 'react';
import { Demo } from './demo/demo';
import { IntegrationsGrid } from './components/integrations-grid';
import { enterpriseIntegrations } from './data/integrations';

export const metadata: Metadata = {
  title: 'hyprsqrl - Get Paid. Pay Bills. Make Money Work.',
  description:
    'The all-in-one crypto financial hub for freelancers that collects payments, handles expenses, and maximizes yield on your earnings.',
  openGraph: {
    title: 'hyprsqrl - Get Paid. Pay Bills. Make Money Work.',
    description:
      'The all-in-one crypto financial hub for freelancers that collects payments, handles expenses, and maximizes yield on your earnings.',
  },
};

// Separate any components that use useSearchParams
function MainContent() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center my-20 md:my-28 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text mb-8" data-text="Get Paid. Pay Bills. Make Money Work.">
              Get Paid. Pay Bills. Make Money Work.
            </h1>
            <p className="text-xl md:text-2xl text-secondary mb-16 max-w-3xl mx-auto">
              The all-in-one crypto financial hub for freelancers that collects payments, handles expenses, and maximizes yield on your earnings.
            </p>
          </div>
          
          <div className="w-full max-w-2xl mx-auto">
            <WaitlistForm />
          </div>
        </div>
        <div className="dotted-divider mt-20"></div>
      </section>

      {/* Demo Section */}
      <section className="mb-24 relative">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 gradient-text" data-text="Your Crypto Bank Account">Your Crypto Bank Account</h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            See how hyprsqrl helps freelancers manage their finances with an all-in-one crypto solution
          </p>
        </div>
        <div className="digital-card overflow-hidden relative z-10 bg-white shadow-xl">
          <div className="absolute inset-0 pointer-events-none z-20 digital-effect"></div>
          <div className="glitch-container">
            <div className="p-6 relative">
              <Demo />
            </div>
          </div>
        </div>
        <div className="section-divider mt-16"></div>
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
                  hyprsqrl gives Sarah a smart crypto wallet with AI-powered optimization and a crypto debit card. Now her story is different:
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
                    <p className="text-secondary">Debit card for everyday spending—no conversions needed</p>
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
          <h2 className="text-3xl font-bold mb-6 gradient-text" data-text="How hyprsqrl works">
            How hyprsqrl works
          </h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="framed-content p-6 digital-effect border border-primary/20">
              <div className="mb-6 text-primary">
                <FileText className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Get Paid Easily</h3>
              <p className="text-secondary">Create invoices in seconds and get paid directly to your personal IBAN. AI handles payment tracking and client communications for you.</p>
            </div>
            <div className="framed-content p-6 digital-effect border border-primary/20">
              <div className="mb-6 text-accent">
                <CreditCard className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Spend Anywhere</h3>
              <p className="text-secondary">Use your debit card worldwide with 0% conversion fees. No complicated on/off-ramps—just spend your money wherever you need it.</p>
            </div>
            <div className="framed-content p-6 digital-effect border border-primary/20">
              <div className="mb-6 text-primary">
                <Wallet className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Optimize Yield</h3>
              <p className="text-secondary">AI automatically allocates your idle funds to the highest-yielding opportunities based on your risk preferences and liquidity needs.</p>
            </div>
            <div className="framed-content p-6 digital-effect border border-primary/20">
              <div className="mb-6 text-primary">
                <BarChart4 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Automate Finances</h3>
              <p className="text-secondary">Complete accounting system with expense tracking, tax optimization, and financial reporting—all managed by AI that learns your business.</p>
            </div>
          </div>
        </div>
        <div className="section-divider mt-16"></div>
      </section>

      {/* Testimonials/User Stories */}
      <section className="mb-24 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 gradient-text" data-text="From idle crypto to working capital">
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
        <div className="max-w-md mx-auto framed-content p-8 digital-effect border border-primary/20">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Early Access</h3>
          </div>
          <div className="flex items-end gap-2 mb-8 justify-center">
            <span className="text-5xl font-bold text-primary">$19</span>
            <span className="text-secondary">/month</span>
          </div>
          <ul className="space-y-4 mb-10">
            {[
              'Debit card for everyday spending',
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
          <div className="max-w-sm mx-auto">
            <WaitlistForm />
          </div>
        </div>
        <div className="section-divider mt-16"></div>
      </section>

      {/* Integrations Section */}
      <IntegrationsGrid 
        title="Secure, battle-tested integrations"
        subtitle="We've partnered with leading blockchain protocols to provide a secure and seamless experience"
        integrations={enterpriseIntegrations}
      />

      {/* Final CTA Section */}
      <section className="text-center py-24 relative">
        <div className="framed-content max-w-4xl mx-auto p-12 pb-16 blue-filter border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text accent-break inline-block" data-text="Your Money, Working Hard While You Do">
            Your Money, Working Hard While You Do
          </h2>
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">
            Join the waitlist for early access to your complete crypto financial system.
          </p>
          <div className="w-full max-w-2xl mx-auto mb-12">
            <WaitlistForm />
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