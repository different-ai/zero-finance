"use client"

import { useState } from "react"
import { InboxCard } from "@/components/inbox-card"
import type { InboxCard as InboxCardType } from "@/types/inbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Filter } from "lucide-react"

interface InboxHistoryListProps {
  cards: InboxCardType[]
  onCardClick: (card: InboxCardType) => void
}

export function InboxHistoryList({ cards, onCardClick }: InboxHistoryListProps) {
  const [historyTab, setHistoryTab] = useState("executed")

  const executedCards = cards.filter((card) => card.status === "executed")
  const dismissedCards = cards.filter((card) => card.status === "dismissed")
  const autoCards = cards.filter((card) => card.status === "auto")

  return (
    <div className="h-full flex flex-col">
      <div className="border-b">
        <Tabs defaultValue="executed" value={historyTab} onValueChange={setHistoryTab} className="w-full">
          <div className="px-4">
            <TabsList>
              <TabsTrigger value="executed">Executed</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
              <TabsTrigger value="auto">Auto</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="h-8">
            <Filter className="h-3.5 w-3.5 mr-1.5" /> Filter
          </Button>
          <Button size="sm" variant="outline" className="h-8">
            <Calendar className="h-3.5 w-3.5 mr-1.5" /> Date range
          </Button>
        </div>
        <Button size="sm" variant="ghost" className="h-8">
          Export JSON
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <TabsContent value="executed" className="mt-0">
          {executedCards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No executed actions yet</div>
          ) : (
            executedCards.map((card) => <InboxCard key={card.id} card={card} onClick={onCardClick} />)
          )}
        </TabsContent>
        <TabsContent value="dismissed" className="mt-0">
          {dismissedCards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No dismissed actions yet</div>
          ) : (
            dismissedCards.map((card) => <InboxCard key={card.id} card={card} onClick={onCardClick} />)
          )}
        </TabsContent>
        <TabsContent value="auto" className="mt-0">
          {autoCards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No auto-executed actions yet</div>
          ) : (
            autoCards.map((card) => <InboxCard key={card.id} card={card} onClick={onCardClick} />)
          )}
        </TabsContent>
      </div>
    </div>
  )
}
