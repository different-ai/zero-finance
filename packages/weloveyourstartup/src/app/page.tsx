'use client';

import { getFeaturedCompany, data } from '@/lib/data';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const company = getFeaturedCompany();

  if (!company) {
    return <div>No featured company found</div>;
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateSavings = (amount: number) => {
    const yearlyDifference = amount * 0.08 - amount * 0.04;
    return yearlyDifference;
  };

  const calculateMonthlyYield = (amount: number) => {
    return (amount * 0.08) / 12;
  };

  return (
    <div className="min-h-screen bg-bg-cream">
      {/* Main Showcase Section - Mediar */}
      <section className="relative bg-bg-warm border-b border-[#101010]/10 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-blue/5 rounded-full filter blur-3xl animate-pulse-slow"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Small intro */}
          <div className="text-center mb-12">
            <p className="uppercase tracking-[0.18em] text-[11px] text-[#101010]/60 animate-fade-in">
              We Love Your Startup 💙
            </p>
            <h1 className="mt-2 font-serif text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] tracking-[-0.015em] text-[#101010] animate-slide-up">
              Today's Featured Founder Friends
            </h1>
          </div>

          {/* Mediar Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Company Info */}
            <div className="bg-white border border-[#101010]/10 p-8 lg:p-10 animate-fade-in">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[36px] sm:text-[42px] font-serif text-[#101010] leading-[0.96]">
                    {company.name}
                  </h2>
                  <span className="inline-block mt-2 px-3 py-1 bg-primary-blue/10 text-primary-blue text-[12px] font-medium rounded-full">
                    {company.showcase?.emoji || '🚀'} {company.category}
                  </span>
                </div>
              </div>

              <p className="text-[16px] sm:text-[18px] leading-[1.5] text-[#101010]/80 mb-8">
                {company.description}
              </p>

              {/* Founders */}
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-4">
                  The Brilliant Minds 🧠
                </p>
                <div className="space-y-4">
                  {company.founders.map((founder) => (
                    <div
                      key={founder.id}
                      className="flex items-center gap-4 group"
                    >
                      {founder.avatar && (
                        <Image
                          src={founder.avatar}
                          alt={founder.name}
                          width={56}
                          height={56}
                          className="rounded-full border-2 border-transparent group-hover:border-primary-blue transition-all"
                        />
                      )}
                      <div className="flex-1">
                        <a
                          href={founder.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[18px] font-medium text-[#101010] hover:text-primary-blue transition-colors flex items-center gap-2"
                        >
                          {founder.name}
                          <span className="text-[14px] text-primary-blue">
                            →
                          </span>
                        </a>
                        <p className="text-[14px] text-[#101010]/60">
                          {founder.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-bg-cream border border-[#101010]/10 rounded-md">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                    💰 Funding
                  </p>
                  <p className="mt-1 text-[24px] font-medium text-primary-blue tabular-nums">
                    {formatCurrency(company.funding.amount)}
                  </p>
                  <p className="text-[12px] text-[#101010]/60">
                    {company.funding.round} • {company.funding.date}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                    📈 Could Save/Year
                  </p>
                  <p className="mt-1 text-[24px] font-medium text-[#1B29FF] tabular-nums">
                    +{formatCurrency(calculateSavings(company.funding.amount))}
                  </p>
                  <p className="text-[12px] text-[#101010]/60">
                    with Zero Finance
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="mt-6 flex flex-wrap gap-4">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-[14px] font-medium text-white bg-[#101010] hover:bg-[#101010]/80 rounded-md transition-colors"
                  >
                    Visit Mediar 🌐
                  </a>
                )}
                {company.twitter && (
                  <a
                    href={company.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-[14px] font-medium text-primary-blue border border-primary-blue hover:bg-primary-blue hover:text-white rounded-md transition-colors"
                  >
                    Follow on X 🐦
                  </a>
                )}
              </div>
            </div>

            {/* Right: Interactive Calculator */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white border border-[#101010]/10 p-8 lg:p-10">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-3">
                  🎯 What if Mediar used Zero Finance?
                </p>
                <h3 className="text-[24px] font-serif text-[#101010] mb-6">
                  Calculate Their Potential
                </h3>

                <SavingsCalculator defaultAmount={company.funding.amount} />

                {/* Fun Stats */}
                <div className="mt-8 p-4 bg-primary-blue/5 border border-primary-blue/20 rounded-md">
                  <p className="text-[14px] font-medium text-[#101010] mb-3">
                    💡 With {formatCurrency(company.funding.amount)} earning 8%
                    APY:
                  </p>
                  <ul className="space-y-2 text-[13px] text-[#101010]/80">
                    <li>
                      ☕{' '}
                      {Math.floor(
                        calculateMonthlyYield(company.funding.amount) / 5,
                      )}
                      coffees per month
                    </li>
                    <li>
                      💻{' '}
                      {Math.floor(
                        calculateMonthlyYield(company.funding.amount) / 1500,
                      )}
                      MacBook Pros per year
                    </li>
                    <li>
                      🚀{' '}
                      {Math.floor(
                        calculateSavings(company.funding.amount) / 50000,
                      )}
                      % of a new engineer's salary
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Love Them */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[800px] mx-auto text-center">
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
              Why We Love Mediar ❤️
            </p>
            <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Building the Future of Memory
            </h2>
            <p className="mt-6 text-[16px] sm:text-[18px] leading-[1.5] text-[#101010]/80">
              Mediar is solving a fundamental human problem: our limited memory.
              By capturing everything you see and hear, they're creating a true
              second brain that never forgets. This isn't just another AI
              tool—it's augmented intelligence that makes you superhuman. 🦸
            </p>
            <p className="mt-4 text-[16px] sm:text-[18px] leading-[1.5] text-[#101010]/80">
              With their funding sitting idle in a traditional bank, they're
              missing out on
              <span className="font-medium text-primary-blue">
                {' '}
                {formatCurrency(calculateSavings(company.funding.amount))}
              </span>{' '}
              per year. That's real money that could extend their runway or fund
              new experiments. 💸
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bg-warm py-12 sm:py-16 border-t border-[#101010]/10">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Hey {company.founders.map((f) => f.name.split(' ')[0]).join(' & ')}!
            👋
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] leading-[1.5] text-[#101010]/80 max-w-[55ch] mx-auto">
            Your idle cash could be earning 8% APY instead of 4%. That's an
            extra{' '}
            <span className="font-medium text-primary-blue">
              {formatCurrency(calculateSavings(company.funding.amount))}
            </span>{' '}
            per year to build the future of augmented memory.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://0.finance"
              className="inline-flex items-center px-8 py-4 text-[16px] font-medium text-white bg-primary-blue hover:bg-primary-blue-hover rounded-md transition-all hover:scale-105"
            >
              Start Earning 8% APY →
            </Link>
            <Link
              href="https://cal.com/team/0finance/30"
              className="inline-flex items-center text-[15px] text-[#101010] hover:text-primary-blue underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-primary-blue transition-colors"
            >
              Book a Demo with Zero Finance
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="bg-white py-12 sm:py-16 border-t border-[#101010]/10">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8 text-center">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            Coming Soon 🔜
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            More Amazing Founders
          </h2>
          <p className="mt-4 text-[14px] sm:text-[16px] leading-[1.5] text-[#101010]/60 max-w-[45ch] mx-auto">
            We'll be featuring more incredible startups soon. Know a founder who
            should be here? Let us know!
          </p>
          <a
            href="https://x.com/0dotfinance"
            className="mt-6 inline-flex items-center text-[14px] text-primary-blue hover:underline"
          >
            Nominate a Startup on X →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101010] text-white py-8">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-[14px]">
                Made with 💙 by{' '}
                <a
                  href="https://0.finance"
                  className="text-primary-blue hover:underline"
                >
                  Zero Finance
                </a>
              </p>
              <p className="text-[12px] text-white/60 mt-1">
                Helping startups make the most of their runway.
              </p>
            </div>
            <div className="flex gap-6 text-[14px]">
              <a
                href="https://0.finance"
                className="hover:text-primary-blue transition-colors"
              >
                Zero Finance
              </a>
              <a
                href="https://x.com/0dotfinance"
                className="hover:text-primary-blue transition-colors"
              >
                X (Twitter)
              </a>
              <a
                href="https://cal.com/team/0finance/30"
                className="hover:text-primary-blue transition-colors"
              >
                Book Demo
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
