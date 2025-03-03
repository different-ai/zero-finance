'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, BarChart4, ArrowUpDown, Coins } from "lucide-react";

export function ValueJourney() {
  return (
    <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
      <CardHeader>
        <CardDescription>How your crypto bank account works for you 24/7</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/40 bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Wallet className="mr-2 h-4 w-4 text-purple-500" />
                1. Consolidate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bring all your crypto into one secure multi-chain wallet with a Gnosis Pay debit card for daily spending.
              </p>
              <div className="mt-4 p-2 bg-muted/40 rounded-md">
                <p className="text-sm italic">
                  "Connected: 4 wallets on 3 chains with total balance of $22,450 in crypto assets + debit card activated"
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Coins className="mr-2 h-4 w-4 text-blue-500" />
                2. Optimize
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI analyzes your assets and finds the best yield opportunities across DeFi protocols.
              </p>
              <div className="mt-4 space-y-2">
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                  Yield Found
                </Badge>
                <p className="text-sm">10,000 USDC → Aave: 9.2% APY (+$920/year)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart4 className="mr-2 h-4 w-4 text-green-500" />
                3. Automate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your smart bank account handles your freelance business operations while your money grows.
              </p>
              <div className="mt-4 p-2 bg-muted/40 rounded-md">
                <p className="text-sm">
                  ✅ Invoice sent to DesignCraft: $3,500
                  <br />
                  ✅ Payment received and automatically allocated: 25% to taxes, 50% to yield strategy, 25% liquid
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 