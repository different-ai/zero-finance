export interface Invoice {
  id: string;
  emailId: string;
  from: string;
  subject: string;
  detectedAt: string;
  invoice: {
    number: string;
    amount: string;
    currency: string;
    chain: 'ethereum' | 'base' | 'solana';
    recipientAddress: string;
    recipientName: string;
    dueDate: string;
    description: string;
  };
  status: 'pending' | 'paid' | 'scheduled' | 'failed';
  firstTimeRecipient: boolean;
  lastPaidDate: string | null;
  autoPayEligible?: boolean;
}

export interface AutoPayRule {
  id: string;
  recipientName: string;
  recipientAddress: string;
  chain: 'ethereum' | 'base' | 'solana';
  maxAmount: string;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  autoApproveUnder: string;
  enabled: boolean;
  lastTriggered?: string;
}

export interface PaymentHistoryItem {
  id: string;
  date: string;
  recipientName: string;
  recipientAddress: string;
  amount: string;
  currency: string;
  chain: 'ethereum' | 'base' | 'solana';
  status: 'success' | 'failed';
  invoiceNumber?: string;
  txHash: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    emailId: 'email_123',
    from: 'accounting@acmecorp.com',
    subject: 'Invoice #2024-001 - Monthly Services',
    detectedAt: '2024-01-15T10:30:00Z',
    invoice: {
      number: 'INV-2024-001',
      amount: '5000',
      currency: 'USDC',
      chain: 'solana',
      recipientAddress: 'AcmeCorpPayments.sol',
      recipientName: 'Acme Corporation',
      dueDate: '2024-02-15',
      description: 'Software development services - January 2024'
    },
    status: 'pending',
    firstTimeRecipient: false,
    lastPaidDate: '2023-12-15',
    autoPayEligible: true
  },
  {
    id: '2',
    emailId: 'email_124',
    from: 'billing@designstudio.io',
    subject: 'Invoice for Logo Design',
    detectedAt: '2024-01-16T14:20:00Z',
    invoice: {
      number: 'DS-0045',
      amount: '1500',
      currency: 'USDC',
      chain: 'base',
      recipientAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f7E123',
      recipientName: 'Design Studio LLC',
      dueDate: '2024-01-30',
      description: 'Logo design and brand guidelines'
    },
    status: 'pending',
    firstTimeRecipient: true,
    lastPaidDate: null
  },
  {
    id: '3',
    emailId: 'email_125',
    from: 'payroll@contractorsinc.com',
    subject: 'Weekly Invoice - W3 January',
    detectedAt: '2024-01-17T09:15:00Z',
    invoice: {
      number: 'CI-2024-W03',
      amount: '3200',
      currency: 'USDC',
      chain: 'ethereum',
      recipientAddress: '0x1234567890123456789012345678901234567890',
      recipientName: 'Contractors Inc',
      dueDate: '2024-01-24',
      description: 'Weekly contractor payments - Week 3'
    },
    status: 'scheduled',
    firstTimeRecipient: false,
    lastPaidDate: '2024-01-10',
    autoPayEligible: true
  },
  {
    id: '4',
    emailId: 'email_126',
    from: 'finance@cloudservices.xyz',
    subject: 'Monthly Cloud Services Bill',
    detectedAt: '2024-01-18T11:45:00Z',
    invoice: {
      number: 'CS-JAN-2024',
      amount: '890.50',
      currency: 'USDC',
      chain: 'solana',
      recipientAddress: 'CloudServicesPay.sol',
      recipientName: 'Cloud Services XYZ',
      dueDate: '2024-02-01',
      description: 'Cloud infrastructure and services - January 2024'
    },
    status: 'paid',
    firstTimeRecipient: false,
    lastPaidDate: '2024-01-18'
  }
];

