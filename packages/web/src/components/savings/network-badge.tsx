/**
 * Network badge and chain indicator components
 * Used to identify which chain a vault or account is on
 */

import { CHAIN_CONFIG } from '@/lib/constants/chains';
import type { SupportedChainId } from '@/lib/types/multi-chain';
import { cn } from '@/lib/utils';

interface NetworkBadgeProps {
  chainId: SupportedChainId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * NetworkBadge - Shows chain name with colored indicator
 * Used to identify which chain a vault or account is on
 *
 * Design Language Compliance:
 * - Typography: text-[11px] uppercase tracking-[0.14em]
 * - Colors: Uses official chain colors (Base: #0052FF, Arbitrum: #28A0F0)
 * - Background: bg-[#F7F7F2] with border-[#101010]/10
 * - Text: text-[#101010]/60 for labels
 */
export function NetworkBadge({
  chainId,
  size = 'md',
  className,
}: NetworkBadgeProps) {
  const config = CHAIN_CONFIG[chainId];

  const sizeClasses = {
    sm: {
      container: 'gap-1.5 px-2 py-1',
      dot: 'size-1.5',
      text: 'text-[10px]',
    },
    md: {
      container: 'gap-2 px-2.5 py-1.5',
      dot: 'size-2',
      text: 'text-[11px]',
    },
    lg: {
      container: 'gap-2.5 px-3 py-2',
      dot: 'size-2.5',
      text: 'text-[12px]',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md bg-[#F7F7F2] border border-[#101010]/10',
        classes.container,
        className,
      )}
    >
      {/* Colored dot indicator */}
      <div
        className={cn('rounded-full', classes.dot)}
        style={{ backgroundColor: config.color }}
        aria-hidden="true"
      />

      {/* Chain name */}
      <span
        className={cn(
          'uppercase tracking-[0.14em] font-medium text-[#101010]/60',
          classes.text,
        )}
      >
        {config.displayName}
      </span>
    </div>
  );
}

interface ChainDotProps {
  chainId: SupportedChainId;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * ChainDot - Small colored circle indicating chain
 * Used in compact displays and tight layouts
 *
 * Design Language Compliance:
 * - sm: 8px diameter
 * - md: 12px diameter
 * - Uses official chain colors
 */
export function ChainDot({ chainId, size = 'sm', className }: ChainDotProps) {
  const config = CHAIN_CONFIG[chainId];

  const sizeClasses = {
    sm: 'size-2', // 8px
    md: 'size-3', // 12px
  };

  return (
    <div
      className={cn('rounded-full flex-shrink-0', sizeClasses[size], className)}
      style={{ backgroundColor: config.color }}
      aria-label={`${config.displayName} network`}
      role="img"
    />
  );
}

interface ChainLabelProps {
  chainId: SupportedChainId;
  className?: string;
}

/**
 * ChainLabel - Text-only chain identifier
 * Used when space is limited or color indicators aren't needed
 */
export function ChainLabel({ chainId, className }: ChainLabelProps) {
  const config = CHAIN_CONFIG[chainId];

  return (
    <span
      className={cn(
        'text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 font-medium',
        className,
      )}
    >
      {config.displayName}
    </span>
  );
}
