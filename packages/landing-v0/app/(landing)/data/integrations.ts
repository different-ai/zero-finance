
import { PipeIcon } from '@hypr/shared';
import { RequestLogo } from '../components/request-logo';

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
    name: 'USDC',
    status: 'coming-soon',
    description: 'Stablecoin payments and treasury',
    icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#2775CA"/>
      <path d="M19.6049 18.0317C19.6049 16.2235 18.5395 15.4396 16.4087 15.1435C14.8877 14.9261 14.5473 14.4952 14.5473 13.7609C14.5473 13.0267 15.0944 12.5463 16.1599 12.5463C17.0969 12.5463 17.644 12.8919 17.9349 13.6261C17.9844 13.7609 18.1278 13.8461 18.2712 13.8461H19.2872C19.4801 13.8461 19.6235 13.7113 19.6235 13.5269V13.4913C19.3821 12.3461 18.3662 11.4326 17.0474 11.3474V10.0674C17.0474 9.88304 16.904 9.73913 16.7111 9.73913H15.6457C15.4528 9.73913 15.3094 9.88304 15.3094 10.0674V11.3474C13.7389 11.4822 12.6239 12.4452 12.6239 13.8461C12.6239 15.5848 13.6894 16.4 15.7707 16.6965C17.3412 16.9635 17.7311 17.3339 17.7311 18.1178C17.7311 18.9017 17.0969 19.4317 16.0314 19.4317C14.8382 19.4317 14.2911 18.9513 14.0992 18.1674C14.0497 18.0326 13.9063 17.9474 13.7629 17.9474H12.6975C12.5046 17.9474 12.3612 18.0822 12.3612 18.2665V18.3022C12.6026 19.5326 13.5396 20.5452 15.2776 20.7626V22.0426C15.2776 22.227 15.421 22.3709 15.6139 22.3709H16.6794C16.8722 22.3709 17.0156 22.227 17.0156 22.0426V20.7626C18.6357 20.5948 19.6049 19.5822 19.6049 18.0317Z" fill="white"/>
      <path d="M11.7364 20.7626C8.28677 19.1583 7.09353 14.9757 8.69766 11.5252C9.48505 9.73913 10.9555 8.26957 12.7431 7.48565C12.9359 7.4 13.0298 7.18783 12.9803 6.97565C12.9308 6.76348 12.7431 6.63913 12.5007 6.63913H12.4512C8.18783 7.72174 5.46021 11.7426 6.14677 15.9704C6.68396 19.3426 9.19414 22.0922 12.4017 22.9065C12.5946 22.9561 12.8359 22.8213 12.8854 22.6091C12.9349 22.397 12.8359 22.1848 12.6431 22.0991C12.3027 21.9643 12.0118 21.8296 11.7364 20.7626Z" fill="white"/>
      <path d="M20.2015 11.2291C23.6511 12.8334 24.8444 17.016 23.2402 20.4665C22.4528 22.2526 20.9824 23.7222 19.1948 24.5061C19.0019 24.5917 18.908 24.8039 18.9575 25.0161C19.007 25.2282 19.1948 25.3526 19.4362 25.3526H19.4857C23.749 24.27 26.4767 20.2491 25.7901 16.0213C25.2529 12.6491 22.7427 9.89948 19.5352 9.08517C19.3423 9.03557 19.101 9.17039 19.0515 9.38257C19.002 9.59474 19.101 9.80691 19.2938 9.89257C19.6342 10.0274 19.9251 10.1622 20.2015 11.2291Z" fill="white"/>
    </svg>`,
  },
  {
    name: 'Request Network',
    status: 'coming-soon',
    description: 'Decentralized invoicing protocol to issue auditable invoices',
    icon: RequestLogo,
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
    name: 'Monerium',
    status: 'coming-soon',
    description: 'IBAN transfers',
    icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#001B44"/>
      <path d="M23.3333 12.6667L16 8L8.66667 12.6667M23.3333 12.6667L16 17.3333M23.3333 12.6667V19.3333L16 24M16 17.3333L8.66667 12.6667M16 17.3333V24M8.66667 12.6667V19.3333L16 24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    name: 'Mercury',
    status: 'coming-soon',
    description: 'ACH transfers',
  },
];    