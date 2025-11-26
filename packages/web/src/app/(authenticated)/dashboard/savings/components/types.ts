/**
 * Shared types for savings page components
 * Re-exports types from vault-calculations for cleaner imports
 */

export type {
  VaultViewModel,
  VaultAssetInfo,
  VaultStat,
  UserPosition,
  BaseVault,
} from '../utils/vault-calculations';

export type { SupportedChainId } from '@/lib/constants/chains';

/**
 * Action type for vault interactions (includes null for "no action selected")
 */
export type VaultAction = 'deposit' | 'withdraw' | 'insure' | null;

/**
 * Active action type (non-null) for callback parameters
 */
export type ActiveVaultAction = 'deposit' | 'withdraw' | 'insure';

/**
 * Selected vault state for managing vault action panels
 */
export type SelectedVaultState = {
  action: VaultAction;
  vaultAddress: string | null;
  vaultName: string | null;
};

/**
 * Props shared by vault display components
 */
export type VaultDisplayProps = {
  isDemoMode: boolean;
  isTechnical: boolean;
  safeAddress: string | null;
};
