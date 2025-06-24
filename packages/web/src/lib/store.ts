import { create } from "zustand"
import type { InboxCard, Comment, Memory } from "@/types/inbox"
import { generateDemoCards } from "@/lib/demo-data"
import { v4 as uuidv4 } from "uuid"

export interface ToastMessage {
  id: string
  message: string
  status: "success" | "error" | "loading"
  duration?: number
  onUndo?: () => void
}

interface InboxState {
  cards: InboxCard[]
  selectedCardIds: Set<string>
  memories: Memory[]
  toasts: ToastMessage[]
  emailProcessingStatus: 'idle' | 'loading' | 'success' | 'error'
  errorMessage?: string
  addCard: (card: InboxCard) => void
  addCards: (cards: InboxCard[]) => void
  setCards: (cards: InboxCard[]) => void
  removeCard: (id: string) => void
  updateCard: (id: string, updates: Partial<InboxCard>) => void
  applySuggestedUpdate: (cardId: string) => void
  addCommentToCard: (cardId: string, comment: Comment) => void
  executeCard: (id: string) => void
  dismissCard: (id: string) => void
  snoozeCard: (id: string, duration: string) => void
  toggleCardSelection: (id: string) => void
  clearSelection: () => void
  clearCards: () => void
  addDemoCards: () => void
  addMemory: (memory: Memory) => void
  addToast: (toast: Omit<ToastMessage, "id">) => void
  removeToast: (toastId: string) => void
  setEmailProcessingStatus: (status: InboxState['emailProcessingStatus']) => void
  setGmailSyncError: (message: string) => void
}

export const useInboxStore = create<InboxState>((set, get) => ({
  cards: [],
  selectedCardIds: new Set<string>(),
  memories: [],
  toasts: [],
  emailProcessingStatus: 'idle',
  errorMessage: undefined,

  addCard: (card) =>
    set((state) => ({
      cards: [card, ...state.cards],
    })),

  addCards: (cards) =>
    set((state) => ({
      cards: [...cards, ...state.cards],
    })),

  setCards: (cards) => set({ cards }),

  removeCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),

  clearCards: () =>
    set(() => ({
      cards: [],
    })),

  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? { ...card, ...updates } : card)),
    })),

  applySuggestedUpdate: (cardId) =>
    // @ts-ignore
    set((state) => {
      const cardToUpdate = state.cards.find((card) => card.id === cardId)
      if (cardToUpdate && cardToUpdate.suggestedUpdate) {
        // Basic merge, more sophisticated logic might be needed for deep objects like 'impact'
        const updatedCardData = { ...cardToUpdate, ...cardToUpdate.suggestedUpdate }

        // Specifically merge impact if present in suggestedUpdate
        if (cardToUpdate.suggestedUpdate.impact) {
          const currentImpact = cardToUpdate.impact;
          const suggestedImpact = cardToUpdate.suggestedUpdate.impact;
          updatedCardData.impact = {
            currentBalance: suggestedImpact.currentBalance ?? currentImpact.currentBalance,
            postActionBalance: suggestedImpact.postActionBalance ?? currentImpact.postActionBalance,
            yield: suggestedImpact.yield ?? currentImpact.yield,
          };
        }

        delete updatedCardData.suggestedUpdate // Clear the suggestion
        updatedCardData.isAiSuggestionPending = false

        return {
          cards: state.cards.map((card) => (card.id === cardId ? updatedCardData : card)),
        }
      }
      return state
    }),

  addCommentToCard: (cardId, comment) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId ? { ...card, comments: [...(card.comments || []), comment] } : card,
      ),
    })),

  executeCard: (id) => {
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, status: "executed", timestamp: new Date().toISOString() } : card,
      ),
    }))
    get().addToast({
      message: `Action approved: ${get()
        .cards.find((c) => c.id === id)
        ?.title.substring(0, 30)}...`,
      status: "success",
    })
  },

  dismissCard: (id) => {
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, status: "dismissed", timestamp: new Date().toISOString() } : card,
      ),
    }))
    get().addToast({
      message: "Action dismissed",
      status: "success",
      onUndo: () => {
        // Implement undo logic if needed, e.g., revert status
        get().updateCard(id, { status: "pending" })
        get().addToast({ message: "Dismissal undone", status: "success" })
      },
    })
  },

  snoozeCard: (id, duration) => {
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id
          ? {
              ...card,
              status: "snoozed",
              snoozedTime: duration,
              timestamp: new Date().toISOString(),
            }
          : card,
      ),
    }))
    get().addToast({ message: `Action snoozed for ${duration}`, status: "success" })
  },

  toggleCardSelection: (id) =>
    set((state) => {
      const newSelection = new Set(state.selectedCardIds)
      if (newSelection.has(id)) {
        newSelection.delete(id)
      } else {
        newSelection.add(id)
      }
      return { selectedCardIds: newSelection }
    }),

  clearSelection: () => set({ selectedCardIds: new Set() }),

  addDemoCards: () =>
    set((state) => {
      const demoCards = generateDemoCards()
      // Ensure demo cards also have an empty comments array if not defined
      const cardsWithComments = demoCards.map((card) => ({ ...card, comments: card.comments || [] }))
      return {
        cards: [...cardsWithComments, ...state.cards.map((card) => ({ ...card, comments: card.comments || [] }))],
      }
    }),

  addMemory: (memory) =>
    set((state) => ({
      memories: [memory, ...state.memories],
    })),

  addToast: (toastData) => {
    const newToast = { ...toastData, id: uuidv4() }
    set((state) => ({ toasts: [...state.toasts, newToast] }))
    if (newToast.status !== "loading" && (!toastData.onUndo || newToast.status === "error")) {
      // Auto-remove if not undoable success or not loading
      setTimeout(() => get().removeToast(newToast.id), newToast.duration || 5000)
    }
  },

  removeToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),

  setEmailProcessingStatus: (status) => set({ emailProcessingStatus: status, errorMessage: undefined }),

  setGmailSyncError: (message) => set({ emailProcessingStatus: 'error', errorMessage: message }),
}))

