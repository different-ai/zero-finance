'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VirtualAccountsDisplaySimple } from '@/components/settings/align-integration/virtual-accounts-display-simple';
import { VirtualAccountForm } from '@/app/(authenticated)/dashboard/tools/safeless/components/virtual-account-form';
import { OnrampTransferForm } from '@/app/(authenticated)/dashboard/tools/safeless/components/onramp-transfer-form';
import { OfframpTransferForm } from '@/app/(authenticated)/dashboard/tools/safeless/components/offramp-transfer-form';
import {
  Building2,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Euro,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/trpc/react';

export function PaymentAccountsContent() {
  const [activeTab, setActiveTab] = useState('accounts');
  const { data: accounts, isLoading } =
    api.align.getAllVirtualAccounts.useQuery();

  const eurAccounts =
    accounts?.filter(
      (acc: any) => acc.deposit_instructions?.currency === 'eur',
    ) || [];
  const usdAccounts =
    accounts?.filter(
      (acc: any) => acc.deposit_instructions?.currency === 'usd',
    ) || [];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header - Technical Mode */}
      <header className="sticky top-0 z-40 bg-[#F8F9FA] border-b border-[#1B29FF]/20">
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto mt-1">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] font-mono mr-3">
            CONFIG::ACCOUNTS
          </p>
          <h1 className="font-mono text-[22px] sm:text-[26px] leading-[1] text-[#101010]">
            Virtual Accounts
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto space-y-6">
        <div>
          <p className="text-[14px] text-[#101010]/60 font-mono">
            Manage virtual bank accounts and transfer funds between fiat and
            crypto
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#1B29FF]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#101010]/50 font-mono uppercase tracking-wider">
                  TOTAL_ACCOUNTS
                </p>
                <p className="text-[28px] font-mono text-[#101010] mt-1">
                  {isLoading ? '-' : accounts?.length || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-[#1B29FF]/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-[#1B29FF]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#1B29FF]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#101010]/50 font-mono uppercase tracking-wider">
                  EUR_ACCOUNTS
                </p>
                <p className="text-[28px] font-mono text-[#101010] mt-1">
                  {isLoading ? '-' : eurAccounts.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 flex items-center justify-center">
                <Euro className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#1B29FF]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#101010]/50 font-mono uppercase tracking-wider">
                  USD_ACCOUNTS
                </p>
                <p className="text-[28px] font-mono text-[#101010] mt-1">
                  {isLoading ? '-' : usdAccounts.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#1B29FF]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#101010]/50 font-mono uppercase tracking-wider">
                  ACTIVE_ROUTES
                </p>
                <p className="text-[28px] font-mono text-[#101010] mt-1">
                  {isLoading
                    ? '-'
                    : accounts?.filter((acc: any) => acc.status === 'active')
                        .length || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white border border-[#1B29FF]/20 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Tab List */}
            <div className="border-b border-[#1B29FF]/20 p-5 sm:p-6">
              <TabsList className="w-full h-auto bg-[#1B29FF]/5 p-1.5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                  <TabsTrigger
                    value="accounts"
                    className="flex items-center gap-2 p-3 h-auto font-mono text-[13px] data-[state=active]:bg-[#1B29FF] data-[state=active]:text-white transition-all"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>ACCOUNTS</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="create"
                    className="flex items-center gap-2 p-3 h-auto font-mono text-[13px] data-[state=active]:bg-[#1B29FF] data-[state=active]:text-white transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>CREATE</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="onramp"
                    className="flex items-center gap-2 p-3 h-auto font-mono text-[13px] data-[state=active]:bg-[#1B29FF] data-[state=active]:text-white transition-all"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    <span>BUY_CRYPTO</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="offramp"
                    className="flex items-center gap-2 p-3 h-auto font-mono text-[13px] data-[state=active]:bg-[#1B29FF] data-[state=active]:text-white transition-all"
                  >
                    <ArrowDownLeft className="h-4 w-4" />
                    <span>SELL_CRYPTO</span>
                  </TabsTrigger>
                </div>
              </TabsList>

              {/* Tab Descriptions */}
              <div className="mt-4">
                {activeTab === 'accounts' && (
                  <p className="text-[13px] text-[#101010]/50 font-mono">
                    View and manage virtual bank accounts for receiving payments
                  </p>
                )}
                {activeTab === 'create' && (
                  <p className="text-[13px] text-[#101010]/50 font-mono">
                    Create new virtual accounts for seamless fiat deposits
                  </p>
                )}
                {activeTab === 'onramp' && (
                  <p className="text-[13px] text-[#101010]/50 font-mono">
                    Convert fiat currency to crypto instantly
                  </p>
                )}
                {activeTab === 'offramp' && (
                  <p className="text-[13px] text-[#101010]/50 font-mono">
                    Convert crypto back to fiat currency
                  </p>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-5 sm:p-6">
              <TabsContent value="accounts" className="mt-0">
                <VirtualAccountsDisplaySimple />
              </TabsContent>

              <TabsContent value="create" className="mt-0">
                <div className="border border-[#1B29FF]/20">
                  <div className="border-b border-[#1B29FF]/20 px-5 py-4">
                    <h3 className="font-mono text-[15px] text-[#101010]">
                      CREATE::VIRTUAL_ACCOUNT
                    </h3>
                    <p className="text-[13px] text-[#101010]/50 font-mono mt-1">
                      Set up a new virtual bank account to receive fiat payments
                      that automatically convert to crypto
                    </p>
                  </div>
                  <div className="p-5">
                    <VirtualAccountForm />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="onramp" className="mt-0">
                <div className="border border-[#1B29FF]/20">
                  <div className="border-b border-[#1B29FF]/20 px-5 py-4">
                    <h3 className="font-mono text-[15px] text-[#101010]">
                      ONRAMP::BUY_CRYPTO
                    </h3>
                    <p className="text-[13px] text-[#101010]/50 font-mono mt-1">
                      Transfer funds from your bank account to purchase
                      cryptocurrency
                    </p>
                  </div>
                  <div className="p-5">
                    <OnrampTransferForm />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="offramp" className="mt-0">
                <div className="border border-[#1B29FF]/20">
                  <div className="border-b border-[#1B29FF]/20 px-5 py-4">
                    <h3 className="font-mono text-[15px] text-[#101010]">
                      OFFRAMP::SELL_CRYPTO
                    </h3>
                    <p className="text-[13px] text-[#101010]/50 font-mono mt-1">
                      Convert your cryptocurrency back to fiat and transfer to
                      your bank account
                    </p>
                  </div>
                  <div className="p-5">
                    <OfframpTransferForm />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
