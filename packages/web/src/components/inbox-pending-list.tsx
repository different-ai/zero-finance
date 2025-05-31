"use client"

import { InboxCard } from "@/components/inbox-card"
import { MobileInboxCard } from "@/components/mobile-inbox-card"
import { useIsMobile } from "@/hooks/use-mobile"
import type { InboxCard as InboxCardType } from "@/types/inbox"

interface InboxPendingListProps {
  cards: InboxCardType[]
  onCardClick: (card: InboxCardType) => void
}

export function InboxPendingList({ cards, onCardClick }: InboxPendingListProps) {
  const isMobile = useIsMobile()
  return (
    <div className="p-4">
      {cards.map((card) =>
        isMobile ? (
          <MobileInboxCard key={card.id} card={card} onClick={onCardClick} />
        ) : (
          <InboxCard key={card.id} card={card} onClick={onCardClick} />
        ),
      )}
    </div>
  )
}
