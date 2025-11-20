'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Blueprint Grid Background
export const BlueprintGrid = ({ className }: { className?: string }) => (
  <div
    className={cn('absolute inset-0 pointer-events-none', className)}
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(27,41,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(27,41,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
    }}
  />
);

// Architectural Crosshairs
export const Crosshairs = ({
  position = 'top-left',
  className,
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}) => {
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  return (
    <div
      className={cn('absolute h-3 w-3', positionClasses[position], className)}
    >
      <div className="absolute top-1/2 w-full h-px bg-[#1B29FF]/40" />
      <div className="absolute left-1/2 h-full w-px bg-[#1B29FF]/40" />
    </div>
  );
};

// Bimodal Toggle Switch
interface BimodalToggleProps {
  isTechnical: boolean;
  onToggle: () => void;
  className?: string;
  showLabels?: boolean;
}

export const BimodalToggle = ({
  isTechnical,
  onToggle,
  className,
  showLabels = true,
}: BimodalToggleProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabels && (
        <span
          className={cn(
            'text-[12px] transition-colors duration-200',
            isTechnical ? 'text-[#101010]/50' : 'text-[#101010] font-medium',
          )}
        >
          Banking
        </span>
      )}
      <button
        onClick={onToggle}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300',
          isTechnical ? 'bg-[#1B29FF]' : 'bg-[#101010]/10',
        )}
        aria-label={
          isTechnical ? 'Switch to Banking mode' : 'Switch to Technical mode'
        }
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300 shadow-sm',
            isTechnical ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
      {showLabels && (
        <span
          className={cn(
            'text-[12px] transition-colors duration-200 font-mono',
            isTechnical ? 'text-[#1B29FF] font-medium' : 'text-[#101010]/50',
          )}
        >
          Technical
        </span>
      )}
    </div>
  );
};

// Bimodal Card Container
interface BimodalCardProps {
  isTechnical: boolean;
  children: React.ReactNode;
  className?: string;
  showCrosshairs?: boolean;
  metaTag?: string;
}

export const BimodalCard = ({
  isTechnical,
  children,
  className,
  showCrosshairs = true,
  metaTag,
}: BimodalCardProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isTechnical
          ? 'bg-white border border-[#1B29FF]/20 rounded-sm shadow-none'
          : 'bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] hover:shadow-[0_6px_16px_rgba(16,16,16,0.08)]',
        className,
      )}
    >
      {/* Blueprint Grid (Technical only) */}
      {isTechnical && <BlueprintGrid />}

      {/* Crosshairs (Technical only) */}
      {isTechnical && showCrosshairs && (
        <>
          <Crosshairs position="top-left" />
          <Crosshairs position="top-right" />
        </>
      )}

      {/* Meta Tag (Technical only) */}
      {isTechnical && metaTag && (
        <div className="absolute top-2 right-8 font-mono text-[9px] text-[#101010]/40 tracking-wider">
          {metaTag}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Bimodal Label
interface BimodalLabelProps {
  isTechnical: boolean;
  bankingText: string;
  technicalText?: string;
  className?: string;
}

export const BimodalLabel = ({
  isTechnical,
  bankingText,
  technicalText,
  className,
}: BimodalLabelProps) => {
  return (
    <p
      className={cn(
        'transition-all duration-200',
        isTechnical
          ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
          : 'uppercase tracking-[0.14em] text-[11px] text-[#101010]/60',
        className,
      )}
    >
      {isTechnical
        ? technicalText || bankingText.toUpperCase().replace(/ /g, '::')
        : bankingText}
    </p>
  );
};

// Bimodal Amount Display
interface BimodalAmountProps {
  isTechnical: boolean;
  amount: number;
  currency?: string;
  tokenSymbol?: string;
  className?: string;
  showUsdEquivalent?: boolean;
}

export const BimodalAmount = ({
  isTechnical,
  amount,
  currency = 'USD',
  tokenSymbol = 'USDC',
  className,
  showUsdEquivalent = true,
}: BimodalAmountProps) => {
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (isTechnical) {
    return (
      <div className={className}>
        <p className="font-mono text-[28px] tabular-nums text-[#101010]">
          {formattedAmount}
          <span className="ml-1 text-[14px] text-[#1B29FF]">{tokenSymbol}</span>
        </p>
        {showUsdEquivalent && (
          <p className="mt-1 font-mono text-[11px] text-[#101010]/60">
            ≈ ${formattedAmount} {currency}
          </p>
        )}
      </div>
    );
  }

  return (
    <p
      className={cn(
        'text-[32px] sm:text-[40px] font-semibold leading-[0.95] tabular-nums text-[#101010]',
        className,
      )}
    >
      ${formattedAmount}
    </p>
  );
};

// Bimodal Button
interface BimodalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isTechnical: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const BimodalButton = ({
  isTechnical,
  variant = 'primary',
  children,
  className,
  ...props
}: BimodalButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 transition-all duration-200';

  const variantClasses = {
    primary: isTechnical
      ? 'border border-[#1B29FF] text-[#1B29FF] font-mono px-4 py-2 rounded-sm hover:bg-[#1B29FF]/5'
      : 'bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium px-5 py-3 rounded-md',
    secondary: isTechnical
      ? 'text-[#1B29FF]/70 font-mono underline underline-offset-2 hover:text-[#1B29FF]'
      : 'border border-[#101010]/10 text-[#101010] hover:bg-[#F7F7F2] px-5 py-3 rounded-md',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// Context for Bimodal state
interface BimodalContextValue {
  isTechnical: boolean;
  setIsTechnical: (value: boolean) => void;
}

export const BimodalContext = React.createContext<BimodalContextValue>({
  isTechnical: false,
  setIsTechnical: () => {},
});

export const useBimodal = () => React.useContext(BimodalContext);

// Provider component
export const BimodalProvider = ({
  children,
  defaultTechnical = false,
}: {
  children: React.ReactNode;
  defaultTechnical?: boolean;
}) => {
  const [isTechnical, setIsTechnical] = React.useState(defaultTechnical);

  return (
    <BimodalContext.Provider value={{ isTechnical, setIsTechnical }}>
      {children}
    </BimodalContext.Provider>
  );
};
