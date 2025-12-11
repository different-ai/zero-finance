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
}

export const LANDING_CONTENT: {
  hero: HeroContent;
  features: FeatureItem[];
} = {
  hero: {
    badge: '',
    headline: {
      prefix: 'Your bank pays you 0.5%',
      highlight: 'with your own money.',
      suffix: '',
    },
    description:
      'Startups lose $50,000+ per year in yield they should be earning. Competitive yield, insurance coverage, instant withdrawals. Your funds stay in your control.',
    features: [
      'Insurance included — deposits protected up to $1M',
      'Withdraw anytime — no lock-ups, no penalties',
      'Your funds, your control — we never touch your balance',
    ],
    cta: {
      primary: { label: 'Open account →', href: '/signin?source=crypto' },
      secondary: {
        label: 'Book a call',
        href: 'https://cal.com/team/0finance/30',
      },
    },
  },
  features: [
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
};
