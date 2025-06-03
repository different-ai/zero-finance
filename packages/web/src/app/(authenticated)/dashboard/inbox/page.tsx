'use client';

import { Button } from '@/components/ui/button';
import { InboxContent } from '@/components/inbox-content';
import { InboxChat } from '@/components/inbox-chat';
import { useGmailSyncOrchestrator, useInboxStore } from '@/lib/store';
import { api } from '@/trpc/react';
import { Loader2, Mail, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { InboxCard as InboxCardType, SimplifiedEmailForChat } from '@/types/inbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { dbCardToUiCard } from '@/lib/inbox-card-utils';

export default function InboxPage() {
  const { startSync, syncSuccess, syncError, emailProcessingStatus, errorMessage } = useGmailSyncOrchestrator();
  const { cards, addCards } = useInboxStore();
  
  const [selectedCardForChat, setSelectedCardForChat] = useState<InboxCardType | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7d');
  const [isLoadingExistingCards, setIsLoadingExistingCards] = useState(true);

  // Check Gmail connection status
  const { data: gmailConnection, isLoading: isCheckingConnection, refetch: refetchConnection } = api.inbox.checkGmailConnection.useQuery();
  const disconnectGmailMutation = api.inbox.disconnectGmail.useMutation({
    onSuccess: () => {
      // Refetch connection status after disconnect
      refetchConnection();
    },
  });

  const ALL_TIME_VALUE_IDENTIFIER = 'all_time_identifier';

  const dateRangeOptions = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 14 Days", value: "14d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "All Time", value: ALL_TIME_VALUE_IDENTIFIER },
  ];

  // Load existing cards from database on page initialization
  const { data: existingCardsData, isLoading: isLoadingCards } = api.inboxCards.getUserCards.useQuery({
    limit: 100,
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });

  // Load existing cards into store on page load (only if store is empty)
  useEffect(() => {
    if (existingCardsData?.cards && !isLoadingCards && cards.length === 0) {
      console.log(`[Inbox Page] Loading ${existingCardsData.cards.length} existing cards from database`);
      // Convert DB cards to UI format and add to store
      const uiCards = existingCardsData.cards.map(dbCard => dbCardToUiCard(dbCard));
      addCards(uiCards);
      setIsLoadingExistingCards(false);
    } else if (!isLoadingCards && existingCardsData?.cards) {
      setIsLoadingExistingCards(false);
    }
  }, [existingCardsData, isLoadingCards, addCards, cards.length]);

  // Mutation to create a card in the database
  const createCardMutation = api.inboxCards.createCard.useMutation();

  const syncGmailMutation = api.inbox.syncGmail.useMutation({
    onMutate: () => startSync(),
    onSuccess: async (newCards) => {
      console.log(`[Inbox Page] Gmail sync returned ${newCards.length} new cards, persisting to database...`);
      
      // Persist each new card to the database
      const persistedCards: InboxCardType[] = [];
      for (const card of newCards) {
        try {
          // Check if card already exists (avoid duplicates)
          const existingCard = cards.find(existingCard => 
            existingCard.sourceType === 'email' && 
            (existingCard.sourceDetails as any).emailId === (card.sourceDetails as any).emailId
          );
          
          if (!existingCard) {
            console.log(`[Inbox Page] Persisting new card: ${card.title}`);
                         const result = await createCardMutation.mutateAsync({
               cardId: card.id,
               icon: card.icon,
               title: card.title,
               subtitle: card.subtitle,
               confidence: card.confidence,
               status: card.status,
               blocked: card.blocked,
               timestamp: card.timestamp,
               snoozedTime: card.snoozedTime || undefined,
               isAiSuggestionPending: card.isAiSuggestionPending || false,
               requiresAction: card.requiresAction || false,
               suggestedActionLabel: card.suggestedActionLabel || undefined,
               amount: card.amount || undefined,
               currency: card.currency || undefined,
               fromEntity: card.from || undefined,
               toEntity: card.to || undefined,
               logId: card.logId,
               rationale: card.rationale,
               codeHash: card.codeHash,
               chainOfThought: card.chainOfThought,
               impact: card.impact,
               parsedInvoiceData: card.parsedInvoiceData || undefined,
               sourceDetails: card.sourceDetails,
               comments: card.comments || [],
               suggestedUpdate: card.suggestedUpdate || undefined,
               metadata: card.metadata || undefined,
               sourceType: card.sourceType,
             });
            
            if (result.success) {
              persistedCards.push(card);
            }
          } else {
            console.log(`[Inbox Page] Skipping duplicate card: ${card.title}`);
          }
        } catch (error) {
          console.error(`[Inbox Page] Failed to persist card ${card.title}:`, error);
        }
      }
      
      // Only add successfully persisted cards to the store
      syncSuccess(persistedCards);
    },
    onError: (error) => {
      const err = new Error(error.message || 'Unknown tRPC error during Gmail sync');
      syncError(err);
    },
  });

  const handleSyncGmail = () => {
    const dateQuery = selectedDateRange ? `newer_than:${selectedDateRange}` : undefined;
    syncGmailMutation.mutate({ count: 50, dateQuery });
  };

  const handleCardSelectForChat = (card: InboxCardType) => {
    setSelectedCardForChat(card);
  };

  let chatInputEmailData: SimplifiedEmailForChat | undefined = undefined;
  if (selectedCardForChat && (selectedCardForChat as any).sourceType === 'email') {
    const details = (selectedCardForChat as any).sourceDetails as any; 
    let bodyContent: string | undefined | null = undefined;
    if (details.textBody) {
        bodyContent = details.textBody;
    } else if (details.htmlBody) {
        bodyContent = details.htmlBody;
    } else if (details.rawBody && typeof details.rawBody === 'string' && details.rawBody.length < 200000) {
        try {
            bodyContent = "Raw email body is present but client-side decoding is disabled. Please use processed text/html body.";
        } catch (e) {
            console.error("Error decoding rawBody on client:", e);
            bodyContent = "Error decoding email body.";
        }
    } else {
        bodyContent = "Email body not available for chat.";
    }

    chatInputEmailData = {
      emailId: details.emailId,
      subject: details.subject,
      body: bodyContent,
    };
  }

  return (
    <div className="flex flex-row h-full w-full">
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Inbox</h1>
            <div className="flex items-center space-x-2">
              {gmailConnection?.isConnected && (
                <Select 
                  value={selectedDateRange === '' ? ALL_TIME_VALUE_IDENTIFIER : selectedDateRange} 
                  onValueChange={(value) => {
                    if (value === ALL_TIME_VALUE_IDENTIFIER) {
                      setSelectedDateRange('');
                    } else {
                      setSelectedDateRange(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {gmailConnection?.isConnected ? (
                <>
                  <Button 
                    onClick={handleSyncGmail} 
                    disabled={emailProcessingStatus === 'loading' || syncGmailMutation.isPending}
                  >
                    {emailProcessingStatus === 'loading' || syncGmailMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...</>
                    ) : (
                      <><Mail className="mr-2 h-4 w-4" /> Sync Gmail</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => disconnectGmailMutation.mutate()}
                    disabled={disconnectGmailMutation.isPending}
                  >
                    {disconnectGmailMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Disconnecting...</>
                    ) : (
                      'Disconnect Gmail'
                    )}
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline">
                  <a href="/api/auth/gmail/connect" target="_blank">
                    <Mail className="mr-2 h-4 w-4" />
                    Connect Gmail
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          {/* Gmail Connection Status Alert */}
          {!isCheckingConnection && !gmailConnection?.isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Gmail is not connected. Connect your Gmail account to sync and process emails automatically.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Gmail Connected Status */}
          {gmailConnection?.isConnected && (
            <Alert className="border-green-200 bg-green-50">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Gmail is connected and ready to sync emails.
              </AlertDescription>
            </Alert>
          )}
          
          {emailProcessingStatus === 'error' && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error: {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
        {isLoadingExistingCards ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading inbox cards...</span>
            </div>
          </div>
        ) : (
          <InboxContent onCardClickForChat={handleCardSelectForChat} />
        )} 
      </div>

      <div className="hidden md:flex md:w-[400px] lg:w-[450px] xl:w-[500px] h-full flex-col">
        <InboxChat 
            selectedEmailData={chatInputEmailData} 
            key={selectedCardForChat?.id || 'no-card-selected'}
        />
      </div>
    </div>
  );
} 