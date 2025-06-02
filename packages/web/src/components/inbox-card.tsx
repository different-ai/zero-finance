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
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { InboxCard as InboxCardType } from "@/types/inbox"
import { useInboxStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

interface InboxCardProps {
  card: InboxCardType
  onClick: (card: InboxCardType) => void
}

export function InboxCard({ card, onClick }: InboxCardProps) {
  const [isRationaleOpen, setIsRationaleOpen] = useState(false)
  const { selectedCardIds, toggleCardSelection } = useInboxStore()
  const isSelected = selectedCardIds.has(card.id)

  const handleToggleRationale = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRationaleOpen(!isRationaleOpen)
  }

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleCardSelection(card.id)
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
        "border rounded-lg p-4 mb-3 hover:shadow-md cursor-pointer transition-all duration-150 ease-in-out",
        getCardBorderClass(),
        isSelected && "ring-2 ring-primary/50 bg-primary/5 dark:bg-primary/10",
      )}
      onClick={() => onClick(card)}
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center h-6 mt-1">
          <Checkbox
            checked={isSelected}
            onClick={handleCheckboxChange}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </div>

        <div className="text-2xl mr-1 mt-0.5">{getCardTypeIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base leading-tight">{card.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{card.subtitle}</p>
              {card.parsedInvoiceData && card.parsedInvoiceData.documentType === 'invoice' && (
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  {card.parsedInvoiceData.buyerName && <p>To: {card.parsedInvoiceData.buyerName}</p>}
                  {card.parsedInvoiceData.amount && card.parsedInvoiceData.currency && (
                    <p>Amount: {card.parsedInvoiceData.amount} {card.parsedInvoiceData.currency}</p>
                  )}
                  {card.parsedInvoiceData.dueDate && <p>Due: {card.parsedInvoiceData.dueDate}</p>}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {card.confidence > 0 && (
                <Badge variant="outline" className={cn("text-xs py-0.5 px-2", getConfidenceBadgeClass())}>
                  Confidence: {card.confidence}%
                </Badge>
              )}
              <div className="flex items-center text-xs text-muted-foreground">
                {getSourceIcon()}
                <span className="ml-1">{card.sourceDetails.name}</span>
              </div>
            </div>
          </div>

          {card.status === "error" && (
            <p className="text-sm text-destructive mt-1.5 font-medium">Network error – retry?</p>
          )}
          {card.status === "snoozed" && (
            <div className="flex items-center mt-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Snoozed {card.snoozedTime}</span>
            </div>
          )}

          <div className="flex items-center mt-3.5 gap-2">
            {card.blocked ? (
              <Button size="sm" variant="destructive" className="h-8 px-3">
                <Lock className="h-3.5 w-3.5 mr-1.5" /> Resolve
              </Button>
            ) : (
              <>
                <Button size="sm" className="h-8 px-3">
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="h-8 px-3">
                  <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Snooze</DropdownMenuItem>
                <DropdownMenuItem>Dismiss</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onClick(card)}>View details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              variant="ghost"
              className="h-8 ml-auto px-2 text-muted-foreground hover:text-foreground"
              onClick={handleToggleRationale}
            >
              {isRationaleOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="ml-1 text-xs font-medium">Why?</span>
            </Button>
          </div>

          {isRationaleOpen && (
            <div className="mt-3 text-sm bg-muted/30 dark:bg-muted/10 p-3 rounded-md">
              <p className="text-foreground/90">{card.rationale}</p>
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">Code hash: {card.codeHash}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
