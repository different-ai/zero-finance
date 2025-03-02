import { PipeIcon } from '@hypr/shared';

interface Integration {
  name: string;
  status: 'active' | 'coming-soon';
  description: string;
  icon?: string | React.ComponentType<{ className?: string }>;
}

export const enterpriseIntegrations: Integration[] = [
  {
    name: 'Local-only screen Monitor with Screenpipe',
    status: 'active',
    description: 'Automated financial task detection, while keeping your data private.',
    icon: PipeIcon,
  },
  {
    name: 'Request Network',
    status: 'active',
    description: 'Decentralized invoicing protocol to issue auditable invoices',
    icon: '/img/logos/request-network.png',
  },
  {
    name: 'Mercury',
    status: 'active',
    description: 'ACH transfers for seamless payment processing',
    icon: '/img/logos/mercury.png',
  },
  {
    name: 'QuickBooks',
    status: 'coming-soon',
    description: 'Automate accounting workflows and sync transactions',
    icon: '/img/logos/quickbooks.png',
  },
  {
    name: 'Stripe',
    status: 'coming-soon',
    description: 'Payment processing for online businesses and subscriptions',
    icon: '/img/logos/stripe.png',
  },
  {
    name: 'Xero',
    status: 'coming-soon',
    description: 'Financial reporting and reconciliation tools',
    icon: '/img/logos/xero.png',
  },
  {
    name: 'Monerium',
    status: 'coming-soon',
    description: 'IBAN transfers for international payments',
    icon: '/img/logos/monerium.png',
  },
  {
    name: 'Plaid',
    status: 'coming-soon',
    description: 'Bank account linking for real-time transaction data',
    icon: '/img/logos/plaid.png',
  },
  {
    name: 'Gusto',
    status: 'coming-soon',
    description: 'Payroll automation and employee expense tracking',
    icon: '/img/logos/gusto.png',
  },
  {
    name: 'Expensify',
    status: 'coming-soon',
    description: 'Expense management and receipt tracking',
    icon: '/img/logos/expensify.png',
  },
];