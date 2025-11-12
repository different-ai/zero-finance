// Type definitions for company data
export interface Founder {
  id: string;
  name: string;
  role: string;
  twitter: string;
  avatar: string;
  bio?: string;
}

export interface Funding {
  amount: number;
  round: string;
  date: string;
  valuation?: number | null;
  leadInvestors?: string[];
  participatingInvestors?: string[];
  angels?: string[];
  announcement?: string;
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  logo?: string;
  website: string;
  twitter?: string;
  category: string;
  whyWeLoveThem: string;
  funFact?: string;
  funding: Funding;
  founders: Founder[];
  metrics?: Record<string, string | undefined>;
  publishedDate?: string;
  featuredOrder?: number;
  showcase?: {
    primaryColor?: string;
    gradient?: string;
    emoji?: string;
    featured?: boolean;
    order?: number;
  };
}

export interface Expense {
  name: string;
  cost: number;
  icon: string;
}

export interface TeamMember {
  role: string;
  salary: number;
  icon: string;
}

export interface CalculatorConfig {
  bankRate: number;
  zeroRate: number;
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  step: number;
}

export interface CompanyData {
  companies: Company[];
  calculatorConfig: CalculatorConfig;
  expenses: Expense[];
  teamMembers: TeamMember[];
}

// Import and export the JSON data with types
import companiesData from '@/data/companies.json';

export const data = companiesData as CompanyData;

// Helper functions
export const getFeaturedCompany = (): Company | undefined => {
  return data.companies.find((company) => company.showcase?.featured);
};

export const getCompanyById = (id: string): Company | undefined => {
  return data.companies.find((company) => company.id === id);
};

export const getCompanies = (): Company[] => {
  return data.companies.sort((a, b) => {
    const orderA = a.showcase?.order ?? 999;
    const orderB = b.showcase?.order ?? 999;
    return orderA - orderB;
  });
};
