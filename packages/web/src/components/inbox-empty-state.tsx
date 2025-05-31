"use client"

import { Button } from "@/components/ui/button"
import { Inbox } from "lucide-react"
import { useInboxStore } from "@/lib/store"
import { useEffect } from "react"

export function InboxEmptyState() {
  const { addDemoCards } = useInboxStore()
  useEffect(() => {
    addDemoCards()
  }, [addDemoCards])

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Inbox className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">All clear – the agent has nothing for you yet.</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        We&apos;ll surface actions like cash sweeps, tax moves, or late invoices here. Want to test?
      </p>
    </div>
  )
}
