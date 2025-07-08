import React from 'react';
import { FeatureList } from '@/components/landing/feature-list';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Code2, Zap, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic imports to prevent SSR issues
const BankAccountDemo = dynamic(
  () => import('@/components/landing/bank-account-demo').then(mod => ({ default: mod.BankAccountDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[500px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);
const InboxDemo = dynamic(
  () => import('@/components/landing/inbox-demo').then(mod => ({ default: mod.InboxDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[350px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);
const SavingsDemo = dynamic(
  () => import('@/components/landing/savings-demo').then(mod => ({ default: mod.SavingsDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[400px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff]">
      {/* Background Video - Now positioned absolutely to cover header and hero */}
      <div className="absolute inset-x-0 top-0 w-full h-[100vh] overflow-hidden">
        <video
          autoPlay
          // loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        >
          <source
            src="https://cdn.midjourney.com/video/b1844fe8-1f77-48e4-81be-b5918c753e77/2.mp4"
            type="video/mp4"
          />
        </video>
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#dfe7ff]/90" />
      </div>

      {/* Header - Now positioned relative with z-index to appear above video */}
      <header className="relative z-20 w-full px-6 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/new-logo-bluer.png"
              alt="Zero Finance"
              width={64}
              height={64}
              className="w-16 h-16 object-contain rounded-md"
            />
            <span className="text-2xl font-semibold text-[#00225b] tracking-tight">
              finance
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-8">
            <Link
              href="/careers"
              className="text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              Careers
            </Link>
            <Link
              href="https://github.com/different-ai/zero-finance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              Open Source
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Now relative with z-index, no background video */}
      <section className="relative z-10 px-6 lg:px-16 pt-16 pb-24">
        {/* Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Copy */}
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-black tracking-tight mb-4 leading-[1.0]">
              <span className="text-[#0040FF]">Simplify</span> your financial
              stack.
              <br />
              <div className="flex flex-col gap-2 mt-4">
                <div className="text-black text-3xl md:text-4xl font-light  tracking-normal">
                  Get a{' '}
                  <span className="text-[#0040FF] font-semibold italic">
                    USDC
                  </span>{' '}
                  business bank account.
                </div>
                <div className="text-black text-3xl md:text-4xl font-light  tracking-normal">
                  and{' '}
                  <span className="text-orange-600 font-semibold italic">
                    spend less time
                  </span>{' '}
                  on financial admin.
                </div>
              </div>
            </h1>

            {/* Supporting Bullets */}
            <h2 className="text-2xl font-medium text-[#00225b] tracking-tight mb-8 leading-[1.1] mt-4">
              Open a dollar-backed bank account wherever you are in the world,
              spend less time on financial admin with our AI CFO, and park your
              idle cash in our high-yield vault.
            </h2>

            {/* Primary CTA */}
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-10 py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
            >
              Get Started
            </Link>
          </div>

          {/* Right Column - Single Demo */}
          <div className="relative">
            <div className="w-full max-w-[500px] mx-auto shadow-2xl rounded-xl overflow-hidden">
              <BankAccountDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Row */}
      <section className="relative z-10 px-6 lg:px-16 py-20 bg-white/50 backdrop-blur-sm border-y border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Open Source Core */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d1ddff] flex items-center justify-center flex-shrink-0">
              <Code2 className="w-6 h-6 text-[#0050ff]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Open source core
              </h3>
              <p className="text-base text-[#5a6b91]">
                {/* it's mit licensed */}
                MIT licensed. Self-host or one-click deploy
              </p>
            </div>
          </div>

          {/* Yield on Idle */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d1ddff] flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-[#0050ff]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Yield on idle
              </h3>
              <p className="text-base text-[#5a6b91]">
                Surplus USDC auto-parks in short-term T-bill wrappers
              </p>
            </div>
          </div>

          {/* EU + US Coverage */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d1ddff] flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-[#0050ff]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                EU + US coverage
              </h3>
              <p className="text-base text-[#5a6b91]">
                ACH, SEPA, IBAN, sort code—one account for both sides
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Have Today Section */}
      <section className="px-6 lg:px-16 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f1e46] mb-4">
              What you can do today
            </h2>
            <p className="text-xl font-medium text-[#5a6b91] max-w-3xl mx-auto">
              Get an IBAN or ACH account. Send and receive money from anywhere
              in the world. Own USD wherever you are.
            </p>
          </div>

          {/* Three key capabilities demos - 2+1 layout */}
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* First row: Bank + Savings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Own dollars globally */}
              <div className="space-y-4 flex flex-col">
                <h3 className="text-2xl font-semibold text-[#0f1e46]">
                  Own dollars globally
                </h3>
                <p className="text-base text-[#5a6b91]">
                  Send & receive USD from anywhere. Issue invoices or payment
                  links and get paid in seconds.
                </p>
                <div className="shadow-xl rounded-xl overflow-hidden flex-grow">
                  <BankAccountDemo />
                </div>
              </div>

              {/* Save more, effortlessly */}
              <div className="space-y-4 flex flex-col">
                <h3 className="text-2xl font-semibold text-[#0f1e46]">
                  Save more, effortlessly
                </h3>
                <p className="text-base text-[#5a6b91]">
                  Set aside a slice of every deposit into a&nbsp;4–8% APY vault.
                  Your funds stay in self-custody DeFi wrappers.
                </p>
                <div className="shadow-xl rounded-xl overflow-hidden flex-grow">
                  <SavingsDemo />
                </div>
              </div>
            </div>

            {/* Second row: Inbox centered */}
            <div className="flex justify-center">
              {/* Do more with less */}
              <div className="space-y-4 flex flex-col max-w-lg w-full">
                <h3 className="text-2xl font-semibold text-[#0f1e46]">
                  Do more with less
                </h3>
                <p className="text-base text-[#5a6b91]">
                  Our AI&nbsp;Inbox parses invoices & receipts, so you can pay
                  and reconcile in one click.
                </p>
                <div className="shadow-xl rounded-xl overflow-hidden flex-grow">
                  <InboxDemo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature List Section */}
      <section className="px-6 lg:px-16 py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f1e46] mb-4">
              Everything your business needs
            </h2>
            <p className="text-xl font-medium text-[#5a6b91]">
              From global payments to automated accounting, we&apos;ve got you
              covered
            </p>
          </div>

          <FeatureList />
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-6 lg:px-16 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            {/* Secondary CTA */}
            <div className="mt-10">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-10 py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
