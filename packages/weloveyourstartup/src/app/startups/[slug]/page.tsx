import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyById, getCompanies } from '@/lib/data';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return getCompanies().map((company) => ({
    slug: company.id,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const company = getCompanyById(params.slug);

  if (!company) {
    return {
      title: 'Startup Not Found',
    };
  }

  const yearlyDifference =
    company.funding.amount * 0.08 - company.funding.amount * 0.04;
  const formattedSavings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(yearlyDifference);

  return {
    title: `${company.name} - We Love Your Startup | Zero Finance`,
    description: `${company.description} With $${(company.funding.amount / 1000000).toFixed(1)}M in funding, ${company.name} could save ${formattedSavings}/year with Zero Finance's 8% APY.`,
    keywords: [
      company.name,
      company.category,
      'startup',
      'funding',
      'savings',
      'Zero Finance',
      ...company.founders.map((f) => f.name),
    ],
    authors: company.founders.map((f) => ({ name: f.name })),
    openGraph: {
      title: `${company.name} - ${company.tagline}`,
      description: company.description,
      url: `https://weloveyourstartup.com/startups/${params.slug}`,
      siteName: 'We Love Your Startup',
      images: [
        {
          url: `https://weloveyourstartup.com/api/og?company=${params.slug}`,
          width: 1200,
          height: 630,
          alt: `${company.name} - We Love Your Startup`,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company.name} - We Love Your Startup`,
      description: `${company.name} could save ${formattedSavings}/year with Zero Finance`,
      images: [`https://weloveyourstartup.com/api/og?company=${params.slug}`],
    },
    alternates: {
      canonical: `https://weloveyourstartup.com/startups/${params.slug}`,
    },
  };
}

export default function StartupPage({ params }: PageProps) {
  const company = getCompanyById(params.slug);

  if (!company) {
    notFound();
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

  const calculateYearlySavings = (amount: number) => {
    return calculateSavings(amount);
  };

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: company.description,
    url: company.website,
    logo: company.founders[0]?.avatar,
    founders: company.founders.map((founder) => ({
      '@type': 'Person',
      name: founder.name,
      jobTitle: founder.role,
      url: founder.twitter,
      image: founder.avatar,
    })),
    funding: {
      '@type': 'MonetaryAmount',
      value: company.funding.amount,
      currency: 'USD',
    },
    sameAs: [
      company.twitter,
      company.website,
      ...company.founders.map((f) => f.twitter),
    ].filter(Boolean),
  };

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-bg-cream">
        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-[#101010]/10">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-[13px]">
              <Link
                href="/"
                className="text-[#101010]/60 hover:text-primary-blue transition-colors"
              >
                Home
              </Link>
              <span className="text-[#101010]/40">/</span>
              <Link
                href="/#directory"
                className="text-[#101010]/60 hover:text-primary-blue transition-colors"
              >
                Startups
              </Link>
              <span className="text-[#101010]/40">/</span>
              <span className="text-[#101010] font-medium">{company.name}</span>
            </div>
          </div>
        </nav>

        {/* Main Showcase Section */}
        <section className="relative bg-bg-warm border-b border-[#101010]/10 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
            <div
              className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-blue/5 rounded-full filter blur-3xl animate-pulse-slow"
              style={{ animationDelay: '2s' }}
            ></div>
          </div>

          <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Company Info */}
              <div className="bg-white border border-[#101010]/10 p-8 lg:p-10 animate-fade-in">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={`${company.name} Logo`}
                        width={48}
                        height={48}
                        className="mt-2"
                        style={{ color: 'transparent' }}
                      />
                    )}
                    <div>
                      <h1 className="text-[36px] sm:text-[42px] font-serif text-[#101010] leading-[0.96]">
                        {company.name}
                      </h1>
                      <span className="inline-block mt-2 px-3 py-1 bg-primary-blue/10 text-primary-blue text-[12px] font-medium rounded-full">
                        {company.showcase?.emoji || '🚀'} {company.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[16px] sm:text-[18px] leading-[1.5] text-[#101010]/80 mb-8">
                  {company.description}
                </p>

                {/* Founders */}
                <div className="mb-8">
                  <h2 className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-4">
                    The Brilliant Minds 🧠
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {company.founders.map((founder) => (
                      <a
                        key={founder.id}
                        href={founder.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 bg-bg-cream hover:bg-primary-blue/5 rounded-lg transition-all group"
                      >
                        {founder.avatar && (
                          <Image
                            src={founder.avatar}
                            alt={founder.name}
                            width={56}
                            height={56}
                            className="rounded-full border-2 border-white shadow-sm group-hover:shadow-md group-hover:border-primary-blue/20 transition-all"
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-[18px] font-medium text-[#101010] group-hover:text-primary-blue transition-colors">
                            {founder.name}
                          </div>
                          <p className="text-[14px] text-[#101010]/60">
                            {founder.role}
                          </p>
                        </div>
                        <span className="text-[14px] text-primary-blue opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Why We Love Them - Brief */}
                {company.whyWeLoveThem && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary-blue/5 to-primary-blue/10 border border-primary-blue/20 rounded-md">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-primary-blue font-medium mb-2">
                      Why We Love {company.name} ❤️
                    </p>
                    <p className="text-[14px] text-[#101010]/80 leading-relaxed">
                      {company.whyWeLoveThem}
                    </p>
                  </div>
                )}

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
                      +
                      {formatCurrency(calculateSavings(company.funding.amount))}
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
                      Visit {company.name} 🌐
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
              <div
                className="animate-fade-in"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="bg-white border border-[#101010]/10 p-8 lg:p-10">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-3">
                    🎯 What if {company.name} used Zero Finance?
                  </p>
                  <h3 className="text-[24px] font-serif text-[#101010] mb-6">
                    Calculate Their Potential
                  </h3>

                  <SavingsCalculator defaultAmount={company.funding.amount} />

                  {/* Fun Stats */}
                  <div className="mt-8 p-4 bg-primary-blue/5 border border-primary-blue/20 rounded-md">
                    <p className="text-[14px] font-medium text-[#101010] mb-3">
                      💡 With {formatCurrency(company.funding.amount)} earning
                      8% APY:
                    </p>
                    <ul className="space-y-2 text-[13px] text-[#101010]/80">
                      <li>
                        ☕{' '}
                        {Math.floor(
                          calculateMonthlyYield(company.funding.amount) / 5,
                        ).toLocaleString()}{' '}
                        coffees per month
                      </li>
                      <li>
                        💻{' '}
                        {Math.floor(
                          calculateYearlySavings(company.funding.amount) / 3000,
                        )}{' '}
                        MacBook Pros per year
                      </li>
                      <li>
                        🏖️{' '}
                        {Math.floor(
                          calculateMonthlyYield(company.funding.amount) / 5000,
                        )}{' '}
                        team retreats per month
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-bg-warm py-12 sm:py-16 border-t border-[#101010]/10">
          <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Hey{' '}
              {company.founders.map((f) => f.name.split(' ')[0]).join(' & ')}!
              👋
            </h2>
            <p className="mt-4 text-[16px] sm:text-[18px] leading-[1.5] text-[#101010]/80 max-w-[55ch] mx-auto">
              Your idle cash could be earning 8% APY instead of 4%. That's an
              extra{' '}
              <span className="font-medium text-primary-blue">
                {formatCurrency(calculateSavings(company.funding.amount))}
              </span>{' '}
              per year to build the future.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="relative">
                {/* Animated ring behind button */}
                <div className="absolute inset-0 rounded-md bg-primary-blue/20 blur-xl animate-pulse"></div>
                <Link
                  href="https://0.finance"
                  className="relative inline-flex items-center px-8 py-4 text-[16px] font-medium text-white bg-primary-blue hover:bg-primary-blue-hover rounded-md transition-all hover:scale-105 pulse-ring glow-effect"
                >
                  Start Earning 8% APY →
                </Link>
              </div>
              <Link
                href="https://cal.com/team/0finance/30"
                className="inline-flex items-center text-[15px] text-[#101010] hover:text-primary-blue underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-primary-blue transition-colors"
              >
                Book a Demo with Zero Finance
              </Link>
            </div>
          </div>
        </section>

        {/* Browse More */}
        <section className="bg-white py-8 border-t border-[#101010]/10">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-[14px] text-primary-blue hover:underline"
            >
              ← Browse More Startups We Love
            </Link>
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
    </>
  );
}
