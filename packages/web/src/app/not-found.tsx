import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | 0 Finance',
  description:
    'The page you are looking for does not exist. Return to 0 Finance to earn 8% on your startup treasury.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center px-4">
      <div className="max-w-[600px] text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <span className="text-[120px] sm:text-[160px] font-serif leading-none text-[#101010]">
            404
          </span>
          <div className="mt-2 text-[14px] uppercase tracking-[0.14em] text-[#101010]/60">
            Page Not Found
          </div>
        </div>

        {/* Message */}
        <h1 className="font-serif text-[28px] sm:text-[36px] leading-[1.1] text-[#101010] mb-4">
          This page seems to have negative yield
        </h1>
        <p className="text-[16px] text-[#101010]/70 mb-8 max-w-[450px] mx-auto">
          Unlike this missing page, your treasury could be earning 8% right now.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
          >
            Back to Home →
          </Link>
          <Link
            href="/runway-calculator"
            className="inline-flex items-center text-[15px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
          >
            Calculate Your Runway
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-[#101010]/10">
          <p className="text-[12px] uppercase tracking-[0.14em] text-[#101010]/60 mb-4">
            Popular Pages
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-[14px]">
            <Link
              href="/high-yield-startup-savings"
              className="text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
            >
              High Yield Savings
            </Link>
            <Link
              href="/startup-treasury"
              className="text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
            >
              Treasury Management
            </Link>
            <Link
              href="/compare"
              className="text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
            >
              Compare Options
            </Link>
            <Link
              href="/signin"
              className="text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
