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
  addCard: (card: InboxCard) => void
  removeCard: (id: string) => void
  updateCard: (id: string, updates: Partial<InboxCard>) => void
  applySuggestedUpdate: (cardId: string) => void
  addCommentToCard: (cardId: string, comment: Comment) => void
  executeCard: (id: string) => void
  dismissCard: (id: string) => void
  snoozeCard: (id: string, duration: string) => void
  toggleCardSelection: (id: string) => void
  clearSelection: () => void
  addDemoCards: () => void
  addMemory: (memory: Memory) => void
  addToast: (toast: Omit<ToastMessage, "id">) => void
  removeToast: (toastId: string) => void
}

export const useInboxStore = create<InboxState>((set, get) => ({
  cards: [],
  selectedCardIds: new Set<string>(),
  memories: [],
  toasts: [],

  addCard: (card) =>
    set((state) => ({
      cards: [card, ...state.cards],
    })),

  removeCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),

  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? { ...card, ...updates } : card)),
    })),

  applySuggestedUpdate: (cardId) =>
    set((state) => {
      const cardToUpdate = state.cards.find((card) => card.id === cardId)
      if (cardToUpdate && cardToUpdate.suggestedUpdate) {
        // Basic merge, more sophisticated logic might be needed for deep objects like 'impact'
        const updatedCardData = { ...cardToUpdate, ...cardToUpdate.suggestedUpdate }

        // Specifically merge impact if present in suggestedUpdate
        if (cardToUpdate.suggestedUpdate.impact) {
          updatedCardData.impact = { ...cardToUpdate.impact, ...cardToUpdate.suggestedUpdate.impact }
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
}))
