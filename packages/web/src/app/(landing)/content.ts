export interface BimodalContent<T> {
  company: T;
  technical: T;
}

export interface HeroContent {
  badge: string;
  headline: {
    prefix: string;
    highlight: string;
    suffix: string;
  };
  description: string;
  features: string[];
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  // Technical mode specific metadata
  technicalMetadata?: {
    label: string; // e.g., "PROTOCOL::AAVE_V3"
    specs?: Record<string, string>; // e.g., { "APY": "8.2%", "TVL": "$12B" }
  };
}

export const LANDING_CONTENT: {
  hero: BimodalContent<HeroContent>;
  features: BimodalContent<FeatureItem[]>;
} = {
  hero: {
    company: {
      badge: 'High-Yield Business Savings',
      headline: {
        prefix: '',
        highlight: 'Earn up to 8%',
        suffix: 'on your idle treasury',
      },
      description:
        'Open US or EU account numbers, wire USD or USDC. We automatically place your idle funds into vetted money market funds with balance protection up to $1M. Withdraw anytime with zero penalties or lock-ups.',
      features: [
        'Built on battle-tested money markets securing $8B+ in assets',
      ],
      cta: {
        primary: { label: 'Sign up →', href: '/signin?source=crypto' },
        secondary: {
          label: 'Book call',
          href: 'https://cal.com/team/0finance/30',
        },
      },
    },
    technical: {
      badge: 'PROTOCOL::TREASURY_AUTOMATION',
      headline: {
        prefix: '',
        highlight: 'High-Yield',
        suffix: 'on your idle treasury',
      },
      description:
        'Earn yield on your idle treasury, safely. We help you generate yield on your USDC and ETH with insurance against smart contract risks. No lock-ins. With our seamless off-and-on-ramps, you can keep your TradFi bank account and continue operational work.',
      features: [
        'Direct protocol interaction • Non-custodial architecture',
        'Audited smart contracts • Real-time on-chain settlement',
      ],
      cta: {
        primary: { label: 'Sign in →', href: '/signin?source=crypto' },
        secondary: {
          label: 'Book a Call',
          href: 'https://cal.com/team/0finance/30',
        },
      },
    },
  },
  features: {
    company: [
      {
        id: 'yield',
        title: 'Competitive Yield',
        description:
          'Earn significantly more than traditional banks on your idle cash. Your funds are automatically allocated to vetted yield strategies with insurance coverage up to $1M from a licensed insurer.',
      },
      {
        id: 'liquidity',
        title: 'No Minimums, Full Liquidity',
        description:
          'Start earning from day one with no minimum balance requirements. Your funds remain fully liquid — withdraw any amount, any time. Perfect for managing runway while maximizing returns on idle capital.',
      },
      {
        id: 'banking',
        title: 'Instant Global Banking',
        description:
          'Open US and EU bank accounts in seconds. Get ACH routing numbers and SEPA IBANs instantly. Receive wire transfers, ACH payments, and SEPA transfers directly to your high-yield account.',
      },
      {
        id: 'security',
        title: 'Institutional-Grade Security',
        description:
          'Bank-level security with self-custody benefits. Your funds are protected by insurance coverage up to $1M from a licensed insurer and battle-tested DeFi protocols securing $8B+ in assets. Email login for easy access.',
      },
    ],
    technical: [
      {
        id: 'yield',
        title: 'YIELD::OPTIMIZATION',
        description:
          'Algorithmic allocation to blue-chip DeFi protocols (Aave, Compound, Morpho). Auto-compounding rewards. Gas-optimized rebalancing strategies.',
        technicalMetadata: {
          label: 'STRATEGY::ERC4626',
          specs: { APY: 'Dynamic', Gas: 'Optimized' },
        },
      },
      {
        id: 'liquidity',
        title: 'LIQUIDITY::ON_CHAIN',
        description:
          'Zero lock-up periods. Instant withdrawals via smart contract interaction. Flash loan compatible. Deep liquidity pools ensure minimal slippage.',
        technicalMetadata: {
          label: 'POOL::DEPTH',
          specs: { Slippage: '<0.01%', 'T+0': 'Instant' },
        },
      },
      {
        id: 'banking',
        title: 'RAMPS::FIAT_CRYPTO',
        description:
          'Integrated fiat on/off ramps. Mint/burn USDC directly via Circle API. Seamless bridging between traditional banking rails (ACH/SEPA) and EVM chains.',
        technicalMetadata: {
          label: 'BRIDGE::CIRCLE',
          specs: { Settlement: 'T+1', Mint: '1:1' },
        },
      },
      {
        id: 'security',
        title: 'SECURITY::AUDITED',
        description:
          'Battle-tested smart contracts. Multi-sig governance via Safe{Wallet}. Insurance coverage up to $1M via Chainproof (licensed insurer).',
        technicalMetadata: {
          label: 'AUDIT::OPENSPEC',
          specs: { Score: '98/100', BugBounty: '$1M+' },
        },
      },
    ],
  },
};
