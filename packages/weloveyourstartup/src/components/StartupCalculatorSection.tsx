'use client';

import { SavingsCalculator } from './SavingsCalculator';

interface StartupCalculatorSectionProps {
  companyName: string;
  fundingAmount: number;
  isMobile?: boolean;
}

export function StartupCalculatorSection({
  companyName,
  fundingAmount,
  isMobile = false,
}: StartupCalculatorSectionProps) {
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

  // Calculate potential savings
  const yearlyAtBank = fundingAmount * 0.02; // 2% bank rate
  const yearlyAtZero = fundingAmount * 0.08; // 8% Zero rate
  const yearlyDifference = yearlyAtZero - yearlyAtBank;
  const monthlyDifference = yearlyDifference / 12;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile: Compact Hero Section */}
      {isMobile && (
        <>
          {/* Main Value Prop Box */}
          <div className="border-4 border-[#00FF00] bg-black p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#00FF00] mb-2">
              [ ZERO_FINANCE: 8% APY SAVINGS ]
            </div>
            <div className="text-xs sm:text-sm text-white/90 font-mono leading-relaxed mb-3">
              Banks pay ~2% on cash. Zero Finance pays 8% APY. That's 4x more
              interest on your idle capital — fully insured, always
              withdrawable.
            </div>
            <div className="border-t-2 border-[#00FF00]/30 pt-3">
              <div className="text-[8px] sm:text-[9px] text-[#00FFFF] font-mono uppercase tracking-wider mb-1">
                {companyName.toUpperCase()}'S POTENTIAL GAIN:
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#00FF00] font-mono">
                +{formatCurrency(yearlyDifference)}/yr
              </div>
              <div className="text-[9px] sm:text-[10px] text-[#00FF00]/70 font-mono mt-1">
                ({formatCurrency(monthlyDifference)}/month extra vs banks)
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black border-2 border-[#FF00FF]/30 p-2.5">
              <div className="text-[8px] text-[#FF00FF]/70 font-mono uppercase tracking-wider mb-1">
                Banks Pay
              </div>
              <div className="text-xl sm:text-2xl font-black text-white/50 font-mono">
                2% APY
              </div>
            </div>
            <div className="bg-black border-2 border-[#00FF00] p-2.5">
              <div className="text-[8px] text-[#00FF00]/70 font-mono uppercase tracking-wider mb-1">
                Zero Pays
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#00FF00] font-mono">
                8% APY
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="bg-[#0000AA]/20 border-2 border-[#00FFFF]/30 p-3">
            <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#00FFFF] mb-2">
              [ WHY_ZERO_FINANCE ]
            </div>
            <div className="space-y-1.5 text-[10px] sm:text-xs font-mono text-white/80">
              <div className="flex items-start gap-2">
                <span className="text-[#00FF00] flex-shrink-0">▸</span>
                <span>4x higher yield than traditional banks</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00FF00] flex-shrink-0">▸</span>
                <span>FDIC insured up to $5M per account</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00FF00] flex-shrink-0">▸</span>
                <span>Withdraw anytime, no lock-ups</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00FF00] flex-shrink-0">▸</span>
                <span>Corporate card coming soon</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop: Expanded Hero Section */}
      {!isMobile && (
        <>
          {/* Main Value Prop - Large */}
          <div className="border-4 border-[#00FF00] bg-black p-8 mb-8">
            <div className="text-sm font-mono font-bold uppercase tracking-widest text-[#00FF00] mb-4">
              [ ZERO_FINANCE: THE 8% APY SAVINGS ACCOUNT ]
            </div>
            <div className="text-xl lg:text-2xl text-white/90 font-mono leading-relaxed mb-6">
              Traditional banks pay ~2% on idle cash. Zero Finance pays{' '}
              <span className="text-[#00FF00] font-bold">8% APY</span> — that's{' '}
              <span className="text-[#00FF00] font-bold">4x more interest</span>{' '}
              on your startup's runway. Self-custodial, insured up to $1M by a
              licensed insurer, always withdrawable, zero lock-ups.
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border-2 border-[#FF00FF]/30 bg-black p-6">
                <div className="text-xs text-[#FF00FF]/70 font-mono uppercase tracking-wider mb-2">
                  Traditional Banks
                </div>
                <div className="text-4xl font-black text-white/50 font-mono mb-1">
                  2% APY
                </div>
                <div className="text-sm text-white/40 font-mono">
                  Low yield, slow growth
                </div>
              </div>
              <div className="border-2 border-[#00FF00] bg-[#00FF00]/5 p-6">
                <div className="text-xs text-[#00FF00]/70 font-mono uppercase tracking-wider mb-2">
                  Zero Finance
                </div>
                <div className="text-4xl font-black text-[#00FF00] font-mono mb-1">
                  8% APY
                </div>
                <div className="text-sm text-[#00FF00]/70 font-mono">
                  4x more earnings
                </div>
              </div>
            </div>

            {/* Potential Gain Highlight */}
            <div className="border-t-4 border-[#00FFFF] pt-6">
              <div className="text-sm text-[#00FFFF] font-mono uppercase tracking-wider mb-3">
                {companyName.toUpperCase()}'S POTENTIAL EXTRA EARNINGS:
              </div>
              <div className="flex items-baseline gap-4">
                <div>
                  <div className="text-6xl lg:text-7xl font-black text-[#00FF00] font-mono">
                    +{formatCurrency(yearlyDifference)}
                  </div>
                  <div className="text-lg text-[#00FF00]/70 font-mono mt-2">
                    per year vs traditional banks
                  </div>
                </div>
                <div className="border-l-2 border-[#00FFFF]/30 pl-4">
                  <div className="text-3xl font-black text-[#00FFFF] font-mono">
                    +{formatCurrency(monthlyDifference)}
                  </div>
                  <div className="text-sm text-[#00FFFF]/70 font-mono">
                    per month
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[#0000AA]/20 border-2 border-[#00FFFF]/30 p-6">
              <div className="text-sm font-mono font-bold uppercase tracking-wider text-[#00FFFF] mb-4">
                [ FULLY_PROTECTED ]
              </div>
              <div className="space-y-3 text-base font-mono text-white/80">
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] text-xl flex-shrink-0">
                    ✓
                  </span>
                  <span>FDIC insured up to $5M</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] text-xl flex-shrink-0">
                    ✓
                  </span>
                  <span>SEC-regulated custodian</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] text-xl flex-shrink-0">
                    ✓
                  </span>
                  <span>Bank-grade security</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0000AA]/20 border-2 border-[#00FFFF]/30 p-6">
              <div className="text-sm font-mono font-bold uppercase tracking-wider text-[#00FFFF] mb-4">
                [ ZERO_RESTRICTIONS ]
              </div>
              <div className="space-y-3 text-base font-mono text-white/80">
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] text-xl flex-shrink-0">
                    ✓
                  </span>
                  <span>Withdraw anytime</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] text-xl flex-shrink-0">
                    ✓
                  </span>
                  <span>No minimum balance</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF00] text-xl flex-shrink-0">
                    ✓
                  </span>
                  <span>Corporate card soon</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Interactive Calculator Section */}
      <div className={isMobile ? 'mt-4' : 'mt-8'}>
        <div
          className={`border-2 border-white/30 bg-[#0000AA]/10 p-2 sm:p-3 mb-3 sm:mb-4`}
        >
          <div
            className={`font-mono ${isMobile ? 'text-[9px] sm:text-[10px]' : 'text-sm'} text-white uppercase tracking-wider`}
          >
            {isMobile
              ? '▼ TRY_THE_CALCULATOR'
              : '▼▼▼ INTERACTIVE_CALCULATOR: SEE_YOUR_POTENTIAL_SAVINGS ▼▼▼'}
          </div>
        </div>
        <SavingsCalculator defaultAmount={fundingAmount} />
      </div>

      {/* Mobile: Bottom CTA */}
      {isMobile && (
        <div className="border-2 border-[#00FF00] bg-black p-3 text-center">
          <div className="text-[9px] sm:text-[10px] text-[#00FFFF] font-mono uppercase tracking-wider mb-2">
            Ready to 4x your interest?
          </div>
          <div className="text-xs sm:text-sm text-white/70 font-mono mb-3">
            Join startups earning 8% APY on idle cash
          </div>
        </div>
      )}
    </div>
  );
}
