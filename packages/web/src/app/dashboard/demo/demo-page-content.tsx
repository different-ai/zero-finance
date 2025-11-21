'use client';

import { FundsDisplayWithDemo } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard/funds-display-with-demo';
import { TransactionTabsDemo } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard/transaction-tabs-demo';
import SavingsPageWrapper from '@/app/(authenticated)/dashboard/savings/page-wrapper';
import { BankingInstructionsDisplay } from '@/components/virtual-accounts/banking-instructions-display';

const DEMO_ACCOUNTS = [
  {
    id: 'demo-ach',
    accountTier: 'starter' as const,
    sourceAccountType: 'us_ach' as const,
    sourceCurrency: 'USD',
    sourceBankName: 'JPMorgan Chase',
    sourceRoutingNumber: '021000021',
    sourceAccountNumber: '****5678',
    sourceIban: null,
    sourceBicSwift: null,
    sourceBankBeneficiaryName: 'Demo Company Inc.',
    destinationAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    destinationBankName: 'Mercury',
    destinationCurrency: 'USDC',
    status: 'active',
  },
  {
    id: 'demo-iban',
    accountTier: 'starter' as const,
    sourceAccountType: 'iban' as const,
    sourceCurrency: 'EUR',
    sourceBankName: 'Deutsche Bank',
    sourceRoutingNumber: null,
    sourceAccountNumber: null,
    sourceIban: 'DE89 3704 0044 0532 0130 00',
    sourceBicSwift: 'DEUTDEFF',
    sourceBankBeneficiaryName: 'Bridge Building Sp.z.o.o.',
    destinationAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    destinationCurrency: 'EURC',
    status: 'active',
  },
];

const DEMO_USER_DATA = {
  firstName: 'Demo',
  lastName: 'User',
  companyName: 'Demo Company Inc.',
};

// Demo funds component that always shows demo data
function DemoFunds() {
  return (
    <FundsDisplayWithDemo
      totalBalance={800000} // $800k demo balance in checking
      walletAddress="0xDemo...1234"
      isDemo={true}
    />
  );
}

export default function DemoPageContent() {
  return (
    <div className="min-h-screen bg-[#F7F7F2] relative">
      {/* Demo Mode Banner - Absolute positioned at top */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-[#1B29FF] border-b border-[#101010]/10 ">
        <div className="h-[48px] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-[11px] uppercase tracking-[0.14em] text-white/90">
                Demo Mode
              </span>
            </div>
            <p className="text-[14px] text-white/90">
              Explore Zero Finance with sample data
            </p>
            <a
              href="/signin"
              className="ml-4 text-[14px] text-white font-medium underline underline-offset-2 hover:text-white/80 transition-colors"
            >
              Sign in to start earning real 8% APY →
            </a>
          </div>
        </div>
      </div>

      {/* Main Content - Add padding-top to account for banner */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 sm:pb-12">
        <div className="space-y-6">
          {/* Welcome Section */}
       

          {/* Balance Section - Checking Account */}


          {/* Savings/Yield Section */}
          <div>
            <div className="mb-4">
              <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Savings
              </h2>
              <p className="mt-1 text-[14px] text-[#101010]/60">
                Earn 8% APY on your idle cash reserves
              </p>
            </div>
            <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
              <div className="p-6 sm:p-8">
                <SavingsPageWrapper mode="demo" />
              </div>
            </div>
          </div>


          {/* Banking Information Section */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] overflow-hidden">
            <div className="p-6 border-b border-[#101010]/10">
              <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Banking Information
              </h2>
              <p className="mt-1 text-[14px] text-[#101010]/60">
                Your assigned virtual accounts for deposits
              </p>
            </div>
            <div className="px-1 sm:px-2">
              <BankingInstructionsDisplay
                accounts={DEMO_ACCOUNTS}
                userData={DEMO_USER_DATA}
              />
            </div>
          </div>

          {/* Transactions Section */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
            <div className="p-5 sm:p-6 border-b border-[#101010]/10">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                RECENT ACTIVITY
              </p>
              <h2 className="mt-2 font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Transactions & Transfers
              </h2>
            </div>
            <TransactionTabsDemo />
          </div>

          {/* CTA Section */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] p-8 text-center shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
            <h3 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010] mb-3">
              Ready to start earning 8% APY?
            </h3>
            <p className="text-[15px] text-[#101010]/60 mb-8 max-w-2xl mx-auto">
              Join hundreds of startups already maximizing their idle cash with
              Zero Finance. Get started in minutes with bank-level security.
            </p>
            <a
              href="/signin"
              className="inline-flex items-center px-6 py-3 bg-[#1B29FF] hover:bg-[#1420CC] text-white rounded-md font-medium transition-colors shadow-[0_4px_12px_rgba(27,41,255,0.2)]"
            >
              Start Earning 8% APY →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
