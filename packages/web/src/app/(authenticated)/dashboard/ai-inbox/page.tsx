"use client"

import {  useDemoTimeline } from "@/context/demo-timeline-context"
import type { InboxItemData } from "@/context/demo-timeline-context"
import { BalanceTile } from "@/components/demo/balance-tile"
import { InitialSetupGlimpse } from "@/components/demo/initial-setup-glimpse"
import { OutstandingBalanceTile } from "@/components/demo/outstanding-balance-tile"
import { PayableBalanceTile } from "@/components/demo/payable-balance-tile"
import { ActivityFeed } from "@/components/demo/activity-feed"
import { TaxVaultTile } from "@/components/demo/tax-vault-tile"
import { InboxItemCard } from "@/components/demo/inbox-item-card"
import { Button } from "@/components/ui/button"
import { Filter, Calendar, PlayCircle, ExternalLink } from "lucide-react" // Removed PlusCircle
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePostHog } from 'posthog-js/react'
// Removed Link for "Add New"

export default function DashboardPage() {
  const { currentScene, triggerLedgerExport, selectInboxItem } = useDemoTimeline()
  // const currentScene = null
  // const selectInboxItem = () => {}

  const [activeTab, setActiveTab] = useState<"pending" | "history" | "snoozed">("pending")
  const [filterDirection, setFilterDirection] = useState<"all" | "inbound" | "outbound">("all")
  const posthog = usePostHog()

  // Track demo page view
  useEffect(() => {
    if (currentScene) {
      const balance = currentScene.balance
      const taxVaultBalance = currentScene.taxVaultBalance
      const totalOutstanding = currentScene.totalOutstanding
      const totalPayable = currentScene.totalPayable
      const inboxItems = currentScene.inboxItems
      
      posthog?.capture('demo_dashboard_viewed', {
        current_balance: typeof balance === 'function' ? 0 : balance,
        current_tax_vault: typeof taxVaultBalance === 'function' ? 0 : taxVaultBalance,
        total_outstanding: typeof totalOutstanding === 'function' ? 0 : (totalOutstanding || 0),
        total_payable: typeof totalPayable === 'function' ? 0 : (totalPayable || 0),
        pending_items_count: Array.isArray(inboxItems) ? inboxItems.filter(item => item.visible && item.status === 'pending').length : 0,
        timestamp: new Date().toISOString()
      })
    }
  }, [currentScene, posthog])

  if (!currentScene) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading demo scene...</p>
      </div>
    )
  }

  const {
    balance,
    taxVaultBalance,
    totalOutstanding,
    totalPayable,
    nextTaxDue,
    inboxItems,
    highlightedInboxItemId,
    showInitialSetupGlimpse,
    showTaxVaultDetailCard,
    activityFeed,
    showActivityFeed,
    selectedInboxItem,
    showActionDetailsSidebar,
  } = currentScene

  const handleScheduleCall = (location: 'banner' | 'header') => {
    posthog?.capture('demo_schedule_call_clicked', {
      location,
      current_balance: typeof balance === 'function' ? 0 : balance,
      current_tax_vault: typeof taxVaultBalance === 'function' ? 0 : taxVaultBalance,
      pending_items_count: Array.isArray(inboxItems) ? inboxItems.filter(item => item.visible && item.status === 'pending').length : 0,
      timestamp: new Date().toISOString()
    })
    window.open('https://cal.com/potato/0-finance-onboarding?overlayCalendar=true&month=2025-07', '_blank')
  }

  const handleSelectInboxItem = (item: InboxItemData) => {
    posthog?.capture('demo_inbox_item_selected', {
      item_type: item.type,
      item_direction: item.direction,
      item_status: item.status,
      item_amount: item.amount,
      item_vendor: item.vendor,
      item_client: item.client,
      timestamp: new Date().toISOString()
    })
    selectInboxItem(item)
  }

  const handleCloseSidebar = () => {
    selectInboxItem(null)
  }

  const getFilteredItems = () => {
    // @ts-ignore
    let filtered = Array.isArray(inboxItems) ? inboxItems.filter((item) => item.visible && item.status === activeTab) : []

    if (filterDirection !== "all") {
      // @ts-ignore
      filtered = filtered.filter((item) => item.direction === filterDirection)
    }

    return filtered
  }

  const visibleInboxItems = getFilteredItems()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 relative">
      {/* Demo Banner */}
      <Alert className="border-blue-200 bg-blue-50 text-blue-900">
        <PlayCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <span>
            <strong>Demo Mode:</strong> You&apos;re viewing a simulation of Zero Finance with sample data. 
            All transactions and balances shown are for demonstration purposes.
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={() => handleScheduleCall('banner')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Setup Call
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </AlertDescription>
      </Alert>

      <AnimatePresence>{showInitialSetupGlimpse && <InitialSetupGlimpse />}</AnimatePresence>

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <ActivityFeed items={Array.isArray(activityFeed) ? activityFeed : []} showFeedIndicator={showActivityFeed || false} />
          <Button 
            variant="default"
            onClick={() => handleScheduleCall('header')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Get Started
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          {/* Removed "Add New" button that linked to /invoice/new */}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <BalanceTile amount={typeof balance === 'function' ? 0 : balance} />
        <TaxVaultTile amount={typeof taxVaultBalance === 'function' ? 0 : taxVaultBalance} nextTaxDueDate={nextTaxDue} showDetailCard={showTaxVaultDetailCard} />
        <OutstandingBalanceTile amount={typeof totalOutstanding === 'function' ? 0 : (totalOutstanding || 0)} />
        <PayableBalanceTile amount={typeof totalPayable === 'function' ? 0 : (totalPayable || 0)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Financial Inbox</h3>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {filterDirection === "all"
                    ? "All Items"
                    : filterDirection === "inbound"
                      ? "Bills to Pay"
                      : "Expecting Payment"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterDirection("all")}>All Items</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDirection("inbound")}>
                  Bills to Pay (Inbound)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDirection("outbound")}>
                  Expecting Payment (Outbound)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              {/* @ts-ignore */}
              Pending ({Array.isArray(inboxItems) ? inboxItems.filter((item) => item.visible && item.status === "pending").length : 0})
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="snoozed">Snoozed</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {renderInboxList(visibleInboxItems, highlightedInboxItemId, handleSelectInboxItem)}
          </TabsContent>
          <TabsContent value="history">
            {renderInboxList(
              // @ts-ignore
              Array.isArray(inboxItems) ? inboxItems.filter((item) => item.visible && item.status === "history") : [],
              highlightedInboxItemId,
              handleSelectInboxItem,
              "No historical items.",
            )}
          </TabsContent>
          <TabsContent value="snoozed">
            {renderInboxList(
              // @ts-ignore
              Array.isArray(inboxItems) ? inboxItems.filter((item) => item.visible && item.status === "snoozed") : [],
              highlightedInboxItemId,
              handleSelectInboxItem,
              "No snoozed items.",
            )}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}

function renderInboxList(
  items: InboxItemData[],
  highlightedId: string | undefined,
  onSelect: (item: InboxItemData) => void,
  emptyMessage = "No items to display.",
) {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <InboxItemCard item={item} onSelect={onSelect} isHighlighted={item.id === highlightedId} />
          </motion.div>
        ))}
      </AnimatePresence>
      {items.length === 0 && <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>}
    </div>
  )
}
