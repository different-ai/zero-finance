"use client";

/// <reference types="react" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, AlertCircle, ExternalLink, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

// Simple helper to format amount strings with commas (assumes string decimal number)
const formatAmount = (amount: string) => {
  const n = Number(amount);
  if (isNaN(n)) return amount;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export function OutgoingTransfersList() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data: transfers,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.align.getAllOfframpTransfers.useQuery();

  const handleOpenAlign = (alignTransferId: string) => {
    // Align currently has no public explorer; just copy id to clipboard
    navigator.clipboard.writeText(alignTransferId).catch(() => {});
    setSelectedId(alignTransferId);
  };

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Outgoing Transfers</h3>
        <p className="text-sm text-gray-500">Recent fiat off-ramp requests.</p>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : isError ? (
          <div className="px-6 py-8">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Error loading transfers</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {error?.message || "Could not fetch transfers. Please try again later."}
            </p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              Retry
            </Button>
          </div>
        ) : !transfers || transfers.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">No outgoing transfers yet.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {transfers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleOpenAlign(t.id)}
                  className={cn(
                    "w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left group",
                    selectedId === t.id && "bg-gray-50"
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium truncate">
                      {formatAmount(t.amount)} {t.source_token.toUpperCase()} → {t.destination_currency.toUpperCase()}
                    </p>
                    <p className="text-gray-500 text-sm truncate capitalize">
                      {t.status} • {dayjs(t.created_at).fromNow()}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}