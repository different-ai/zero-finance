"use client";

import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';

/**
 * A hook to handle address visibility preference.
 * Returns functions to format addresses according to user's preference.
 */
export function useAddressVisibility() {
  const { data: settings, isLoading } = trpc.settings.userSettings.get.useQuery(
    undefined,
    { staleTime: 1000 * 60 * 5 }, // Cache for 5 minutes
  );

  // Default to hiding addresses if settings haven't loaded yet
  const showAddresses = useMemo(
    () => settings?.showAddresses ?? false,
    [settings],
  );

  /**
   * Formats an address according to the user's visibility preference
   * @param address The Ethereum address to format
   * @param fallback Optional fallback text to show when hiding addresses (defaults to '***')
   * @returns Formatted address string
   */
  const formatAddress = (
    address: string | null | undefined,
    fallback: string = '***',
  ): string => {
    if (!address) return fallback;

    if (showAddresses) {
      // Show full address
      return address;
    } else {
      // Show abbreviated format like 0x123...abc
      if (address.length >= 10) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      }
      return fallback;
    }
  };

  /**
   * Determines if address details should be shown or hidden.
   * Useful for conditionally rendering address-related UI elements.
   */
  const shouldShowAddressDetails = showAddresses;

  /**
   * Updates the user's address visibility preference
   */
  const settingsMutation = trpc.settings.userSettings.update.useMutation();

  const toggleAddressVisibility = async () => {
    return settingsMutation.mutateAsync({
      showAddresses: !showAddresses,
    });
  };

  return {
    showAddresses,
    formatAddress,
    shouldShowAddressDetails,
    toggleAddressVisibility,
    isLoading,
    isUpdating: settingsMutation.isPending,
  };
}
