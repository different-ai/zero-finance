'use client';

import { getCompanies } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const companies = getCompanies();

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

  return (
    <div className="min-h-screen bg-bg-cream">
      {/* Hero Section */}
      <section className="relative bg-bg-warm border-b border-[#101010]/10 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-blue/5 rounded-full filter blur-3xl animate-pulse-slow"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <p className="uppercase tracking-[0.18em] text-[12px] text-[#101010]/70 animate-fade-in">
              By Zero Finance
            </p>
            <h1 className="mt-3 font-serif text-[48px] sm:text-[64px] lg:text-[88px] leading-[0.96] tracking-[-0.015em] text-[#101010] animate-slide-up">
              We Love Your{' '}
              <span className="text-primary-blue italic">Startup</span>
            </h1>
            <p
              className="mt-6 max-w-[65ch] mx-auto text-[16px] sm:text-[18px] leading-[1.5] text-[#101010]/80 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              A curated directory of founders we admire. See how much their idle
              cash could be earning with Zero Finance's 8% APY savings accounts.
            </p>

            <div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                href="https://0.finance"
                className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white bg-primary-blue hover:bg-primary-blue-hover rounded-md transition-all hover:scale-105"
              >
                Open Zero Account →
              </Link>
              <a
                href="#directory"
                className="inline-flex items-center text-[15px] text-[#101010] hover:text-primary-blue underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-primary-blue transition-colors"
              >
                Browse Startups
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Startup */}
      {companies
        .filter((c) => c.showcase?.featured)
        .sort((a, b) => (a.publishedDate && b.publishedDate ? new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime() : 0))
        .map((company, index) => (
          <section key={company.id} className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                Featured Startup 🌟• Published {company.publishedDate}
              </p>
              {index === 0 ? (
                <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                  next week's Highlight
                </h2>
              ) : (
                <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]/80">
                  Previously Featured
                </h2>
              )}

              <div className="mt-8 bg-bg-warm border border-[#101010]/10 p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={`${company.name} Logo`}
                        width={32}
                        height={32}
                        className="mt-1"
                        style={{ color: 'transparent' }}
                      />
                    )}
                    <div>
                      <h3 className="text-[24px] font-medium text-[#101010]">
                        {company.name}
                      </h3>
                      <p className="mt-2 text-[14px] text-[#101010]/70 max-w-[45ch]">
                        {company.description}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary-blue/10 text-primary-blue text-[12px] font-medium rounded-full">
                    {company.category}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                      Founders
                    </p>
                    <div className="mt-2 space-y-2">
                      {company.founders.map((founder) => (
                        <div
                          key={founder.id}
                          className="flex items-center gap-2"
                        >
                          {founder.avatar && (
                            <Image
                              src={founder.avatar}
                              alt={founder.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          )}
                          <a
                            href={founder.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] text-[#101010] hover:text-primary-blue transition-colors"
                          >
                            {founder.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                      Funding
                    </p>
                    <p className="mt-1 text-[20px] font-medium text-primary-blue tabular-nums">
                      {formatCurrency(company.funding.amount)}
                    </p>
                    <p className="text-[12px] text-[#101010]/60">
                      {company.funding.round} • {company.funding.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                      Potential Savings
                    </p>
                    <p className="mt-1 text-[20px] font-medium text-[#1B29FF] tabular-nums">
                      +
                      {formatCurrency(calculateSavings(company.funding.amount))}
                    </p>
                    <p className="text-[12px] text-[#101010]/60">
                      per year with Zero
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <Link
                    href={`/startups/${company.id}`}
                    className="inline-flex items-center px-4 py-2 text-[14px] font-medium text-white bg-primary-blue hover:bg-primary-blue-hover rounded-md transition-colors"
                  >
                    View Full Profile →
                  </Link>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-[14px] font-medium text-primary-blue border border-primary-blue hover:bg-primary-blue hover:text-white rounded-md transition-colors"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}

      {/* All Startups Directory */}
      <section id="directory" className="bg-bg-warm py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            Directory
          </p>
          <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            All Startups We Love
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#101010]/10">
            {companies.map((startup) => (
              <Link
                key={startup.id}
                href={`/startups/${startup.id}`}
                className="bg-white p-6 hover:bg-bg-cream transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {startup.logo && (
                      <img
                        src={startup.logo}
                        alt={`${startup.name} Logo`}
                        width={20}
                        height={20}
                        style={{ color: 'transparent' }}
                      />
                    )}
                    <h3 className="text-[18px] font-medium text-[#101010] group-hover:text-primary-blue transition-colors">
                      {startup.name}
                    </h3>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                    {startup.category}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-[#101010]/70 line-clamp-2">
                  {startup.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[14px] font-medium text-primary-blue tabular-nums">
                    {formatCurrency(startup.funding.amount)}
                  </span>
                  <span className="text-[12px] text-[#101010]/60">
                    {startup.funding.round}
                  </span>
                </div>
                <div className="mt-3 text-[11px] text-[#101010]/50">
                  Could save{' '}
                  {formatCurrency(calculateSavings(startup.funding.amount))}
                  /year
                </div>
              </Link>
            ))}
          </div>

          {companies.length === 1 && (
            <div className="mt-8 text-center">
              <p className="text-[14px] text-[#101010]/60">
                More amazing startups coming soon! 🚀
              </p>
              <a
                href="https://x.com/0dotfinance"
                className="mt-2 inline-flex items-center text-[14px] text-primary-blue hover:underline"
              >
                Nominate a startup on X →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-12 sm:py-16 border-t border-[#101010]/10">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Your Startup Could Be Next
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] leading-[1.5] text-[#101010]/80 max-w-[55ch] mx-auto">
            Join the growing list of startups earning 8% APY on their idle cash.
            Stop leaving money on the table.
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
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#101010]/10 bg-gradient-to-b from-white via-[#f7f8ff] to-[#eef2ff]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Image
                src="/images/new-logo-bluer.png"
                alt="Zero Finance logo"
                width={64}
                height={64}
                className="h-12 w-auto drop-shadow-sm"
              />
              <div>
                <p className="text-[14px] text-[#101010] flex items-center gap-1">
                  Built with <span className="text-primary-blue">💙</span> by{' '}
                  <a
                    href="https://0.finance"
                    className="font-semibold text-primary-blue hover:underline decoration-2 underline-offset-[4px]"
                  >
                    0 Finance
                  </a>
                </p>
                <p className="text-[13px] text-[#101010]/70 mt-1">
                  Helping startups make the most of their runway.
                </p>
              </div>
            </div>
            <nav className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-[14px] text-[#101010]/80">
              <a
                href="https://0.finance"
                className="hover:text-primary-blue transition-colors"
              >
                0 Finance
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
                Book a Demo
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
