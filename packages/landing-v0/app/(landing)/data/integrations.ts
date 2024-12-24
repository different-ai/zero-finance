interface Integration {
  name: string;
  status: 'active' | 'coming-soon';
  description: string;
}

export const enterpriseIntegrations: Integration[] = [
  {
    name: 'Screen Monitor',
    status: 'active',
    description: 'Automated financial task detection',
  },
  {
    name: 'USDC',
    status: 'active',
    description: 'Stablecoin payments and treasury',
  },
  {
    name: 'Aave',
    status: 'coming-soon',
    description: 'DeFi yield optimization',
  },
  {
    name: 'Compound',
    status: 'coming-soon',
    description: 'DeFi lending and borrowing',
  },
  {
    name: 'QuickBooks',
    status: 'coming-soon',
    description: 'Accounting automation',
  },
  {
    name: 'Stripe',
    status: 'coming-soon',
    description: 'Payment processing',
  },
  {
    name: 'Xero',
    status: 'coming-soon',
    description: 'Financial reporting',
  },
  {
    name: 'Circle',
    status: 'coming-soon',
    description: 'Business payments infrastructure',
  },
];    