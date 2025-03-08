interface Integration {
  name: string;
  status: 'active' | 'coming-soon';
  description: string;
  icon?: string;
}

export const enterpriseIntegrations: Integration[] = [
  {
    name: 'Request Network',
    status: 'active',
    description: 'Decentralized invoicing protocol to issue auditable invoices',
    icon: '/img/logos/request-network.png',
  },
  {
    name: 'Gnosis Chain',
    status: 'active',
    description: 'Secure EVM-compatible blockchain for EURe payments',
    icon: '/img/logos/gnosis-logo.jpg',
  },
  {
    name: 'Monerium',
    status: 'coming-soon',
    description: 'E-money transfers and IBAN connectivity',
    icon: '/img/logos/monerium-logo.png',
  },
  {
    name: 'ScreenPipe',
    status: 'coming-soon',
    description: 'AI-powered document analysis and insights',
    icon: '/screenpipe-logo.png',
  }
];