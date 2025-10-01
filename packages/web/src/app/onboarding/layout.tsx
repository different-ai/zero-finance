'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Check,
  LogIn,
  LogOut,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { api } from '@/trpc/react';
import { cn } from '@/lib/utils';
import { steps } from './constants';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, login, ready, authenticated } = usePrivy();

  // Fetch customer status to check if onboarding is complete
  const { data: customerStatus } = api.align.getCustomerStatus.useQuery(
    undefined, // no input
    { enabled: ready && authenticated }, // Only run if user is logged in
  );

  // In Lite mode, KYC is not required, so check if status is 'not_required' or 'approved'
  const isOnboardingComplete =
    customerStatus?.kycStatus === 'approved' ||
    customerStatus?.kycStatus === 'not_required';

  // Get the current step index
  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path),
  );

  // Calculate progress percentage
  const progressPercentage =
    currentStepIndex >= 0
      ? Math.round(((currentStepIndex + 1) / steps.length) * 100)
      : 0;

  // Logic for mobile step navigation
  const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const nextStep =
    currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  // Fetch user profile to access persisted email (may differ from Privy user obj)
  // const { data: userProfile } = api.user.getProfile.useQuery(undefined, {
  //   enabled: ready && authenticated, // only fetch when auth ready
  //   staleTime: 5 * 60 * 1000,
  // });

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      {/* Header - following design system */}
      <div className="bg-white border-b border-[#101010]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-0 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
              ONBOARDING
            </p>
            <h1 className="mt-1 font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Account Setup
            </h1>
          </div>
          {ready && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (authenticated) {
                  try {
                    await logout();
                    // Use window.location.href for a full page reload to ensure clean logout
                    window.location.href = '/';
                  } catch (error) {
                    console.error('Logout error:', error);
                    // Fallback to force redirect even if logout fails
                    window.location.href = '/';
                  }
                } else {
                  login();
                }
              }}
              className="mt-1 sm:mt-0"
            >
              {authenticated ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </>
              )}
            </Button>
          )}
        </div>

        {/* Add progress bar beneath header - visible on all screens */}
        <Progress value={progressPercentage} className="h-1 rounded-none" />
      </div>

      {/* Mobile Progress Indicator - visible only on small screens */}
      <div className="md:hidden bg-white border-b border-[#101010]/10 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium">
              {currentStepIndex + 1}
            </span>
            <span className="ml-2 text-sm font-medium">
              {steps[currentStepIndex]?.name}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Mobile Step Navigation */}
        <div className="flex items-center justify-between mt-2 pb-1">
          {prevStep ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-2"
              asChild
            >
              <Link href={prevStep.path}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                {prevStep.name}
              </Link>
            </Button>
          ) : (
            <div></div>
          )}

          {nextStep && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-2"
              asChild
            >
              <Link href={nextStep.path}>
                {nextStep.name}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Main Onboarding Section */}
      <div className="flex flex-1 w-full max-w-4xl mx-auto px-4 sm:px-0 lg:px-0 py-4 sm:py-6 lg:py-10 gap-4 flex-col lg:flex-row items-start ">
        {/* Main Content Card */}
        <main className="flex-1 flex flex-col items-start w-full order-2 lg:order-1">
          {/* --- Onboarding Completed Banner --- */}
          {isOnboardingComplete && (
            <Alert className="mb-4 sm:mb-6 w-full bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300">
              <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-300" />
              <AlertTitle className="text-green-800 dark:text-green-200">
                Onboarding Completed!
              </AlertTitle>
              <AlertDescription>
                You&apos;ve successfully set up your account. You can now access
                your{' '}
                <Link
                  href="/dashboard"
                  className="font-medium text-green-800 dark:text-green-200 underline hover:no-underline"
                >
                  dashboard
                </Link>
                .
              </AlertDescription>
            </Alert>
          )}
          {/* --- End Banner --- */}

          {children}
        </main>

        {/* Sidebar Stepper & Help - hidden on mobile, shown on desktop */}
        <aside className="hidden lg:flex w-full lg:w-72 flex-col gap-4 sticky top-24 self-start order-1 lg:order-2">
          {/* Stepper */}
          {/* KYB FAQ - Only show on KYC page */}
          {pathname === '/onboarding/kyc' && (
            <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-4">
              <h3 className="text-sm font-semibold mb-1">KYB FAQ</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Help for Delaware C-Corp verification
              </p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="business-name" className="border-b-0">
                  <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                    Business Name
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                    <p className="font-medium text-foreground">What it is</p>
                    <p>Your legal company name as registered with Delaware.</p>
                    <p className="font-medium text-foreground mt-2">
                      Where to find it
                    </p>
                    <p>
                      Certificate of Incorporation or Good Standing certificate.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="entity-id" className="border-b-0">
                  <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                    Business Entity ID (State Registration Number)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                    <p className="font-medium text-foreground">What it is</p>
                    <p>Your Delaware File Number.</p>
                    <p className="font-medium text-foreground mt-2">
                      Where to find it
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Certificate of Incorporation: top-left stamp</li>
                      <li>
                        Delaware business search or Good Standing certificate
                      </li>
                      <li>Emails from your registered agent</li>
                    </ul>
                    <p className="font-medium text-foreground mt-2">
                      What to paste
                    </p>
                    <p>
                      Digits only. Example: 7286832. Ignore &quot;SR …&quot;
                      numbers.
                    </p>
                    <p className="font-medium text-foreground mt-2">
                      Common mistakes
                    </p>
                    <p>
                      Using your EIN here, or pasting the SR receipt number.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ein" className="border-b-0">
                  <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                    Tax ID (EIN Number)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                    <p className="font-medium text-foreground">What it is</p>
                    <p>
                      Your Federal Employer Identification Number from the IRS.
                    </p>
                    <p className="font-medium text-foreground mt-2">
                      Where to find it
                    </p>
                    <p>
                      IRS CP-575 or SS-4 approval letter, prior returns, payroll
                      filings, bank or payroll dashboards. If you lost it,
                      request an IRS 147C letter.
                    </p>
                    <p className="font-medium text-foreground mt-2">
                      What to paste
                    </p>
                    <p>
                      9 digits. Use the field&apos;s format hint (12-3456789 or
                      123456789).
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ubos" className="border-b-0">
                  <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                    Ultimate Beneficial Owners (UBOs) & Founders
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                    <p className="font-medium text-foreground">What we need</p>
                    <p>
                      List all beneficial owners and all founders. Do not submit
                      a single contact only.
                    </p>
                    <p className="font-medium text-foreground mt-2">Why</p>
                    <p>
                      Regulations require KYB on the people who own or control
                      the company.
                    </p>
                    <p className="font-medium text-foreground mt-2">
                      How it works
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>You provide names and emails for each UBO/founder</li>
                      <li>
                        Each person will receive an email with a secure link to
                        complete KYC (ID, selfie, and basic details)
                      </li>
                      <li>
                        We cannot proceed until everyone on the list has
                        completed their KYC
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cap-table" className="border-b-0">
                  <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                    Shareholders Registry (Required)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                    <p className="font-medium text-foreground">What it is</p>
                    <p>A simple document showing who owns what.</p>
                    <p className="font-medium text-foreground mt-2">
                      Easy options
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>If you use Carta, export a current cap table PDF</li>
                      <li>
                        If you do not, generate a one-pager and upload it as PDF
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="registration" className="border-b-0">
                  <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                    Business Registration Document (Required)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                    <p className="font-medium text-foreground">What it is</p>
                    <p>A document that proves your company exists.</p>
                    <p className="font-medium text-foreground mt-2">
                      Accepted for Delaware C-Corp
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Certificate of Incorporation (stamped)</li>
                      <li>Certificate of Good Standing (recent)</li>
                      <li>
                        A certified copy from the Delaware Division of
                        Corporations
                      </li>
                    </ul>
                    <p className="font-medium text-foreground mt-2">
                      Where to get it
                    </p>
                    <p>
                      From your registered agent portal or the Delaware Division
                      of Corporations. Stripe Atlas/Clerky usually provide the
                      PDFs.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="source-of-funds" className="border-b-0">
                  <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                    Source of Funds (Optional)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                    <p className="font-medium text-foreground">What it is</p>
                    <p>
                      A short note or document showing where the initial money
                      comes from.
                    </p>
                    <p className="font-medium text-foreground mt-2">
                      Examples we accept
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        Investment docs: SAFE or priced round closing notice
                      </li>
                      <li>
                        Bank statement or wire receipt showing founder deposit
                        or investor funds
                      </li>
                      <li>
                        Revenue evidence: Stripe or PayPal dashboard screenshot
                        with recent payouts
                      </li>
                      <li>Grant or accelerator award letter</li>
                    </ul>
                    <p className="font-medium text-foreground mt-2">Tips</p>
                    <p>
                      Mask full account numbers. Make sure the company name
                      matches your entity.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dba" className="border-b-0">
                  <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                    Doing Business As Document (Optional)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                    <p>
                      If your company operates under a different name than your
                      legal entity name, provide a DBA certificate or fictitious
                      business name filing.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="proof-address" className="border-b-0">
                  <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                    Proof of Address (within 3 months, Required)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                    <p className="font-medium text-foreground">
                      What it must do
                    </p>
                    <p>
                      Confirm your current operating address and be addressed to
                      the applying entity.
                    </p>
                    <p className="font-medium text-foreground mt-2">
                      Commonly accepted documents
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Lease or utility bill</li>
                      <li>Bank statement or merchant account statement</li>
                      <li>Business insurance policy or premium notice</li>
                      <li>Recent government or tax notice to the company</li>
                    </ul>
                    <p className="font-medium text-foreground mt-2">
                      Requirements
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        Shows the legal company name and the same address you
                        entered
                      </li>
                      <li>
                        Clearly dated and recent (within the last 3 months)
                      </li>
                      <li>
                        Street address preferred. P.O. Boxes are usually not
                        accepted for operating address.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {/* Help/Support Section */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-4 flex flex-col items-center text-center mt-auto">
            <span className="text-sm font-semibold mb-1">Need help?</span>
            <span className="text-xs text-muted-foreground mb-2">
              Book a personalized demo with our team and we&apos;ll walk you
              through everything.
            </span>
            <Link
              href="https://cal.com/potato/0-finance-onboarding"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1B29FF] text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-[#1420CC] transition-colors inline-flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" />
              Book Demo
            </Link>
          </div>
        </aside>
      </div>

      {/* Add a text progress indicator beneath the content */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 -mt-2 mb-4 hidden sm:block lg:hidden">
        <div className="text-xs text-muted-foreground text-center">
          Step {currentStepIndex + 1} of {steps.length} • {progressPercentage}%
          complete
        </div>
      </div>

      {/* Mobile Bottom Help - Only visible on mobile */}
      <div className="lg:hidden bg-white border-t border-[#101010]/10 p-3 mt-2">
        <div className="text-center">
          <span className="text-sm font-semibold block">Need help?</span>
          <Link
            href="https://cal.com/potato/0-finance-onboarding"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
          >
            <Calendar className="h-3 w-3" />
            Book Demo
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-2 sm:py-3 px-4 sm:px-6 text-center text-[#101010]/60 text-xs border-t border-[#101010]/10 mt-auto">
        <div className="max-w-4xl mx-auto">
          &copy; {new Date().getFullYear()} zero finance. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