export const mockPayrollPool = {
  balances: {
    ethereum: { 
      USDC: '10000',
      ETH: '2.5',
      valueUSD: 12500
    },
    base: { 
      USDC: '15000',
      ETH: '1.2',
      valueUSD: 16200
    },
    solana: { 
      USDC: '8000',
      SOL: '50',
      valueUSD: 8800
    }
  },
  totalValueUSD: 37500,
  lowBalanceThreshold: 5000,
  transactions: [
    { 
      date: '2024-01-10', 
      type: 'deposit' as const, 
      amount: '20000', 
      currency: 'USDC', 
      chain: 'base' as const,
      txHash: '0xabc123...'
    },
    { 
      date: '2024-01-12', 
      type: 'payment' as const, 
      amount: '3000', 
      currency: 'USDC', 
      chain: 'solana' as const, 
      recipient: 'Vendor.sol',
      txHash: '0xdef456...'
    },
    { 
      date: '2024-01-15', 
      type: 'payment' as const, 
      amount: '5000', 
      currency: 'USDC', 
      chain: 'ethereum' as const, 
      recipient: '0x123...890',
      txHash: '0xghi789...'
    }
  ]
};

export const mockAutoPayRules: AutoPayRule[] = [
  {
    id: '1',
    recipientName: 'Acme Corporation',
    recipientAddress: 'AcmeCorpPayments.sol',
    chain: 'solana',
    maxAmount: '10000',
    frequency: 'monthly',
    autoApproveUnder: '5000',
    enabled: true,
    lastTriggered: '2023-12-15'
  },
  {
    id: '2',
    recipientName: 'Contractors Inc',
    recipientAddress: '0x1234567890123456789012345678901234567890',
    chain: 'ethereum',
    maxAmount: '5000',
    frequency: 'weekly',
    autoApproveUnder: '3500',
    enabled: true,
    lastTriggered: '2024-01-10'
  },
  {
    id: '3',
    recipientName: 'Cloud Services XYZ',
    recipientAddress: 'CloudServicesPay.sol',
    chain: 'solana',
    maxAmount: '2000',
    frequency: 'monthly',
    autoApproveUnder: '1000',
    enabled: false
  }
];

export const mockPaymentHistory: PaymentHistoryItem[] = [
  {
    id: '1',
    date: '2024-01-18T11:45:00Z',
    recipientName: 'Cloud Services XYZ',
    recipientAddress: 'CloudServicesPay.sol',
    amount: '890.50',
    currency: 'USDC',
    chain: 'solana',
    status: 'success',
    invoiceNumber: 'CS-JAN-2024',
    txHash: '5xY9kL3mN8pQ2rT6vW1zB4cD7fG0jH5kM8nP2qR6tV1wX9yZ'
  },
  {
    id: '2',
    date: '2024-01-15T10:30:00Z',
    recipientName: 'Acme Corporation',
    recipientAddress: 'AcmeCorpPayments.sol',
    amount: '5000',
    currency: 'USDC',
    chain: 'solana',
    status: 'success',
    invoiceNumber: 'INV-2023-012',
    txHash: '3aB7cD9eF2gH4jK6mN8pQ1rS5tU9vW2xY4zB7cD0eF3gH6jK'
  },
  {
    id: '3',
    date: '2024-01-10T14:20:00Z',
    recipientName: 'Contractors Inc',
    recipientAddress: '0x1234567890123456789012345678901234567890',
    amount: '3200',
    currency: 'USDC',
    chain: 'ethereum',
    status: 'success',
    invoiceNumber: 'CI-2024-W02',
    txHash: '0x9f8e7d6c5b4a3928176e5d4c3b2a1908f7e6d5c4b3a29180'
  },
  {
    id: '4',
    date: '2024-01-05T09:15:00Z',
    recipientName: 'Marketing Agency Pro',
    recipientAddress: '0x987654321098765432109876543210987654321',
    amount: '2500',
    currency: 'USDC',
    chain: 'base',
    status: 'failed',
    invoiceNumber: 'MAP-2024-001',
    txHash: '0xfailed123...'
  }
];

// Mock email content for demonstration
export const mockEmailContent = {
  'email_123': {
    subject: 'Invoice #2024-001 - Monthly Services',
    from: 'accounting@acmecorp.com',
    to: 'payments@yourcompany.com',
    date: '2024-01-15T10:30:00Z',
    body: `Dear Client,

Please find attached our invoice for software development services provided in January 2024.

Invoice Details:
- Invoice Number: INV-2024-001
- Amount Due: $5,000 USDC
- Due Date: February 15, 2024
- Payment Address: AcmeCorpPayments.sol (Solana)

Thank you for your continued business.

Best regards,
Acme Corporation Accounting Department`,
    attachments: ['invoice_2024_001.pdf']
  }
};