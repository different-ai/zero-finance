/**
 * Client-side feature configuration
 * Uses NEXT_PUBLIC_ environment variables
 */
export const featureConfigClient = {
  align: {
    enabled: !!process.env.NEXT_PUBLIC_ALIGN_PUBLISHABLE_KEY,
  },

  banking: {
    get enabled() {
      return featureConfigClient.align.enabled;
    },
  },

  kyc: {
    get required() {
      return featureConfigClient.align.enabled;
    },
  },

  earn: {
    enabled: !!process.env.NEXT_PUBLIC_AUTO_EARN_MODULE_ADDRESS,
  },
};
