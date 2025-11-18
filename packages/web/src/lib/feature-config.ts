/**
 * Central feature configuration based on environment variables
 * This determines what features are available at runtime
 */
export const featureConfig = {
  align: {
    enabled: !!process.env.ALIGN_API_KEY,
    get apiKey() {
      return process.env.ALIGN_API_KEY;
    },
    get environment() {
      return process.env.ALIGN_ENVIRONMENT as 'sandbox' | 'production';
    },
  },

  banking: {
    get enabled() {
      return featureConfig.align.enabled;
    },
    virtualAccounts: {
      get enabled() {
        return featureConfig.align.enabled;
      },
    },
    transfers: {
      get achEnabled() {
        return featureConfig.align.enabled;
      },
      get wireEnabled() {
        return featureConfig.align.enabled;
      },
    },
  },

  kyc: {
    get required() {
      return featureConfig.align.enabled;
    },
    get provider() {
      return featureConfig.align.enabled ? 'align' : null;
    },
  },

  payments: {
    crypto: {
      enabled: true, // Always enabled
      networks: ['base', 'ethereum', 'polygon'],
    },
    fiat: {
      get enabled() {
        return featureConfig.align.enabled;
      },
    },
  },

  earn: {
    enabled: !!process.env.AUTO_EARN_MODULE_ADDRESS,
    get moduleAddress() {
      return process.env.AUTO_EARN_MODULE_ADDRESS;
    },
  },

  ai: {
    enabled: !!process.env.OPENAI_API_KEY,
    invoiceExtraction: !!process.env.OPENAI_API_KEY,
  },

  email: {
    loops: !!process.env.LOOPS_API_KEY,
  },

  /**
   * Multi-chain vault feature configuration
   * Controls access to cross-chain vault functionality
   */
  multiChain: {
    // Feature is enabled via environment variable
    get enabled() {
      return process.env.NEXT_PUBLIC_MULTI_CHAIN_ENABLED === 'true';
    },
    // Percentage of users to enable for (0-100)
    get betaPercentage() {
      return parseInt(
        process.env.NEXT_PUBLIC_MULTI_CHAIN_BETA_PERCENTAGE || '0',
        10,
      );
    },
    // Specific user DIDs allowed (comma-separated in env)
    get allowedUsers() {
      return (
        process.env.NEXT_PUBLIC_MULTI_CHAIN_ALLOWED_USERS?.split(',').filter(
          Boolean,
        ) || []
      );
    },
    // Which chains are enabled
    chains: {
      base: true, // Always enabled
      arbitrum: process.env.NEXT_PUBLIC_MULTI_CHAIN_ARBITRUM_ENABLED === 'true',
    },
  },
};

// Export type for use in components
export type FeatureConfig = typeof featureConfig;
