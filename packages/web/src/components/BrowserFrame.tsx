import React from 'react';

interface BrowserFrameProps {
  children: React.ReactNode;
  url?: string;
  className?: string;
  showDemoBadge?: boolean;
}

export function BrowserFrame({
  children,
  url = 'app.0.finance',
  className = '',
  showDemoBadge = false,
}: BrowserFrameProps) {
  return (
    <div
      className={`bg-white border border-[#101010]/10 rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      {/* Browser Chrome */}
      <div className="bg-[#F6F5EF] border-b border-[#101010]/10 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28CA42]"></div>
          </div>

          {/* URL Bar */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="bg-white border border-[#101010]/10 rounded-md px-3 py-1.5 text-center">
              <span className="text-[13px] text-[#101010]/60 font-medium">
                {url}
              </span>
            </div>
          </div>

          {/* Right side spacer for balance */}
          <div className="w-20"></div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="bg-white relative">
        {/* Optional Demo Badge - corner style */}
        {showDemoBadge && (
          <div className="absolute top-4 right-4 z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1B29FF]/5 backdrop-blur-sm border border-[#1B29FF]/20 rounded-md">
              <div className="w-1 h-1 bg-[#1B29FF] rounded-full"></div>
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#1B29FF] font-medium">
                Demo
              </span>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// Minimal version without URL bar
export function MinimalBrowserFrame({
  children,
  className = '',
}: Omit<BrowserFrameProps, 'url'>) {
  return (
    <div
      className={`bg-white border border-[#101010]/10 rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      {/* Minimal Browser Chrome */}
      <div className="bg-[#F6F5EF] border-b border-[#101010]/10 px-4 py-2.5">
        <div className="flex items-center">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA42]"></div>
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="bg-white">{children}</div>
    </div>
  );
}
