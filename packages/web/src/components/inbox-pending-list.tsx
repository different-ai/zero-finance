"use client"

import { InboxCard } from "@/components/inbox-card"
import type { InboxCard as InboxCardType } from "@/types/inbox"

interface InboxPendingListProps {
  cards: InboxCardType[]
  onCardClick: (card: InboxCardType) => void
}

export function InboxPendingList({ cards, onCardClick }: InboxPendingListProps) {
  return (
    <div className="p-4">
      {cards.map((card) => (
        <InboxCard key={card.id} card={card} onClick={onCardClick} />
      ))}
    </div>
  )
}
