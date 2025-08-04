"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VirtualAccountsDisplaySimple } from "@/components/settings/align-integration/virtual-accounts-display-simple";
import { VirtualAccountForm } from "@/app/(authenticated)/dashboard/tools/safeless/components/virtual-account-form";
import { OnrampTransferForm } from "@/app/(authenticated)/dashboard/tools/safeless/components/onramp-transfer-form";
import { OfframpTransferForm } from "@/app/(authenticated)/dashboard/tools/safeless/components/offramp-transfer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Building2, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Wallet,
  Euro,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

export function PaymentAccountsContent() {
  const [activeTab, setActiveTab] = useState("accounts");
  const { data: accounts, isLoading } = api.align.getAllVirtualAccounts.useQuery();

  const eurAccounts = accounts?.filter((acc: any) => acc.deposit_instructions?.currency === 'eur') || [];
  const usdAccounts = accounts?.filter((acc: any) => acc.deposit_instructions?.currency === 'usd') || [];

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
              Payment & Virtual Accounts
            </h1>
            <p className="text-base text-muted-foreground">
              Manage virtual bank accounts and transfer funds between fiat and crypto
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-2xl font-bold">{isLoading ? "-" : accounts?.length || 0}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">EUR Accounts</p>
                <p className="text-2xl font-bold">{isLoading ? "-" : eurAccounts.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Euro className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">USD Accounts</p>
                <p className="text-2xl font-bold">{isLoading ? "-" : usdAccounts.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Routes</p>
                <p className="text-2xl font-bold">
                  {isLoading ? "-" : accounts?.filter((acc: any) => acc.status === 'active').length || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab List */}
          <div className="border-b border-neutral-200 dark:border-neutral-800 p-6">
            <TabsList className="w-full h-auto bg-neutral-50 dark:bg-neutral-800/50 p-1.5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                <TabsTrigger
                  value="accounts"
                  className="flex items-center gap-2 p-3 h-auto data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md transition-all"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">My Accounts</span>
                </TabsTrigger>

                <TabsTrigger
                  value="create"
                  className="flex items-center gap-2 p-3 h-auto data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">Create Account</span>
                </TabsTrigger>

                <TabsTrigger
                  value="onramp"
                  className="flex items-center gap-2 p-3 h-auto data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md transition-all"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="font-medium">Buy Crypto</span>
                </TabsTrigger>

                <TabsTrigger
                  value="offramp"
                  className="flex items-center gap-2 p-3 h-auto data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md transition-all"
                >
                  <ArrowDownLeft className="h-4 w-4" />
                  <span className="font-medium">Sell Crypto</span>
                </TabsTrigger>
              </div>
            </TabsList>

            {/* Tab Descriptions */}
            <div className="mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: activeTab === "accounts" ? 1 : 0 }}
                className={cn("text-sm text-muted-foreground", activeTab === "accounts" ? "block" : "hidden")}
              >
                View and manage your virtual bank accounts for receiving payments
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: activeTab === "create" ? 1 : 0 }}
                className={cn("text-sm text-muted-foreground", activeTab === "create" ? "block" : "hidden")}
              >
                Create new virtual accounts for seamless fiat deposits
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: activeTab === "onramp" ? 1 : 0 }}
                className={cn("text-sm text-muted-foreground", activeTab === "onramp" ? "block" : "hidden")}
              >
                Convert fiat currency to crypto instantly
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: activeTab === "offramp" ? 1 : 0 }}
                className={cn("text-sm text-muted-foreground", activeTab === "offramp" ? "block" : "hidden")}
              >
                Convert crypto back to fiat currency
              </motion.div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <TabsContent value="accounts" className="mt-0">
              <VirtualAccountsDisplaySimple />
            </TabsContent>

            <TabsContent value="create" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Create Virtual Account</CardTitle>
                  <CardDescription>
                    Set up a new virtual bank account to receive fiat payments that automatically convert to crypto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VirtualAccountForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="onramp" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Buy Crypto (Onramp)</CardTitle>
                  <CardDescription>
                    Transfer funds from your bank account to purchase cryptocurrency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OnrampTransferForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="offramp" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Sell Crypto (Offramp)</CardTitle>
                  <CardDescription>
                    Convert your cryptocurrency back to fiat and transfer to your bank account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OfframpTransferForm />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}