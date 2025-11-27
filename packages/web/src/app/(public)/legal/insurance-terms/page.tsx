import Link from 'next/link';
import { Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insurance Terms & Conditions | 0 Finance',
  description:
    'Security Services Guarantee and insurance coverage details for 0 Finance deposits',
};

export default function InsuranceTermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <div className="max-w-[800px] mx-auto px-6 py-16 sm:py-24">
        <Link
          href="/dashboard/savings"
          className="inline-flex items-center gap-2 text-[14px] text-[#1B29FF] hover:text-[#1420CC] transition-colors mb-8"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white border border-[#101010]/10 rounded-lg p-8 sm:p-12 space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#1B29FF]" />
              </div>
              <div>
                <h1 className="font-serif text-[32px] sm:text-[40px] leading-[1.1] text-[#101010]">
                  Insurance Terms & Conditions
                </h1>
                <p className="text-[14px] text-[#101010]/60 mt-1">
                  Last updated: October 19, 2025
                </p>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-[24px] font-serif text-[#101010]">
              Coverage Overview
            </h2>
            <p className="text-[15px] leading-[1.6] text-[#101010]/80">
              In the event of a security exploit due to smart contract
              vulnerabilities in approved DeFi protocols, 0 Finance will
              reimburse you up to your chosen Maximum Coverage amount for the
              loss or theft of your deposits, subject to the terms and
              conditions below.
            </p>
            <div className="bg-[#1B29FF]/5 border border-[#1B29FF]/20 rounded-md p-4">
              <p className="text-[14px] text-[#101010]/70">
                <strong className="text-[#101010]">Important:</strong> Insurance
                coverage up to $1M is provided by Chainproof, a licensed
                insurer, at no additional cost for all deposits. Coverage
                applies automatically to approved vaults.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[24px] font-serif text-[#101010]">
              What's Covered
            </h2>
            <ul className="space-y-3">
              {[
                'Smart contract vulnerabilities in approved DeFi protocols',
                'Loss or theft of deposits up to Maximum Coverage amount',
                'Accrued interest or yield at time of incident',
                '100% principal protection on covered protocols',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] text-[#101010]/80">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-[24px] font-serif text-[#101010]">
              What's NOT Covered
            </h2>
            <ul className="space-y-3">
              {[
                'Oracle failures or manipulation',
                'Blockchain layer attacks',
                'Frontend attacks or phishing schemes',
                'Social engineering resulting in credential theft',
                'Governance attacks or voting manipulation',
                'User errors or excessive token approvals',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] text-[#101010]/80">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-[24px] font-serif text-[#101010]">
              Coverage Limits
            </h2>
            <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-md p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#101010]/10">
                <span className="text-[14px] text-[#101010]/60">
                  Maximum per Protocol
                </span>
                <span className="text-[16px] font-medium tabular-nums text-[#101010]">
                  $1,000,000
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#101010]/10">
                <span className="text-[14px] text-[#101010]/60">
                  Processing Fee
                </span>
                <span className="text-[16px] font-medium text-[#101010]">
                  5% of coverage amount
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#101010]/60">
                  Supported Networks
                </span>
                <span className="text-[16px] font-medium text-[#101010]">
                  Ethereum, Base, Arbitrum
                </span>
              </div>
            </div>
            <div className="bg-[#FFF8E6] border border-[#FFA500]/20 rounded-md p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-[#FFA500] flex-shrink-0 mt-0.5" />
              <p className="text-[14px] text-[#101010]/80">
                The insurance premium is already deducted from your APY. You
                will never be charged separately for coverage.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[24px] font-serif text-[#101010]">
              Reporting Requirements
            </h2>
            <p className="text-[15px] leading-[1.6] text-[#101010]/80 mb-4">
              In the event of a covered incident, you must:
            </p>
            <ol className="space-y-3 list-decimal list-inside">
              {[
                'Report the incident within 24 hours of discovery',
                'Provide all transaction details and relevant documentation',
                'Cooperate with our investigation process',
                'File a police report if requested (within 7 days)',
              ].map((item, index) => (
                <li key={index} className="text-[15px] text-[#101010]/80 pl-2">
                  {item}
                </li>
              ))}
            </ol>
            <div className="mt-4 bg-[#F7F7F2] border border-[#101010]/10 rounded-md p-4">
              <p className="text-[14px] text-[#101010]/70">
                <strong className="text-[#101010]">Contact for claims:</strong>{' '}
                insurance@0finance.com
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[24px] font-serif text-[#101010]">
              Jurisdiction & Eligibility
            </h2>
            <p className="text-[15px] leading-[1.6] text-[#101010]/80">
              This insurance coverage is only offered to residents of the United
              States, Canada, Mexico, Great Britain, and their territories.
              Coverage is not available in restricted jurisdictions including
              sanctioned countries.
            </p>
            <p className="text-[15px] leading-[1.6] text-[#101010]/80">
              By activating insurance coverage, you confirm that you are
              eligible under these jurisdictional requirements and agree to all
              terms outlined in this document.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[24px] font-serif text-[#101010]">
              Changes to Terms
            </h2>
            <p className="text-[15px] leading-[1.6] text-[#101010]/80">
              0 Finance reserves the right to modify these terms at any time. We
              will notify users of material changes via email and in-app
              notifications. Continued use of insurance coverage after changes
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="pt-8 border-t border-[#101010]/10">
            <p className="text-[13px] text-[#101010]/60">
              Insurance coverage is provided by Chainproof, a licensed insurer.
              These terms are provided in partnership with Quantstamp for DeFi
              Protection. For questions about coverage, contact{' '}
              <a
                href="mailto:insurance@0finance.com"
                className="text-[#1B29FF] hover:underline"
              >
                insurance@0finance.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
