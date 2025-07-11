// @ts-nocheck
"use client"

import { InboxCard as InboxCardType } from "@/types/inbox"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import { useInboxStore } from "@/lib/store"
import { trpc } from "@/utils/trpc"
import { motion, AnimatePresence } from "framer-motion"

interface MobileInboxCardProps {
  card: InboxCardType
  onClick: (card: InboxCardType) => void
}

export function MobileInboxCard({ card, onClick }: MobileInboxCardProps) {
  const getCardIcon = () => {
    switch (card.icon ) {
      case "bank":
        return "🏦"
      case "invoice":
        return "📄"
      case "compliance":
        return "🛡️"
      case "fx":
        return "✈️"
      default:
        return "📋"
    }
  }

  const getCardBorderClass = () => {
    if (card.status === "error") return "border-l-4 border-l-destructive"
    if (card.status === "snoozed") return "border-l-4 border-l-muted"

    if (card.confidence >= 95) return "border-l-4 border-l-green-300"
    if (card.confidence >= 60 && card.confidence < 95) return "border-l-4 border-l-amber-400"
    if (card.blocked) return "border-l-4 border-l-destructive"

    return ""
  }

  const getConfidenceBadgeClass = () => {
    if (card.confidence >= 95) return "bg-green-100 text-green-800"
    if (card.confidence >= 60 && card.confidence < 95) return "bg-amber-100 text-amber-800"
    return "bg-muted text-muted-foreground"
  }

  // Swipe detection
  const startX = useRef<number | null>(null)
  const [swiped, setSwiped] = useState(false)

  const { executeCard, addToast } = useInboxStore()

  const markSeenMutation = trpc.inboxCards.markSeen.useMutation({
    onSuccess: () => addToast({ message: 'Marked as seen', status: 'success' }),
    onError: (err) => addToast({ message: err.message || 'Failed', status: 'error' })
  })

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (startX.current === null) return
    const endX = e.changedTouches[0].clientX
    const diffX = endX - startX.current
    const swipeThreshold = 80 // px
    if (diffX > swipeThreshold) {
      // Swipe right detected -> approve
      setSwiped(true)
      executeCard(card.id) // optimistic
      try {
        await markSeenMutation.mutateAsync({ cardId: card.id })
      } catch (err) {
        console.error(err)
      }
    }
    startX.current = null
  }

  return (
    <AnimatePresence>
      {!swiped && (
        <motion.div
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={cn("border rounded-md p-3 mb-2 active:bg-muted/50 touch-manipulation", getCardBorderClass())}
            onClick={() => onClick(card)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getCardIcon()}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{card.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>

                    {card.status === "error" && <p className="text-xs text-destructive mt-1">Network error – retry?</p>}

                    {card.status === "snoozed" && (
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Snoozed {card.snoozedTime}</span>
                      </div>
                    )}
                  </div>

                  {card.confidence > 0 && (
                    <Badge variant="outline" className={cn("text-xs", getConfidenceBadgeClass())}>
                      {card.confidence}%
                    </Badge>
                  )}
                </div>

                {/* Buttons removed for mobile; swipe right to approve */}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
