'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBimodal } from '@/components/ui/bimodal';

interface CryptoDepositDisplayProps {
  safeAddress: string;
  chainName?: string;
  className?: string;
}

export function CryptoDepositDisplay({
  safeAddress,
  chainName = 'Base',
  className,
}: CryptoDepositDisplayProps) {
  const { isTechnical } = useBimodal();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(safeAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Address Card */}
      <div
        className={cn(
          'relative overflow-hidden',
          isTechnical
            ? 'bg-white border border-[#1B29FF]/30 p-6'
            : 'bg-white border border-[#101010]/10 rounded-[12px] p-6 shadow-[0_2px_8px_rgba(16,16,16,0.04)]',
        )}
      >
        {/* Network Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <img src="/logos/_base-logo.svg" alt="Base" className="h-5 w-5" />
            <span
              className={cn(
                isTechnical
                  ? 'font-mono text-[12px] text-[#1B29FF] uppercase'
                  : 'text-[14px] font-medium text-[#101010]',
              )}
            >
              {isTechnical
                ? `CHAIN::${chainName.toUpperCase()}`
                : `${chainName} Network`}
            </span>
          </div>
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em]',
              isTechnical
                ? 'bg-[#1B29FF]/10 text-[#1B29FF] font-mono border border-[#1B29FF]/20'
                : 'bg-[#10B981]/10 text-[#10B981] rounded-full',
            )}
          >
            {isTechnical ? 'ACTIVE' : 'Active'}
          </span>
        </div>

        {/* Address Display */}
        <div className="space-y-3">
          <p
            className={cn(
              'uppercase tracking-[0.14em] text-[10px]',
              isTechnical ? 'font-mono text-[#1B29FF]/70' : 'text-[#101010]/50',
            )}
          >
            {isTechnical ? 'SAFE_ADDRESS' : 'Your deposit address'}
          </p>

          {/* Full Address with Copy */}
          <div
            className={cn(
              'flex items-center gap-3 p-4',
              isTechnical
                ? 'bg-[#1B29FF]/5 border border-[#1B29FF]/10'
                : 'bg-[#F7F7F2] rounded-lg',
            )}
          >
            <code
              className={cn(
                'flex-1 text-[13px] break-all select-all',
                isTechnical
                  ? 'font-mono text-[#1B29FF]'
                  : 'font-mono text-[#101010]',
              )}
            >
              {safeAddress}
            </code>
            <button
              onClick={handleCopy}
              className={cn(
                'flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-all',
                isTechnical
                  ? 'font-mono border border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/10 hover:border-[#1B29FF]'
                  : 'bg-white border border-[#101010]/10 text-[#101010] rounded-md hover:border-[#1B29FF] hover:text-[#1B29FF]',
              )}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>{isTechnical ? 'COPIED' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>{isTechnical ? 'COPY' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Crosshair decoration for technical mode */}
        {isTechnical && (
          <div className="absolute top-4 right-4 h-3 w-3">
            <div className="absolute top-1/2 w-full h-px bg-[#1B29FF]/40" />
            <div className="absolute left-1/2 h-full w-px bg-[#1B29FF]/40" />
          </div>
        )}
      </div>

      {/* View on Explorer Link */}
      <a
        href={`https://basescan.org/address/${safeAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-2 text-[13px] transition-colors',
          isTechnical
            ? 'font-mono text-[#1B29FF] hover:text-[#1B29FF]/70'
            : 'text-[#101010]/60 hover:text-[#1B29FF]',
        )}
      >
        <ExternalLink className="h-4 w-4" />
        {isTechnical ? 'VIEW::BASESCAN' : 'View on Basescan'}
      </a>
    </div>
  );
}
