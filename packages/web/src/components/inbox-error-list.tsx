"use client"

import { InboxCard } from "@/components/inbox-card"
import { MobileInboxCard } from "@/components/mobile-inbox-card"
import { useIsMobile } from "@/hooks/use-mobile"
import type { InboxCard as InboxCardType } from "@/types/inbox"

interface InboxErrorListProps {
  cards: InboxCardType[]
  onCardClick: (card: InboxCardType) => void
}

export function InboxErrorList({ cards, onCardClick }: InboxErrorListProps) {
  const isMobile = useIsMobile()
  return (
    <div className="p-4">
      {cards.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No errors</div>
      ) : (
        cards.map((card) =>
          isMobile ? (
            <MobileInboxCard key={card.id} card={card} onClick={onCardClick} />
          ) : (
            <InboxCard key={card.id} card={card} onClick={onCardClick} />
          ),
        )
      )}
    </div>
  )
}
