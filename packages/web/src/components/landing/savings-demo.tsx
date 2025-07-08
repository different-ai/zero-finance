"use client";

import React, { useState } from "react";
import { BrowserWindow } from "@/components/ui/browser-window";
import { AllocationDial } from "@/components/savings";
import { TrendingUp } from "lucide-react";

export function SavingsDemo() {
  const [percentage, setPercentage] = useState(20);
  const APY = 8;
  const brand = "#0050ff";

  return (
    <div className="relative pointer-events-none">
      <BrowserWindow
        url="0.finance/dashboard/savings"
        title="Zero Finance – Savings Vault"
      >
        <div className="bg-gray-50 p-6 flex flex-col items-center">
          {/* Interactive dial */}
          <AllocationDial
            percentage={percentage}
            onPercentageChange={setPercentage}
            size={180}
          />
          {/* Info */}
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {percentage}% auto-saved
            </h3>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" style={{ color: brand }} /> Earn up to
              {" "}
              <span className="font-medium" style={{ color: brand }}>{APY}%</span> APY
            </p>
          </div>
        </div>
      </BrowserWindow>
    </div>
  );
} 