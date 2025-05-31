"use client"

import { useState } from "react" // Ensured React is imported for Fragment clarity
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InboxEmptyState } from "@/components/inbox-empty-state"
import { InboxPendingList } from "@/components/inbox-pending-list"
import { InboxHistoryList } from "@/components/inbox-history-list"
import { InboxSnoozedList } from "@/components/inbox-snoozed-list"
import { InboxErrorList } from "@/components/inbox-error-list"
import { InboxDetailSidebar } from "@/components/inbox-detail-sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import type { InboxCard } from "@/types/inbox"
import { useInboxStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { ActionToast } from "@/components/action-toast"

export function InboxContent() {
  const { cards, selectedCardIds, toggleCardSelection, clearSelection, toasts, removeToast } = useInboxStore()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedCard, setSelectedCard] = useState<InboxCard | null>(null)
  const isMobile = useIsMobile()

  const pendingCards = cards.filter((card) => card.status === "pending")
  const historyCards = cards.filter((card) => ["executed", "dismissed", "auto"].includes(card.status))
  const snoozedCards = cards.filter((card) => card.status === "snoozed")
  const errorCards = cards.filter((card) => card.status === "error")

  const hasMultipleSelected = selectedCardIds.size > 0
  const hasErrors = errorCards.length > 0

  const handleCardClick = (card: InboxCard) => {
    setSelectedCard(card)
  }

  const handleCloseSidebar = () => {
    setSelectedCard(null)
  }

  return (
    <>
      <div className="flex h-full flex-col md:flex-row">
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Multi-select header */}
          {hasMultipleSelected && (
            <div className="bg-muted p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox checked={true} />
                <span className="text-sm font-medium">{selectedCardIds.size} items selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="default">
                  Approve selected
                </Button>
                <Button size="sm" variant="outline">
                  Dismiss
                </Button>
                <Button size="sm" variant="ghost" onClick={clearSelection}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="h-10">
                <TabsTrigger value="pending" className="data-[state=active]:font-medium">
                  Pending
                  {pendingCards.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {pendingCards.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:font-medium">
                  History
                </TabsTrigger>
                <TabsTrigger value="snoozed" className="data-[state=active]:font-medium">
                  Snoozed
                  {snoozedCards.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {snoozedCards.length}
                    </span>
                  )}
                </TabsTrigger>
                {(hasErrors || errorCards.length > 0) && ( // Ensure errors tab shows if there are errors
                  <TabsTrigger value="errors" className="data-[state=active]:font-medium">
                    Errors
                    {errorCards.length > 0 && (
                      <span className="ml-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                        {errorCards.length}
                      </span>
                    )}
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto">
              <TabsContent value="pending" className="h-full">
                {pendingCards.length === 0 ? (
                  <InboxEmptyState />
                ) : (
                  <InboxPendingList cards={pendingCards} onCardClick={handleCardClick} />
                )}
              </TabsContent>
              <TabsContent value="history" className="h-full">
                <InboxHistoryList cards={historyCards} onCardClick={handleCardClick} />
              </TabsContent>
              <TabsContent value="snoozed" className="h-full">
                <InboxSnoozedList cards={snoozedCards} onCardClick={handleCardClick} />
              </TabsContent>
              <TabsContent value="errors" className="h-full">
                <InboxErrorList cards={errorCards} onCardClick={handleCardClick} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Detail Sidebar */}
        {isMobile ? (
          <Sheet open={!!selectedCard} onOpenChange={(open) => !open && handleCloseSidebar()}>
            <SheetContent side="bottom" className="p-0 h-[90vh] overflow-y-auto">
              {selectedCard && (
                <InboxDetailSidebar card={selectedCard} onClose={handleCloseSidebar} />
              )}
            </SheetContent>
          </Sheet>
        ) : (
          selectedCard && (
            <InboxDetailSidebar card={selectedCard} onClose={handleCloseSidebar} />
          )
        )}
      </div>

      <div className="fixed bottom-4 right-4 space-y-2 z-[100]">
        {toasts.map((toast) => (
          <ActionToast
            key={toast.id}
            message={toast.message}
            status={toast.status}
            onUndo={toast.onUndo}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </>
  )
}
