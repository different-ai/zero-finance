"use client";

import { Button } from "@/components/ui/button";
import { useInboxStore } from "@/lib/store";
import { Check, XCircle, Trash2, Clock, Tag, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { motion, AnimatePresence } from "framer-motion";

export function MultiSelectActionBar() {
  const { selectedCardIds, clearSelection, addToast, bulkUpdateCardStatus, bulkRemoveCards } = useInboxStore();
  const hasSelected = selectedCardIds.size > 0;

  // API mutations
  const bulkUpdateStatusMutation = api.inboxCards.bulkUpdateStatus.useMutation({
    onMutate: async ({ cardIds, status }) => {
      // Optimistically update the UI
      bulkUpdateCardStatus(cardIds, status);
      return { cardIds, status };
    },
    onSuccess: () => {
      addToast({ message: `${selectedCardIds.size} cards updated`, status: 'success' });
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error by refetching
      addToast({ 
        message: error.message || 'Failed to update cards', 
        status: 'error' 
      });
    },
  });

  const bulkDeleteMutation = api.inboxCards.bulkDelete.useMutation({
    onMutate: async ({ cardIds }) => {
      // Optimistically remove cards from UI
      bulkRemoveCards(cardIds);
      return { cardIds };
    },
    onSuccess: () => {
      addToast({ message: `${selectedCardIds.size} cards deleted`, status: 'success' });
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error by refetching
      addToast({ 
        message: error.message || 'Failed to delete cards', 
        status: 'error' 
      });
    },
  });

  const handleApprove = () => {
    const selectedIds = Array.from(selectedCardIds);
    bulkUpdateStatusMutation.mutate({
      cardIds: selectedIds,
      status: 'seen',
    });
  };

  const handleDismiss = () => {
    const selectedIds = Array.from(selectedCardIds);
    bulkUpdateStatusMutation.mutate({
      cardIds: selectedIds,
      status: 'dismissed',
    });
  };

  const handleSnooze = () => {
    const selectedIds = Array.from(selectedCardIds);
    bulkUpdateStatusMutation.mutate({
      cardIds: selectedIds,
      status: 'snoozed',
    });
  };

  const handleMarkDone = () => {
    const selectedIds = Array.from(selectedCardIds);
    bulkUpdateStatusMutation.mutate({
      cardIds: selectedIds,
      status: 'done',
    });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to permanently delete ${selectedCardIds.size} cards? This action cannot be undone.`)) {
      const selectedIds = Array.from(selectedCardIds);
      bulkDeleteMutation.mutate({
        cardIds: selectedIds,
      });
    }
  };

  const isLoading = bulkUpdateStatusMutation.isPending || bulkDeleteMutation.isPending;

  return (
    <AnimatePresence>
      {hasSelected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-x-0 bottom-4 flex justify-center z-50 pointer-events-none",
          )}
        >
          <div className="pointer-events-auto bg-card/95 backdrop-blur-md border border-border/50 shadow-lg rounded-full px-6 py-3 flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedCardIds.size} {selectedCardIds.size === 1 ? 'item' : 'items'} selected
            </span>
            
            <div className="h-8 w-px bg-border" />
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="h-8 px-3 gap-2" 
                onClick={handleApprove}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Approve</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-3 gap-2" 
                onClick={handleDismiss}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Dismiss</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-3 gap-2" 
                onClick={handleSnooze}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Clock className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Snooze</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-3 gap-2" 
                onClick={handleMarkDone}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Done</span>
              </Button>
              
              <div className="h-8 w-px bg-border" />
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 px-3 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" 
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
            
            <div className="h-8 w-px bg-border" />
            
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-muted-foreground"
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}