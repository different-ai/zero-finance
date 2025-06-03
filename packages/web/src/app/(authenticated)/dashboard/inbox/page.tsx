'use client';

import { Button } from '@/components/ui/button';
import { InboxContent } from '@/components/inbox-content';
import { InboxChat } from '@/components/inbox-chat';
import { useGmailSyncOrchestrator, useInboxStore } from '@/lib/store';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { InboxCard as InboxCardType, SimplifiedEmailForChat } from '@/types/inbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function InboxPage() {
  const { startSync, syncSuccess, syncError, emailProcessingStatus, errorMessage } = useGmailSyncOrchestrator();
  const cards = useInboxStore(state => state.cards);
  
  const [selectedCardForChat, setSelectedCardForChat] = useState<InboxCardType | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7d');

  const ALL_TIME_VALUE_IDENTIFIER = 'all_time_identifier';

  const dateRangeOptions = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 14 Days", value: "14d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "All Time", value: ALL_TIME_VALUE_IDENTIFIER },
  ];

  const syncGmailMutation = api.inbox.syncGmail.useMutation({
    onMutate: () => startSync(),
    onSuccess: (newCards) => syncSuccess(newCards),
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
              <Button asChild variant="outline">
                <a href="/api/auth/gmail/connect" target="_blank">Connect Gmail (OAuth)</a>
              </Button>
            </div>
          </div>
          {emailProcessingStatus === 'error' && errorMessage && (
            <p className="text-sm text-destructive">Error: {errorMessage}</p>
          )}
        </div>
        <InboxContent onCardClickForChat={handleCardSelectForChat} /> 
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