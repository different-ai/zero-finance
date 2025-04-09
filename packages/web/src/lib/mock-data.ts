// Mock data for dashboard components
// This is temporarily used until actual data fetching is implemented

export const transactions = [
  {
    id: 'txn-1234',
    date: '2023-12-01T12:30:45',
    description: 'Deposit from Exchange',
    amount: 1500,
    type: 'deposit',
    status: 'completed', 
    currency: 'USDC'
  },
  {
    id: 'txn-1235',
    date: '2023-12-02T13:15:22',
    description: 'Allocation to Yield Strategy',
    amount: 500,
    type: 'allocation',
    status: 'completed',
    currency: 'USDC'
  },
  {
    id: 'txn-1236',
    date: '2023-12-03T09:45:11',
    description: 'Token Swap USDC to EURe',
    amount: 300,
    type: 'swap',
    status: 'completed',
    currency: 'USDC'
  },
  {
    id: 'txn-1237',
    date: '2023-12-05T16:20:33',
    description: 'Invoice Payment',
    amount: 450,
    type: 'payment',
    status: 'completed',
    currency: 'EURe'
  },
  {
    id: 'txn-1238',
    date: '2023-12-07T11:05:27',
    description: 'Withdrawal to External Wallet',
    amount: 200,
    type: 'withdrawal',
    status: 'pending',
    currency: 'USDC'
  }
];

export const accounts = [
  {
    id: 'acc-1',
    name: 'Main Account',
    type: 'checking',
    balance: 2500,
    currency: 'USDC'
  },
  {
    id: 'acc-2',
    name: 'Yield Strategy',
    type: 'yield',
    balance: 1000,
    currency: 'USDC',
    apy: 4.5
  },
  {
    id: 'acc-3',
    name: 'EUR Account',
    type: 'checking',
    balance: 750,
    currency: 'EURe'
  }
];

export const safes = [
  {
    safeAddress: '0x4C97aae56945520A4E9aD115e2aaf2514c28A127',
    safeType: 'primary',
    name: 'Main Safe',
    balance: 3500,
    currency: 'USDC'
  }
];

export type UserFundingSourceDisplayData = {
  id: string;
  sourceType: 'bank' | 'crypto' | 'card';
  sourceBankName?: string;
  sourceIdentifier: string;
  sourceAccountType?: string;
  destinationAddress?: string;
  status: 'active' | 'pending' | 'inactive';
  lastUpdated: string;
};

export const fundingSources: UserFundingSourceDisplayData[] = [
  {
    id: 'src-1',
    sourceType: 'bank',
    sourceBankName: 'Chase Bank',
    sourceIdentifier: '****1234',
    sourceAccountType: 'checking',
    destinationAddress: '0x1234567890123456789012345678901234567890',
    status: 'active',
    lastUpdated: '2023-12-01T12:30:45'
  },
  {
    id: 'src-2',
    sourceType: 'crypto',
    sourceIdentifier: '0x9876543210987654321098765432109876543210',
    destinationAddress: '0x1234567890123456789012345678901234567890',
    status: 'active',
    lastUpdated: '2023-11-15T09:45:22'
  }
]; 