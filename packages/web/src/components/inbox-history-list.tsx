"use client"

import { InboxCard } from "@/components/inbox-card"
import { MobileInboxCard } from "@/components/mobile-inbox-card"
import { useIsMobile } from "@/hooks/use-mobile"
import type { InboxCard as InboxCardType } from "@/types/inbox"

interface InboxHistoryListProps {
  cards: InboxCardType[]
  onCardClick: (card: InboxCardType) => void
}

export function InboxHistoryList({ cards, onCardClick }: InboxHistoryListProps) {
  const isMobile = useIsMobile()

  // Sort cards by timestamp (most recent first)
  const sortedCards = [...cards].sort((a, b) => {
    const timestampA = new Date(a.timestamp).getTime()
    const timestampB = new Date(b.timestamp).getTime()
    return timestampB - timestampA
  })

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        {sortedCards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No history yet</p>
            <p className="text-sm">Actions you take will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCards.map((card) =>
              isMobile ? (
                <MobileInboxCard key={card.id} card={card} onClick={onCardClick} />
              ) : (
                <InboxCard key={card.id} card={card} onClick={onCardClick} />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}
