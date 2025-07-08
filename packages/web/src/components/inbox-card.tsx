// @ts-nocheck
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
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
  Trash2,
  CheckCircle,
  X,
  Paperclip,
  Bot,
  Tag,
  FileText,
  EyeOff,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { InboxCard as InboxCardType } from "@/types/inbox"
import { useInboxStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/utils/trpc"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { formatDate } from "date-fns"
import { useCardActions } from "@/hooks/use-card-actions"
import { PayInvoiceModal } from "@/components/inbox/pay-invoice-modal"

interface InboxCardProps {
  card: InboxCardType
  onClick: (card: InboxCardType) => void
}

export function InboxCard({ card, onClick }: InboxCardProps) {
  const [isRationaleOpen, setIsRationaleOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const { selectedCardIds, toggleCardSelection, executeCard, ignoreCard, addToast, markCardAsDone, updateCard, addCard } = useInboxStore()
  const isSelected = selectedCardIds.has(card.id)
  const { trackAction } = useCardActions()

  // tRPC mutations
  const updateCardStatus = trpc.inboxCards.updateCard.useMutation({
    onMutate: async ({ status }) => {
      // Optimistically update the card status
      updateCard(card.id, { status, timestamp: new Date().toISOString() });
    },
    onSuccess: () => {
      console.log('[Inbox Card] Card status updated in database')
    },
    onError: (error) => {
      console.error('[Inbox Card] Failed to update card status:', error)
      // Revert the optimistic update
      updateCard(card.id, { status: card.status });
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
    onMutate: async () => {
      // Optimistically update UI
      executeCard(card.id);
    },
    onSuccess: () => {
      addToast({
        message: "Card marked as seen",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error marking card as seen:', error)
      // Revert optimistic update
      updateCard(card.id, { status: card.status });
      addToast({
        message: "Failed to mark card as seen",
        status: "error",
      })
    },
  })

  const markPaidMutation = trpc.inbox.markAsPaid.useMutation({
    onMutate: async () => {
      // Optimistically update payment status
      updateCard(card.id, { 
        paymentStatus: 'paid', 
        paidAt: new Date().toISOString(),
        status: 'done' 
      });
    },
    onSuccess: () => {
      addToast({
        message: "Marked as paid",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error marking as paid:', error)
      // Revert optimistic update
      updateCard(card.id, { 
        paymentStatus: card.paymentStatus,
        paidAt: card.paidAt,
        status: card.status 
      });
      addToast({
        message: "Failed to mark as paid",
        status: "error",
      })
    },
  })

  const addToExpenseMutation = trpc.inbox.addToExpense.useMutation({
    onMutate: async () => {
      // Optimistically update expense status
      updateCard(card.id, { 
        addedToExpenses: true,
        expenseAddedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      addToast({
        message: "Added to expenses",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error adding to expenses:', error)
      // Revert optimistic update
      updateCard(card.id, { 
        addedToExpenses: card.addedToExpenses,
        expenseAddedAt: card.expenseAddedAt
      });
      addToast({
        message: "Failed to add to expenses",
        status: "error",
      })
    },
  })

  const setReminderMutation = trpc.inbox.setReminder.useMutation({
    onMutate: async ({ reminderDate }) => {
      // Optimistically update reminder status
      updateCard(card.id, { 
        reminderSet: true,
        reminderDate
      });
    },
    onSuccess: () => {
      addToast({
        message: "Reminder set",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error setting reminder:', error)
      // Revert optimistic update
      updateCard(card.id, { 
        reminderSet: card.reminderSet,
        reminderDate: card.reminderDate
      });
      addToast({
        message: "Failed to set reminder",
        status: "error",
      })
    },
  })

  const approveWithNoteMutation = trpc.inboxCards.approveWithNote.useMutation({
    onMutate: async ({ note, categories }) => {
      // Optimistically update note and categories
      const updates: any = {};
      if (note) updates.note = note;
      if (categories && categories.length > 0) updates.categories = categories;
      updateCard(card.id, updates);
    },
    onSuccess: () => addToast({ message: 'Saved', status: 'success' }),
    onError: (err, variables) => {
      // Revert optimistic update
      const reverts: any = {};
      if (variables.note) reverts.note = card.note;
      if (variables.categories) reverts.categories = card.categories;
      updateCard(card.id, reverts);
      addToast({ message: err.message || 'Failed', status: 'error' })
    }
  })

  const downloadAttachmentMutation = trpc.inbox.downloadAttachment.useMutation({
    onMutate: async () => {
      // Show loading state
      addToast({ message: 'Downloading attachment...', status: 'loading' });
    },
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

  const deleteCardMutation = trpc.inboxCards.deleteCard.useMutation({
    onMutate: async () => {
      // Optimistically remove card from UI
      ignoreCard(card.id);
    },
    onSuccess: () => {
      addToast({
        message: "Card deleted successfully",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error deleting card:', error)
      // Re-add the card on error
      addCard(card);
      addToast({
        message: "Failed to delete card",
        status: "error",
      })
    },
  })

  const markAsFraudMutation = trpc.inboxCards.markAsFraud.useMutation({
    onMutate: async () => {
      // Optimistically update fraud status and remove from UI
      updateCard(card.id, { markedAsFraud: true });
      ignoreCard(card.id);
    },
    onSuccess: () => {
      addToast({
        message: "Card marked as fraudulent",
        status: "success",
      })
    },
    onError: (error) => {
      console.error('[Inbox Card] Error marking card as fraud:', error)
      // Re-add the card and revert fraud status
      addCard({ ...card, markedAsFraud: false });
      addToast({
        message: "Failed to mark card as fraud",
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
    try {
      await markSeenMutation.mutateAsync({ cardId: card.id })
    } catch(err) {
      console.error(err)
    }
  }

  const handleMarkPaid = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      // Track the action
      await trackAction(card.id, 'marked_paid', {
        previousValue: { paymentStatus: card.paymentStatus },
        newValue: { paymentStatus: 'paid' },
        details: {
          amount: card.amount,
          currency: card.currency,
          paymentMethod: 'manual',
        },
      })
      
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
      // Track the action
      await trackAction(card.id, 'added_to_expenses', {
        previousValue: { addedToExpenses: card.addedToExpenses },
        newValue: { addedToExpenses: true },
        details: {
          category: 'general',
          note: card.subtitle,
          amount: card.amount,
          currency: card.currency,
        },
      })
      
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

  const handleIgnore = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      // Track the ignore action
      await trackAction(card.id, 'ignored', {
        previousValue: { status: card.status },
        newValue: { status: 'dismissed' },
        details: {
          reason: 'user_ignored',
          title: card.title,
          amount: card.amount,
          currency: card.currency,
        },
      })
      
      await updateCardStatus.mutateAsync({
        cardId: card.id,
        status: 'dismissed'
      })
    } catch (error) {
      console.error('[Inbox Card] Error ignoring card:', error)
      addToast({ 
        message: "Failed to ignore card", 
        status: "error" 
      })
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (confirm("Are you sure you want to permanently delete this card? This action cannot be undone.")) {
      try {
        // Track the action
        await trackAction(card.id, 'deleted', {
          previousValue: { status: card.status },
          details: {
            title: card.title,
            subtitle: card.subtitle,
            amount: card.amount,
            currency: card.currency,
          },
        })
        
        await deleteCardMutation.mutateAsync({
          cardId: card.id,
        })
      } catch (error) {
        console.error('[Inbox Card] Error deleting card:', error)
      }
    }
  }

  const handleMarkAsFraud = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const reason = prompt("Please provide a reason for marking this as fraud (optional):");
    
    try {
      // Track the action
      await trackAction(card.id, 'marked_fraud', {
        previousValue: { markedAsFraud: false },
        newValue: { markedAsFraud: true },
        details: {
          reason: reason || 'No reason provided',
          title: card.title,
          subtitle: card.subtitle,
          amount: card.amount,
          currency: card.currency,
          from: card.from,
          to: card.to,
        },
      })
      
      await markAsFraudMutation.mutateAsync({
        cardId: card.id,
        reason: reason || undefined,
      })
    } catch (error) {
      console.error('[Inbox Card] Error marking card as fraud:', error)
    }
  }

  const handlePayInvoice = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      // Track the action
      await trackAction(card.id, 'payment_scheduled', {
        details: {
          title: card.title,
          subtitle: card.subtitle,
          amount: card.amount,
          currency: card.currency,
          from: card.from,
          to: card.to,
          openedPaymentModal: true,
        },
      })
      
      setIsPayModalOpen(true)
    } catch (error) {
      console.error('[Inbox Card] Error opening pay modal:', error)
      // Still open the modal even if tracking fails
      setIsPayModalOpen(true)
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
  const [isCategoryMode, setIsCategoryMode] = useState(false)
  const [categoriesText,setCategoriesText]=useState((card.categories || []).join(', '))

  const handleSaveNote= async (e:React.MouseEvent)=>{
    e.stopPropagation();
    if(!noteText.trim()) return;
    try {
      // Track the action
      await trackAction(card.id, 'note_added', {
        newValue: { note: noteText.trim() },
        details: {
          noteLength: noteText.trim().length,
        },
      })
      
      await approveWithNoteMutation.mutateAsync({ cardId: card.id, note: noteText.trim(), categories: [] })
      setIsNoteMode(false); 
      setNoteText('');
      executeCard(card.id)
    }catch(err){ console.error(err)}
  }

  const handleSaveCategories = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const cats = categoriesText.split(',').map(c => c.trim()).filter(Boolean);
    try {
      // Track the action
      await trackAction(card.id, 'category_added', {
        previousValue: { categories: card.categories || [] },
        newValue: { categories: cats },
        details: {
          addedCategories: cats.filter(c => !card.categories?.includes(c)),
          removedCategories: card.categories?.filter(c => !cats.includes(c)) || [],
        },
      })
      
      await approveWithNoteMutation.mutateAsync({ cardId: card.id, note: '', categories: cats })
      setIsCategoryMode(false);
      addToast({ message: 'Categories updated', status: 'success' })
    } catch(err) { 
      console.error(err)
      addToast({ message: 'Failed to update categories', status: 'error' })
    }
  }

  const handleDownloadPdf = async (e: React.MouseEvent, index: number = 0) => {
    e.stopPropagation()
    try {
      // Track the download action
      await trackAction(card.id, 'attachment_downloaded', {
        details: {
          attachmentIndex: index,
          attachmentCount: card.attachmentUrls?.length || 0,
          filename: (card.sourceDetails as any)?.attachments?.[index]?.filename || 'document.pdf',
        },
      })
      
      await downloadAttachmentMutation.mutateAsync({
        cardId: card.id,
        attachmentIndex: index,
      })
    } catch (error) {
      console.error('[Inbox Card] Error in handleDownloadPdf:', error)
    }
  }

  // Determine the default action based on card state
  const getDefaultAction = () => {
    if (card.paymentStatus === 'unpaid' && card.amount) {
      return {
        label: 'Mark Paid',
        icon: DollarSign,
        onClick: handleMarkPaid,
        isPending: markPaidMutation.isPending,
        className: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400",
      };
    }
    return {
      label: 'Mark Seen',
      icon: Eye,
      onClick: handleMarkSeen,
      isPending: markSeenMutation.isPending,
      className: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80",
    };
  };

  const defaultAction = getDefaultAction();

  // Check if any mutation is pending
  const isAnyActionPending = 
    updateCardStatus.isPending ||
    markSeenMutation.isPending ||
    markPaidMutation.isPending ||
    addToExpenseMutation.isPending ||
    setReminderMutation.isPending ||
    approveWithNoteMutation.isPending ||
    downloadAttachmentMutation.isPending ||
    deleteCardMutation.isPending ||
    markAsFraudMutation.isPending;

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
          card.status === "snoozed" && "opacity-60",
          card.autoApproved && "border-green-200 dark:border-green-800",
          isAnyActionPending && "pointer-events-none"
        )}
        onClick={() => onClick(card)}
      >
        {/* Loading overlay */}
        {isAnyActionPending && (
          <div className="absolute inset-0 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

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
                  {/* Categories */}
                  {card.categories && card.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {card.categories.map((category, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {/* Date/Time */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(card.timestamp, 'MMM d, yyyy')}</span>
                  </div>
                </div>

                {/* Right side metadata */}
                <div className="flex flex-col items-end gap-2">
                  {/* Classification indicator - show if any classification was triggered */}
                  {card.classificationTriggered && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            card.autoApproved 
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          )}>
                            <Bot className="h-3 w-3" />
                            {card.autoApproved ? "Auto-approved" : "AI Rule Applied"}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="font-medium mb-2">Applied AI Rules:</p>
                          <ul className="text-xs space-y-1.5">
                            {card.appliedClassifications?.filter(c => c.matched).map((classification) => (
                              <li key={classification.id} className="flex items-start gap-2">
                                <div className="flex items-center gap-1 mt-0.5">
                                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                  <span className={cn(
                                    "font-medium text-xs px-1.5 py-0.5 rounded-full",
                                    classification.confidence >= 90 
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                      : classification.confidence >= 70
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                                  )}>
                                    {classification.confidence}%
                                  </span>
                                </div>
                                <span className="flex-1">{classification.name}</span>
                              </li>
                            ))}
                          </ul>
                          {card.appliedClassifications?.some(c => c.confidence && c.confidence < 70) && (
                            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                              <AlertCircle className="h-3 w-3 inline mr-1" />
                              Rules with confidence below 70% may need review
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
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
                  
                  {/* Enhanced email source details */}
                  {card.sourceType === 'email' && card.sourceDetails && (
                    <div className="mt-1 space-y-0.5">
                      {(card.sourceDetails as any).fromAddress && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                          From: {(card.sourceDetails as any).fromAddress}
                        </div>
                      )}
                      {(card.sourceDetails as any).attachments && (card.sourceDetails as any).attachments.length > 0 && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {(card.sourceDetails as any).attachments.length} attachment{(card.sourceDetails as any).attachments.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons with animations */}
              <div className="mt-3 flex items-center gap-2">
                {/* Note/Category input modes */}
                {(isNoteMode || isCategoryMode) ? (
                  <AnimatePresence mode="wait">
                    {isNoteMode && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col gap-2 w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
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
                              variant="outline"
                              className="h-9 px-3" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsNoteMode(false);
                                setNoteText('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {isCategoryMode && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col gap-2 w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="relative">
                              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                value={categoriesText} 
                                onChange={e => setCategoriesText(e.target.value)} 
                                placeholder="Categories (comma separated)" 
                                className="pl-10 h-9 text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-primary/20"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              className="h-9 px-3 bg-primary hover:bg-primary/90" 
                              onClick={handleSaveCategories}
                              disabled={approveWithNoteMutation.isPending}
                            >
                              {approveWithNoteMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                'Save'
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-9 px-3" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCategoryMode(false);
                                setCategoriesText((card.categories || []).join(', '));
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {/* Always visible action button */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className={cn(
                              "h-9 px-4 font-medium text-sm",
                              "border-neutral-200 dark:border-neutral-700",
                              "bg-white dark:bg-neutral-900",
                              "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                              "text-neutral-700 dark:text-neutral-300",
                              "hover:text-neutral-900 dark:hover:text-neutral-100",
                              "transition-all duration-200"
                            )}
                          >
                            <span>Actions</span>
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="start" 
                          className="w-48"
                          sideOffset={4}
                        >
                          {/* Primary Actions */}
                          <DropdownMenuItem 
                            onClick={handleMarkSeen} 
                            disabled={markSeenMutation.isPending}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2 text-blue-600" />
                            <span>Mark as Seen</span>
                            {markSeenMutation.isPending && (
                              <Loader2 className="h-3 w-3 ml-auto animate-spin" />
                            )}
                          </DropdownMenuItem>
                          
                          {card.paymentStatus !== 'paid' && card.amount && (
                            <>
                              <DropdownMenuItem 
                                onClick={handlePayInvoice} 
                                className="cursor-pointer"
                              >
                                <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                                <span>Pay</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={handleMarkPaid} 
                                disabled={markPaidMutation.isPending}
                                className="cursor-pointer"
                              >
                                <DollarSign className="h-4 w-4 mr-2 text-emerald-600" />
                                <span>Mark as Paid</span>
                                {markPaidMutation.isPending && (
                                  <Loader2 className="h-3 w-3 ml-auto animate-spin" />
                                )}
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={handleMarkAsFraud}
                            disabled={markAsFraudMutation.isPending || card.markedAsFraud}
                            className="cursor-pointer"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                            <span>{card.markedAsFraud ? 'Already marked as fraud' : 'Mark as Fraud'}</span>
                            {markAsFraudMutation.isPending && (
                              <Loader2 className="h-3 w-3 ml-auto animate-spin" />
                            )}
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={handleIgnore}
                            disabled={updateCardStatus.isPending}
                            className="cursor-pointer"
                          >
                            <EyeOff className="h-4 w-4 mr-2 text-gray-600" />
                            <span>Ignore</span>
                            {updateCardStatus.isPending && (
                              <Loader2 className="h-3 w-3 ml-auto animate-spin" />
                            )}
                          </DropdownMenuItem>
                          
                          {/* Secondary Actions */}
                          <DropdownMenuSeparator />
                          
                          {!card.addedToExpenses && card.amount && (
                            <DropdownMenuItem 
                              onClick={handleAddToExpense} 
                              disabled={addToExpenseMutation.isPending}
                              className="cursor-pointer"
                            >
                              <Receipt className="h-4 w-4 mr-2 text-purple-600" />
                              <span>Add to Expenses</span>
                              {addToExpenseMutation.isPending && (
                                <Loader2 className="h-3 w-3 ml-auto animate-spin" />
                              )}
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); setIsNoteMode(true); }}
                            className="cursor-pointer"
                          >
                            <MessageSquare className="h-4 w-4 mr-2 text-indigo-600" />
                            <span>Add Note</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); setIsCategoryMode(true); }}
                            className="cursor-pointer"
                          >
                            <Tag className="h-4 w-4 mr-2 text-violet-600" />
                            <span>Edit Categories</span>
                          </DropdownMenuItem>
                          
                          {/* Attachments */}
                          {card.hasAttachments && card.attachmentUrls && card.attachmentUrls.length > 0 && (
                            <>
                              <DropdownMenuSeparator />
                              {card.attachmentUrls.map((_, index) => (
                                <DropdownMenuItem 
                                  key={index}
                                  onClick={(e) => handleDownloadPdf(e, index)}
                                  disabled={downloadAttachmentMutation.isPending}
                                  className="cursor-pointer"
                                >
                                  <FileText className="h-4 w-4 mr-2 text-orange-600" />
                                  <span className="text-sm">
                                    Download {(card.sourceDetails as any)?.attachments?.[index]?.filename || `PDF ${index + 1}`}
                                  </span>
                                  {downloadAttachmentMutation.isPending && (
                                    <Loader2 className="h-3 w-3 ml-auto animate-spin" />
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}
                          
                          {/* Danger Zone */}
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={handleDelete}
                            disabled={deleteCardMutation.isPending}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span>Delete</span>
                            {deleteCardMutation.isPending && (
                              <Loader2 className="h-3 w-3 ml-auto animate-spin" />
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      {/* Quick status badges */}
                      {card.paymentStatus === 'unpaid' && card.amount && (
                        <Badge 
                          variant="outline" 
                          className="text-xs border-orange-200 text-orange-700 bg-orange-50"
                        >
                          <DollarSign className="h-3 w-3 mr-1" />
                          Unpaid
                        </Badge>
                      )}
                      
                      {card.markedAsFraud && (
                        <Badge 
                          variant="destructive" 
                          className="text-xs bg-red-100 text-red-700 border-red-200"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Fraud
                        </Badge>
                      )}
                      
                      {card.blocked && (
                        <Badge 
                          variant="destructive" 
                          className="text-xs"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Blocked
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* More options menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onClick(card)
                            }}
                            className="cursor-pointer"
                          >
                            <Info className="h-4 w-4 mr-2" />
                            <span>View Details</span>
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

      {/* Pay Invoice Modal */}
      <PayInvoiceModal
        card={card}
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
      />
    </motion.div>
  )
}
