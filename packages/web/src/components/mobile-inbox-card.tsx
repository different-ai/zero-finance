// @ts-nocheck
"use client"

import { InboxCard as InboxCardType } from "@/types/inbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInboxStore } from "@/lib/store"
import { trpc } from "@/utils/trpc"

interface MobileInboxCardProps {
  card: InboxCardType
  onClick: (card: InboxCardType) => void
}

export function MobileInboxCard({ card, onClick }: MobileInboxCardProps) {
  const { executeCard, addToast } = useInboxStore()

  // tRPC mutation to mark the card as seen (equivalent of "Approve")
  const markSeenMutation = trpc.inboxCards.markSeen.useMutation({
    onSuccess: () => addToast({ message: "Marked as seen", status: "success" }),
    onError: (err) => addToast({ message: err.message || "Failed to mark as seen", status: "error" }),
  })

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await markSeenMutation.mutateAsync({ cardId: card.id })
      executeCard(card.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick(card)
  }

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

  return (
    <div
      className={cn("border rounded-md p-3 mb-2 active:bg-muted/50 touch-manipulation", getCardBorderClass())}
      onClick={() => onClick(card)}
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

          {card.status === "pending" && (
            <div className="flex items-center mt-2 gap-1">
              <Button size="sm" className="h-7 text-xs px-2" onClick={handleApprove}>
                Approve
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={handleEdit}>
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
