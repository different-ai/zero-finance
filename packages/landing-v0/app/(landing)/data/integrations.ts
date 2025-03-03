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
    name: 'Gnosis Pay',
    status: 'active',
    description: 'Debit card for spending anywhere Visa is accepted',
    icon: '/img/logos/gnosis-logo.jpg',
  },
  {
    name: 'Monerium',
    status: 'active',
    description: 'E-money transfers and IBAN connectivity',
    icon: '/img/logos/monerium-logo.png',
  }
];