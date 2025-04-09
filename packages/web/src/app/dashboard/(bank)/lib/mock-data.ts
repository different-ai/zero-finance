import { Account, Transaction, YieldOpportunity, YieldPosition } from "@/src/types/account";
import { addDays, subDays } from "date-fns";

// Mock accounts data
export const accounts: Account[] = [
  {
    id: "acc-1",
    name: "Main Checking",
    type: "checking",
    currency: "USD",
    balance: 4582.45,
    iban: "US45HYPR78901234567890",
    accountNumber: "78901234567890",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-02-22"),
  },
  {
    id: "acc-2",
    name: "Euro Savings",
    type: "savings",
    currency: "EUR",
    balance: 12750.00,
    iban: "EU22HYPR12345678901234",
    accountNumber: "12345678901234",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "acc-3",
    name: "Investment Account",
    type: "investment",
    currency: "USD",
    balance: 35000.00,
    iban: "US67HYPR45678901234567",
    accountNumber: "45678901234567",
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "acc-4",
    name: "Yield Optimization",
    type: "yield",
    currency: "USD",
    balance: 10000.00,
    iban: "US98HYPR23456789012345",
    accountNumber: "23456789012345",
    createdAt: new Date("2023-07-05"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "acc-5",
    name: "Ethereum Wallet",
    type: "crypto",
    currency: "ETH",
    balance: 5.78,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    blockchain: "Ethereum",
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-03-18"),
  },
  {
    id: "acc-6",
    name: "USDC Stablecoin",
    type: "crypto",
    currency: "USDC",
    balance: 15000.00,
    walletAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    blockchain: "Ethereum",
    createdAt: new Date("2023-10-22"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "acc-7",
    name: "Bitcoin Holdings",
    type: "crypto",
    currency: "BTC",
    balance: 0.42,
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    blockchain: "Bitcoin",
    createdAt: new Date("2023-12-10"),
    updatedAt: new Date("2024-03-21"),
  },
];

// Mock transactions data
export const transactions: Transaction[] = [
  {
    id: "tx-1",
    accountId: "acc-1",
    amount: -42.50,
    currency: "USD",
    description: "Grocery Store Purchase",
    category: "Groceries",
    status: "completed",
    type: "payment",
    date: subDays(new Date(), 1),
    counterparty: {
      name: "Whole Foods Market",
    },
  },
  {
    id: "tx-2",
    accountId: "acc-1",
    amount: 1500.00,
    currency: "USD",
    description: "Salary Deposit",
    category: "Income",
    status: "completed",
    type: "deposit",
    date: subDays(new Date(), 7),
    counterparty: {
      name: "ABC Company Ltd",
    },
  },
  {
    id: "tx-3",
    accountId: "acc-1",
    amount: -800.00,
    currency: "USD",
    description: "Rent Payment",
    category: "Housing",
    status: "completed",
    type: "payment",
    date: subDays(new Date(), 14),
    counterparty: {
      name: "Property Management Inc",
      accountNumber: "98765432109876",
    },
  },
  {
    id: "tx-4",
    accountId: "acc-2",
    amount: 1000.00,
    currency: "EUR",
    description: "Transfer from USD account",
    reference: "INTERNAL-TRANSFER",
    status: "completed",
    type: "transfer",
    date: subDays(new Date(), 5),
    counterparty: {
      name: "Self (USD Account)",
      accountNumber: "78901234567890",
    },
  },
  {
    id: "tx-5",
    accountId: "acc-3",
    amount: 5000.00,
    currency: "USD",
    description: "Investment Deposit",
    status: "completed",
    type: "deposit",
    date: subDays(new Date(), 21),
  },
  {
    id: "tx-6",
    accountId: "acc-4",
    amount: 10000.00,
    currency: "USD",
    description: "Initial Yield Account Funding",
    status: "completed",
    type: "deposit",
    date: subDays(new Date(), 30),
  },
  {
    id: "tx-7",
    accountId: "acc-1",
    amount: -120.00,
    currency: "USD",
    description: "Utility Bill Payment",
    category: "Utilities",
    status: "pending",
    type: "payment",
    date: new Date(),
    counterparty: {
      name: "City Power & Water",
    },
  },
];

// Mock yield opportunities
export const yieldOpportunities: YieldOpportunity[] = [
  {
    id: "yield-1",
    name: "Stable USD Savings",
    description: "Low-risk stable USD yield opportunity with daily interest accrual",
    apy: 4.2,
    minInvestment: 100,
    currency: "USD",
    term: 30, // 30 days
    risk: "low",
    available: true,
  },
  {
    id: "yield-2",
    name: "Enhanced EUR Yield",
    description: "Medium-risk EUR yield opportunity with higher returns",
    apy: 5.8,
    minInvestment: 500,
    currency: "EUR",
    term: 90, // 90 days
    risk: "medium",
    available: true,
  },
  {
    id: "yield-3",
    name: "High Yield USD Strategy",
    description: "Higher risk yield strategy for maximum returns",
    apy: 8.5,
    minInvestment: 1000,
    currency: "USD",
    term: 180, // 180 days
    risk: "high",
    available: true,
  },
  {
    id: "yield-4",
    name: "Flexible USD Yield",
    description: "Low-risk strategy with flexible withdrawal",
    apy: 3.2,
    minInvestment: 50,
    currency: "USD",
    term: 0, // no fixed term
    risk: "low",
    available: true,
  },
];

// Mock yield positions
export const yieldPositions: YieldPosition[] = [
  {
    id: "pos-1",
    opportunityId: "yield-1",
    accountId: "acc-4",
    amount: 5000,
    currency: "USD",
    startDate: subDays(new Date(), 15),
    endDate: addDays(new Date(), 15),
    expectedInterest: 5000 * 0.042 * (30/365), // APY calculations
    status: "active",
  },
  {
    id: "pos-2",
    opportunityId: "yield-4",
    accountId: "acc-4",
    amount: 3000,
    currency: "USD",
    startDate: subDays(new Date(), 10),
    endDate: new Date(0), // Flexible, no end date
    expectedInterest: 3000 * 0.032 * (30/365), // APY calculations for 30 days
    status: "active",
  },
];