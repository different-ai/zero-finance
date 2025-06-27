'use client';

import { Button } from '@/components/ui/button';
import { InboxContent } from '@/components/inbox-content';
import { InboxChat } from '@/components/inbox-chat';
import { useInboxStore } from '@/lib/store';
import { api } from '@/trpc/react';
import { Loader2, Mail, AlertCircle, CheckCircle, X, Sparkles, TrendingUp, Activity, Filter, Search, Settings2, ChevronDown, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { InboxCard as InboxCardType } from '@/types/inbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { dbCardToUiCard } from '@/lib/inbox-card-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionLogsDisplay } from '@/components/action-logs-display';
import { MultiSelectActionBar } from '@/components/multi-select-action-bar';
import { MiniSparkline } from '@/components/mini-sparkline';
import { InsightsBanner } from '@/components/insights-banner';
import { InboxCardSkeleton } from '@/components/inbox-card-skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { InboxPendingList } from '@/components/inbox-pending-list';
import { InboxHistoryList } from '@/components/inbox-history-list';
import { ClassificationSettings } from '@/components/inbox/classification-settings';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export default function InboxPage() {
  const { cards, addCards, setCards } = useInboxStore();
  
  const [selectedCardForChat, setSelectedCardForChat] = useState<InboxCardType | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7d');
  const [isLoadingExistingCards, setIsLoadingExistingCards] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [groupBy, setGroupBy] = useState<'none' | 'vendor' | 'amount' | 'frequency'>('none');
  const [isChatVisible, setIsChatVisible] = useState(true);
  
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

  // Get real activity stats from the data
  const { data: stats } = api.inboxCards.getStats.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Track user-initiated sync jobs in this browser session
  const USER_INITIATED_SYNC_KEY = 'zero-finance-active-sync';

  // If a sync from a previous session is still incomplete, we'll store the job id here
  const [incompleteSyncJobId, setIncompleteSyncJobId] = useState<string | null>(null);

  // Decide whether to resume tracking a sync based on session-storage info.
  useEffect(() => {
    if (!latestJobData?.job) {
      setIncompleteSyncJobId(null);
      return;
    }

    const job = latestJobData.job;
    const isActive = job.status === 'PENDING' || job.status === 'RUNNING';
    if (!isActive) {
      setIncompleteSyncJobId(null);
      return;
    }

    const storedId = typeof window !== 'undefined' ? sessionStorage.getItem(USER_INITIATED_SYNC_KEY) : null;

    if (storedId && storedId === job.id) {
      // This sync was started by the user in the current session – resume tracking only, do NOT auto-start.
      setSyncJobId(job.id);
      if (syncStatus !== 'syncing') setSyncStatus('syncing');
      if (job.startedAt) {
        setSyncMessage(`Sync in progress (started at ${new Date(job.startedAt).toLocaleTimeString()})...`);
      } else {
        setSyncMessage(`Sync is pending...`);
      }
    } else {
      // An active sync exists from a previous session.
      setIncompleteSyncJobId(job.id);
    }
  }, [latestJobData, syncStatus]);

  const { data: jobStatusData } = api.inbox.getSyncJobStatus.useQuery(
    { jobId: syncJobId! },
    {
      enabled: !!syncJobId && (syncStatus === 'syncing'),
      refetchInterval: 1000,
    }
  );

  useEffect(() => {
    if (jobStatusData?.job) {
      const { status, error, cardsAdded, processedCount, currentAction } = jobStatusData.job;
      
      // Refetch cards whenever new cards are added during sync
      if (status === 'RUNNING' || status === 'PENDING') {
        if (cardsAdded && cardsAdded > 0) {
          refetchCards(); // Update UI with new cards in real-time
        }
      }
      
      if (status === 'COMPLETED') {
        setSyncStatus('success');
        setSyncMessage(`Sync completed successfully. ${cardsAdded} new items processed.`);
        setSyncJobId(null);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(USER_INITIATED_SYNC_KEY);
        }
        refetchCards();
        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setSyncStatus('idle');
          setSyncMessage('');
        }, 5000);
      } else if (status === 'FAILED') {
        setSyncStatus('error');
        setSyncMessage(`Sync failed: ${error || 'An unknown error occurred.'}`);
        setSyncJobId(null);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(USER_INITIATED_SYNC_KEY);
        }
      } else if (status === 'RUNNING' || status === 'PENDING') {
        // Show current action if available, otherwise show progress counts
        if (currentAction) {
          setSyncMessage(currentAction);
        } else if (processedCount) {
          setSyncMessage(`Syncing... ${processedCount} emails processed, ${cardsAdded || 0} cards added.`);
        }
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
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(USER_INITIATED_SYNC_KEY, data.jobId);
      }
    },
    onError: (error) => {
      setSyncStatus('error');
      setSyncMessage(error.message || 'Failed to start sync job.');
    },
  });

  const cancelSyncMutation = api.inbox.cancelSync.useMutation({
    onSuccess: () => {
      setSyncStatus('idle');
      setSyncMessage('');
      setSyncJobId(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(USER_INITIATED_SYNC_KEY);
      }
      refetchCards();
    },
    onError: (error) => {
      setSyncStatus('error');
      setSyncMessage(error.message || 'Failed to cancel sync job.');
    },
  });

  const continueSyncMutation = api.inbox.continueSyncJob.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        if (data.status === 'completed') {
          // Sync is done, no need to continue
          setSyncStatus('success');
          setSyncMessage(`Sync completed! ${data.processed} emails processed.`);
          setSyncJobId(null);
          refetchCards();
          setTimeout(() => {
            setSyncStatus('idle');
            setSyncMessage('');
          }, 5000);
        } else {
          // More to process, update message
          setSyncMessage(`Processing... ${data.processed} emails processed so far.`);
          refetchCards();
        }
      }
    },
    onError: (error) => {
      console.error('Error continuing sync:', error);
      // Don't show error to user, just stop auto-continuation
    },
  });

  const handleSyncGmail = () => {
    const dateQuery = selectedDateRange && selectedDateRange !== 'all_time_identifier' ? `newer_than:${selectedDateRange}` : undefined;
    syncGmailMutation.mutate({ count: 100, dateQuery });
  };

  const handleCancelSync = () => {
    if (syncJobId) {
      cancelSyncMutation.mutate({ jobId: syncJobId });
    }
  };

  const handleResumeSync = () => {
    if (incompleteSyncJobId) {
      setSyncJobId(incompleteSyncJobId);
      setSyncStatus('syncing');
      setSyncMessage('Resuming previous sync...');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(USER_INITIATED_SYNC_KEY, incompleteSyncJobId);
      }
      // Attempt to continue the job immediately
      continueSyncMutation.mutate({ jobId: incompleteSyncJobId });
    }
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

  // Refetch cards when tab changes to ensure UI stays in sync
  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'history' || activeTab === 'logs') {
      refetchCards();
    }
  }, [activeTab, refetchCards]);

  // Calculate real stats from actual data
  const pendingCards = cards.filter(card => card.status === 'pending');
  const pendingCount = pendingCards.length;
  const executedToday = cards.filter(card => 
    card.status === 'executed' && 
    card.timestamp && 
    new Date(card.timestamp).toDateString() === new Date().toDateString()
  ).length;
  
  // Calculate real trend data from the last 7 days
  const getTrendData = () => {
    const now = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const count = cards.filter(card => 
        card.timestamp && 
        new Date(card.timestamp).toDateString() === date.toDateString()
      ).length;
      data.push(count);
    }
    return data;
  };
  
  const trendData = getTrendData();
  const totalProcessed = cards.filter(card => card.status === 'executed').length;
  const avgConfidence = cards.length ? Math.round(cards.reduce((a, c) => a + (c.confidence || 0), 0) / cards.length) : 0;

  // Filter cards based on search
  const filteredCards = cards.filter(card => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(query) ||
      card.subtitle.toLowerCase().includes(query) ||
      card.sourceDetails.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-row h-full w-full bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Ultra-modern sticky header */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200/50 dark:border-neutral-800/50">
          <div className="relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse" />
            
            <div className="relative px-4 md:px-8 py-6 space-y-4">
              {/* Header top row */}
              <div className="flex items-start justify-between">
                {/* Left side - Title and metrics */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                      Inbox
                    </h1>
                    
                    {/* Live stats badges */}
                    <div className="flex items-center gap-3">
                      {pendingCount > 0 && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
                          <Badge className="relative bg-primary/10 text-primary border-primary/20 px-3 py-1">
                            <span className="relative z-10 flex items-center gap-1.5">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                              </span>
                              {pendingCount} pending
                            </span>
                          </Badge>
                        </motion.div>
                      )}
                      
                      <Badge variant="outline" className="px-3 py-1 bg-white/50 dark:bg-neutral-800/50">
                        <Activity className="h-3 w-3 mr-1.5" />
                        {executedToday} today
                      </Badge>
                      
                      <Badge variant="outline" className="px-3 py-1 bg-white/50 dark:bg-neutral-800/50">
                        <TrendingUp className="h-3 w-3 mr-1.5" />
                        {totalProcessed} total
                      </Badge>
                    </div>

                    {/* Live sparkline */}
                    <div className="flex items-center gap-2">
                      <MiniSparkline data={trendData} width={80} height={24} />
                      <span className="text-xs text-muted-foreground">7-day activity</span>
                    </div>
                  </div>
                  
                  {/* AI insights with animation */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <InsightsBanner />
                  </motion.div>
                </div>
                
                {/* Right side - Actions */}
                <div className="flex items-start gap-3">
                  {/* Search bar */}
             
                  
                  {/* Group by dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-10 gap-2 bg-white/50 dark:bg-neutral-800/50">
                        <Filter className="h-4 w-4" />
                        Group by
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Group items by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setGroupBy('none')}>
                        None {groupBy === 'none' && '✓'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupBy('vendor')}>
                        Vendor {groupBy === 'vendor' && '✓'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupBy('amount')}>
                        Amount {groupBy === 'amount' && '✓'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupBy('frequency')}>
                        Frequency {groupBy === 'frequency' && '✓'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {gmailConnection?.isConnected && (
                    <Select 
                      value={selectedDateRange === '' || selectedDateRange === ALL_TIME_VALUE_IDENTIFIER ? ALL_TIME_VALUE_IDENTIFIER : selectedDateRange} 
                      onValueChange={(value) => {
                        setSelectedDateRange(value === ALL_TIME_VALUE_IDENTIFIER ? '' : value);
                      }}
                    >
                      <SelectTrigger className="w-[160px] h-10 bg-white/50 dark:bg-neutral-800/50">
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
                        className="h-10 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25"
                      >
                        {syncStatus === 'syncing' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4" />
                            <span>Sync Gmail</span>
                          </>
                        )}
                      </Button>
                      {incompleteSyncJobId && syncStatus === 'idle' && (
                        <Button 
                          onClick={handleResumeSync}
                          variant="outline"
                          className="h-10 gap-2"
                        >
                          <ChevronDown className="h-4 w-4" />
                          <span>Resume Sync</span>
                        </Button>
                      )}
                      {syncStatus === 'syncing' && syncJobId && (
                        <>
                          <Button 
                            onClick={handleCancelSync}
                            disabled={cancelSyncMutation.isPending}
                            variant="destructive"
                            className="h-10 gap-2"
                          >
                            {cancelSyncMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                            <span>Cancel</span>
                          </Button>
                        </>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-10 w-10 bg-white/50 dark:bg-neutral-800/50"
                              onClick={() => disconnectGmailMutation.mutate()}
                              disabled={disconnectGmailMutation.isPending}
                            >
                              {disconnectGmailMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Disconnect Gmail</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  ) : (
                    <Button asChild className="h-10 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25">
                      <a href="/api/auth/gmail/connect" target="_blank" rel="noopener noreferrer">
                        <Mail className="h-4 w-4" />
                        Connect Gmail
                      </a>
                    </Button>
                  )}
                  
                  {/* Classification Settings */}
                  <ClassificationSettings className="h-10" />
                </div>
              </div>
              
              {/* Status alerts with animation */}
              <AnimatePresence>
                {!isCheckingConnection && !gmailConnection?.isConnected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 dark:text-amber-200">
                        Gmail is not connected. Connect your Gmail account to sync and process emails automatically.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                {syncStatus !== 'idle' && syncMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert 
                      variant={syncStatus === 'error' ? 'destructive' : 'default'} 
                      className={cn(
                        syncStatus === 'success' && "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800",
                        syncStatus === 'syncing' && "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800"
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {syncStatus === 'syncing' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                          {syncStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {syncStatus === 'error' && <AlertCircle className="h-4 w-4" />}
                          <AlertDescription className={cn(
                            syncStatus === 'success' && "text-green-800 dark:text-green-200",
                            syncStatus === 'syncing' && "text-blue-800 dark:text-blue-200"
                          )}>
                            {syncMessage}
                          </AlertDescription>
                        </div>
                        {syncStatus === 'syncing' && jobStatusData?.job && (
                          <div className="space-y-1">
                            {jobStatusData.job.processedCount > 0 && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Emails: {jobStatusData.job.processedCount || 0}</span>
                                <span>•</span>
                                <span>Cards created: {jobStatusData.job.cardsAdded || 0}</span>
                              </div>
                            )}
                            {/* Show a simple progress indicator */}
                            <Progress value={0} className="h-1" indeterminate />
                          </div>
                        )}
                      </div>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content tabs with glass morphism */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          <div className="px-4 md:px-8 pt-4 pb-2">
            <TabsList className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50">
              <TabsTrigger value="pending" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800">
                <span className="flex items-center gap-2">
                  Pending
                  {pendingCount > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800">
                History
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800">
                Action Logs
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pending" className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0 overflow-hidden">
            {isLoadingExistingCards ? (
              <div className="space-y-3 py-4">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <InboxCardSkeleton />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <InboxPendingList 
                  cards={pendingCards} 
                  onCardClick={handleCardSelectForChat}
                  groupBy={groupBy}
                />
              </div>
            )} 
          </TabsContent>
          
          <TabsContent value="history" className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0 overflow-hidden">
            <div className="h-full overflow-auto">
              <InboxHistoryList 
                cards={cards.filter(c => !['pending'].includes(c.status))} 
                onCardClick={handleCardSelectForChat} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0 overflow-hidden">
            <div className="h-full overflow-auto">
              <ActionLogsDisplay />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Floating multi-select action bar */}
        <MultiSelectActionBar />
      </div>

      {/* AI Assistant sidebar - clean and hideable */}
      <AnimatePresence>
        {isChatVisible && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden md:flex md:w-[400px] lg:w-[450px] xl:w-[500px] h-full flex-col border-l border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900"
          >
            <InboxChat 
              key={selectedCardForChat?.id || 'no-card-selected'}
              onCardsUpdated={refetchCards}
              onClose={() => setIsChatVisible(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 