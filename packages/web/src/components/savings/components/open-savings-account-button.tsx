'use client';

import { type Address } from 'viem';

interface OpenSavingsAccountButtonProps {
  safeAddress?: Address;
  onSuccess?: () => void;
}

/**
 * OpenSavingsAccountButton - Previously used to enable and configure the Auto-Earn module.
 *
 * The auto-earn module system is temporarily retired. This component is now a no-op.
 * Keeping it for backwards compatibility in case it's imported elsewhere.
 */
export function OpenSavingsAccountButton({
  safeAddress: _safeAddress,
  onSuccess: _onSuccess,
}: OpenSavingsAccountButtonProps) {
  // Module system retired - no UI needed
  return null;
}
