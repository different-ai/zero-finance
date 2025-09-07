"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CryptoTransactionHistory } from './crypto-transaction-history';
import { BankTransfersList } from './bank-transfers-list';

export function TransactionTabs() {
  return (
    <Tabs defaultValue="bank" className="w-full p-6">
      <TabsList className="mb-4 overflow-x-auto">
        <TabsTrigger value="bank">Bank Transfers</TabsTrigger>
        <TabsTrigger value="crypto">Crypto Transfers</TabsTrigger>
      </TabsList>

      <TabsContent value="bank">
        <BankTransfersList />
      </TabsContent>

      <TabsContent value="crypto">
        <CryptoTransactionHistory />
      </TabsContent>
    </Tabs>
  );
}