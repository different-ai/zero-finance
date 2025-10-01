'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowLeft } from 'lucide-react';
import { AlignKycStatus } from '@/components/settings/align-integration';
import { steps as onboardingSteps } from '../constants';
import { useSkipOnboarding } from '@/hooks/use-skip-onboarding';

// Helper to manage onboarding step completion
const completeOnboardingStep = (step: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`onboarding_step_${step}_completed`, 'true');
  }
};

export default function KycOnboardingPage() {
  const router = useRouter();
  const { skipOnboarding, isSkipping } = useSkipOnboarding();
  const [kycApproved, setKycApproved] = React.useState(false);

  const handleKycApproved = () => {
    console.log('KYC Approved! User can now continue manually.');
    completeOnboardingStep('kyc');
    setKycApproved(true);
    // Note: No automatic redirect - user must click continue
  };

  const handleKycUserAwaitingReview = () => {
    console.log(
      'User has finished KYC external steps. User can now continue manually.',
    );
    completeOnboardingStep('kyc_submitted');
    // Note: No automatic redirect - user must click continue
  };

  const handleContinue = () => {
    const currentPath = '/onboarding/kyc'; // Current page's path
    const currentIndex = onboardingSteps.findIndex(
      (step) => step.path === currentPath,
    );

    if (currentIndex !== -1 && currentIndex < onboardingSteps.length - 1) {
      const nextStep = onboardingSteps[currentIndex + 1];
      console.log(
        `Navigating from ${currentPath} to next step: ${nextStep.name} (${nextStep.path})`,
      );
      router.push(nextStep.path);
    } else {
      console.warn(
        `Could not determine next step from ${currentPath}, or it's the last step. Navigating to /onboarding/complete as a fallback.`,
      );
      router.push('/onboarding/complete'); // Fallback to complete page
    }
  };

  const handleBack = () => {
    const currentPath = '/onboarding/kyc'; // Current page's path
    const currentIndex = onboardingSteps.findIndex(
      (step) => step.path === currentPath,
    );

    if (currentIndex > 0) {
      const prevStep = onboardingSteps[currentIndex - 1];
      console.log(
        `Navigating from ${currentPath} to previous step: ${prevStep.name} (${prevStep.path})`,
      );
      router.push(prevStep.path);
    } else {
      console.warn(
        `Could not determine previous step from ${currentPath}, or it's the first step. Staying on current page.`,
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card className="w-full bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-[#101010]/10">
          <CardTitle className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Verify Your Identity
          </CardTitle>
          <CardDescription className="text-[14px] text-[#101010]/70 mt-2">
            To ensure the security of your account and comply with regulations,
            we need to verify your identity. This process is handled by our
            trusted partner, Align.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <AlignKycStatus
            onKycApproved={handleKycApproved}
            onKycUserAwaitingReview={handleKycUserAwaitingReview}
            variant="embedded"
          />
        </CardContent>
        <CardFooter className="flex justify-between p-5 sm:p-6 bg-[#F7F7F2] border-t border-[#101010]/10">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-[#101010]/10 text-[#101010] hover:bg-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {kycApproved ? (
            <Button
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Continue to Next Step
            </Button>
          ) : (
            <Button
              onClick={skipOnboarding}
              variant="outline"
              disabled={isSkipping}
              className="border-[#101010]/10 text-[#101010] hover:bg-white"
            >
              {isSkipping ? 'Skipping...' : 'Skip KYC for now'}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card className="w-full bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
        <CardHeader className="p-5 sm:p-6 border-b border-[#101010]/10">
          <CardTitle className="text-lg font-semibold text-[#101010]">
            KYB FAQ
          </CardTitle>
          <CardDescription className="text-sm text-[#101010]/70">
            Help for Delaware C-Corp verification
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="entity-id">
              <AccordionTrigger className="text-sm font-medium">
                Business Entity ID
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#101010]/70 space-y-2">
                <p className="font-medium">What it is</p>
                <p>Your Delaware File Number.</p>
                <p className="font-medium mt-2">Where to find it</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    Certificate of Incorporation: top-left stamp shows "File
                    Number #######"
                  </li>
                  <li>
                    Delaware business search page or any Good Standing
                    certificate
                  </li>
                  <li>Emails or PDFs from your registered agent</li>
                </ul>
                <p className="font-medium mt-2">What to paste</p>
                <p>Digits only. Example: 7286832. Ignore "SR …" numbers.</p>
                <p className="font-medium mt-2">Common mistakes</p>
                <p>Using your EIN here, or pasting the SR receipt number.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ein">
              <AccordionTrigger className="text-sm font-medium">
                EIN
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#101010]/70 space-y-2">
                <p className="font-medium">What it is</p>
                <p>Your Federal Employer Identification Number from the IRS.</p>
                <p className="font-medium mt-2">Where to find it</p>
                <p>
                  IRS CP-575 or SS-4 approval letter, prior returns, payroll
                  filings, bank or payroll dashboards. If you lost it, request
                  an IRS 147C letter.
                </p>
                <p className="font-medium mt-2">What to paste</p>
                <p>
                  9 digits. Use the field's format hint (12-3456789 or
                  123456789).
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="website">
              <AccordionTrigger className="text-sm font-medium">
                Website
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#101010]/70 space-y-2">
                <p className="font-medium">What it is</p>
                <p>Your public company site or profile.</p>
                <p className="font-medium mt-2">What to paste</p>
                <p>
                  Full URL (e.g., https://0.finance). If you do not have one
                  yet, leave it blank. A LinkedIn page is acceptable if
                  requested.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="address">
              <AccordionTrigger className="text-sm font-medium">
                Address Line 1
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#101010]/70 space-y-2">
                <p className="font-medium">What it is</p>
                <p>
                  Your operating or HQ street address. You can use your mailing
                  address if that is how your company receives mail.
                </p>
                <p className="font-medium mt-2">Note</p>
                <p>
                  Many KYB providers do not accept a registered agent address as
                  the operating address.
                </p>
                <p className="font-medium mt-2">Proof tip</p>
                <p>
                  Use the same address you will prove in "Proof of Address".
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ubos">
              <AccordionTrigger className="text-sm font-medium">
                Ultimate Beneficial Owners & Founders
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#101010]/70 space-y-2">
                <p className="font-medium">What we need</p>
                <p>
                  List all beneficial owners and all founders. Do not submit a
                  single contact only.
                </p>
                <p className="font-medium mt-2">Why</p>
                <p>
                  Regulations require KYB on the people who own or control the
                  company.
                </p>
                <p className="font-medium mt-2">How it works</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>You provide names and emails for each UBO/founder</li>
                  <li>
                    Each person will receive an email with a secure link to
                    complete KYC (ID, selfie, and basic details)
                  </li>
                  <li>
                    We cannot proceed until everyone on the list has completed
                    their KYC
                  </li>
                </ul>
                <p className="font-medium mt-2">Helpful note</p>
                <p>
                  If someone owns through an entity, include the natural
                  person(s) behind that entity too.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cap-table">
              <AccordionTrigger className="text-sm font-medium">
                Shareholder Registry (Cap Table)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#101010]/70 space-y-2">
                <p className="font-medium">What it is</p>
                <p>A simple document showing who owns what.</p>
                <p className="font-medium mt-2">Easy options</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>If you use Carta, export a current cap table PDF</li>
                  <li>
                    If you do not, generate a one-pager and upload it as PDF
                  </li>
                </ul>
                <p className="font-medium mt-2">Need help creating one?</p>
                <p className="text-xs bg-[#F7F7F2] p-2 rounded mt-1">
                  Use this prompt in ChatGPT: "Create a simple shareholder
                  registry for a Delaware C-Corp as a one-page table. Columns:
                  Shareholder name, Email, Role (founder/investor/employee),
                  Security type (common/preferred/SAFE/option), Shares or %
                  ownership (both if known), Fully diluted %, Vesting (start
                  date, cliff, schedule), Notes. Include a footer line:
                  'Informational cap table snapshot for KYB. Not a legal
                  certificate.' Fill it with placeholders I can edit."
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="registration-doc">
              <AccordionTrigger className="text-sm font-medium">
                Business Registration Document
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#101010]/70 space-y-2">
                <p className="font-medium">What it is</p>
                <p>A document that proves your company exists.</p>
                <p className="font-medium mt-2">Accepted for Delaware C-Corp</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Certificate of Incorporation (stamped)</li>
                  <li>Certificate of Good Standing (recent)</li>
                  <li>
                    A certified copy from the Delaware Division of Corporations
                  </li>
                </ul>
                <p className="font-medium mt-2">Where to get it</p>
                <p>
                  From your registered agent portal or the Delaware Division of
                  Corporations. Stripe Atlas/Clerky usually provide the PDFs.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="source-of-funds">
              <AccordionTrigger className="text-sm font-medium">
                Source of Funds
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#101010]/70 space-y-2">
                <p className="font-medium">What it is</p>
                <p>
                  A short note or document showing where the initial money comes
                  from.
                </p>
                <p className="font-medium mt-2">Examples we accept</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Investment docs: SAFE or priced round closing notice</li>
                  <li>
                    Bank statement or wire receipt showing founder deposit or
                    investor funds
                  </li>
                  <li>
                    Revenue evidence: Stripe or PayPal dashboard screenshot with
                    recent payouts
                  </li>
                  <li>Grant or accelerator award letter</li>
                </ul>
                <p className="font-medium mt-2">Tips</p>
                <p>
                  Mask full account numbers. Make sure the company name matches
                  your entity.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="proof-of-address">
              <AccordionTrigger className="text-sm font-medium">
                Proof of Address (Business)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#101010]/70 space-y-2">
                <p className="font-medium">What it must do</p>
                <p>
                  Confirm your current operating address and be addressed to the
                  applying entity.
                </p>
                <p className="font-medium mt-2">Commonly accepted documents</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Lease or utility bill</li>
                  <li>Bank statement or merchant account statement</li>
                  <li>Business insurance policy or premium notice</li>
                  <li>Recent government or tax notice to the company</li>
                </ul>
                <p className="font-medium mt-2">Requirements</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    Shows the legal company name and the same address you
                    entered
                  </li>
                  <li>
                    Clearly dated and recent (most reviewers expect within the
                    last 3 months)
                  </li>
                  <li>
                    Street address preferred. P.O. Boxes are usually not
                    accepted for operating address.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
