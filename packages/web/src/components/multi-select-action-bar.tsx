"use client";

import { Button } from "@/components/ui/button";
import { useInboxStore } from "@/lib/store";
import { Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MultiSelectActionBar() {
  const { selectedCardIds, executeCard, dismissCard, clearSelection } = useInboxStore();
  const hasSelected = selectedCardIds.size > 0;

  if (!hasSelected) return null;

  const handleApprove = () => {
    selectedCardIds.forEach((id) => executeCard(id));
    clearSelection();
  };

  const handleDismiss = () => {
    selectedCardIds.forEach((id) => dismissCard(id));
    clearSelection();
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-4 flex justify-center z-50 pointer-events-none",
      )}
    >
      <div className="pointer-events-auto bg-card border shadow-md rounded-full px-4 py-2 flex items-center gap-3">
        <span className="text-sm font-medium">{selectedCardIds.size} selected</span>
        <Button size="sm" className="h-8 px-3" onClick={handleApprove}>
          <Check className="h-4 w-4 mr-1" /> Approve
        </Button>
        <Button size="sm" variant="outline" className="h-8 px-3" onClick={handleDismiss}>
          <XCircle className="h-4 w-4 mr-1" /> Dismiss
        </Button>
      </div>
    </div>
  );
}