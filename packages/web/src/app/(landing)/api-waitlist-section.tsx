'use client';

import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { useBimodal } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

interface ApiWaitlistSectionProps {
  onSubmit: (data: {
    email?: string;
    companyName?: string;
    useCase?: string;
    privyDid?: string;
  }) => Promise<{ success: boolean; message?: string }>;
}

export function ApiWaitlistSection({ onSubmit }: ApiWaitlistSectionProps) {
  const { user, authenticated } = usePrivy();
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await onSubmit({
        email: authenticated ? user?.email?.address : email,
        companyName,
        useCase,
        privyDid: authenticated ? user?.id : undefined,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { mode } = useBimodal();

  const features =
    mode === 'consumer'
      ? [
          'Bank-level security with smart contract protection',
          'Instant deposits and withdrawals',
          'USDC stablecoin backed 1:1 with US dollars',
          'Transparent on-chain yield sources',
        ]
      : [
          'RESTful API with comprehensive documentation',
          'White-label solution for your brand',
          'Sub-1 week integration time',
          'Self-custody architecture — users own their funds',
        ];

  const useCases =
    mode === 'consumer'
      ? [
          {
            title: 'Emergency Fund',
            description: 'Build your safety net with market-leading rates',
          },
          {
            title: 'Savings Goals',
            description: 'Grow your money while saving for big purchases',
          },
          {
            title: 'Passive Income',
            description: 'Earn consistently on your idle stablecoin balance',
          },
          {
            title: 'Dollar Holdings',
            description: 'Hold USD digitally while earning competitive yield',
          },
        ]
      : [
          {
            title: 'Corporate Banking',
            description:
              'Offer high-yield treasury management to business customers',
          },
          {
            title: 'Neobanks',
            description: 'Add competitive savings rates to your product suite',
          },
          {
            title: 'Crypto Wallets',
            description: 'Enable idle balance yield for your users',
          },
          {
            title: 'Payment Apps',
            description: 'Let users earn while they save for upcoming payments',
          },
        ];

  return (
    <section
      id="api-access"
      className="relative border-y border-[#101010]/10 bg-white/90 overflow-hidden"
    >
      {/* Solid cream background */}
      <div className="absolute inset-0 bg-[#F6F5EF] z-0" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 mb-3">
            {mode === 'consumer'
              ? 'Start Growing Your Money'
              : 'For Developers & Partners'}
          </p>
          <h2 className="font-serif text-[48px] sm:text-[64px] lg:text-[72px] leading-[0.96] tracking-[-0.015em] text-[#101010] mb-6">
            {mode === 'consumer' ? (
              <>
                Save Smarter with{' '}
                <span className="text-[#1B29FF]">High-Yield</span>
                <br />
                Stablecoin Accounts
              </>
            ) : (
              <>
                Embed <span className="text-[#1B29FF]">High-Yield Savings</span>
                <br />
                in Your App
              </>
            )}
          </h2>
          <p className="text-[16px] leading-[1.5] text-[#101010]/80 max-w-[600px] mx-auto">
            {mode === 'consumer'
              ? 'Open a USDC savings account that earns competitive yield automatically. No lock-ups, no hidden fees, just transparent returns on your digital dollars.'
              : 'Integrate competitive high-yield savings directly into your fintech product. We handle the DeFi complexity, insurance, and compliance — you get a clean REST API.'}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto rounded-xl overflow-hidden border border-[#101010]/10 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
          {/* Left Card - Features & Use Cases */}
          <div className="bg-white/95 backdrop-blur-sm p-8 lg:p-12">
            <div className="mb-8">
              <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[#101010] mb-6">
                {mode === 'consumer' ? 'Why Choose 0 Finance' : 'What You Get'}
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-[#1B29FF]" />
                    </div>
                    <span className="text-[14px] text-[#101010]/70">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[#101010] mb-6">
                {mode === 'consumer' ? 'Perfect For' : 'Use Cases'}
              </h3>
              <div className="space-y-4">
                {useCases.map((item, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-[#1B29FF]/30 pl-4"
                  >
                    <h4 className="text-[15px] font-medium text-[#101010] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[13px] text-[#101010]/60">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card - Waitlist Form */}
          <div className="bg-white/90 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-[#101010]/10 p-8 lg:p-12 flex flex-col justify-center">
            {submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-[#10b981]/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-[#10b981]" />
                </div>
                <h3 className="text-[24px] font-semibold text-[#101010] mb-3">
                  You're on the list!
                </h3>
                <p className="text-[15px] text-[#101010]/70 mb-6">
                  We'll reach out soon to discuss your integration needs and
                  provide API access.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-[24px] font-semibold tracking-[-0.01em] text-[#101010] mb-3">
                  {mode === 'consumer'
                    ? 'Start Earning Today'
                    : 'Request API Access'}
                </h3>
                <p className="text-[14px] text-[#101010]/60 mb-6">
                  {authenticated
                    ? mode === 'consumer'
                      ? "You're signed in! Start earning in seconds."
                      : "You're signed in! Join the waitlist with one click."
                    : mode === 'consumer'
                      ? 'Open your high-yield account in under a minute.'
                      : "Join the waitlist and we'll reach out to discuss your needs."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!authenticated && (
                    <div>
                      <label className="block text-[13px] font-medium text-[#101010] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-12 px-4 bg-white border border-[#101010]/20 rounded-md 
                                 focus:border-[#1B29FF] focus:ring-2 focus:ring-[#1B29FF]/20 
                                 text-[15px] placeholder:text-[#101010]/40 transition-colors"
                        placeholder="you@company.com"
                      />
                    </div>
                  )}

                  {mode === 'business' && (
                    <div>
                      <label className="block text-[13px] font-medium text-[#101010] mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="w-full h-12 px-4 bg-white border border-[#101010]/20 rounded-md 
                                 focus:border-[#1B29FF] focus:ring-2 focus:ring-[#1B29FF]/20 
                                 text-[15px] placeholder:text-[#101010]/40 transition-colors"
                        placeholder="Acme Inc."
                      />
                    </div>
                  )}

                  {mode === 'business' && (
                    <div>
                      <label className="block text-[13px] font-medium text-[#101010] mb-2">
                        Use Case (Optional)
                      </label>
                      <textarea
                        value={useCase}
                        onChange={(e) => setUseCase(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-[#101010]/20 rounded-md 
                                 focus:border-[#1B29FF] focus:ring-2 focus:ring-[#1B29FF]/20 
                                 text-[15px] placeholder:text-[#101010]/40 transition-colors resize-none"
                        placeholder="Tell us about your integration plans..."
                      />
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-[13px] text-red-800">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1B29FF] hover:bg-[#1420CC] disabled:bg-[#1B29FF]/60 
                             text-white font-medium px-6 py-3 rounded-md transition-colors 
                             flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : authenticated ? (
                      <>
                        {mode === 'consumer' ? 'Open Account' : 'Join Waitlist'}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        {mode === 'consumer' ? 'Get Started' : 'Request Access'}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
