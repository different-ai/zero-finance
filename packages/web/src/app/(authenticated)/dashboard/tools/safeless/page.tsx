"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VirtualAccountForm } from "./components/virtual-account-form";
import { OnrampTransferForm } from "./components/onramp-transfer-form";
import { OfframpTransferForm } from "./components/offramp-transfer-form";

export default function SafelessPage() {
  const [activeTab, setActiveTab] = useState("virtual-account");

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Align Network Experiments</CardTitle>
          <CardDescription>
            Test virtual accounts and transfer operations on Align Network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="virtual-account">Virtual Account</TabsTrigger>
              <TabsTrigger value="onramp">Onramp Transfer</TabsTrigger>
              <TabsTrigger value="offramp">Offramp Transfer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="virtual-account" className="mt-6">
              <VirtualAccountForm />
            </TabsContent>
            
            <TabsContent value="onramp" className="mt-6">
              <OnrampTransferForm />
            </TabsContent>
            
            <TabsContent value="offramp" className="mt-6">
              <OfframpTransferForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}