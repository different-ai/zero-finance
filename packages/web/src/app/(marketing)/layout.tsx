import Link from 'next/link';
import Image from 'next/image';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/new-logo-bluer.png"
              alt="Zero Finance"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
            <span className="ml-2 font-bold text-[#0050ff] text-[13px] sm:text-[14px] tracking-tight">
              finance
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/compare"
              className="hidden sm:inline-flex items-center text-[14px] text-[#101010] hover:text-[#0050ff] transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/runway-calculator"
              className="hidden sm:inline-flex items-center text-[14px] text-[#101010] hover:text-[#0050ff] transition-colors"
            >
              Calculator
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center px-5 py-2 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      {children}

      {/* Footer */}
      <footer className="border-t border-[#101010]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="text-[12px] text-[#101010]/60">
                © 2025 0 Finance
              </span>
              <Link
                href="/legal"
                className="text-[12px] text-[#101010]/60 hover:text-[#101010]"
              >
                Legal & Security
              </Link>
              <Link
                href="/privacy"
                className="text-[12px] text-[#101010]/60 hover:text-[#101010]"
              >
                Privacy
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/high-yield-startup-savings"
                className="text-[12px] text-[#101010]/60 hover:text-[#0050ff]"
              >
                High Yield Savings
              </Link>
              <Link
                href="/extend-runway"
                className="text-[12px] text-[#101010]/60 hover:text-[#0050ff]"
              >
                Extend Runway
              </Link>
              <Link
                href="/startup-treasury"
                className="text-[12px] text-[#101010]/60 hover:text-[#0050ff]"
              >
                Treasury Management
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
