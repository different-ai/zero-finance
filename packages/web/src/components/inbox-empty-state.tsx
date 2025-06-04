"use client"

import { Button } from "@/components/ui/button"
import { Inbox } from "lucide-react"
import { useInboxStore } from "@/lib/store"

export function InboxEmptyState() {
  const { addDemoCards } = useInboxStore()

  const handleLoadDemoData = () => {
    addDemoCards();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Inbox className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Your inbox is empty.</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Sync with Gmail to see your actionable items or load some demo data to explore.
      </p>
      <Button onClick={handleLoadDemoData} variant="outline">
        Load Demo Data
      </Button>
    </div>
  )
}