export const useGmailSyncOrchestrator = () => {
  const store = useInboxStore()

  const startSync = () => {
    store.setEmailProcessingStatus('loading')
    // Add a toast that can be manually removed or will timeout.
    // The component should manage removing this toast on success/error if a specific ID is needed for removal.
    store.addToast({ message: 'Syncing Gmail...', status: 'loading', duration: 30000 })
  }

  const syncSuccess = (newCards: InboxCard[]) => {
    console.log('[Store.syncSuccess] Received new cards from sync:', newCards.map(c => ({ id: c.id, emailId: (c.sourceDetails as any).emailId, title: c.title })));
    // Assuming cards from Gmail have emailId in sourceDetails for de-duplication
    const existingCardEmailIds = new Set(
      store.cards
        .filter(card => card.sourceType === 'email' && (card.sourceDetails as any).emailId)
        .map(card => (card.sourceDetails as any).emailId)
    );
    let addedCount = 0;
    let skippedCount = 0;

    newCards.forEach(card => {
      const emailId = (card.sourceDetails as any).emailId;
      if (card.sourceType === 'email' && emailId && existingCardEmailIds.has(emailId)) {
        console.log(`[Store.syncSuccess] Skipping duplicate EMAIL card with emailId: ${emailId}, Title: "${card.title}"`);
        skippedCount++;
      } else {
        console.log(`[Store.syncSuccess] Adding new card. Email ID: ${emailId || 'N/A'}, Title: "${card.title}"`);
        store.addCard(card);
        addedCount++;
      }
    });

    store.setEmailProcessingStatus('success');
    store.addToast({ message: `Gmail sync complete! ${addedCount} new card(s) added, ${skippedCount} duplicate(s) skipped.`, status: 'success' });
  }

  const syncError = (error: Error) => {
    store.setGmailSyncError(error.message || 'Unknown error during Gmail sync')
    // Optionally remove the specific loading toast
    store.addToast({ message: `Gmail sync failed: ${error.message || 'Unknown error'}`, status: 'error' })
  }

  return { startSync, syncSuccess, syncError, emailProcessingStatus: store.emailProcessingStatus, errorMessage: store.errorMessage }
}
