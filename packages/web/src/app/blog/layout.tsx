import Link from 'next/link';
import Image from 'next/image';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#101010]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
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

            <nav className="flex items-center gap-6">
              <Link
                href="/blog"
                className="text-[14px] text-[#101010] hover:text-[#0050ff] transition-colors"
              >
                All Posts
              </Link>
              <Link
                href="/high-yield-startup-savings"
                className="text-[14px] text-[#101010] hover:text-[#0050ff] transition-colors"
              >
                Product
              </Link>
              <Link
                href="/signin"
                className="inline-flex items-center px-5 py-2 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              >
                Get Started →
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {children}

      {/* Footer */}
      <footer className="bg-white border-t border-[#101010]/10 mt-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-[12px] text-[#101010]/60">
              © 2025 0 Finance - 8% yield through DeFi protocols with smart
              contract insurance
            </p>
            <div className="flex gap-4">
              <Link
                href="/blog"
                className="text-[12px] text-[#101010]/60 hover:text-[#0050ff]"
              >
                Blog
              </Link>
              <Link
                href="/compare"
                className="text-[12px] text-[#101010]/60 hover:text-[#0050ff]"
              >
                Compare
              </Link>
              <Link
                href="/runway-calculator"
                className="text-[12px] text-[#101010]/60 hover:text-[#0050ff]"
              >
                Calculator
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
