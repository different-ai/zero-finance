/**
 * Gnosis Chain sDAI vault configuration
 * Provides access to Sky Savings Rate (SSR) via sDAI on Gnosis Chain
 *
 * NOTE: Gnosis vaults are ONLY visible in Technical Mode.
 * Banking mode continues to show only Base USDC vaults.
 */

import { type Address } from 'viem';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { type CrossChainVault } from '@/lib/types/multi-chain';

/**
 * Asset configuration for Gnosis Chain
 */
export const GNOSIS_ASSETS = {
  // Savings xDAI - ERC-4626 vault earning Sky Savings Rate
  sDAI: {
    address: '0xaf204776c7245bf4147c2612bf6e5972ee483701' as Address,
    symbol: 'sDAI',
    decimals: 18,
  },
  // Native xDAI (gas token)
  xDAI: {
    address: '0x0000000000000000000000000000000000000000' as Address,
    symbol: 'xDAI',
    decimals: 18,
    isNative: true,
  },
  // Wrapped xDAI (needed for sDAI interaction if not using router)
  WXDAI: {
    address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d' as Address,
    symbol: 'WXDAI',
    decimals: 18,
  },
  // Bridged USDC (Circle)
  'USDC.e': {
    address: '0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0' as Address,
    symbol: 'USDC.e',
    decimals: 6,
  },
} as const;

/**
 * Gnosis sDAI vault configuration
 *
 * sDAI is an ERC-4626 vault that earns the Sky Savings Rate (SSR),
 * formerly known as the DAI Savings Rate (DSR).
 *
 * Benefits:
 * - Low fees: Gnosis Chain fees are <$0.01
 * - High yield: SSR offers competitive stablecoin yields
 * - Safety: Gnosis is a robust, decentralized chain
 */
export const GNOSIS_SDAI_VAULTS: CrossChainVault[] = [
  {
    id: 'sdaiGnosis',
    name: 'Savings xDAI (sDAI)',
    displayName: 'Sky Savings (Gnosis)',
    address: GNOSIS_ASSETS.sDAI.address,
    chainId: SUPPORTED_CHAINS.GNOSIS,
    risk: 'Conservative', // sDAI is backed by MakerDAO/Sky Protocol
    curator: 'Sky (MakerDAO)',
    appUrl: 'https://gnosis.spark.fi',
    // Asset info - sDAI underlying is WXDAI (18 decimals)
    // The vault token (sDAI) is also 18 decimals, and converts to WXDAI value
    asset: {
      symbol: 'sDAI',
      decimals: 18,
      isNative: false,
      address: GNOSIS_ASSETS.sDAI.address,
    },
    category: 'stable',
    // APY is dynamically fetched from the sDAI contract
    // Current SSR is typically 5-8% depending on protocol governance
  },
];

/**
 * Get the primary (default) vault for Gnosis
 */
export function getPrimaryGnosisVault(): CrossChainVault {
  return GNOSIS_SDAI_VAULTS[0];
}

/**
 * Get Gnosis vault by ID
 */
export function getGnosisVaultById(id: string): CrossChainVault | undefined {
  return GNOSIS_SDAI_VAULTS.find((vault) => vault.id === id);
}

/**
 * Get Gnosis vault by address
 */
export function getGnosisVaultByAddress(
  address: Address,
): CrossChainVault | undefined {
  return GNOSIS_SDAI_VAULTS.find(
    (vault) => vault.address.toLowerCase() === address.toLowerCase(),
  );
}
