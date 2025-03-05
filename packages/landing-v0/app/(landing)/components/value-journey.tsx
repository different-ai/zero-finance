'use client';

import { useState, useEffect } from 'react';
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
  // Check if it's mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <Card className="border-primary/20 bg-white shadow-md">
      <CardHeader className="px-3 py-2 sm:p-6">
        <CardDescription className="text-gray-600 text-xs sm:text-sm">How your crypto bank account works for you 24/7</CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <div className={`${isMobile ? 'space-y-3' : 'grid gap-4 md:grid-cols-3'}`}>
          <Card className="border-primary/20 bg-white shadow-sm">
            <CardHeader className="px-3 py-2 sm:p-6">
              <CardTitle className="flex items-center text-base sm:text-lg text-gray-800">
                <Wallet className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                1. Consolidate
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <p className="text-xs sm:text-sm text-gray-600">
                Bring all your crypto into one secure multi-chain wallet with a debit card for daily spending.
              </p>
              <div className="mt-3 p-2 bg-primary/5 rounded-md border border-primary/10">
                <p className="text-xs sm:text-sm italic text-gray-700">
                  "Connected: 4 wallets on 3 chains with total balance of $22,450 in crypto assets + debit card activated"
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-white shadow-sm">
            <CardHeader className="px-3 py-2 sm:p-6">
              <CardTitle className="flex items-center text-base sm:text-lg text-gray-800">
                <Coins className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                2. Optimize
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <p className="text-xs sm:text-sm text-gray-600">
                AI analyzes your assets and finds the best yield opportunities across DeFi protocols.
              </p>
              <div className="mt-3 space-y-1 sm:space-y-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                  Yield Found
                </Badge>
                <p className="text-xs sm:text-sm text-gray-700">10,000 USDC → Aave: 9.2% APY (+$920/year)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-white shadow-sm">
            <CardHeader className="px-3 py-2 sm:p-6">
              <CardTitle className="flex items-center text-base sm:text-lg text-gray-800">
                <BarChart4 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                3. Automate
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <p className="text-xs sm:text-sm text-gray-600">
                Your smart bank account handles your freelance business operations while your money grows.
              </p>
              <div className="mt-3 p-2 bg-primary/5 rounded-md border border-primary/10">
                <p className="text-xs sm:text-sm text-gray-700">
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