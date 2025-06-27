/// <reference types="react" />
// @ts-nocheck
"use client"

import React from "react"
import { InboxCard } from "@/components/inbox-card"
import { MobileInboxCard } from "@/components/mobile-inbox-card"
import { useIsMobile } from "@/hooks/use-mobile"
import type { InboxCard as InboxCardType } from "@/types/inbox"
import { useMemo } from "react"

interface InboxPendingListProps {
  cards: InboxCardType[]
  onCardClick: (card: InboxCardType) => void
  groupBy?: 'none' | 'vendor' | 'amount' | 'frequency'
}

export function InboxPendingList({ cards, onCardClick, groupBy = 'none' }: InboxPendingListProps) {
  const isMobile = useIsMobile()

  const grouped = useMemo(() => {
    if (groupBy === 'none') return { All: cards } as Record<string, InboxCardType[]>;

    const map: Record<string, InboxCardType[]> = {}
    const getKey = (c: InboxCardType) => {
      if (groupBy === 'vendor') {
        return c.from || c.to || (c.sourceDetails as any).name || 'Unknown'
      }
      if (groupBy === 'amount') {
        const amtNum = parseFloat(c.amount || '0')
        const amt = isNaN(amtNum) ? 0 : amtNum
        if (amt > 1000) return 'High (> $1k)'
        if (amt > 100) return 'Medium ($100-1k)'
        return 'Low (< $100)'
      }
      if (groupBy === 'frequency') {
        // frequency grouping: by vendor occurence count threshold
        const vendor = c.from || c.to || (c.sourceDetails as any).name || 'Unknown'
        const count = cards.filter(card=> (card.from || card.to || (card.sourceDetails as any).name) === vendor).length
        return count > 2 ? 'Frequent' : 'Infrequent'
      }
      return 'Other'
    }
    cards.forEach(card => {
      const key = getKey(card)
      if (!map[key]) map[key] = []
      map[key].push(card)
    })
    return map
  }, [cards, groupBy])

  return (
    <div className="p-2 sm:p-4 space-y-6">
      {Object.entries(grouped).map(([group, list]) => (
        <div key={group}>
          {groupBy !== 'none' && <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{group}</h4>}
          <div className="space-y-2">
            {list.map(card => (
              isMobile ? (
                <MobileInboxCard key={card.id} card={card} onClick={onCardClick} />
              ) : (
                <InboxCard key={card.id} card={card} onClick={onCardClick} />
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
