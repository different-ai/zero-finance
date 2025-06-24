// @ts-nocheck
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Edit,
  Lock,
  MoreHorizontal,
  Mail,
  BanknoteIcon as BankIcon,
  StickerIcon as StripeIcon,
  ShieldAlert,
  UserCircle,
  AlertTriangle,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { InboxCard as InboxCardType } from "@/types/inbox"
import { useInboxStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/utils/trpc"

interface InboxCardProps {
  card: InboxCardType
  onClick: (card: InboxCardType) => void
}

export function InboxCard({ card, onClick }: InboxCardProps) {
  const [isRationaleOpen, setIsRationaleOpen] = useState(false)
  const { selectedCardIds, toggleCardSelection, executeCard, addToast } = useInboxStore()
  const isSelected = selectedCardIds.has(card.id)

  // tRPC mutation for logging approved actions
  const logApprovedAction = trpc.actionLedger.logApprovedAction.useMutation({
    onSuccess: (result) => {
      console.log('[Inbox Card] Action logged to ledger:', result.ledgerEntryId)
      addToast({ 
        message: "Action approved and logged to audit trail", 
        status: "success" 
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Failed to log action to ledger:', error)
      addToast({ 
        message: "Action approved but failed to log to audit trail", 
        status: "error" 
      })
    }
  })

  const handleToggleRationale = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRationaleOpen(!isRationaleOpen)
  }

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleCardSelection(card.id)
  }

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      // Determine action type based on card content
      let actionType = 'general'
      if (card.parsedInvoiceData) {
        actionType = 'invoice'
      } else if (card.amount && card.currency) {
        actionType = 'payment'
      } else if (card.sourceType === 'bank_transaction') {
        actionType = 'transfer'
      }

      // Log the approved action to the ledger (fire & forget)
      logApprovedAction.mutate({
        inboxCard: {
          id: card.id,
          title: card.title,
          subtitle: card.subtitle,
          icon: card.icon,
          confidence: card.confidence,
          status: card.status,
          sourceType: card.sourceType,
          sourceDetails: card.sourceDetails,
          impact: card.impact,
          amount: card.amount,
          currency: card.currency,
          rationale: card.rationale,
          chainOfThought: card.chainOfThought,
          parsedInvoiceData: card.parsedInvoiceData,
          metadata: card.metadata,
        },
        actionType,
      })

      executeCard(card.id)
    } catch (error) {
      console.error('[Inbox Card] Error approving action:', error)
      executeCard(card.id)
    }
  }

  const getCardTypeIcon = () => {
    switch (card.icon) {
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

  const getSourceIcon = () => {
    switch (card.sourceType) {
      case "email":
        return <Mail className="h-3.5 w-3.5 text-muted-foreground" />
      case "bank_transaction":
        return <BankIcon className="h-3.5 w-3.5 text-muted-foreground" />
      case "stripe":
        return <StripeIcon className="h-3.5 w-3.5 text-muted-foreground" />
      case "hyperstable_bank":
        return <ShieldAlert className="h-3.5 w-3.5 text-blue-500" /> // Specific icon for Hyperstable
      case "manual":
        return <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
      case "system_alert":
        return <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
      default:
        return null
    }
  }

  const getCardBorderClass = () => {
    if (card.status === "error") return "border-l-4 border-l-destructive"
    if (card.status === "snoozed") return "border-l-4 border-l-muted"

    if (card.confidence >= 95) return "border-l-4 border-l-green-400" // Brighter green
    if (card.confidence >= 60 && card.confidence < 95) return "border-l-4 border-l-amber-400"
    if (card.blocked) return "border-l-4 border-l-destructive"

    return "border-l-4 border-l-primary" // Default to primary color
  }

  const getConfidenceBadgeClass = () => {
    if (card.confidence >= 95) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    if (card.confidence >= 60 && card.confidence < 95)
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    return "bg-muted text-muted-foreground"
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-md p-3 mb-2 cursor-pointer transition hover:bg-muted/50",
        getCardBorderClass(),
      )}
      onClick={() => onClick(card)}
    >
      {/* Checkbox – visible during selection or on hover */}
      <div className="flex-shrink-0" onClick={handleCheckboxChange}>
        <Checkbox
          checked={isSelected}
          className={cn(
            "transition-opacity",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        />
      </div>

      {/* Avatar / icon */}
      <div className="flex-shrink-0">
        <div className="h-9 w-9 rounded-full flex items-center justify-center bg-muted text-lg">
          {getCardTypeIcon()}
        </div>
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate text-sm sm:text-base leading-tight">
            {card.title}
          </span>
          {card.confidence > 0 && (
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                card.confidence >= 95 ? "bg-green-500" : card.confidence >= 60 ? "bg-amber-500" : "bg-muted-foreground",
              )}
            />
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
          {card.subtitle}
        </p>
      </div>

      {/* Metadata (optional) */}
      <div className="hidden sm:flex flex-col items-end text-xs text-muted-foreground mr-8">
        {card.amount && card.currency && <span>{card.amount} {card.currency}</span>}
        {card.status === "snoozed" && (
          <span className="flex items-center"><Clock className="h-3 w-3 mr-0.5"/>Snoozed</span>
        )}
      </div>

      {/* Hover quick actions */}
      <div className="absolute top-1.5 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleApprove}>
          <Check className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => useInboxStore.getState().snoozeCard(card.id, "1d")}>Snooze 1d</DropdownMenuItem>
            <DropdownMenuItem onClick={() => useInboxStore.getState().dismissCard(card.id)}>Dismiss</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onClick(card)}>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
