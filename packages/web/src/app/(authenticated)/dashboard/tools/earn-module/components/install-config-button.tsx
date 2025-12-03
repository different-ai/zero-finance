'use client';

import { type Address } from 'viem';

interface Props {
  safeAddress?: Address;
}

/**
 * InstallConfigButton - Previously installed the configuration for the Auto-Earn module.
 *
 * The auto-earn module system is temporarily retired. This component is now a no-op.
 * Keeping it for backwards compatibility in case it's imported elsewhere.
 */
export function InstallConfigButton({ safeAddress: _safeAddress }: Props) {
  // Module system retired - no UI needed
  return null;
}
