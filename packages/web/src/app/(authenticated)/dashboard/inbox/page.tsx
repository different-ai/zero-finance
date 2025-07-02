'use client';

import { Button } from '@/components/ui/button';
import { InboxContent } from '@/components/inbox-content';
import { InboxChat } from '@/components/inbox-chat';
import { useInboxStore } from '@/lib/store';
import { api } from '@/trpc/react';
import { Loader2, Mail, AlertCircle, CheckCircle, X, Sparkles, TrendingUp, Activity, Filter, Search, Settings2, ChevronDown, MessageSquare, Settings, Download } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { GmailNotConnectedEmptyState, NoCardsEmptyState, AIProcessingDisabledEmptyState } from '@/components/inbox/empty-states';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export default function InboxPage() {
  const { cards, addCards, setCards } = useInboxStore();
  const router = useRouter();
  
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

  const { data: processingStatus } = api.inbox.getGmailProcessingStatus.useQuery();

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

  const exportCsvMutation = api.inbox.exportCsv.useMutation({
    onSuccess: (data) => {
      // Import the CSV utility functions
      import('@/lib/utils/csv').then(({ downloadCSV, generateInboxExportFilename }) => {
        downloadCSV(data.csvContent, generateInboxExportFilename());
      });
    },
    onError: (error) => {
      console.error('Error exporting CSV:', error);
      // You could show a toast notification here
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

  const handleExportCSV = () => {
    // Get current filter state based on active tab
    // For 'history' tab, we don't pass a status filter to exclude pending cards
    // The backend will return all non-pending cards when status is undefined
    const statusFilter = activeTab === 'pending' ? 'pending' : undefined;
    
    exportCsvMutation.mutate({
      status: statusFilter,
      searchQuery: searchQuery || undefined,
    });
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

  useEffect(() => {
    // Auto-continue sync jobs that are marked PENDING (only in current session)
    if (
      syncStatus === 'syncing' &&
      jobStatusData?.job?.status === 'PENDING' &&
      syncJobId &&
      !continueSyncMutation.isPending
    ) {
      continueSyncMutation.mutate({ jobId: syncJobId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncStatus, jobStatusData, syncJobId, continueSyncMutation.isPending]);

  // Auto-sync periodically when auto-processing is enabled
  useEffect(() => {
    if (!processingStatus?.isEnabled || !gmailConnection?.isConnected) {
      return;
    }

    // Check if we should auto-sync (every 5 minutes)
    const checkAutoSync = () => {
      const lastSync = processingStatus.lastSyncedAt ? new Date(processingStatus.lastSyncedAt) : null;
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      // If we haven't synced in the last 5 minutes and no sync is running
      if ((!lastSync || lastSync < fiveMinutesAgo) && syncStatus === 'idle') {
        console.log('[Inbox] Auto-sync triggered');
        syncGmailMutation.mutate({ count: 100 });
      }
    };

    // Check immediately
    checkAutoSync();

    // Then check every minute
    const interval = setInterval(checkAutoSync, 60000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processingStatus?.isEnabled, processingStatus?.lastSyncedAt, gmailConnection?.isConnected, syncStatus]);

  return (
    <div className="flex flex-row h-full w-full bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-auto md:overflow-hidden">
        {/* Ultra-modern sticky header */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200/50 dark:border-neutral-800/50">
          <div className="relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse" />
            
            <div className="relative px-4 py-3 md:px-8 md:py-6 space-y-3 md:space-y-4">
              {/* Header top row */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left side - Title and metrics */}
                <div className="space-y-3 flex-shrink-0">
                  <div className="flex flex-wrap items-baseline gap-3 sm:gap-6">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                      Inbox
                    </h1>
                    
                    {/* Live stats badges */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {pendingCount > 0 && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
                          <Badge className="relative bg-primary/10 text-primary border-primary/20 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm">
                            <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary"></span>
                              </span>
                              {pendingCount} <span className="hidden sm:inline">pending</span>
                            </span>
                          </Badge>
                        </motion.div>
                      )}
                      
                      <Badge variant="outline" className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/50 dark:bg-neutral-800/50 text-xs sm:text-sm">
                        <Activity className="h-3 w-3 mr-1 sm:mr-1.5" />
                        {executedToday} <span className="hidden sm:inline">today</span>
                      </Badge>
                      
                      <Badge variant="outline" className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/50 dark:bg-neutral-800/50 text-xs sm:text-sm">
                        <TrendingUp className="h-3 w-3 mr-1 sm:mr-1.5" />
                        {totalProcessed} <span className="hidden sm:inline">total</span>
                      </Badge>
                    </div>

                    {/* Live sparkline */}
                    <div className="hidden sm:flex items-center gap-2">
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
              </div>
              
              {/* Second row - Actions */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {/* Search bar */}
  
                
                {/* Group by dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 gap-2 bg-white/50 dark:bg-neutral-800/50 text-sm">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Group by</span>
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
                
                {/* Gmail sync controls - show skeleton while loading */}
                {isCheckingConnection ? (
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse" />
                    <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse" />
                  </div>
                ) : gmailConnection?.isConnected && processingStatus?.isEnabled ? (
                  <>
                    {/* Show auto-processing status */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="h-10 px-3 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            AI Processing Active
                          </span>
                        </div>
                      </Badge>
                      {syncStatus === 'syncing' && (
                        <Badge variant="outline" className="h-10 px-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Syncing...
                            </span>
                          </div>
                        </Badge>
                      )}
                      {processingStatus.lastSyncedAt && syncStatus !== 'syncing' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="h-10 px-2 text-xs">
                                Last: {new Date(processingStatus.lastSyncedAt).toLocaleTimeString()}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Last synced at {new Date(processingStatus.lastSyncedAt).toLocaleString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {syncStatus === 'syncing' && syncJobId && (
                        <Button 
                          onClick={handleCancelSync}
                          disabled={cancelSyncMutation.isPending}
                          variant="destructive"
                          className="h-10 gap-2 text-sm px-3"
                        >
                          {cancelSyncMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline">Cancel</span>
                        </Button>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-10 w-10 bg-white/50 dark:bg-neutral-800/50"
                              onClick={() => router.push('/dashboard/settings/integrations')}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Manage Keywords & Settings</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </>
                ) : gmailConnection?.isConnected && !processingStatus?.isEnabled ? (
                  <>
                    {/* AI Processing is disabled - show enable button */}
                    <Button 
                      className="h-10 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25"
                      onClick={() => router.push('/dashboard/settings/integrations')}
                    >
                      <Sparkles className="h-4 w-4" />
                      Enable AI Processing
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-10 w-10 bg-white/50 dark:bg-neutral-800/50"
                            onClick={() => router.push('/dashboard/settings/integrations')}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Manage Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                ) : (
                  <>
                    {/* Gmail not connected */}
                    <Button asChild className="h-10 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25">
                      <a href="/api/auth/gmail/connect" target="_blank" rel="noopener noreferrer">
                        <Mail className="h-4 w-4" />
                        Connect Gmail
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-10 gap-2 bg-white/50 dark:bg-neutral-800/50"
                      onClick={() => router.push('/dashboard/settings/integrations')}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Manage Integrations</span>
                    </Button>
                  </>
                )}
                
                {/* Right-aligned actions - push to the right on desktop */}
                <div className="flex gap-2 sm:ml-auto">
                  {/* Export CSV Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-10 w-10 bg-white/50 dark:bg-neutral-800/50"
                          onClick={handleExportCSV}
                          disabled={exportCsvMutation.isPending}
                        >
                          {exportCsvMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export to CSV</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800 dark:text-amber-200">
                            Gmail is not connected. Connect your Gmail account to use the AI-powered inbox.
                          </AlertDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                          onClick={() => router.push('/dashboard/settings/integrations')}
                        >
                          Go to Settings
                        </Button>
                      </div>
                    </Alert>
                  </motion.div>
                )}
                
                {!isCheckingConnection && gmailConnection?.isConnected && !processingStatus?.isEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800 dark:text-amber-200">
                            AI Processing is disabled. Enable it to automatically process invoices and receipts from your emails.
                          </AlertDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                          onClick={() => router.push('/dashboard/settings/integrations')}
                        >
                          Enable AI Processing
                        </Button>
                      </div>
                    </Alert>
                  </motion.div>
                )}
                
                {(syncStatus !== 'idle' && syncMessage) || (incompleteSyncJobId && syncStatus === 'idle') ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert 
                      variant={syncStatus === 'error' ? 'destructive' : 'default'} 
                      className={cn(
                        syncStatus === 'success' && "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800",
                        syncStatus === 'syncing' && "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800",
                        incompleteSyncJobId && syncStatus === 'idle' && "border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800"
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {syncStatus === 'syncing' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                          {syncStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {syncStatus === 'error' && <AlertCircle className="h-4 w-4" />}
                          {incompleteSyncJobId && syncStatus === 'idle' && <AlertCircle className="h-4 w-4 text-amber-600" />}
                          <AlertDescription className={cn(
                            syncStatus === 'success' && "text-green-800 dark:text-green-200",
                            syncStatus === 'syncing' && "text-blue-800 dark:text-blue-200",
                            incompleteSyncJobId && syncStatus === 'idle' && "text-amber-800 dark:text-amber-200"
                          )}>
                            {syncMessage || (incompleteSyncJobId && syncStatus === 'idle' && 'You have an incomplete sync from a previous session. Click "Resume Sync" to continue.')}
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
                            <Progress value={0} className="h-1" />
                          </div>
                        )}
                      </div>
                    </Alert>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content tabs with glass morphism */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          <div className="px-8 pt-4 pb-2">
            <TabsList className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 overflow-x-auto whitespace-nowrap">
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
          
          <TabsContent value="pending" className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0 overflow-auto">
            {isLoadingExistingCards || isCheckingConnection ? (
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
            ) : !gmailConnection?.isConnected ? (
              <GmailNotConnectedEmptyState 
                onConnectGmail={() => window.open('/api/auth/gmail/connect', '_blank')}
              />
            ) : !processingStatus?.isEnabled ? (
              <AIProcessingDisabledEmptyState 
                onEnableProcessing={() => router.push('/dashboard/settings/integrations')}
              />
            ) : pendingCards.length === 0 ? (
              <NoCardsEmptyState 
                onGoToSettings={() => router.push('/dashboard/settings/integrations')}
                processingEnabled={processingStatus?.isEnabled}
                lastSyncedAt={processingStatus?.lastSyncedAt ? new Date(processingStatus.lastSyncedAt) : null}
              />
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
          
          <TabsContent value="history" className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0 overflow-auto">
            {isLoadingExistingCards || isCheckingConnection ? (
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
            ) : !gmailConnection?.isConnected ? (
              <GmailNotConnectedEmptyState 
                onConnectGmail={() => window.open('/api/auth/gmail/connect', '_blank')}
              />
            ) : !processingStatus?.isEnabled ? (
              <AIProcessingDisabledEmptyState 
                onEnableProcessing={() => router.push('/dashboard/settings/integrations')}
              />
            ) : cards.filter(c => !['pending'].includes(c.status)).length === 0 ? (
              <NoCardsEmptyState 
                onGoToSettings={() => router.push('/dashboard/settings/integrations')}
                processingEnabled={processingStatus?.isEnabled}
                lastSyncedAt={processingStatus?.lastSyncedAt ? new Date(processingStatus.lastSyncedAt) : null}
              />
            ) : (
              <div className="h-full overflow-auto">
                <InboxHistoryList 
                  cards={cards.filter(c => !['pending'].includes(c.status))} 
                  onCardClick={handleCardSelectForChat} 
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="logs" className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0 overflow-auto">
            <div className="h-full overflow-auto">
              <ActionLogsDisplay />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Floating multi-select action bar */}
        <MultiSelectActionBar />
      </div>


    </div>
  );
} 