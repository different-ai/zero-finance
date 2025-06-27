"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TransactionHistoryList } from './transaction-history-list';
import { OfframpTransfersList } from './offramp-transfers-list';

export function TransactionTabs() {
  return (
    <Tabs defaultValue="base" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="base">Base Transactions</TabsTrigger>
        <TabsTrigger value="offramp">Offramp Transfers</TabsTrigger>
      </TabsList>
      <TabsContent value="base">
        <TransactionHistoryList />
      </TabsContent>
      <TabsContent value="offramp">
        <OfframpTransfersList />
      </TabsContent>
    </Tabs>
  );
}