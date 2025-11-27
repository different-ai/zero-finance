'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/trpc/react';
import {
  Shield,
  Check,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import GeneratedComponent from '@/app/(landing)/welcome-gradient';
import { toast } from 'sonner';

export default function InsuranceActivatePage() {
  const router = useRouter();
  const [step, setStep] = useState<'initial' | 'loading' | 'success'>(
    'initial',
  );
  const [isActivating, setIsActivating] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const activateInsurance = api.user.activateInsurance.useMutation();
  const utils = api.useUtils();

  // Animation states for the loading screen
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const loadingSteps = [
    'Verifying account status...',
    'Applying insurance coverage...',
    'Updating risk parameters...',
    'Finalizing protection...',
    'Coverage activated!',
  ];

  // Handle the animation sequence during loading
  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setCurrentLoadingStep((prev) => {
          if (prev >= loadingSteps.length - 1) {
            clearInterval(interval);
            // Transition to success after last step
            setTimeout(() => setStep('success'), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 800); // Each step takes 800ms

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleActivate = async () => {
    setIsActivating(true);
    setStep('loading');
    setCurrentLoadingStep(0);

    try {
      await activateInsurance.mutateAsync(undefined);

      // Invalidate user profile to refresh insurance status
      await utils.user.getProfile.invalidate();

      // The success state will be triggered by the useEffect above
    } catch (error) {
      console.error('Insurance activation error:', error);
      toast.error(
        'Failed to activate insurance. Please try again or contact support.',
      );
      setStep('initial');
      setIsActivating(false);
    }
  };

  const handleReturnToDashboard = () => {
    router.push('/dashboard');
  };

  // Initial state - show activation prompt
  if (step === 'initial') {
    return (
      <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
        {/* Gradient Background */}
        <GeneratedComponent className="z-0 bg-[#F6F5EF]" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[500px] px-4">
          <div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-8 sm:p-10">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[#1B29FF]/10 rounded-full">
                  <Shield className="w-8 h-8 text-[#1B29FF]" />
                </div>

                <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] font-medium text-[#101010]/70 mb-3">
                  INSURANCE ACTIVATION
                </p>

                <h1 className="font-serif text-[36px] sm:text-[44px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
                  Activate Coverage
                </h1>
                <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.5] text-[#101010]/70">
                  Enable insurance protection for your Morpho vaults.
                </p>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="bg-[#F6F5EF] border border-[#101010]/10 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#101010]/30 text-[#1B29FF] focus:ring-[#1B29FF] focus:ring-offset-0"
                  />
                  <span className="text-[13px] sm:text-[14px] text-[#101010]/80 leading-[1.5]">
                    I have read and agree to the{' '}
                    <Link
                      href="/terms-of-service"
                      target="_blank"
                      className="text-[#1B29FF] hover:underline font-medium"
                    >
                      Terms and Conditions
                    </Link>{' '}
                    for the DeFi Protection Security Guarantee. I understand
                    that only Morpho vaults are covered through this interface,
                    insurance (up to $1M) is provided by Chainproof (a licensed
                    insurer), and smart contract audits are performed by
                    Quantstamp.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleActivate}
                  disabled={isActivating || !acceptedTerms}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Activate Insurance Protection
                  <Shield className="ml-2 h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleReturnToDashboard}
                  disabled={isActivating}
                  className="w-full px-6 py-3 text-[14px] sm:text-[15px] text-[#101010]/60 hover:text-[#101010] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Return to Dashboard
                </button>
              </div>

              {/* Footer note */}
              <div className="pt-4 border-t border-[#101010]/10">
                <p className="text-[12px] sm:text-[13px] text-[#101010]/50 text-center">
                  Insurance coverage applies to all eligible Morpho vaults in
                  your account
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Loading state - show activation progress
  if (step === 'loading') {
    return (
      <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
        {/* Gradient Background */}
        <GeneratedComponent className="z-0 bg-[#F6F5EF]" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[500px] px-4">
          <div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-8 sm:p-10">
            <div className="space-y-8">
              {/* Animated Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#1B29FF]/20 rounded-full animate-ping" />
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-[#1B29FF]/10 rounded-full">
                    <Shield className="w-10 h-10 text-[#1B29FF] animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                <h2 className="font-serif text-[28px] sm:text-[32px] text-center text-[#101010]">
                  Activating Insurance
                </h2>

                <div className="space-y-3">
                  {loadingSteps.map((stepText, index) => (
                    <div
                      key={stepText}
                      className="flex items-center gap-3 transition-all duration-300"
                      style={{
                        opacity: index <= currentLoadingStep ? 1 : 0.3,
                        transform:
                          index <= currentLoadingStep
                            ? 'translateX(0)'
                            : 'translateX(-10px)',
                      }}
                    >
                      <div className="flex-shrink-0">
                        {index < currentLoadingStep ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : index === currentLoadingStep ? (
                          <div className="h-5 w-5 border-2 border-[#1B29FF] rounded-full border-t-transparent animate-spin" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-[#101010]/20 rounded-full" />
                        )}
                      </div>
                      <span
                        className={`text-[14px] ${index <= currentLoadingStep ? 'text-[#101010]' : 'text-[#101010]/40'}`}
                      >
                        {stepText}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-[#101010]/5 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1B29FF] to-[#1B29FF]/80 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${((currentLoadingStep + 1) / loadingSteps.length) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                  </div>
                </div>

                <p className="text-center text-[12px] text-[#101010]/50">
                  Please wait while we set up your insurance coverage...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Success state
  return (
    <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
      {/* Gradient Background */}
      <GeneratedComponent className="z-0 bg-[#F6F5EF]" />

      {/* Confetti-like animation */}
      <div className="absolute inset-0 z-5">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute text-[#1B29FF]/20 animate-float-${i}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[500px] px-4">
        <div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-8 sm:p-10">
          <div className="space-y-6">
            {/* Success Icon */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-50 rounded-full">
                <div className="relative">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                  <div className="absolute -inset-1 bg-green-500/20 rounded-full animate-ping" />
                </div>
              </div>

              <h1 className="font-serif text-[36px] sm:text-[44px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
                Coverage Active!
              </h1>

              <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.5] text-[#101010]/70">
                Your insurance protection is now active. All eligible vaults are
                covered and risk warnings have been removed.
              </p>
            </div>

            {/* Success Details */}
            <div className="bg-green-50/50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-[14px] text-green-900">
                  Insurance coverage enabled
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-[14px] text-green-900">
                  Risk warnings removed
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-[14px] text-green-900">
                  Priority support activated
                </p>
              </div>
            </div>

            {/* Return Button */}
            <button
              onClick={handleReturnToDashboard}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            {/* Footer note */}
            <div className="pt-4 border-t border-[#101010]/10">
              <p className="text-[12px] sm:text-[13px] text-[#101010]/50 text-center">
                You can view your coverage details in your account settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes float-0 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(180deg);
          }
        }
        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-35px) rotate(-180deg);
          }
        }
        @keyframes float-4 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-5 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-28px) rotate(-180deg);
          }
        }

        .animate-float-0 {
          animation: float-0 3s ease-in-out infinite;
        }
        .animate-float-1 {
          animation: float-1 3.5s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 4s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-3 3.2s ease-in-out infinite;
        }
        .animate-float-4 {
          animation: float-4 3.8s ease-in-out infinite;
        }
        .animate-float-5 {
          animation: float-5 3.3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
