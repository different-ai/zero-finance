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
    const yearlyDifference = amount * 0.08 - amount * 0.02;
    return yearlyDifference;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section
        className="relative border-b-2 border-[#00FF00] overflow-hidden"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0, 255, 0, 0.3) 19px, rgba(0, 255, 0, 0.3) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0, 255, 0, 0.3) 19px, rgba(0, 255, 0, 0.3) 20px)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-8 py-20 lg:py-28">
          <div className="text-center">
            <p className="uppercase tracking-widest text-xs text-[#00FF00]/60 font-mono font-bold mb-6">
              [ SYSTEM: STARTUP_DIRECTORY_v2.0 ]
            </p>
            <h1 className="font-mono text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight text-white leading-none mb-4">
              WE_LOVE_YOUR_
              <br />
              <span className="text-[#00FF00]">STARTUP</span>
            </h1>
            <div className="mt-8 border-2 border-[#00FF00] bg-black p-6 max-w-4xl mx-auto">
              <p className="text-white/70 text-base sm:text-lg font-mono leading-relaxed uppercase tracking-wide">
                // A curated directory of founders we admire. See how much their
                idle cash could be earning with Zero Finance's high-yield
                savings at 8% APY — 4x more than traditional banks.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="https://0.finance"
                className="px-8 py-4 text-base font-bold font-mono uppercase tracking-wider bg-[#00FF00] text-black hover:bg-white transition-all border-2 border-[#00FF00] hover:border-white"
              >
                [ ACTION: OPEN_ZERO_ACCOUNT ]
              </Link>
              <a
                href="#directory"
                className="text-base text-white/70 font-mono uppercase tracking-wide hover:text-white transition-colors border-b-2 border-white/30 hover:border-white pb-1"
              >
                {'>> BROWSE_STARTUPS'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Startup */}
      {companies
        .filter((c) => c.showcase?.featured)
        .sort((a, b) =>
          a.publishedDate && b.publishedDate
            ? new Date(b.publishedDate).getTime() -
              new Date(a.publishedDate).getTime()
            : 0,
        )
        .map((company, index) => (
          <section
            key={company.id}
            className="bg-black py-16 sm:py-20 border-b-2 border-[#00FF00]"
          >
            <div className="mx-auto max-w-[1400px] px-8">
              <div className="flex items-center gap-4 mb-8">
                <p className="uppercase tracking-widest text-xs text-[#00FF00]/60 font-mono font-bold">
                  [ FEATURED_STARTUP ] • PUBLISHED: {company.publishedDate}
                </p>
              </div>
              {index === 0 ? (
                <h2 className="font-mono text-3xl sm:text-4xl font-black uppercase tracking-wide text-white mb-8">
                  {'>> NEXT_WEEKS_HIGHLIGHT'}
                </h2>
              ) : (
                <h2 className="font-mono text-3xl sm:text-4xl font-black uppercase tracking-wide text-white/70 mb-8">
                  {'>> PREVIOUSLY_FEATURED'}
                </h2>
              )}

              <div className="border-3 border-[#00FF00] bg-black p-8 sm:p-10 border-2">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={`${company.name} Logo`}
                        // 120x120
                        width={120}
                        height={120}
                        className="border-2 border-[#00FF00]"
                        style={{ color: 'transparent' }}
                      />
                    )}
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-black text-white font-mono uppercase tracking-wide">
                        {company.name.toUpperCase().replace(/\s+/g, '_')}
                      </h3>
                      <p className="mt-3 text-base text-white/60 font-mono max-w-[50ch]">
                        // {company.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-[#00FF00]/20 border-2 border-[#00FF00] text-[#00FF00] text-xs font-mono font-bold uppercase tracking-widest">
                    {company.category.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#00FF00]/30">
                  <div className="bg-black border-2 border-[#00FF00] p-6">
                    <p className="text-xs uppercase tracking-widest text-[#00FF00]/70 font-mono font-bold mb-4">
                      [ DATA: FOUNDERS ]
                    </p>
                    <div className="space-y-3">
                      {company.founders.map((founder) => (
                        <a
                          key={founder.id}
                          href={founder.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 group"
                        >
                          {founder.avatar && (
                            <Image
                              src={founder.avatar}
                              alt={founder.name}
                              width={32}
                              height={32}
                              className="border-2 border-[#00FF00] group-hover:border-white transition-colors"
                            />
                          )}
                          <span className="text-sm text-white/70 font-mono group-hover:text-white transition-colors uppercase">
                            {founder.name.toUpperCase()}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black border-2 border-[#00FF00] p-6">
                    <p className="text-xs uppercase tracking-widest text-[#00FF00]/70 font-mono font-bold mb-4">
                      [ DATA: FUNDING ]
                    </p>
                    <p className="text-3xl font-black text-[#00FF00] font-mono tabular-nums">
                      {formatCurrency(company.funding.amount)}
                    </p>
                    <p className="text-sm text-white/50 font-mono uppercase mt-2">
                      {company.funding.round} / {company.funding.date}
                    </p>
                  </div>

                  <div className="bg-black border-2 border-white p-6">
                    <p className="text-xs uppercase tracking-widest text-white/50 font-mono font-bold mb-4">
                      [ OUTPUT: EXTRA_YIELD ]
                    </p>
                    <p className="text-3xl font-black text-white font-mono tabular-nums">
                      +
                      {formatCurrency(calculateSavings(company.funding.amount))}
                    </p>
                    <p className="text-sm text-white/50 font-mono uppercase mt-2">
                      PER_YEAR_VS_BANKS
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/startups/${company.id}`}
                    className="px-6 py-3 text-sm font-bold font-mono uppercase tracking-wider bg-[#00FF00] text-black hover:bg-white transition-all border-2 border-[#00FF00] hover:border-white text-center"
                  >
                    [ VIEW_FULL_PROFILE ]
                  </Link>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 text-sm font-mono uppercase tracking-wider border-2 border-white/30 text-white/70 hover:border-white hover:text-white hover:bg-white/5 transition-all text-center"
                    >
                      [ VISIT_WEBSITE ]
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}

      {/* All Startups Directory */}
      <section
        id="directory"
        className="bg-black py-16 sm:py-20 border-b-2 border-[#00FF00]"
      >
        <div className="mx-auto max-w-[1400px] px-8">
          <p className="uppercase tracking-widest text-xs text-[#00FF00]/60 font-mono font-bold mb-4">
            [ DATABASE: STARTUP_REGISTRY ]
          </p>
          <h2 className="font-mono text-4xl sm:text-5xl font-black uppercase tracking-wide text-white mb-10">
            ALL_STARTUPS_WE_LOVE
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {companies.map((startup) => (
              <Link
                key={startup.id}
                href={`/startups/${startup.id}`}
                className="bg-black border-2 border-[#00FF00] p-6 hover:bg-[#00FF00]/10 hover:border-white transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {startup.logo && (
                      <img
                        src={startup.logo}
                        alt={`${startup.name} Logo`}
                        width={24}
                        height={24}
                        className="border border-[#00FF00] group-hover:border-white transition-colors"
                        style={{ color: 'transparent' }}
                      />
                    )}
                    <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wide group-hover:text-white transition-colors">
                      {startup.name.toUpperCase()}
                    </h3>
                  </div>
                </div>
                <div className="mb-3 px-2 py-1 bg-[#00FF00]/20 border border-[#00FF00] text-[#00FF00] text-[10px] font-mono font-bold uppercase tracking-widest inline-block">
                  {startup.category.toUpperCase()}
                </div>
                <p className="mt-3 text-sm text-white/60 font-mono line-clamp-2">
                  // {startup.description}
                </p>
                <div className="mt-4 pt-4 border-t border-[#00FF00]/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-white/40 font-mono">
                      FUNDING:
                    </span>
                    <span className="text-base font-bold text-[#00FF00] font-mono tabular-nums">
                      {formatCurrency(startup.funding.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-white/40 font-mono">
                      ROUND:
                    </span>
                    <span className="text-sm text-white/70 font-mono">
                      {startup.funding.round.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <span className="text-[10px] text-white/40 font-mono uppercase tracking-wide">
                      {'>> POTENTIAL_SAVINGS: '}
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {formatCurrency(calculateSavings(startup.funding.amount))}
                      /YR
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {companies.length === 1 && (
            <div className="mt-10 text-center border-2 border-[#00FF00] p-8 bg-black">
              <p className="text-base text-white/70 font-mono uppercase tracking-wide mb-4">
                {'>> MORE_AMAZING_STARTUPS_COMING_SOON'}
              </p>
              <a
                href="https://x.com/0dotfinance"
                className="inline-block px-6 py-3 border-2 border-white/30 text-white/70 font-mono uppercase tracking-wide hover:border-white hover:text-white hover:bg-white/5 transition-all text-sm"
              >
                [ NOMINATE_STARTUP_ON_X ]
              </a>
            </div>
          )}
        </div>
      </section>

      {/* API Access Section */}
      <section className="bg-black py-16 sm:py-20 border-b-2 border-[#00FF00]">
        <div className="mx-auto max-w-[1400px] px-8">
          <p className="uppercase tracking-widest text-xs text-[#00FF00]/60 font-mono font-bold mb-4">
            [ MODULE: API_INFRASTRUCTURE ]
          </p>
          <h2 className="font-mono text-4xl sm:text-5xl font-black uppercase tracking-wide text-white mb-10">
            EMBED_HIGH_YIELD_SAVINGS_IN_YOUR_APP
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* API Overview */}
            <div className="border-2 border-[#00FFFF] bg-black p-8">
              <div className="text-sm font-mono font-bold uppercase tracking-wider text-[#00FFFF] mb-4">
                [ API_PLATFORM ]
              </div>
              <p className="text-base text-white/80 font-mono leading-relaxed mb-6">
                // Integrate 8% APY high-yield savings directly into your
                fintech product. We handle the DeFi complexity, insurance, and
                compliance — you get a clean REST API.
              </p>
              <div className="space-y-3 text-sm font-mono text-white/70">
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] flex-shrink-0">▸</span>
                  <span>RESTful API with comprehensive documentation</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] flex-shrink-0">▸</span>
                  <span>White-label solution for your brand</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] flex-shrink-0">▸</span>
                  <span>Sub-1 week integration time</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] flex-shrink-0">▸</span>
                  <span>Self-custody architecture — users own their funds</span>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="border-2 border-[#00FFFF] bg-[#0000AA]/10 p-8">
              <div className="text-sm font-mono font-bold uppercase tracking-wider text-[#00FFFF] mb-4">
                [ USE_CASES ]
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-[#00FF00] pl-4">
                  <h3 className="text-base font-black text-white font-mono uppercase mb-1">
                    Corporate_Banking
                  </h3>
                  <p className="text-sm text-white/70 font-mono">
                    Offer high-yield treasury management to business customers
                  </p>
                </div>
                <div className="border-l-2 border-[#00FF00] pl-4">
                  <h3 className="text-base font-black text-white font-mono uppercase mb-1">
                    Neobanks
                  </h3>
                  <p className="text-sm text-white/70 font-mono">
                    Add competitive savings rates to your product suite
                  </p>
                </div>
                <div className="border-l-2 border-[#00FF00] pl-4">
                  <h3 className="text-base font-black text-white font-mono uppercase mb-1">
                    Crypto_Wallets
                  </h3>
                  <p className="text-sm text-white/70 font-mono">
                    Enable idle balance yield for your users
                  </p>
                </div>
                <div className="border-l-2 border-[#00FF00] pl-4">
                  <h3 className="text-base font-black text-white font-mono uppercase mb-1">
                    Payment_Apps
                  </h3>
                  <p className="text-sm text-white/70 font-mono">
                    Let users earn while they save for upcoming payments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black border-2 border-[#00FF00] p-6 text-center">
              <p className="text-3xl font-black text-[#00FF00] font-mono">8%</p>
              <p className="text-xs text-white/70 font-mono uppercase tracking-wide mt-2">
                APY_YIELD
              </p>
            </div>
            <div className="bg-black border-2 border-[#00FF00] p-6 text-center">
              <p className="text-3xl font-black text-[#00FF00] font-mono">
                &lt;1wk
              </p>
              <p className="text-xs text-white/70 font-mono uppercase tracking-wide mt-2">
                INTEGRATION
              </p>
            </div>
            <div className="bg-black border-2 border-[#00FF00] p-6 text-center">
              <p className="text-3xl font-black text-[#00FF00] font-mono">
                $2M+
              </p>
              <p className="text-xs text-white/70 font-mono uppercase tracking-wide mt-2">
                LOI_COMMITMENTS
              </p>
            </div>
            <div className="bg-black border-2 border-[#00FF00] p-6 text-center">
              <p className="text-3xl font-black text-[#00FF00] font-mono">
                15+
              </p>
              <p className="text-xs text-white/70 font-mono uppercase tracking-wide mt-2">
                STARTUPS_SIGNED
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link
              href="https://cal.com/team/0finance/30"
              className="inline-block px-10 py-4 text-base font-bold font-mono uppercase tracking-wider bg-[#00FF00] text-black hover:bg-white transition-all border-2 border-[#00FF00] hover:border-white"
            >
              [ REQUEST_API_ACCESS ]
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16 sm:py-20 border-b-2 border-[#00FF00]">
        <div className="mx-auto max-w-[1000px] px-8 text-center">
          <div className="border-3 border-white bg-black p-10 sm:p-12 border-2">
            <p className="uppercase tracking-widest text-xs text-[#00FF00]/60 font-mono font-bold mb-6">
              [ CALL_TO_ACTION ]
            </p>
            <h2 className="font-mono text-4xl sm:text-5xl font-black uppercase tracking-wide text-white mb-6">
              START_EARNING_4X_MORE
            </h2>
            <p className="text-base sm:text-lg text-white/70 font-mono leading-relaxed max-w-[60ch] mx-auto mb-8">
              // STOP LEAVING MONEY ON THE TABLE. GET 8% APY HIGH-YIELD SAVINGS
              ON YOUR IDLE CASH — 4X MORE THAN TRADITIONAL BANKS.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="https://0.finance"
                className="px-8 py-4 text-base font-bold font-mono uppercase tracking-wider bg-[#00FF00] text-black hover:bg-white transition-all border-2 border-[#00FF00] hover:border-white"
              >
                [ OPEN_HIGH_YIELD_ACCOUNT ]
              </Link>
              <Link
                href="https://cal.com/team/0finance/30"
                className="px-8 py-4 text-base font-mono uppercase tracking-wider border-2 border-white/30 text-white/70 hover:border-white hover:text-white hover:bg-white/5 transition-all"
              >
                [ BOOK_A_DEMO ]
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t-2 border-[#00FF00]">
        <div className="mx-auto max-w-[1400px] px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#00FF00]/30">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Image
                src="/images/new-logo-bluer.png"
                alt="Zero Finance logo"
                width={80}
                height={80}
                className="h-16 w-auto border-2 border-[#00FF00]"
              />
              <div>
                <p className="text-sm text-white/70 font-mono uppercase tracking-wide flex items-center gap-2">
                  {'>> BUILT_BY'}
                  <a
                    href="https://0.finance"
                    className="font-bold text-[#00FF00] hover:text-white transition-colors border-b-2 border-[#00FF00] hover:border-white"
                  >
                    0_FINANCE
                  </a>
                </p>
                <p className="text-xs text-white/50 font-mono uppercase tracking-wide mt-2">
                  // HIGH_YIELD_SAVINGS_FOR_STARTUPS
                </p>
              </div>
            </div>
            <nav className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-mono">
              <a
                href="https://0.finance"
                className="text-white/70 hover:text-white transition-colors uppercase tracking-wide border-b border-white/20 hover:border-white pb-1"
              >
                0_FINANCE
              </a>
              <a
                href="https://x.com/0dotfinance"
                className="text-white/70 hover:text-white transition-colors uppercase tracking-wide border-b border-white/20 hover:border-white pb-1"
              >
                X_(TWITTER)
              </a>
              <a
                href="https://cal.com/team/0finance/30"
                className="text-white/70 hover:text-white transition-colors uppercase tracking-wide border-b border-white/20 hover:border-white pb-1"
              >
                BOOK_DEMO
              </a>
            </nav>
          </div>
          <div className="pt-6 text-center">
            <p className="text-xs text-[#00FF00]/60 font-mono uppercase tracking-widest">
              [ SYSTEM_VERSION: 2.0.0 ] • [ STATUS: OPERATIONAL ]
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
