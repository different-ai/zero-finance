'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Users,
  Building,
  Receipt,
  MapPin,
} from 'lucide-react';
import { steps as onboardingSteps } from '../constants';
import { useSkipOnboarding } from '@/hooks/use-skip-onboarding';
import { usePrivy } from '@privy-io/react-auth';

export default function InfoPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { skipOnboarding, isSkipping } = useSkipOnboarding();

  React.useEffect(() => {
    if (ready && !authenticated) {
      router.push('/signin');
    }
  }, [ready, authenticated, router]);

  const handleContinue = () => {
    router.push('/onboarding/kyc');
  };

  const handleBack = () => {
    const currentPath = '/onboarding/info';
    const currentIndex = onboardingSteps.findIndex(
      (step) => step.path === currentPath,
    );

    if (currentIndex > 0) {
      const prevStep = onboardingSteps[currentIndex - 1];
      router.push(prevStep.path);
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-[#101010]/10">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
            PREPARATION
          </p>
          <CardTitle className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Before We Begin
          </CardTitle>
          <CardDescription className="text-[14px] text-[#101010]/70 mt-3">
            Let&apos;s prepare for the verification process. This will only take
            a few minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 space-y-6">
          <div className="bg-[#EAF0FF] border border-[#0050ff]/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0050ff]/10 flex items-center justify-center flex-shrink-0">
                <ArrowRight className="h-4 w-4 text-[#0050ff]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-[#101010] mb-1">
                  Helpful Resources Available
                </h3>
                <p className="text-[12px] text-[#101010]/70 leading-[1.5]">
                  Check the sidebar on the right for detailed FAQs, an AI
                  assistant, and a cap table converter tool to help you through
                  each step.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold mb-2 text-[#101010]">
              Why We Need to Verify Your Business
            </h3>
            <p className="text-[13px] text-[#101010]/70 mb-3 leading-[1.5]">
              Business verification unlocks key banking features for you:
            </p>
            <ul className="space-y-2 text-[13px] text-[#101010]/70">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-[#0050ff] mt-0.5 flex-shrink-0" />
                <span>ACH transfers and wire transfers</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold mb-2 text-[#101010]">
              Required Documents
            </h3>
            <p className="text-[13px] text-[#101010]/70 mb-4 leading-[1.5]">
              Please have these documents ready. We accept Excel, CSV, or PDF
              formats.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-[#F7F7F2] rounded-lg border border-[#101010]/5">
                <div className="w-8 h-8 rounded-full bg-white border border-[#101010]/10 flex items-center justify-center flex-shrink-0">
                  <Building className="h-4 w-4 text-[#0050ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#101010]">
                    Business Registration Document
                  </p>
                  <p className="text-[12px] text-[#101010]/60 mt-0.5 leading-[1.4]">
                    Certificate of Incorporation or Good Standing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#F7F7F2] rounded-lg border border-[#101010]/5">
                <div className="w-8 h-8 rounded-full bg-white border border-[#101010]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-[#0050ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#101010]">
                    Shareholders Registry (Cap Table)
                  </p>
                  <p className="text-[12px] text-[#101010]/60 mt-0.5 leading-[1.4]">
                    Excel/CSV preferred — use our converter tool in the sidebar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#F7F7F2] rounded-lg border border-[#101010]/5">
                <div className="w-8 h-8 rounded-full bg-white border border-[#101010]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-[#0050ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#101010]">
                    Proof of Address (within 3 months)
                  </p>
                  <p className="text-[12px] text-[#101010]/60 mt-0.5 leading-[1.4]">
                    Utility bill, lease, or bank statement
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#F7F7F2] rounded-lg border border-[#101010]/5">
                <div className="w-8 h-8 rounded-full bg-white border border-[#101010]/10 flex items-center justify-center flex-shrink-0">
                  <Receipt className="h-4 w-4 text-[#0050ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#101010]">
                    Tax Information
                  </p>
                  <p className="text-[12px] text-[#101010]/60 mt-0.5 leading-[1.4]">
                    EIN (Tax ID) and Business Entity ID
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#F7F7F2] rounded-lg border border-[#101010]/5">
                <div className="w-8 h-8 rounded-full bg-white border border-[#101010]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-[#0050ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#101010]">
                    Beneficial Owners & Founders
                  </p>
                  <p className="text-[12px] text-[#101010]/60 mt-0.5 leading-[1.4]">
                    Names and emails — each will receive a verification link
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white border border-[#101010]/10 rounded-lg">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#101010]/50 mb-1">
                OPTIONAL
              </p>
              <p className="text-[12px] text-[#101010]/70 leading-[1.4]">
                Source of Funds documentation and DBA certificate can help speed
                up verification.
              </p>
            </div>
          </div>

          <div className="border-t border-[#101010]/10 pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0050ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="h-4 w-4 text-[#0050ff]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-[#101010] mb-1">
                  About Our Partners
                </h3>
                <p className="text-[12px] text-[#101010]/70 leading-[1.5] mb-2">
                  <span className="font-semibold">AiPrise</span> handles your
                  business and identity verification.{' '}
                  <span className="font-semibold">Align</span> is our financial
                  services provider for deposits and transfers.
                </p>
                <p className="text-[11px] text-[#101010]/60 leading-[1.4]">
                  Both are regulated providers with strict security and
                  encryption standards.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-5 sm:p-6 bg-[#F7F7F2] border-t border-[#101010]/10">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-[#101010]/10 text-[#101010] hover:bg-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={skipOnboarding}
              variant="outline"
              disabled={isSkipping}
              className="border-[#101010]/10 text-[#101010] hover:bg-white"
            >
              {isSkipping ? 'Skipping...' : 'Skip for now'}
            </Button>
            <Button
              onClick={handleContinue}
              className="bg-[#0050ff] hover:bg-[#0040cc] text-white"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
