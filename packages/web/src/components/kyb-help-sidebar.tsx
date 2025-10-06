'use client';

import React from 'react';
import { Sparkles, BookOpen, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KybAiAssistant } from '@/components/kyb-ai-assistant';
import { CsvToPdfConverter } from '@/components/csv-to-pdf-converter';

export function KybHelpSidebar() {
  return (
    <>
      <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-4">
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="faq" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-0">
            <h3 className="text-sm font-semibold mb-1">KYB FAQ</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Help for Delaware C-Corp verification
            </p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="partners" className="border-b-0">
                <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                  Who are your verification partners?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                  <p className="font-medium text-foreground">AiPrise</p>
                  <p>
                    Handles all identity verification (KYB) for your business.
                    AiPrise is a regulated compliance provider that verifies
                    business documents, entity information, and individual
                    identities (ID + selfie) for beneficial owners and founders.
                  </p>
                  <p className="font-medium text-foreground mt-2">
                    What to expect
                  </p>
                  <p>
                    You&apos;ll complete the business verification directly
                    through AiPrise. When you add beneficial owners or founders,
                    each person receives a secure email from AiPrise to complete
                    their personal verification.
                  </p>
                  <p className="font-medium text-foreground mt-2">Align</p>
                  <p>
                    Our financial services provider that enables deposits and
                    transfers. Align will ask you some additional questions
                    during the onboarding process to set up your banking
                    features.
                  </p>
                  <p className="font-medium text-foreground mt-2">
                    Why we use partners
                  </p>
                  <p>
                    These specialized providers ensure fast, secure, and
                    compliant verification and banking services. Your data is
                    encrypted and handled according to strict security
                    standards.
                  </p>
                </AccordionContent>
              </AccordionItem>

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
                      <a
                        href="https://icis.corp.delaware.gov/eCorp/EntitySearch/NameSearch.aspx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Delaware business search
                      </a>{' '}
                      or Good Standing certificate
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
                  <p>Using your EIN here, or pasting the SR receipt number.</p>
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
                    filings, bank or payroll dashboards. If you lost it, request
                    an IRS 147C letter.
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
                    You must add ALL beneficial owners (25%+ ownership) and ALL
                    founders. This is required by financial regulations - you
                    cannot skip anyone.
                  </p>
                  <p className="font-medium text-foreground mt-2">
                    How it works
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Provide names and emails for each person</li>
                    <li>
                      Each receives an email from{' '}
                      <span className="font-semibold">AiPrise</span> to complete
                      identity verification (ID + selfie, 2-3 minutes)
                    </li>
                    <li>
                      We cannot proceed until everyone completes their
                      verification
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="role-assignments" className="border-b-0">
                <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                  Role Assignments (Beneficial Owner, Controlling Person, etc.)
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground space-y-2 pb-3">
                  <p className="font-medium text-foreground">
                    The three role types
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      <span className="font-semibold">Beneficial Owner:</span>{' '}
                      Anyone with 25%+ ownership (required by regulations)
                    </li>
                    <li>
                      <span className="font-semibold">Controlling Person:</span>{' '}
                      Executives, directors, or key decision-makers
                    </li>
                    <li>
                      <span className="font-semibold">
                        Authorized Representative:
                      </span>{' '}
                      Someone authorized to sign documents for the company
                    </li>
                  </ul>
                  <p className="font-medium text-foreground mt-2">Important</p>
                  <p>
                    One person can have multiple roles if they apply (e.g.,
                    founder-CEO with 40% = all three). Only select roles that
                    actually describe each person. Everyone you add receives a
                    verification email from AiPrise regardless of role.
                  </p>
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
                    Preferred Formats
                  </p>
                  <p className="text-foreground">
                    ✅ Excel (.xlsx, .xls) or CSV - Recommended for easier
                    processing
                  </p>
                  <p className="text-muted-foreground">
                    ⚠️ PDF - Accepted but formatting can be inconsistent
                  </p>

                  <p className="font-medium text-foreground mt-2">
                    Easy options
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      If you use Carta, export as Excel/CSV (preferred) or PDF
                    </li>
                    <li>
                      If you use Google Sheets/Excel: Export directly or
                      download as CSV
                    </li>
                    <li>
                      If you do not have one, use the ChatGPT prompts below to
                      generate one
                    </li>
                  </ul>

                  <p className="font-medium text-foreground mt-2">
                    Have a CSV or Excel file?
                  </p>
                  <p>
                    Switch to the <span className="font-semibold">Tools</span>{' '}
                    tab above to convert your spreadsheet to PDF format for
                    upload.
                  </p>

                  <p className="font-medium text-foreground mt-2">
                    ChatGPT Prompt for Delaware C-Corp
                  </p>
                  <div className="text-xs bg-[#F7F7F2] p-2 rounded mt-1 font-mono">
                    <p className="mb-1 font-sans font-medium text-foreground">
                      Copy and paste this into ChatGPT, then export as
                      Excel/CSV:
                    </p>
                    <p className="whitespace-pre-wrap">
                      Create a simple shareholder registry for a Delaware C-Corp
                      as a one-page table. Columns: Shareholder name, Email,
                      Role (founder/investor/employee), Security type
                      (common/preferred/SAFE/option), Shares or % ownership
                      (both if known), Fully diluted %, Vesting (start date,
                      cliff, schedule), Notes. Include a footer line:
                      &quot;Informational cap table snapshot for KYB. Not a
                      legal certificate.&quot; Fill it with placeholders I can
                      edit.
                    </p>
                  </div>
                  <p className="font-medium text-foreground mt-2">
                    ChatGPT Prompt for LLC
                  </p>
                  <div className="text-xs bg-[#F7F7F2] p-2 rounded mt-1 font-mono">
                    <p className="mb-1 font-sans font-medium text-foreground">
                      Copy and paste this into ChatGPT, then export as
                      Excel/CSV:
                    </p>
                    <p className="whitespace-pre-wrap">
                      Create a simple member registry for an LLC as a one-page
                      table. Columns: Member name, Email, Role (manager/member),
                      Membership units or % ownership, Capital contribution
                      amount, Capital contribution date, Voting rights (yes/no),
                      Profit/loss allocation %, Notes. Include a footer line:
                      &quot;Informational member registry snapshot for KYB. Not
                      a legal certificate.&quot; Fill it with placeholders I can
                      edit.
                    </p>
                  </div>
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
                      Bank statement or wire receipt showing founder deposit or
                      investor funds
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
                  <p className="font-medium text-foreground">What it must do</p>
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
                    <li>Clearly dated and recent (within the last 3 months)</li>
                    <li>
                      Street address preferred. P.O. Boxes are usually not
                      accepted for operating address.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="tools" className="mt-0 space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI KYB Assistant
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Ask questions about KYB requirements
              </p>
              <KybAiAssistant />
            </div>

            <div className="border-t border-[#101010]/10 pt-6">
              <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Cap Table Converter
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Convert your CSV or Excel cap table to PDF format
              </p>
              <CsvToPdfConverter />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-4 flex flex-col items-center text-center mt-auto">
        <span className="text-sm font-semibold mb-1">Need help?</span>
        <span className="text-xs text-muted-foreground mb-2">
          Book a personalized demo with our team and we&apos;ll walk you through
          everything.
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
    </>
  );
}
