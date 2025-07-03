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
  DollarSign,
  Receipt,
  Bell,
  Download,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { InboxCard as InboxCardType } from "@/types/inbox"
import { useInboxStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/utils/trpc"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

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

  const markSeenMutation = trpc.inbox.updateCardStatus.useMutation({
    onSuccess: () => {
      addToast({
        message: "Card marked as seen",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error marking card as seen:', error)
      addToast({
        message: "Failed to mark card as seen",
        status: "error",
      })
    },
  })

  const markPaidMutation = trpc.inbox.markAsPaid.useMutation({
    onSuccess: () => {
      addToast({
        message: "Marked as paid",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error marking as paid:', error)
      addToast({
        message: "Failed to mark as paid",
        status: "error",
      })
    },
  })

  const addToExpenseMutation = trpc.inbox.addToExpense.useMutation({
    onSuccess: () => {
      addToast({
        message: "Added to expenses",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error adding to expenses:', error)
      addToast({
        message: "Failed to add to expenses",
        status: "error",
      })
    },
  })

  const setReminderMutation = trpc.inbox.setReminder.useMutation({
    onSuccess: () => {
      addToast({
        message: "Reminder set",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error setting reminder:', error)
      addToast({
        message: "Failed to set reminder",
        status: "error",
      })
    },
  })

  const approveWithNoteMutation = trpc.inboxCards.approveWithNote.useMutation({
    onSuccess: () => addToast({ message: 'Saved note', status: 'success' }),
    onError: (err)=> addToast({ message: err.message || 'Failed', status: 'error' })
  })

  const downloadAttachmentMutation = trpc.inbox.downloadAttachment.useMutation({
    onSuccess: (data) => {
      // Open the PDF in a new tab
      window.open(data.url, '_blank');
    },
    onError: (error) => {
      console.error('[Inbox Card] Error downloading attachment:', error)
      addToast({
        message: "Failed to download attachment",
        status: "error",
      })
    },
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

  const handleMarkPaid = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await markPaidMutation.mutateAsync({
        cardId: card.id,
        amount: card.amount,
        paymentMethod: 'manual',
      })
    } catch (error) {
      console.error('[Inbox Card] Error in handleMarkPaid:', error)
    }
  }

  const handleAddToExpense = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await addToExpenseMutation.mutateAsync({
        cardId: card.id,
        category: 'general', // TODO: Allow user to select category
        note: card.subtitle,
      })
    } catch (error) {
      console.error('[Inbox Card] Error in handleAddToExpense:', error)
    }
  }

  const handleSetReminder = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Show date picker for reminder
    const reminderDate = new Date()
    reminderDate.setDate(reminderDate.getDate() + 1) // Default to tomorrow
    
    try {
      await setReminderMutation.mutateAsync({
        cardId: card.id,
        reminderDate: reminderDate.toISOString(),
      })
    } catch (error) {
      console.error('[Inbox Card] Error in handleSetReminder:', error)
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

  const handleDownloadPdf = async (e: React.MouseEvent, index: number = 0) => {
    e.stopPropagation()
    try {
      await downloadAttachmentMutation.mutateAsync({
        cardId: card.id,
        attachmentIndex: index,
      })
    } catch (error) {
      console.error('[Inbox Card] Error in handleDownloadPdf:', error)
    }
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    {/* Payment Status Badge */}
                    {card.paymentStatus && card.paymentStatus !== 'not_applicable' && (
                      <Badge 
                        variant={
                          card.paymentStatus === 'paid' ? 'default' :
                          card.paymentStatus === 'overdue' ? 'destructive' :
                          card.paymentStatus === 'partial' ? 'secondary' :
                          'outline'
                        }
                        className={cn(
                          "text-xs",
                          card.paymentStatus === 'paid' && "bg-green-100 text-green-800 border-green-200",
                          card.paymentStatus === 'overdue' && "bg-red-100 text-red-800 border-red-200",
                          card.paymentStatus === 'partial' && "bg-yellow-100 text-yellow-800 border-yellow-200",
                          card.paymentStatus === 'unpaid' && "bg-gray-100 text-gray-800 border-gray-200"
                        )}
                      >
                        {card.paymentStatus === 'paid' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {card.paymentStatus === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {card.paymentStatus.charAt(0).toUpperCase() + card.paymentStatus.slice(1)}
                      </Badge>
                    )}
                    {/* Expense Badge */}
                    {card.addedToExpenses && (
                      <Badge variant="secondary" className="text-xs">
                        <Receipt className="h-3 w-3 mr-1" />
                        Expensed
                      </Badge>
                    )}
                    {/* PDF Attachment Indicator */}
                    {card.hasAttachments && card.attachmentUrls && card.attachmentUrls.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {card.subtitle}
                  </p>
                  {/* Amount and Due Date */}
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    {card.amount && card.currency && (
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{card.amount} {card.currency}</span>
                      </div>
                    )}
                    {card.dueDate && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Due {new Date(card.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
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
                            {/* Financial Action Buttons */}
                            {card.paymentStatus !== 'paid' && card.amount && (
                              <Button 
                                size="sm" 
                                className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white" 
                                onClick={handleMarkPaid}
                                disabled={markPaidMutation.isPending}
                              >
                                {markPaidMutation.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                ) : (
                                  <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                {markPaidMutation.isPending ? 'Marking...' : 'Mark Paid'}
                              </Button>
                            )}
                            
                            {!card.addedToExpenses && card.amount && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-3" 
                                onClick={handleAddToExpense}
                                disabled={addToExpenseMutation.isPending}
                              >
                                {addToExpenseMutation.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                ) : (
                                  <Receipt className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                {addToExpenseMutation.isPending ? 'Adding...' : 'Add to Expense'}
                              </Button>
                            )}
                            
                            {card.dueDate && !card.reminderSent && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-3" 
                                onClick={handleSetReminder}
                                disabled={setReminderMutation.isPending}
                              >
                                {setReminderMutation.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                ) : (
                                  <Bell className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                {setReminderMutation.isPending ? 'Setting...' : 'Set Reminder'}
                              </Button>
                            )}
                            
                            <Button size="sm" variant="outline" className="h-8 px-3" onClick={()=>setIsNoteMode(true)}>
                              <MessageSquare className="h-3.5 w-3.5 mr-1.5"/> Note
                            </Button>
                            
                            {/* Download button for attachments */}
                            {card.hasAttachments && card.attachmentUrls && card.attachmentUrls.length > 0 && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-3 text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50" 
                                onClick={handleDownloadPdf}
                              >
                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                Download
                              </Button>
                            )}
                          </>) }
                          {isNoteMode && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex flex-col gap-2 w-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1 space-y-2">
                                  <div className="relative">
                                    <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                      value={noteText} 
                                      onChange={e => setNoteText(e.target.value)} 
                                      placeholder="Add a note..." 
                                      className="pl-10 h-9 text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-primary/20"
                                      autoFocus
                                    />
                                  </div>
                                  <div className="relative">
                                    <Receipt className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                      value={categoriesText} 
                                      onChange={e => setCategoriesText(e.target.value)} 
                                      placeholder="Categories (comma separated)" 
                                      className="pl-10 h-9 text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-primary/20"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    className="h-9 px-3 bg-primary hover:bg-primary/90" 
                                    onClick={handleSaveNote}
                                    disabled={!noteText.trim() || approveWithNoteMutation.isPending}
                                  >
                                    {approveWithNoteMutation.isPending ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      'Save'
                                    )}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-9 px-3" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsNoteMode(false);
                                      setNoteText('');
                                      setCategoriesText('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
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
                    {card.hasAttachments && card.attachmentUrls && card.attachmentUrls.length > 0 && (
                      <DropdownMenuItem onClick={(e) => handleDownloadPdf(e)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleMarkSeen}>
                      <Eye className="h-4 w-4 mr-2" />
                      Mark as seen
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
