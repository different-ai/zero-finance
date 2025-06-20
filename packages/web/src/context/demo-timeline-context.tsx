"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"
import {
  CheckCircle2,
  Landmark,
  ArrowDownCircle,
  Mail,
  Shuffle,
  Send,
  Receipt,
  FileText,
  Sparkles,
  ThumbsUp,
  Banknote,
  CalendarClock,
  Brain,
} from "lucide-react"

// Constants for the demo
export const DEMO_CONFIG = {
  TAX_RATE: 0.2, // 20%
  INVOICE_ID_PAID: "INV-2024-0847",
  CLIENT_NAME_PAID: "TechFlow Solutions",
  INVOICE_AMOUNT_PAID: 4750,
  CURRENCY_SYMBOL: "$",
  INITIAL_BALANCE: 11850,
  INITIAL_TAX_VAULT: 720,
  UTILITY_BILL_AMOUNT: 312,
  LEGACY_INVOICE_AMOUNT: 2890, // Assuming this is still used for an initial outstanding amount
}

export type InboxItemType =
  | "payment_received"
  | "invoice_sent"
  | "invoice_sent_reminder_due"
  | "invoice_sent_overdue"
  | "invoice_received"
  | "invoice_received_due_soon"
  | "invoice_payment_scheduled"
  | "cash_sweep_proposal"
  | "tax_sweep_proposal_auto"
  | "compliance_alert"
  | "payout_received"
  | "tax_report_ready"
  | "tax_transfer_confirmation"
  | "generic_task"

export type InboxItemStatus = "pending" | "approved" | "rejected" | "done" | "history" | "snoozed" | "error"
export type InboxItemDirection = "inbound" | "outbound"

export interface InboxItemAction {
  label: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  onClick?: () => void
  icon?: React.ElementType
}
export interface InboxItemSource {
  name: string
  details?: string
  icon?: React.ElementType
}
export interface InboxItemChainOfThoughtStep {
  id: string
  text: string
  icon?: React.ElementType
}
export interface InboxItemImpact {
  currentBalance?: number
  postActionBalance?: number
  details?: string[]
}
export interface InboxItemLogInfo {
  id: string
  timestamp: string
  confidence?: number
}

export interface InboxItemData {
  id: string
  type: InboxItemType
  direction: InboxItemDirection
  title: string
  description: string
  timestamp?: string
  status: InboxItemStatus
  itemSpecificStatus?: string
  icon: React.ElementType
  borderColorClass: string
  confidence?: number
  source?: InboxItemSource
  actions: InboxItemAction[]
  aiSuggestion?: { title: string; description: string; applyActionLabel: string }
  chainOfThought?: InboxItemChainOfThoughtStep[]
  impact?: InboxItemImpact
  logInfo?: InboxItemLogInfo
  amount?: number
  currencySymbol?: string
  client?: string
  vendor?: string
  dueDate?: string
  visible: boolean
  lastAction?: string
}

export interface ActivityItem {
  id: string
  timestamp: string
  description: string
  icon: React.ElementType
}

export type DemoScene = {
  timeStart: number
  timeEnd: number
  description: string
  voiceOver?: string
  /**
   * Numeric fields can be expressed directly as numbers **or**
   * as a reducer function receiving the previous scene so we can
   * derive values on-the-fly when resolving the script. This makes
   * the mocked data feel more dynamic / "real".
   */
  balance: number | ((prev: DemoScene) => number)
  taxVaultBalance: number | ((prev: DemoScene) => number)
  totalOutstanding?: number | ((prev: DemoScene) => number)
  totalPayable?: number | ((prev: DemoScene) => number)
  nextTaxDue?: string
  inboxItems: InboxItemData[] | ((prevItems: InboxItemData[]) => InboxItemData[])
  highlightedInboxItemId?: string
  selectedInboxItem?: InboxItemData | null | ((allItems: InboxItemData[]) => InboxItemData | null)
  showActionDetailsSidebar?: boolean
  showInitialSetupGlimpse?: boolean
  // Removed gmailVisible and gmailView as they are no longer used in the main demo flow
  showTaxVaultDetailCard?: boolean
  ledgerExportTriggered: boolean
  uiFlashMessage?: string | null
  showIntro: boolean // For initial talking head or black screen if needed
  showOutro: boolean
  currentRoute: "/" | "/dashboard" | "/dashboard/ai-inbox" | "/gmail"
  fastForwarding?: boolean
  activityFeed?: ActivityItem[] | ((prevFeed: ActivityItem[]) => ActivityItem[])
  showActivityFeed?: boolean
}

// Local UI-only state that evolves during the demo runtime. Keeping this
// separate from DemoScene prevents function unions from leaking into places
// that expect concrete data (and fixes linter complaints).
type SceneInternalState = {
  selectedInboxItem?: InboxItemData | null
  showActionDetailsSidebar?: boolean
  uiFlashMessage?: string | null
}

const INCOMING_UTILITY_BILL_INITIAL: InboxItemData = {
  id: "bill-pge-dec24",
  type: "invoice_received_due_soon",
  direction: "inbound",
  title: "Bill from PG&E",
  description: `Office electricity & gas • Due in 6 days`,
  amount: DEMO_CONFIG.UTILITY_BILL_AMOUNT,
  vendor: "PG&E",
  dueDate: "in 6 days",
  timestamp: "Received 3 days ago",
  status: "pending",
  icon: Receipt,
  borderColorClass: "border-yellow-500",
  confidence: 98,
  source: { name: "Email Import", icon: Mail, details: "pge_statement_dec2024.pdf" },
  actions: [
    { label: "Schedule Payment", variant: "default", icon: CalendarClock },
    { label: "Pay Now", icon: Banknote },
  ],
  visible: true,
  chainOfThought: [
    { id: "bill_cot1", text: "Source: Email Import - pge_statement_dec2024.pdf", icon: Mail },
    {
      id: "bill_cot2",
      text: `AI: Parsed bill from PG&E for ${DEMO_CONFIG.CURRENCY_SYMBOL}${DEMO_CONFIG.UTILITY_BILL_AMOUNT}, due in 6 days.`,
      icon: Brain,
    },
    { id: "bill_cot3", text: "AI: Proposing payment scheduling.", icon: Sparkles },
  ],
}

const EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL: InboxItemData = {
  id: DEMO_CONFIG.INVOICE_ID_PAID,
  type: "invoice_sent",
  direction: "outbound",
  title: `Invoice #${DEMO_CONFIG.INVOICE_ID_PAID} to ${DEMO_CONFIG.CLIENT_NAME_PAID}`,
  description: `Q4 Digital Strategy Consulting • Due in 12 days`,
  amount: DEMO_CONFIG.INVOICE_AMOUNT_PAID,
  client: DEMO_CONFIG.CLIENT_NAME_PAID,
  dueDate: "in 12 days",
  timestamp: "Sent 18 days ago",
  status: "pending",
  icon: Send,
  borderColorClass: "border-blue-500",
  source: { name: "Manual Creation", icon: FileText }, // Added source for Tweak #3
  visible: true,
  actions: [{ label: "View Details" }, { label: "Send Reminder" }],
}

// Legacy invoice for outstanding total, might not be actively interacted with in this script
const EXISTING_UNPAID_INVOICE_LEGACY_INITIAL: InboxItemData = {
  id: "INV-2024-0721",
  type: "invoice_sent_reminder_due",
  direction: "outbound",
  title: "Invoice #INV-2024-0721 to Brenner & Associates",
  description: "Brand Identity Workshop • Reminder Sent",
  amount: DEMO_CONFIG.LEGACY_INVOICE_AMOUNT,
  client: "Brenner & Associates",
  dueDate: "overdue by 5 days",
  timestamp: "Sent 47 days ago",
  status: "pending",
  icon: Send,
  borderColorClass: "border-orange-600",
  source: { name: "Invoice System", icon: FileText }, // Added source
  visible: true,
  actions: [{ label: "Send Final Notice" }, { label: "Schedule Call" }],
}

const calculateTotals = (items: InboxItemData[]): { outstanding: number; payable: number } => {
  let outstanding = 0
  let payable = 0
  items.forEach((item) => {
    if (item.visible && item.status === "pending") {
      if (item.direction === "outbound" && item.type.startsWith("invoice_sent")) {
        outstanding += item.amount || 0
      } else if (item.direction === "inbound" && item.type.startsWith("invoice_received")) {
        // Note: "invoice_payment_scheduled" items are considered "history" or "done" for pending payable
        payable += item.amount || 0
      }
    }
  })
  return { outstanding, payable }
}

