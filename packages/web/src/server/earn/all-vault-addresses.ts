/**
 * All Vault Addresses
 *
 * Aggregates all known vault addresses across all chains for use in
 * filtering transactions (e.g., identifying vault redemptions vs regular transfers).
 *
 * This is used by the safe-router to filter out vault withdrawals from
 * incoming transfers, so they don't appear as "Received" in the UI.
 */

import { ALL_CROSS_CHAIN_VAULTS } from './cross-chain-vaults';

/**
 * Set of all vault addresses (lowercased for easy lookup)
 */
export const ALL_VAULT_ADDRESSES: Set<string> = new Set(
  ALL_CROSS_CHAIN_VAULTS.map((vault) => vault.address.toLowerCase()),
);

/**
 * Check if an address is a known vault
 * @param address - The address to check
 * @returns true if the address is a known vault
 */
export function isKnownVaultAddress(address: string): boolean {
  return ALL_VAULT_ADDRESSES.has(address.toLowerCase());
}

/**
 * Get all vault addresses as an array
 * @returns Array of vault addresses (lowercased)
 */
export function getAllVaultAddresses(): string[] {
  return Array.from(ALL_VAULT_ADDRESSES);
}
