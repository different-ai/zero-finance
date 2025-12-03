'use client';

import { type Address } from 'viem';

interface Props {
  safeAddress?: Address;
}

/**
 * EnableSafeModuleButton - Previously enabled the Auto-Earn contract as a Safe module.
 *
 * The auto-earn module system is temporarily retired. This component is now a no-op.
 * Keeping it for backwards compatibility in case it's imported elsewhere.
 */
export function EnableSafeModuleButton({ safeAddress: _safeAddress }: Props) {
  // Module system retired - no UI needed
  return null;
}
