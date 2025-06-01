'use client';

import { Button } from '@/components/ui/button';
import { InboxContent } from '@/components/inbox-content';
import { useGmailSyncOrchestrator, useInboxStore } from '@/lib/store';
import { api } from '@/trpc/react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function InboxPage() {
  const { startSync, syncSuccess, syncError, emailProcessingStatus, errorMessage } = useGmailSyncOrchestrator();
  const { data: initialCards, isLoading: isLoadingInitialCards } = api.inbox.getInboxCards.useQuery({}); // Example initial load

  const syncGmailMutation = api.inbox.syncGmail.useMutation({
    onMutate: () => {
      startSync();
    },
    onSuccess: (newCards) => {
      syncSuccess(newCards);
    },
    onError: (error) => {
      const err = new Error(error.message || 'Unknown tRPC error during Gmail sync');
      syncError(err);
    },
  });

  // Example of how to load initial cards into the store if needed (e.g., from DB)
  // const addCard = useInboxStore(state => state.addCard);
  // useEffect(() => {
  //   if (initialCards) {
  //     initialCards.forEach(card => addCard(card)); // This might cause duplicates if not handled carefully
  //   }
  // }, [initialCards, addCard]);

  const handleSyncGmail = () => {
    syncGmailMutation.mutate({ count: 50 }); // Fetch 50 emails
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Inbox</h1>
          <Button 
            onClick={handleSyncGmail} 
            disabled={emailProcessingStatus === 'loading' || syncGmailMutation.isPending}
          >
            {emailProcessingStatus === 'loading' || syncGmailMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...</>
            ) : (
              'Sync Gmail'
            )}
          </Button>
        </div>
        {emailProcessingStatus === 'error' && errorMessage && (
          <p className="text-sm text-destructive mt-2">Error: {errorMessage}</p>
        )}
      </div>
      {/* isLoadingInitialCards can be used here if cards are fetched from DB initially */}
      <InboxContent /> 
    </div>
  );
} 