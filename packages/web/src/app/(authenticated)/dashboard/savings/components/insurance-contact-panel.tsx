import { Mail, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { ZERO_LOGO_SRC, INSURANCE_CONTACT } from '../demo-data';

export function InsuranceContactPanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={ZERO_LOGO_SRC}
            alt="0 Finance logo"
            width={42}
            height={42}
            className="h-10 w-10 rounded-md"
          />
          <div>
            <p className="text-[15px] font-medium text-[#101010]">
              Speak with our coverage team
            </p>
            <p className="text-[13px] text-[#101010]/70 max-w-[420px]">
              We arrange bespoke insurance policies for treasury deposits. Reach
              out to secure coverage on this 8% vault.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`mailto:${INSURANCE_CONTACT.email}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
          >
            <Mail className="h-4 w-4" /> Email {INSURANCE_CONTACT.email}
          </a>
          <a
            href={INSURANCE_CONTACT.scheduleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium text-[#101010] border border-[#101010]/15 hover:bg-[#F7F7F2] transition-colors"
          >
            <CalendarDays className="h-4 w-4" /> Schedule a call
          </a>
        </div>
      </div>
      <div className="border border-dashed border-[#1B29FF]/30 rounded-lg p-4 bg-[#1B29FF]/5">
        <p className="text-[13px] text-[#1B29FF]">
          Coverage is issued through our underwriting partners after a short
          call. We&apos;ll validate treasury size, coverage needs, and onboard
          you end-to-end.
        </p>
      </div>
    </div>
  );
}
