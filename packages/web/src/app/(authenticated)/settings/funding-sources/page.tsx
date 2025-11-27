import { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, Building2, ArrowLeft, BanknoteIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Funding Sources - Zero Finance',
  description: 'Manage your payment methods and funding sources',
};

export default function FundingSourcesPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Dashboard Header - Following Design Language */}
      <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b border-[#101010]/10">
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <Link
            href="/settings"
            className="flex items-center text-[#101010]/60 hover:text-[#101010] transition-colors mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mr-3">
            Settings
          </p>
          <h1 className="font-serif text-[24px] sm:text-[28px] leading-[1] text-[#101010]">
            Funding Sources
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {/* Virtual Bank Account Card */}
          <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <BanknoteIcon className="h-5 w-5 text-[#0050ff] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                  Virtual Bank Account
                </h2>
                <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70 leading-[1.5]">
                  Receive fiat payments via bank transfer, automatically convert
                  to crypto
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-[13px] text-[#101010]/60">
                    Set up a virtual bank account through Align to receive USD
                    or EUR payments.
                  </p>
                  <ul className="text-[12px] space-y-1.5 text-[#101010]/50">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Get your own IBAN or ACH account details
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Share with clients for easy bank transfers
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Automatic conversion to stablecoin
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Funds delivered to your wallet or safe
                    </li>
                  </ul>
                </div>
                <div className="mt-6 p-3 bg-[#F7F7F2] rounded-md">
                  <p className="text-[12px] text-[#101010]/60 text-center">
                    Virtual bank account setup is available in your dashboard
                    onboarding flow
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Bank Details Card */}
          <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-[#0050ff] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                  Manual Bank Details
                </h2>
                <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70 leading-[1.5]">
                  Add your traditional bank account details for invoices
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-[13px] text-[#101010]/60">
                    Add your existing bank account details to be included on
                    invoices.
                  </p>
                  <ul className="text-[12px] space-y-1.5 text-[#101010]/50">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Add multiple bank accounts
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Support for IBAN, SWIFT/BIC, and Routing numbers
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Choose which account to use per invoice
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      No automatic conversion to crypto
                    </li>
                  </ul>
                </div>
                <button className="mt-6 w-full px-4 py-2 text-[13px] font-medium text-[#101010] bg-white border border-[#101010]/20 rounded-md hover:bg-[#F7F7F2] transition-colors">
                  Add Bank Details
                </button>
              </div>
            </div>
          </div>

          {/* Crypto Wallet Card */}
          <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-[#0050ff] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                  Crypto Wallets
                </h2>
                <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70 leading-[1.5]">
                  Manage your crypto addresses for payments
                </p>
                <div className="mt-4">
                  <p className="text-[13px] text-[#101010]/60">
                    Add and manage wallet addresses for receiving crypto
                    payments directly through invoices or other channels.
                  </p>
                </div>
                <button className="mt-6 w-full px-4 py-2 text-[13px] font-medium text-[#101010] bg-white border border-[#101010]/20 rounded-md hover:bg-[#F7F7F2] transition-colors">
                  Manage Wallets
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
