"use client"

import { InboxCard } from "@/components/inbox-card"
import type { InboxCard as InboxCardType } from "@/types/inbox"

interface InboxSnoozedListProps {
  cards: InboxCardType[]
  onCardClick: (card: InboxCardType) => void
}

export function InboxSnoozedList({ cards, onCardClick }: InboxSnoozedListProps) {
  return (
    <div className="p-4">
      {cards.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No snoozed actions</div>
      ) : (
        cards.map((card) => <InboxCard key={card.id} card={card} onClick={onCardClick} />)
      )}
    </div>
  )
}
