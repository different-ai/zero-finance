export type FiatCurrency = "USD" | "EUR" | "GBP";
export type CryptoCurrency = "BTC" | "ETH" | "USDC" | "USDT";
export type Currency = FiatCurrency | CryptoCurrency;

export type AccountType = "checking" | "savings" | "investment" | "yield" | "crypto";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  iban?: string;
  accountNumber?: string;
  walletAddress?: string;
  blockchain?: "Ethereum" | "Bitcoin" | "Polygon" | "Solana";
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: Currency;
  description: string;
  category?: string;
  reference?: string;
  status: "pending" | "completed" | "failed";
  type: "deposit" | "withdrawal" | "transfer" | "payment" | "tax" | "yield";
  date: Date;
  counterparty?: {
    name: string;
    accountNumber?: string;
    iban?: string;
  };
}

export interface YieldOpportunity {
  id: string;
  name: string;
  description: string;
  apy: number; // Annual Percentage Yield
  minInvestment: number;
  currency: Currency;
  term: number; // in days
  risk: "low" | "medium" | "high";
  available: boolean;
}

export interface YieldPosition {
  id: string;
  opportunityId: string;
  accountId: string;
  amount: number;
  currency: Currency;
  startDate: Date;
  endDate: Date;
  expectedInterest: number;
  status: "active" | "pending" | "completed" | "cancelled";
}