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
  MoreVertical,
  Mail,
  BanknoteIcon as BankIcon,
  StickerIcon as StripeIcon,
  ShieldAlert,
  UserCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Zap,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { InboxCard as InboxCardType } from "@/types/inbox"
import { useInboxStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/utils/trpc"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InboxCardProps {
  card: InboxCardType
  onClick: (card: InboxCardType) => void
}

export function InboxCard({ card, onClick }: InboxCardProps) {
  const [isRationaleOpen, setIsRationaleOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { selectedCardIds, toggleCardSelection, executeCard, dismissCard, addToast } = useInboxStore()
  const isSelected = selectedCardIds.has(card.id)

  // tRPC mutations
  const updateCardStatus = trpc.inboxCards.updateCard.useMutation({
    onSuccess: () => {
      console.log('[Inbox Card] Card status updated in database')
    },
    onError: (error) => {
      console.error('[Inbox Card] Failed to update card status:', error)
      addToast({ 
        message: "Failed to update card status", 
        status: "error" 
      })
    }
  })

  const logApprovedAction = trpc.actionLedger.logApprovedAction.useMutation({
    onSuccess: (result) => {
      console.log('[Inbox Card] Action logged to ledger:', result.ledgerEntryId)
      addToast({ 
        message: "Action approved and logged", 
        status: "success" 
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Failed to log action to ledger:', error)
      addToast({ 
        message: "Action approved but failed to log", 
        status: "error" 
      })
    }
  })

  const markSeenMutation = trpc.inboxCards.markSeen.useMutation({
    onSuccess: () => {
      addToast({ message: 'Marked as seen', status: 'success' })
    },
    onError: (err) => {
      addToast({ message: err.message || 'Failed', status: 'error' })
    }
  })

  const approveWithNoteMutation = trpc.inboxCards.approveWithNote.useMutation({
    onSuccess: () => addToast({ message: 'Saved note', status: 'success' }),
    onError: (err)=> addToast({ message: err.message || 'Failed', status: 'error' })
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
      await updateCardStatus.mutateAsync({
        cardId: card.id,
        status: 'seen'
      })

      let actionType = 'general'
      if (card.parsedInvoiceData) {
        actionType = 'invoice'
      } else if (card.amount && card.currency) {
        actionType = 'payment'
      } else if (card.sourceType === 'bank_transaction') {
        actionType = 'transfer'
      }

      await logApprovedAction.mutateAsync({
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
      addToast({ 
        message: "Failed to approve action", 
        status: "error" 
      })
    }
  }

  const handleMarkSeen = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // Optimistic UI: immediately move card to seen state
    executeCard(card.id)
    try {
      await markSeenMutation.mutateAsync({ cardId: card.id })
    } catch(err) {
      console.error(err)
    }
  }

  const handleDismiss = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      await updateCardStatus.mutateAsync({
        cardId: card.id,
        status: 'dismissed'
      })
      dismissCard(card.id)
    } catch (error) {
      console.error('[Inbox Card] Error dismissing card:', error)
      addToast({ 
        message: "Failed to dismiss card", 
        status: "error" 
      })
    }
  }

  const getCardTypeIcon = () => {
    const iconClass = "h-5 w-5"
    switch (card.icon) {
      case "bank":
        return <BankIcon className={iconClass} />
      case "invoice":
        return <Mail className={iconClass} />
      case "compliance":
        return <ShieldAlert className={iconClass} />
      case "fx":
        return <TrendingUp className={iconClass} />
      default:
        return <Zap className={iconClass} />
    }
  }

  const getSourceIcon = () => {
    switch (card.sourceType) {
      case "email":
        return <Mail className="h-3.5 w-3.5" />
      case "bank_transaction":
        return <BankIcon className="h-3.5 w-3.5" />
      case "stripe":
        return <StripeIcon className="h-3.5 w-3.5" />
      case "hyperstable_bank":
        return <ShieldAlert className="h-3.5 w-3.5 text-blue-500" />
      case "manual":
        return <UserCircle className="h-3.5 w-3.5" />
      case "system_alert":
        return <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
      default:
        return null
    }
  }

  const getConfidenceColor = () => {
    if (card.confidence >= 95) return "text-green-600 dark:text-green-400"
    if (card.confidence >= 60) return "text-amber-600 dark:text-amber-400"
    return "text-gray-600 dark:text-gray-400"
  }

  const getConfidenceIcon = () => {
    if (card.confidence >= 95) return <Sparkles className="h-3.5 w-3.5" />
    if (card.confidence >= 60) return <Zap className="h-3.5 w-3.5" />
    return <AlertCircle className="h-3.5 w-3.5" />
  }

  // Format amount if available
  const formattedAmount = card.amount && card.currency 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: card.currency,
      }).format(parseFloat(card.amount))
    : null

  const [isNoteMode,setIsNoteMode]=useState(false)
  const [noteText,setNoteText]=useState('')
  const [categoriesText,setCategoriesText]=useState('')

  const handleSaveNote= async (e:React.MouseEvent)=>{
    e.stopPropagation();
    if(!noteText.trim()) return;
    try {
      const cats = categoriesText.split(',').map(c=>c.trim()).filter(Boolean)
      await approveWithNoteMutation.mutateAsync({ cardId: card.id, note: noteText.trim(), categories: cats })
      setIsNoteMode(false); setNoteText('');
      setCategoriesText('');
      executeCard(card.id)
    }catch(err){ console.error(err)}
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "group relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden",
          "bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm",
          "hover:bg-white/80 dark:hover:bg-neutral-900/80",
          "hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-800/50",
          "hover:border-neutral-300 dark:hover:border-neutral-700",
          isSelected && "ring-2 ring-primary ring-offset-2 bg-primary/5 dark:bg-primary/10",
          card.status === "error" && "border-red-200 dark:border-red-800",
          card.status === "snoozed" && "opacity-60"
        )}
        onClick={() => onClick(card)}
      >
        {/* Confidence indicator bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b" style={{
          background: card.confidence >= 95 
            ? 'linear-gradient(to bottom, #10b981, #34d399)' 
            : card.confidence >= 60 
            ? 'linear-gradient(to bottom, #f59e0b, #fbbf24)'
            : 'linear-gradient(to bottom, #6b7280, #9ca3af)'
        }} />

        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Checkbox with animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered || isSelected ? 1 : 0 }}
              className="flex items-center pt-1"
            >
              <Checkbox
                checked={isSelected}
                onClick={handleCheckboxChange}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
            </motion.div>

            {/* Icon with glass effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 blur-xl" />
              <div className="relative p-2.5 rounded-lg bg-gradient-to-br from-white/80 to-white/40 dark:from-neutral-800/80 dark:to-neutral-800/40 backdrop-blur-sm border border-white/20 dark:border-neutral-700/20">
                {getCardTypeIcon()}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-base leading-tight text-neutral-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {card.subtitle}
                  </p>
                  
                  {/* Enhanced metadata */}
                  {(formattedAmount || card.parsedInvoiceData) && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {formattedAmount && (
                        <Badge variant="secondary" className="bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                          {formattedAmount}
                        </Badge>
                      )}
                      {card.parsedInvoiceData?.dueDate && (
                        <Badge variant="outline" className="text-xs">
                          Due: {new Date(card.parsedInvoiceData.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Right side metadata */}
                <div className="flex flex-col items-end gap-2">
                  {/* Confidence badge with icon */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "flex items-center gap-1 px-2 py-1",
                            "bg-white/50 dark:bg-neutral-800/50",
                            "border-neutral-200 dark:border-neutral-700",
                            getConfidenceColor()
                          )}
                        >
                          {getConfidenceIcon()}
                          <span className="text-xs font-medium">{card.confidence}%</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI Confidence Score</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Source indicator */}
                  <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {getSourceIcon()}
                    <span>{card.sourceDetails.name}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons with animations */}
              <div className="mt-3 flex items-center gap-2">
                <AnimatePresence>
                  {(isHovered || card.status === "error" || card.blocked) && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-2"
                    >
                      {card.blocked ? (
                        <Button size="sm" variant="destructive" className="h-8 px-3">
                          <AlertCircle className="h-3.5 w-3.5 mr-1.5" /> Resolve
                        </Button>
                      ) : (
                        <>
                          {!isNoteMode && (
                          <>
                            <Button 
                              size="sm" 
                              className="h-8 px-3 bg-primary text-white disabled:opacity-70" 
                              onClick={handleMarkSeen}
                              disabled={markSeenMutation.isPending}
                            >
                              {markSeenMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Eye className="h-3.5 w-3.5 mr-1.5" />
                              )}
                              {markSeenMutation.isPending ? 'Seeing...' : 'Seen'}
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 px-3" onClick={()=>setIsNoteMode(true)}>
                              <MessageSquare className="h-3.5 w-3.5 mr-1.5"/> Note
                            </Button>
                          </>) }
                          {isNoteMode && (
                            <div className="flex items-center gap-2">
                              <input value={noteText} onClick={(e)=>e.stopPropagation()} onChange={e=>setNoteText(e.target.value)} placeholder="Add note" className="border rounded px-2 py-1 text-sm" />
                              <input value={categoriesText} onClick={(e)=>e.stopPropagation()} onChange={e=>setCategoriesText(e.target.value)} placeholder="categories (comma)" className="border rounded px-2 py-1 text-sm" />
                              <Button size="sm" className="h-8 px-2" onClick={handleSaveNote}>Save</Button>
                              <Button size="sm" variant="ghost" className="h-8 px-2" onClick={(e)=>{e.stopPropagation();setIsNoteMode(false);setNoteText('')}}>Cancel</Button>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* More options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 px-2 ml-auto">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onClick(card)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add comment
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="h-4 w-4 mr-2" />
                      Snooze
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Why button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  onClick={handleToggleRationale}
                >
                  {isRationaleOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="ml-1 text-xs font-medium">Why?</span>
                </Button>
              </div>

              {/* Rationale with animation */}
              <AnimatePresence>
                {isRationaleOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="p-3 rounded-lg bg-neutral-100/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">{card.rationale}</p>
                      {card.codeHash && card.codeHash !== 'N/A' && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
                          Version: {card.codeHash}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
