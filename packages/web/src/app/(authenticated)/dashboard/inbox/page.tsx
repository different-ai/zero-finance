'use client';

import { Button } from '@/components/ui/button';
import { InboxContent } from '@/components/inbox-content';
import { InboxChat } from '@/components/inbox-chat';
import { useInboxStore } from '@/lib/store';
import { api } from '@/trpc/react';
import { Loader2, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { InboxCard as InboxCardType } from '@/types/inbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { dbCardToUiCard } from '@/lib/inbox-card-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionLogsDisplay } from '@/components/action-logs-display';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export default function InboxPage() {
  const { cards, addCards, setCards } = useInboxStore();
  
  const [selectedCardForChat, setSelectedCardForChat] = useState<InboxCardType | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7d');
  const [isLoadingExistingCards, setIsLoadingExistingCards] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("inbox");
  
  const [syncJobId, setSyncJobId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: gmailConnection, isLoading: isCheckingConnection, refetch: refetchConnection } = api.inbox.checkGmailConnection.useQuery();
  const disconnectGmailMutation = api.inbox.disconnectGmail.useMutation({
    onSuccess: () => {
      refetchConnection();
    },
  });

  const { data: existingCardsData, isLoading: isLoadingCards, refetch: refetchCards } = api.inboxCards.getUserCards.useQuery({
    limit: 100,
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });

  const { data: latestJobData } = api.inbox.getLatestSyncJob.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (latestJobData?.job && (latestJobData.job.status === 'PENDING' || latestJobData.job.status === 'RUNNING')) {
      setSyncJobId(latestJobData.job.id);
      setSyncStatus('syncing');
      if (latestJobData.job.startedAt) {
        setSyncMessage(`Sync in progress (started at ${new Date(latestJobData.job.startedAt).toLocaleTimeString()})...`);
      } else {
        setSyncMessage(`Sync is pending...`);
      }
    }
  }, [latestJobData]);

  const { data: jobStatusData } = api.inbox.getSyncJobStatus.useQuery(
    { jobId: syncJobId! },
    {
      enabled: !!syncJobId && (syncStatus === 'syncing'),
      refetchInterval: 2000, // Poll every 2 seconds
    }
  );

  useEffect(() => {
    if (jobStatusData?.job) {
      const { status, error, cardsAdded } = jobStatusData.job;
      if (status === 'COMPLETED') {
        setSyncStatus('success');
        setSyncMessage(`Sync completed successfully. ${cardsAdded} new items processed.`);
        setSyncJobId(null);
        refetchCards();
      } else if (status === 'FAILED') {
        setSyncStatus('error');
        setSyncMessage(`Sync failed: ${error || 'An unknown error occurred.'}`);
        setSyncJobId(null);
      }
    }
  }, [jobStatusData, refetchCards]);


  useEffect(() => {
    if (existingCardsData?.cards && !isLoadingCards) {
      const uiCards = existingCardsData.cards.map(dbCard => dbCardToUiCard(dbCard as any));
      setCards(uiCards);
      setIsLoadingExistingCards(false);
    } else if (!isLoadingCards) {
      setIsLoadingExistingCards(false);
    }
  }, [existingCardsData, isLoadingCards, setCards]);

  const syncGmailMutation = api.inbox.syncGmail.useMutation({
    onMutate: () => {
      setSyncStatus('syncing');
      setSyncMessage('Initiating Gmail sync...');
    },
    onSuccess: (data) => {
      setSyncJobId(data.jobId);
      setSyncMessage('Sync job started. Waiting for progress...');
    },
    onError: (error) => {
      setSyncStatus('error');
      setSyncMessage(error.message || 'Failed to start sync job.');
    },
  });

  const handleSyncGmail = () => {
    const dateQuery = selectedDateRange && selectedDateRange !== 'all_time_identifier' ? `newer_than:${selectedDateRange}` : undefined;
    syncGmailMutation.mutate({ count: 50, dateQuery });
  };

  const handleCardSelectForChat = (card: InboxCardType) => {
    setSelectedCardForChat(card);
  };
  
  const ALL_TIME_VALUE_IDENTIFIER = 'all_time_identifier';

  const dateRangeOptions = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 14 Days", value: "14d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "All Time", value: ALL_TIME_VALUE_IDENTIFIER },
  ];

  let chatInputEmailData: any | undefined = undefined;
  if (selectedCardForChat && selectedCardForChat.sourceType === 'email') {
    const details = selectedCardForChat.sourceDetails as any; 
    let bodyContent: string | undefined | null = undefined;
    if (details.textBody) {
        bodyContent = details.textBody;
    } else if (details.htmlBody) {
        bodyContent = details.htmlBody;
    } else if (details.rawBody && typeof details.rawBody === 'string' && details.rawBody.length < 200000) {
        bodyContent = "Raw email body is present but client-side decoding is disabled. Please use processed text/html body.";
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
                  value={selectedDateRange === '' || selectedDateRange === ALL_TIME_VALUE_IDENTIFIER ? ALL_TIME_VALUE_IDENTIFIER : selectedDateRange} 
                  onValueChange={(value) => {
                    setSelectedDateRange(value === ALL_TIME_VALUE_IDENTIFIER ? '' : value);
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
                    disabled={syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? (
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
                  <a href="/api/auth/gmail/connect" target="_blank" rel="noopener noreferrer">
                    <Mail className="mr-2 h-4 w-4" />
                    Connect Gmail
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          {!isCheckingConnection && !gmailConnection?.isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Gmail is not connected. Connect your Gmail account to sync and process emails automatically.
              </AlertDescription>
            </Alert>
          )}
          
          {syncStatus !== 'idle' && syncMessage && (
            <Alert variant={syncStatus === 'error' ? 'destructive' : syncStatus === 'success' ? 'default' : 'default'} className={syncStatus === 'success' ? "border-green-200 bg-green-50" : ""}>
              {syncStatus === 'syncing' && <Loader2 className="h-4 w-4 animate-spin" />}
              {syncStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {syncStatus === 'error' && <AlertCircle className="h-4 w-4" />}
              <AlertDescription className="ml-2">
                {syncMessage}
              </AlertDescription>
            </Alert>
          )}
          
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
          <TabsList className="mx-4 mt-4 self-start">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="logs">Action Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="inbox" className="flex-grow outline-none ring-0 focus:ring-0">
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
          </TabsContent>
          <TabsContent value="logs" className="flex-grow outline-none ring-0 focus:ring-0">
            <ActionLogsDisplay />
          </TabsContent>
        </Tabs>
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