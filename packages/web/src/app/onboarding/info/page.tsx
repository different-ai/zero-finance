'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function InfoPage() {
  const router = useRouter();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Platform Information</h3>

      <div className="space-y-6 mb-6">
        <div>
          <h4 className="font-medium text-lg mb-2">Current Capabilities</h4>
          <p className="mb-3">
            With your Primary Safe set up, hyprsqrl supports:
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Creating and sending invoices</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Receiving payments FIAT & crypto payments</span>
            </li>

            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Managing invoices through your dashboard</span>
            </li>


            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>You can request a bank account (IBAN or ACH)</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-lg mb-2">Coming Soon</h4>
          <p className="mb-3">We&apos;re actively working on:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-blue-500 text-xs">→</span>
              </div>
              <span>Automated fund allocation (Tax, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-blue-500 text-xs">→</span>
              </div>
              <span>Debit card payment options</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-blue-500 text-xs">→</span>
              </div>
              <span>AI-powered insights and financial automation</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex mb-6 gap-4">
        <Link
          href="https://hyprsqrl.com/roadmap"
          target="_blank"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm"
        >
          View Full Roadmap <ExternalLink className="ml-1 h-3 w-3" />
        </Link>
        <Link
          href="https://github.com/different-ai/hypr-v0/issues/new"
          target="_blank"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm"
        >
          Request Features <ExternalLink className="ml-1 h-3 w-3" />
        </Link>
      </div>

      <div className="flex justify-between mt-8">
        <Link
          href="/onboarding/create-safe"
          className="px-4 py-2 text-muted-foreground border border-border rounded-md hover:bg-muted transition-colors"
        >
          Back
        </Link>

        <Link
          href="/onboarding/complete"
          className="px-4 py-2 bg-primary text-white rounded-md inline-flex items-center font-medium hover:bg-primary/90 transition-colors"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
