'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CryptoTransactionHistory } from './crypto-transaction-history';
import { BankTransfersList } from './bank-transfers-list';
import { useBimodal } from '@/components/ui/bimodal';

export function TransactionTabs() {
  const { isTechnical } = useBimodal();

  // In Banking mode, just show bank transfers without tabs
  if (!isTechnical) {
    return (
      <div className="w-full p-0">
        <BankTransfersList />
      </div>
    );
  }

  // Technical mode shows both tabs
  return (
    <Tabs defaultValue="bank" className="w-full p-0">
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
