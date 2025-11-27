'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface InsuranceTermsDialogProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export function InsuranceTermsDialog({
  open,
  onAccept,
  onCancel,
}: InsuranceTermsDialogProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-semibold">
            Insurance Terms & Conditions
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#101010]/60">
            Security Services Guarantee — Last updated: {currentDate}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-6 text-[13px] text-[#101010]/80 leading-relaxed">
            {/* Coverage Summary */}
            <section>
              <h3 className="text-[15px] font-medium text-[#101010] mb-3">
                Coverage Overview
              </h3>
              <p>
                Insurance coverage (up to $1M) is provided by Chainproof, a
                licensed insurer. In the event of a security exploit due to
                smart contract vulnerabilities in approved DeFi protocols, Zero
                Finance will reimburse you up to your chosen Maximum Coverage
                amount for the loss or theft of your deposits, subject to the
                terms and conditions below.
              </p>
            </section>

            {/* What's Covered */}
            <section>
              <h3 className="text-[15px] font-medium text-[#101010] mb-3">
                What's Covered
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Smart contract vulnerabilities in approved DeFi protocols
                </li>
                <li>Loss or theft of deposits up to Maximum Coverage amount</li>
                <li>Accrued interest or yield at time of incident</li>
                <li>100% principal protection on covered protocols</li>
              </ul>
            </section>

            {/* What's NOT Covered */}
            <section>
              <h3 className="text-[15px] font-medium text-[#101010] mb-3">
                What's NOT Covered
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Oracle failures or manipulation</li>
                <li>Blockchain layer attacks</li>
                <li>Frontend attacks or phishing schemes</li>
                <li>Social engineering resulting in credential theft</li>
                <li>Governance attacks or voting manipulation</li>
                <li>User errors or excessive token approvals</li>
                <li>
                  Attacks involving privileged roles or multi-signature wallets
                </li>
              </ul>
            </section>

            {/* Coverage Limits */}
            <section>
              <h3 className="text-[15px] font-medium text-[#101010] mb-3">
                Coverage Limits
              </h3>
              <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#101010]/60">
                    Maximum per Protocol
                  </span>
                  <span className="font-medium tabular-nums">$1,000,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#101010]/60">Processing Fee</span>
                  <span className="font-medium">5% of coverage amount</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#101010]/60">Supported Networks</span>
                  <span className="font-medium">Ethereum, Base, Arbitrum</span>
                </div>
              </div>
            </section>

            {/* Reporting Requirements */}
            <section>
              <h3 className="text-[15px] font-medium text-[#101010] mb-3">
                Reporting Requirements
              </h3>
              <p className="mb-3">
                In the event of a covered incident, you must:
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Report the incident within 24 hours of discovery</li>
                <li>
                  Provide all transaction details and relevant documentation
                </li>
                <li>Cooperate with our investigation process</li>
                <li>File a police report if requested (within 7 days)</li>
              </ol>
            </section>

            {/* Jurisdiction */}
            <section>
              <h3 className="text-[15px] font-medium text-[#101010] mb-3">
                Jurisdiction & Eligibility
              </h3>
              <p className="mb-3">
                This insurance coverage is only offered to residents of the
                United States, Canada, Mexico, Great Britain, and their
                territories. Coverage is not available in restricted
                jurisdictions including sanctioned countries.
              </p>
              <p>
                By accepting these terms, you confirm that you are not a
                Restricted Person and will not use this service from any
                Restricted Jurisdiction.
              </p>
            </section>

            {/* Full Terms Link */}
            <section className="pt-4 border-t border-[#101010]/10">
              <a
                href="/legal/insurance-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B29FF] hover:underline flex items-center gap-1 text-[13px]"
              >
                Read full terms and conditions
                <ExternalLink className="h-3 w-3" />
              </a>
            </section>
          </div>
        </div>

        <DialogFooter className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC] text-white"
            type="button"
          >
            Accept & Activate Insurance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
