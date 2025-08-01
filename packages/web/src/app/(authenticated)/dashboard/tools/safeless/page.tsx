"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VirtualAccountForm } from "./components/virtual-account-form";
import { OnrampTransferForm } from "./components/onramp-transfer-form";
import { OfframpTransferForm } from "./components/offramp-transfer-form";
import { motion } from "framer-motion";
import { Coins, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function SafelessPage() {
  const [activeTab, setActiveTab] = useState("virtual-account");

  const tabConfig = [
    {
      value: "virtual-account",
      label: "Virtual Account",
      icon: Coins,
      description: "Create virtual accounts for seamless fiat deposits"
    },
    {
      value: "onramp",
      label: "Onramp Transfer",
      icon: ArrowUpRight,
      description: "Convert fiat to crypto instantly"
    },
    {
      value: "offramp",
      label: "Offramp Transfer",
      icon: ArrowDownLeft,
      description: "Convert crypto back to fiat"
    }
  ];

  return (
    <div className="w-full space-y-8 p-4">
      {/* Header with gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <Coins className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
              Payment Routes
            </h1>
            <p className="text-base text-muted-foreground">
              Bridge traditional finance with crypto seamlessly
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Custom Tab List */}
          <div className="border-b border-neutral-200 dark:border-neutral-800 p-6">
            <TabsList className="w-full h-auto bg-neutral-50 dark:bg-neutral-800/50 p-1.5">
              <div className="grid grid-cols-3 gap-2 w-full">
                {tabConfig.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col gap-2 p-4 h-auto data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md transition-all"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </div>
            </TabsList>
            
            {/* Tab Description */}
            <div className="mt-4">
              {tabConfig.map((tab) => (
                <motion.p
                  key={tab.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeTab === tab.value ? 1 : 0 }}
                  className={`text-sm text-muted-foreground ${
                    activeTab === tab.value ? 'block' : 'hidden'
                  }`}
                >
                  {tab.description}
                </motion.p>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            <TabsContent value="virtual-account" className="mt-0">
              <VirtualAccountForm />
            </TabsContent>
            
            <TabsContent value="onramp" className="mt-0">
              <OnrampTransferForm />
            </TabsContent>
            
            <TabsContent value="offramp" className="mt-0">
              <OfframpTransferForm />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}