const SCRIPT_SCENES: DemoScene[] = [
  // 00:11-00:13 (P-in-P: head shrinks, dashboard fades in) - Now starts at 6s (11 - 5s shift)
  {
    timeStart: 6, // Was 11
    timeEnd: 8, // Was 13
    description: "Transition to dashboard.",
    voiceOver: "and it all starts with this dashboard.",
    currentRoute: "/dashboard/ai-inbox",
    balance: DEMO_CONFIG.INITIAL_BALANCE,
    taxVaultBalance: DEMO_CONFIG.INITIAL_TAX_VAULT,
    inboxItems: [
      INCOMING_UTILITY_BILL_INITIAL,
      EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL,
      EXISTING_UNPAID_INVOICE_LEGACY_INITIAL,
    ],
    totalOutstanding: DEMO_CONFIG.INVOICE_AMOUNT_PAID + DEMO_CONFIG.LEGACY_INVOICE_AMOUNT,
    totalPayable: DEMO_CONFIG.UTILITY_BILL_AMOUNT,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 00:13-00:24 (Focus on dashboard top metrics and inbox) - Now starts at 8s (13 - 5s shift)
  {
    timeStart: 8, // Was 13
    timeEnd: 19, // Was 24
    description: "Dashboard overview: metrics and financial inbox.",
    voiceOver:
      "here's the financial inbox. every bill you owe, every dollar you're owed, and how much we've set aside for taxes.",
    currentRoute: "/dashboard/ai-inbox",
    balance: DEMO_CONFIG.INITIAL_BALANCE,
    taxVaultBalance: DEMO_CONFIG.INITIAL_TAX_VAULT,
    inboxItems: [
      INCOMING_UTILITY_BILL_INITIAL,
      EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL,
      EXISTING_UNPAID_INVOICE_LEGACY_INITIAL,
    ],
    totalOutstanding: DEMO_CONFIG.INVOICE_AMOUNT_PAID + DEMO_CONFIG.LEGACY_INVOICE_AMOUNT,
    totalPayable: DEMO_CONFIG.UTILITY_BILL_AMOUNT,
    activityFeed: [
      { id: "act_welcome", timestamp: "Yesterday", description: "Account activated - welcome to Zero Finance!", icon: CheckCircle2 },
    ],
    showActivityFeed: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 00:24-00:29 (Click yellow 'bill from utility co.') - Now starts at 19s (24 - 5s shift)
  {
    timeStart: 19, // Was 24
    timeEnd: 24, // Was 29
    description: "Open Utility Co. bill.",
    voiceOver: "let's open this PG&E bill.",
    currentRoute: "/dashboard/ai-inbox",
    balance: DEMO_CONFIG.INITIAL_BALANCE,
    taxVaultBalance: DEMO_CONFIG.INITIAL_TAX_VAULT,
    inboxItems: (prev) => prev,
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    highlightedInboxItemId: INCOMING_UTILITY_BILL_INITIAL.id,
    selectedInboxItem: (items) => items.find((item) => item.id === INCOMING_UTILITY_BILL_INITIAL.id) as InboxItemData,
    showActionDetailsSidebar: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 00:29-00:35 (Sidebar slides in, chain-of-thought animates for utility bill) - Now starts at 24s (29 - 5s shift)
  {
    timeStart: 24, // Was 29
    timeEnd: 30, // Was 35
    description: "Utility bill details and AI parsing in sidebar.",
    voiceOver: "zero finance pulled it straight from that email, parsed the pdf, and knows it's due in six days.",
    currentRoute: "/dashboard/ai-inbox",
    balance: DEMO_CONFIG.INITIAL_BALANCE,
    taxVaultBalance: DEMO_CONFIG.INITIAL_TAX_VAULT,
    // @ts-ignore
    inboxItems: (prev) => prev,
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    highlightedInboxItemId: INCOMING_UTILITY_BILL_INITIAL.id,
    selectedInboxItem: (items) => items.find((item) => item.id === INCOMING_UTILITY_BILL_INITIAL.id) as InboxItemData,
    showActionDetailsSidebar: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 00:35-00:37 (Click schedule payment for utility bill) - Now starts at 30s (35 - 5s shift)
  {
    timeStart: 30, // Was 35
    timeEnd: 32, // Was 37
    description: "Scheduling payment for Utility Co. bill.",
    voiceOver: "one click to schedule.",
    currentRoute: "/dashboard/ai-inbox",
    balance: DEMO_CONFIG.INITIAL_BALANCE,
    taxVaultBalance: DEMO_CONFIG.INITIAL_TAX_VAULT,
    // @ts-ignore
    inboxItems: (prevItems) => prevItems, // Action happens, state changes in next scene
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    highlightedInboxItemId: INCOMING_UTILITY_BILL_INITIAL.id,
    selectedInboxItem: (items) => items.find((item) => item.id === INCOMING_UTILITY_BILL_INITIAL.id) as InboxItemData,
    showActionDetailsSidebar: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 00:37-00:42 (Utility bill card border turns purple, date appears) - Now starts at 32s (37 - 5s shift)
  {
    timeStart: 32, // Was 37
    timeEnd: 37, // Was 42
    description: "Utility bill payment scheduled. UI updates.",
    voiceOver: "done. the agent will push crypto→ACH on the due date.",
    currentRoute: "/dashboard/ai-inbox",
    uiFlashMessage: `Payment for PG&E scheduled.`,
    balance: DEMO_CONFIG.INITIAL_BALANCE,
    taxVaultBalance: DEMO_CONFIG.INITIAL_TAX_VAULT,
    inboxItems: (prevItems) =>
      prevItems.map((item) =>
        item.id === INCOMING_UTILITY_BILL_INITIAL.id
          ? {
              ...item,
              type: "invoice_payment_scheduled",
              status: "history",
              itemSpecificStatus: "Payment Scheduled",
              description: `Payment scheduled for ${new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}. Payment will send via USDC → ACH.`,
              borderColorClass: "border-purple-500",
              icon: CalendarClock,
              actions: [{ label: "Cancel Payment", variant: "outline" }, { label: "Pay Now Instead" }],
            }
          : item,
      ),
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    selectedInboxItem: null,
    showActionDetailsSidebar: false,
    highlightedInboxItemId: INCOMING_UTILITY_BILL_INITIAL.id,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 00:42-00:53 (Click blue 'invoice #inv-demo-001') - Now starts at 37s (42 - 5s shift)
  {
    timeStart: 37, // Was 42
    timeEnd: 48, // Was 53
    description: "Open New Client Inc. invoice.",
    voiceOver: "moving on. this invoice to techflow solutions just got paid.",
    currentRoute: "/dashboard/ai-inbox",
    balance: DEMO_CONFIG.INITIAL_BALANCE,
    taxVaultBalance: DEMO_CONFIG.INITIAL_TAX_VAULT,
    // @ts-ignore
    inboxItems: (prev) => prev,
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    highlightedInboxItemId: EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id,
    selectedInboxItem: (items) =>
      items.find((item) => item.id === EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id) as InboxItemData,
    showActionDetailsSidebar: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 00:53-01:05 (Sidebar shows payment matched for New Client Inc. invoice, green border) - Now starts at 48s (53 - 5s shift)
  {
    timeStart: 48, // Was 53
    timeEnd: 60, // Was 65
    description: "New Client Inc. invoice payment reconciled.",
    voiceOver: "zero finance reconciled the payment and marked it complete in the ledger.",
    currentRoute: "/dashboard/ai-inbox",
    balance: DEMO_CONFIG.INITIAL_BALANCE + DEMO_CONFIG.INVOICE_AMOUNT_PAID,
    taxVaultBalance: DEMO_CONFIG.INITIAL_TAX_VAULT,
    inboxItems: (prevItems) =>
      prevItems.map((item) =>
        item.id === EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id
          ? {
              ...item,
              type: "payment_received",
              itemSpecificStatus: "Payment Received",
              description: `Payment of ${DEMO_CONFIG.CURRENCY_SYMBOL}${DEMO_CONFIG.INVOICE_AMOUNT_PAID} received. Pending tax allocation.`,
              borderColorClass: "border-green-500",
              icon: ArrowDownCircle,
              source: { name: "Bank Feed Sync", icon: Landmark },
              // CHAIN OF THOUGHT UPDATE
              chainOfThought: [
                { id: "paid_inv_cot1_source", text: "Source: Bank Feed Sync", icon: Landmark },
                {
                  id: "paid_inv_cot2_matched",
                  text: `AI: Payment of ${DEMO_CONFIG.CURRENCY_SYMBOL}${DEMO_CONFIG.INVOICE_AMOUNT_PAID} received, matched to invoice ${DEMO_CONFIG.INVOICE_ID_PAID} for ${DEMO_CONFIG.CLIENT_NAME_PAID}.`,
                  icon: Brain,
                },
                {
                  id: "paid_inv_cot2b_ledger_payment",
                  text: "System: Ledger lines booked for payment received.",
                  icon: FileText,
                },
              ],
            }
          : item,
      ),
    totalOutstanding: DEMO_CONFIG.LEGACY_INVOICE_AMOUNT,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    highlightedInboxItemId: EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id,
    selectedInboxItem: (items) =>
      items.find((item) => item.id === EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id) as InboxItemData,
    showActionDetailsSidebar: true,
    // @ts-ignore
    activityFeed: (prevFeed = []) => [
      {
        id: "act_payment_in_newclient",
        timestamp: "Just now",
        description: `Payment for ${DEMO_CONFIG.INVOICE_ID_PAID} received from ${DEMO_CONFIG.CLIENT_NAME_PAID}`,
        icon: ArrowDownCircle,
      },
      // @ts-ignore
      ...prevFeed.filter((f) => f.id !== "act_welcome"),
    ],
    showActivityFeed: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 01:05-01:15 (Top metrics animate) - Now starts at 60s (65 - 5s shift)
  {
    timeStart: 60, // Was 65
    timeEnd: 70, // Was 75
    description: "Metrics updated. Explaining impact.",
    voiceOver: "main balance jumps, outstanding drops. no spreadsheets touched.",
    currentRoute: "/dashboard/ai-inbox",
    // @ts-ignore
    balance: (prev) => prev.balance,
    // @ts-ignore
    taxVaultBalance: (prev) => prev.taxVaultBalance,
    inboxItems: (prev) => prev,
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    highlightedInboxItemId: EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id,
    selectedInboxItem: (items) =>
      items.find((item) => item.id === EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id) as InboxItemData,
    showActionDetailsSidebar: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 01:15-01:22 (Chain-of-thought line appears: tax rule fired) - Now starts at 70s (75 - 5s shift)
  {
    timeStart: 70, // Was 75
    timeEnd: 77, // Was 82
    description: "Tax rule triggered for the received payment.",
    voiceOver: "we also have a plain-language rule: 'reserve twenty percent for tax.'",
    currentRoute: "/dashboard/ai-inbox",
    // @ts-ignore
    balance: (prev) => prev.balance,
    // @ts-ignore
    taxVaultBalance: (prev) => prev.taxVaultBalance,
    inboxItems: (prevItems) =>
      prevItems.map((item) =>
        item.id === EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id
          ? {
              ...item,
              // CHAIN OF THOUGHT UPDATE
              chainOfThought: [
                { id: "paid_inv_cot1_source", text: "Source: Bank Feed Sync", icon: Landmark },
                {
                  id: "paid_inv_cot2_matched",
                  text: `AI: Payment of ${DEMO_CONFIG.CURRENCY_SYMBOL}${DEMO_CONFIG.INVOICE_AMOUNT_PAID} received, matched to invoice ${DEMO_CONFIG.INVOICE_ID_PAID} for ${DEMO_CONFIG.CLIENT_NAME_PAID}.`,
                  icon: Brain,
                },
                {
                  id: "paid_inv_cot2b_ledger_payment",
                  text: "System: Ledger lines booked for payment received.",
                  icon: FileText,
                },
                {
                  id: "paid_inv_cot3_taxrule",
                  text: "AI: Tax rule 'Reserve 20% of project revenue for taxes' triggered.",
                  icon: Brain,
                },
              ],
            }
          : item,
      ),
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    highlightedInboxItemId: EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id,
    selectedInboxItem: (items) =>
      items.find((item) => item.id === EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id) as InboxItemData,
    showActionDetailsSidebar: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 01:22-01:25 (New blue card appears: auto-reserve $1 000) - Now starts at 77s (82 - 5s shift)
  {
    timeStart: 77, // Was 82
    timeEnd: 80, // Was 85
    description: "AI queues tax reservation to Tax Vault.",
    voiceOver: "the agent queued nine-fifty to the tax vault.",
    currentRoute: "/dashboard/ai-inbox",
    // @ts-ignore
    balance: (prev) => prev.balance,
    // @ts-ignore
    taxVaultBalance: (prev) => prev.taxVaultBalance,
    // @ts-ignore
    inboxItems: (prevItems) => {
      const taxAmount = DEMO_CONFIG.INVOICE_AMOUNT_PAID * DEMO_CONFIG.TAX_RATE
      const taxProposalId = `tax-sweep-prop-${DEMO_CONFIG.INVOICE_ID_PAID}`

      const itemsWithTaxProposal = prevItems.find((item) => item.id === taxProposalId)
        ? prevItems
        : [
            ...prevItems,
            {
              id: taxProposalId,
              type: "tax_sweep_proposal_auto",
              direction: "outbound",
              title: `Auto-reserve ${DEMO_CONFIG.CURRENCY_SYMBOL}${taxAmount} for taxes`,
              description: `From payment for ${DEMO_CONFIG.INVOICE_ID_PAID}. Will execute in 2h or approve now.`,
              amount: taxAmount,
              currencySymbol: DEMO_CONFIG.CURRENCY_SYMBOL,
              timestamp: "Just now",
              status: "pending",
              icon: Shuffle,
              borderColorClass: "border-blue-500",
              confidence: 100,
              source: { name: "Zero Finance AI", icon: Sparkles },
              actions: [
                { label: "Approve Now", variant: "default", icon: ThumbsUp },
                { label: "Adjust Amount", variant: "outline" },
              ],
              visible: true,
              chainOfThought: [
                // CoT for the proposal item itself
                {
                  id: "tax_prop_cot1",
                  text: "Triggered by tax rule on invoice " + DEMO_CONFIG.INVOICE_ID_PAID,
                  icon: Brain,
                },
                {
                  id: "tax_prop_cot2",
                  text: `Calculated ${DEMO_CONFIG.TAX_RATE * 100}% of ${DEMO_CONFIG.CURRENCY_SYMBOL}${DEMO_CONFIG.INVOICE_AMOUNT_PAID} = ${DEMO_CONFIG.CURRENCY_SYMBOL}${taxAmount}`,
                  icon: Sparkles,
                },
              ],
            } as InboxItemData,
          ]

      // Update CoT on the original invoice item
      return itemsWithTaxProposal.map((item) =>
        item.id === EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id
          ? {
              ...item,
              // CHAIN OF THOUGHT UPDATE
              chainOfThought: [
                { id: "paid_inv_cot1_source", text: "Source: Bank Feed Sync", icon: Landmark },
                {
                  id: "paid_inv_cot2_matched",
                  text: `AI: Payment of ${DEMO_CONFIG.CURRENCY_SYMBOL}${DEMO_CONFIG.INVOICE_AMOUNT_PAID} received, matched to invoice ${DEMO_CONFIG.INVOICE_ID_PAID} for ${DEMO_CONFIG.CLIENT_NAME_PAID}.`,
                  icon: Brain,
                },
                {
                  id: "paid_inv_cot2b_ledger_payment",
                  text: "System: Ledger lines booked for payment received.",
                  icon: FileText,
                },
                {
                  id: "paid_inv_cot3_taxrule",
                  text: "AI: Tax rule 'Reserve 20% of project revenue for taxes' triggered.",
                  icon: Brain,
                },
                {
                  id: "paid_inv_cot4_taxproposal_sidebar", // Renamed to avoid conflict if this ID was used elsewhere
                  text: `AI: Proposing ${DEMO_CONFIG.CURRENCY_SYMBOL}${taxAmount} transfer to Tax Vault. Will execute in 2h or on approval.`,
                  icon: Sparkles,
                },
              ],
            }
          : item,
      )
    },
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    highlightedInboxItemId: `tax-sweep-prop-${DEMO_CONFIG.INVOICE_ID_PAID}`,
    selectedInboxItem: (items) =>
      items.find((item) => item.id === `tax-sweep-prop-${DEMO_CONFIG.INVOICE_ID_PAID}`) as InboxItemData,
    showActionDetailsSidebar: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 01:25-01:32 (Click approve now, card disappears, vault metric up) - Now starts at 80s (85 - 5s shift)
  {
    timeStart: 80, // Was 85
    timeEnd: 87, // Was 92
    description: "Tax reservation approved. Funds move, books close.",
    voiceOver: "approve, funds move, books close.",
    currentRoute: "/dashboard/ai-inbox",
    uiFlashMessage: "Tax reservation approved and funds transferred to Tax Vault.",
    // @ts-ignore
    balance: DEMO_CONFIG.INITIAL_BALANCE + DEMO_CONFIG.INVOICE_AMOUNT_PAID * (1 - DEMO_CONFIG.TAX_RATE),
    taxVaultBalance: DEMO_CONFIG.INITIAL_TAX_VAULT + DEMO_CONFIG.INVOICE_AMOUNT_PAID * DEMO_CONFIG.TAX_RATE,
    // @ts-ignore
    inboxItems: (prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === `tax-sweep-prop-${DEMO_CONFIG.INVOICE_ID_PAID}`) {
            return {
              ...item,
              status: "done",
              visible: false, // Makes it disappear from pending
              description: `${DEMO_CONFIG.CURRENCY_SYMBOL}${item.amount} transferred to Tax Vault.`,
            }
          }
          if (item.id === EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id) {
            return {
              ...item,
              status: "done",
              itemSpecificStatus: "Paid & Tax Allocated",
              description: `Paid by ${DEMO_CONFIG.CLIENT_NAME_PAID}. Tax portion allocated.`,
              // CHAIN OF THOUGHT UPDATE
              chainOfThought: [
                { id: "paid_inv_cot1_source", text: "Source: Bank Feed Sync", icon: Landmark },
                {
                  id: "paid_inv_cot2_matched",
                  text: `AI: Payment of ${DEMO_CONFIG.CURRENCY_SYMBOL}${DEMO_CONFIG.INVOICE_AMOUNT_PAID} received, matched to invoice ${DEMO_CONFIG.INVOICE_ID_PAID} for ${DEMO_CONFIG.CLIENT_NAME_PAID}.`,
                  icon: Brain,
                },
                // Step for "Tax rule triggered" and "Proposing transfer" are implicitly covered by user approval now
                { id: "paid_inv_cot5_user_action", text: "User action: Approved tax transfer.", icon: CheckCircle2 },
                {
                  id: "paid_inv_cot6_system_transfer",
                  text: `System: ${DEMO_CONFIG.CURRENCY_SYMBOL}${DEMO_CONFIG.INVOICE_AMOUNT_PAID * DEMO_CONFIG.TAX_RATE} transferred from Main Balance to Tax Vault.`,
                  icon: Landmark,
                },
                {
                  id: "paid_inv_cot7_ledger_final",
                  text: "System: Ledger lines booked for payment and tax allocation.", // Comprehensive ledger update
                  icon: FileText,
                },
              ],
            }
          }
          return item
        })
        .filter((item) => item.visible !== false),
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    selectedInboxItem: (items) =>
      items.find((item) => item.id === EXISTING_UNPAID_INVOICE_NEWCLIENT_INITIAL.id) as InboxItemData,
    showActionDetailsSidebar: true,
    showTaxVaultDetailCard: true,
    nextTaxDue: `${DEMO_CONFIG.CURRENCY_SYMBOL}${(DEMO_CONFIG.INITIAL_TAX_VAULT + DEMO_CONFIG.INVOICE_AMOUNT_PAID * DEMO_CONFIG.TAX_RATE).toLocaleString()} (Est. Next Quarter)`,
    // @ts-ignore
    activityFeed: (prevFeed = []) => [
      {
        id: "act_tax_swept_approved",
        timestamp: "Just now",
        description: `Tax allocation for ${DEMO_CONFIG.INVOICE_ID_PAID} completed - $${DEMO_CONFIG.INVOICE_AMOUNT_PAID * DEMO_CONFIG.TAX_RATE} moved to vault`,
        icon: Landmark,
      },
      // @ts-ignore
      ...prevFeed,
    ],
    showActivityFeed: true,
    showIntro: false,
    showOutro: false,
    ledgerExportTriggered: false,
  },
  // 01:32-01:40 (Talking head full screen, dash p-in-p top-right) - Now starts at 87s (92 - 5s shift)
  {
    timeStart: 87, // Was 92
    timeEnd: 95, // Was 100
    description: "Summary: Plain English rules, crypto rails.",
    voiceOver: "rules in plain english, crypto rails under the hood, zero busy work.",
    currentRoute: "/dashboard/ai-inbox",
    showOutro: true,
    // @ts-ignore
    balance: (prev) => prev.balance,
    // @ts-ignore
    taxVaultBalance: (prev) => prev.taxVaultBalance,
    // @ts-ignore
    inboxItems: (prev) => prev,
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    // @ts-ignore
    totalOutstanding: (prev) => prev.totalOutstanding,
    // @ts-ignore
    totalPayable: (prev) => prev.totalPayable,
    selectedInboxItem: null,
    showActionDetailsSidebar: false,
    showIntro: false,
    ledgerExportTriggered: false,
  },
  // 01:40-01:45 (Fade to url / qr) - Now starts at 95s (100 - 5s shift)
  {
    timeStart: 95, // Was 100
    timeEnd: 100, // Was 105
    description: "Call to action: Sandbox.",
    voiceOver: "spin up a read-only sandbox with your own data in ninety seconds. link below.",
    currentRoute: "/dashboard/ai-inbox",
    showOutro: true,
    // @ts-ignore
    balance: (prev) => prev.balance,
    // @ts-ignore
    taxVaultBalance: (prev) => prev.taxVaultBalance,
    // @ts-ignore
    inboxItems: (prev) => prev,
    showIntro: false,
    ledgerExportTriggered: false,
  },
  // 01:45 (Black) - Final scene - Now starts at 100s (105 - 5s shift)
  {
    timeStart: 100, // Was 105
    timeEnd: 101, // Was 106
    description: "End of demo.",
    voiceOver: "",
    currentRoute: "/dashboard/ai-inbox",
    showOutro: true,
    // @ts-ignore
    balance: (prev) => prev.balance,
    // @ts-ignore
    taxVaultBalance: (prev) => prev.taxVaultBalance,
    // @ts-ignore
    inboxItems: (prev) => prev,
    // @ts-ignore
    showIntro: false,
    ledgerExportTriggered: false,
  },
]

const TOTAL_DURATION = SCRIPT_SCENES.length > 0 ? SCRIPT_SCENES[SCRIPT_SCENES.length - 1].timeEnd : 0

type DemoContextType = {
  scenes: DemoScene[]
  currentScene: DemoScene | null
  currentSceneIndex: number
  isPlaying: boolean
  elapsedTime: number
  totalDuration: number
  playDemo: () => void
  pauseDemo: () => void
  nextScene: () => void
  prevScene: () => void
  resetDemo: () => void
  jumpToScene: (sceneIndex: number) => void
  triggerLedgerExport: () => void
  selectInboxItem: (item: InboxItemData | null) => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [sceneInternalState, setSceneInternalState] = useState<SceneInternalState>({})
  // go to scene 1
  useEffect(() => {
    router.push(SCRIPT_SCENES[0].currentRoute)
  }, [currentSceneIndex])

  const [resolvedScenes, setResolvedScenes] = useState<DemoScene[]>(() => {
    const scenes = [...SCRIPT_SCENES]
    let lastResolvedInbox: InboxItemData[] = []
    let lastBalance = DEMO_CONFIG.INITIAL_BALANCE
    let lastTaxVaultBalance = DEMO_CONFIG.INITIAL_TAX_VAULT
    let lastTotalOutstanding = DEMO_CONFIG.INVOICE_AMOUNT_PAID + DEMO_CONFIG.LEGACY_INVOICE_AMOUNT
    let lastTotalPayable = DEMO_CONFIG.UTILITY_BILL_AMOUNT
    let lastActivityFeed: ActivityItem[] = []

    return scenes.map((scene) => {
      let currentInboxItems = scene.inboxItems
      if (typeof scene.inboxItems === "function") {
        currentInboxItems = scene.inboxItems(lastResolvedInbox)
      }
      lastResolvedInbox = currentInboxItems as InboxItemData[]

      let currentSelectedInboxItem = scene.selectedInboxItem
      if (typeof scene.selectedInboxItem === "function") {
        currentSelectedInboxItem = scene.selectedInboxItem(lastResolvedInbox)
      }

      // @ts-ignore
      const currentBalance =
        // @ts-ignore
        typeof scene.balance === "function" ? scene.balance({ balance: lastBalance } as DemoScene) : scene.balance
      lastBalance = currentBalance

      // @ts-ignore
      const currentTaxVaultBalance =
        typeof scene.taxVaultBalance === "function"
          // @ts-ignore
          ? scene.taxVaultBalance({ taxVaultBalance: lastTaxVaultBalance } as DemoScene)
          : scene.taxVaultBalance
      lastTaxVaultBalance = currentTaxVaultBalance

      const { outstanding, payable } = calculateTotals(lastResolvedInbox)
      // @ts-ignore
      const currentTotalOutstanding =
        scene.totalOutstanding === undefined
          ? outstanding
          : typeof scene.totalOutstanding === "function"
            // @ts-ignore
            ? scene.totalOutstanding({ totalOutstanding: lastTotalOutstanding } as DemoScene)
            : scene.totalOutstanding
      lastTotalOutstanding = currentTotalOutstanding

      // @ts-ignore
      const currentTotalPayable =
        scene.totalPayable === undefined
          ? payable
          : typeof scene.totalPayable === "function"
            // @ts-ignore
            ? scene.totalPayable({ totalPayable: lastTotalPayable } as DemoScene)
            : scene.totalPayable
      lastTotalPayable = currentTotalPayable

      // @ts-ignore
      let currentActivityFeed = scene.activityFeed
      if (typeof scene.activityFeed === "function") {
        // @ts-ignore
        currentActivityFeed = scene.activityFeed(lastActivityFeed)
      }
      lastActivityFeed = currentActivityFeed as ActivityItem[]

      return {
        ...scene,
        inboxItems: lastResolvedInbox,
        selectedInboxItem: currentSelectedInboxItem as InboxItemData | null,
        balance: currentBalance,
        taxVaultBalance: currentTaxVaultBalance,
        totalOutstanding: currentTotalOutstanding,
        totalPayable: currentTotalPayable,
        activityFeed: currentActivityFeed,
      }
    })
  })

  const currentSceneData = resolvedScenes[currentSceneIndex]
  const currentScene = currentSceneData ? { ...currentSceneData, ...sceneInternalState } : null

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const sceneProcessedRef = useRef<boolean>(false)

  const playDemo = useCallback(() => setIsPlaying(true), [])
  const pauseDemo = useCallback(() => setIsPlaying(false), [])

  const resetDemo = useCallback(() => {
    setCurrentSceneIndex(0)
    setIsPlaying(false)
    setElapsedTime(0)
    setSceneInternalState({})
    // Re-initialize resolvedScenes (this logic was already in resetDemo)
    const scenes = [...SCRIPT_SCENES]
    let lastResolvedInbox: InboxItemData[] = []
    let lastBalance = DEMO_CONFIG.INITIAL_BALANCE
    let lastTaxVaultBalance = DEMO_CONFIG.INITIAL_TAX_VAULT
    let lastTotalOutstanding = DEMO_CONFIG.INVOICE_AMOUNT_PAID + DEMO_CONFIG.LEGACY_INVOICE_AMOUNT
    let lastTotalPayable = DEMO_CONFIG.UTILITY_BILL_AMOUNT
    let lastActivityFeed: ActivityItem[] = []

    setResolvedScenes(
      scenes.map((scene) => {
        let currentInboxItems = scene.inboxItems
        if (typeof scene.inboxItems === "function") {
          currentInboxItems = scene.inboxItems(lastResolvedInbox)
        }
        lastResolvedInbox = currentInboxItems as InboxItemData[]

        let currentSelectedInboxItem = scene.selectedInboxItem
        if (typeof scene.selectedInboxItem === "function") {
          currentSelectedInboxItem = scene.selectedInboxItem(lastResolvedInbox)
        }

        // @ts-ignore
        const currentBalance =
          // @ts-ignore
          typeof scene.balance === "function" ? scene.balance({ balance: lastBalance } as DemoScene) : scene.balance
        // @ts-ignore
        lastBalance = currentBalance

        // @ts-ignore
        const currentTaxVaultBalance =
          typeof scene.taxVaultBalance === "function"
            // @ts-ignore
            ? scene.taxVaultBalance({ taxVaultBalance: lastTaxVaultBalance } as DemoScene)
            : scene.taxVaultBalance
        // @ts-ignore
        lastTaxVaultBalance = currentTaxVaultBalance

        const { outstanding, payable } = calculateTotals(lastResolvedInbox)
        // @ts-ignore
        const currentTotalOutstanding =
          scene.totalOutstanding === undefined
            ? outstanding
            : typeof scene.totalOutstanding === "function"
              // @ts-ignore
              ? scene.totalOutstanding({ totalOutstanding: lastTotalOutstanding } as DemoScene)
              : scene.totalOutstanding
        // @ts-ignore
                lastTotalOutstanding = currentTotalOutstanding

        // @ts-ignore
        const currentTotalPayable =
          scene.totalPayable === undefined
            ? payable
            : typeof scene.totalPayable === "function"
              // @ts-ignore
              ? scene.totalPayable({ totalPayable: lastTotalPayable } as DemoScene)
              : scene.totalPayable
        lastTotalPayable = currentTotalPayable

        // @ts-ignore
        let currentActivityFeed = scene.activityFeed
        if (typeof scene.activityFeed === "function") {
          // @ts-ignore
          currentActivityFeed = scene.activityFeed(lastActivityFeed)
        }
        lastActivityFeed = currentActivityFeed as ActivityItem[]

        return {
          ...scene,
          inboxItems: lastResolvedInbox,
          selectedInboxItem: currentSelectedInboxItem as InboxItemData | null,
          balance: currentBalance,
          taxVaultBalance: currentTaxVaultBalance,
          totalOutstanding: currentTotalOutstanding,
          totalPayable: currentTotalPayable,
          activityFeed: currentActivityFeed,
        }
      }),
    )

    // if (pathname !== "/") router.push("/")
    sceneProcessedRef.current = false
  }, [router, pathname]) // Added router and pathname as dependencies

  const processSceneSideEffects = useCallback(
    (scene: DemoScene | null) => {
      if (!scene || sceneProcessedRef.current) return

      if (scene.currentRoute && pathname !== scene.currentRoute) {
        // router.push(scene.currentRoute)
      }
      if (scene.uiFlashMessage && scene.uiFlashMessage !== sceneInternalState.uiFlashMessage) {
        toast.success(scene.uiFlashMessage)
        setSceneInternalState((prev) => ({ ...prev, uiFlashMessage: scene.uiFlashMessage }))
      }

      const shouldShowSidebar =
        scene.showActionDetailsSidebar === undefined
          ? sceneInternalState.showActionDetailsSidebar
          : scene.showActionDetailsSidebar
      const newSelectedInboxItem =
        scene.selectedInboxItem === undefined ? sceneInternalState.selectedInboxItem : scene.selectedInboxItem

      if (
        sceneInternalState.showActionDetailsSidebar !== shouldShowSidebar ||
        // @ts-ignore
        sceneInternalState.selectedInboxItem?.id !== (newSelectedInboxItem as InboxItemData | null)?.id
      ) {
        setSceneInternalState((prev) => ({
          ...prev,
          selectedInboxItem: newSelectedInboxItem as InboxItemData | null,
          showActionDetailsSidebar: shouldShowSidebar,
        }))
      }
      sceneProcessedRef.current = true
    },
    [pathname, router, sceneInternalState],
  )

  useEffect(() => {
    processSceneSideEffects(currentScene)
  }, [currentScene, processSceneSideEffects])

  useEffect(() => {
    sceneProcessedRef.current = false
  }, [currentSceneIndex])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 0.1
          if (newTime >= TOTAL_DURATION) {
            setIsPlaying(false)
            const lastSceneIndex = resolvedScenes.length - 1
            if (lastSceneIndex !== currentSceneIndex) {
              setCurrentSceneIndex(lastSceneIndex)
            }
            return TOTAL_DURATION
          }

          const nextApplicableSceneIndex = resolvedScenes.findIndex((scene) => newTime < scene.timeEnd)

          if (nextApplicableSceneIndex !== -1 && nextApplicableSceneIndex !== currentSceneIndex) {
            setCurrentSceneIndex(nextApplicableSceneIndex)
          }
          return newTime
        })
      }, 100)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, currentSceneIndex, resolvedScenes])

  const jumpToScene = useCallback(
    (sceneIndex: number) => {
      if (sceneIndex >= 0 && sceneIndex < resolvedScenes.length) {
        setCurrentSceneIndex(sceneIndex)
        setElapsedTime(resolvedScenes[sceneIndex].timeStart)
        // Keep isPlaying state as is, or explicitly pause:
        // setIsPlaying(false); // Uncomment if jumping should always pause
        const targetScene = resolvedScenes[sceneIndex]
        setSceneInternalState((prevState) => ({
          ...prevState,
          uiFlashMessage:
            targetScene.uiFlashMessage === undefined ? prevState.uiFlashMessage : targetScene.uiFlashMessage,
          selectedInboxItem: targetScene.selectedInboxItem as InboxItemData | null,
          showActionDetailsSidebar: targetScene.showActionDetailsSidebar || false,
        }))
        sceneProcessedRef.current = false
      }
    },
    [resolvedScenes], // resolvedScenes is a dependency
  )

  const nextScene = useCallback(() => {
    const nextIndex = currentSceneIndex + 1
    if (nextIndex < resolvedScenes.length) {
      jumpToScene(nextIndex)
    } else {
      setIsPlaying(false) // Stop playing at the end
      if (currentSceneIndex !== resolvedScenes.length - 1) {
        jumpToScene(resolvedScenes.length - 1)
      }
    }
  }, [currentSceneIndex, jumpToScene, resolvedScenes.length])

  const prevScene = useCallback(() => {
    const prevIndex = currentSceneIndex - 1
    if (prevIndex >= 0) {
      jumpToScene(prevIndex)
    }
  }, [currentSceneIndex, jumpToScene])

  const triggerLedgerExport = () => {
    toast.info("Ledger export initiated (mock).")
  }

  const selectInboxItem = useCallback((item: InboxItemData | null) => {
    // pauseDemo() // Already memoized
    setIsPlaying(false) // Explicitly pause when an item is selected
    setSceneInternalState((prev) => ({
      ...prev,
      selectedInboxItem: item,
      showActionDetailsSidebar: !!item,
    }))
  }, []) // No explicit dependencies needed here if pauseDemo is stable

  useHotkeys(
    "space",
    (e) => {
      e.preventDefault()
      isPlaying ? pauseDemo() : playDemo()
    },
    [isPlaying],
  )
  useHotkeys(
    "n",
    (e) => {
      e.preventDefault()
      nextScene()
    },
    [nextScene],
  )
  useHotkeys(
    "p",
    (e) => {
      e.preventDefault()
      prevScene()
    },
    [prevScene],
  )
  useHotkeys(
    "r",
    (e) => {
      e.preventDefault()
      resetDemo()
    },
    [resetDemo],
  )

  return (
    <DemoContext.Provider
      value={{
        scenes: resolvedScenes,
        currentScene,
        currentSceneIndex,
        isPlaying,
        elapsedTime,
        totalDuration: TOTAL_DURATION,
        playDemo,
        pauseDemo,
        nextScene,
        prevScene,
        resetDemo,
        jumpToScene,
        triggerLedgerExport,
        selectInboxItem,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export const useDemoTimeline = () => {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error("useDemoTimeline must be used within a DemoProvider")
  }
  return context
}
