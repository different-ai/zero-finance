'use client';

import { Button } from '@/components/ui/button';
import { InboxContent } from '@/components/inbox-content';
import { InboxChat } from '@/components/inbox-chat';
import { useInboxStore } from '@/lib/store';
import { api } from '@/trpc/react';
import {
  Loader2,
  Mail,
  AlertCircle,
  CheckCircle,
  X,
  Sparkles,
  TrendingUp,
  Activity,
  Filter,
  Search,
  Settings2,
  ChevronDown,
  MessageSquare,
  Settings,
  Download,
  DollarSign,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { InboxCard as InboxCardType } from '@/types/inbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { dbCardToUiCard } from '@/lib/inbox-card-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardActionsDisplay } from '@/components/card-actions-display';
import { MultiSelectActionBar } from '@/components/multi-select-action-bar';
import { MiniSparkline } from '@/components/mini-sparkline';
import { InsightsBanner } from '@/components/insights-banner';
import { InboxCardSkeleton } from '@/components/inbox-card-skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { InboxPendingList } from '@/components/inbox-pending-list';
import { InboxHistoryList } from '@/components/inbox-history-list';
import { useRouter } from 'next/navigation';
import {
  GmailNotConnectedEmptyState,
  NoCardsEmptyState,
  AIProcessingDisabledEmptyState,
} from '@/components/inbox/empty-states';
import { DocumentDropZone } from '@/components/inbox/document-drop-zone';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export default function InboxPage() {
  const { cards, addCards, setCards } = useInboxStore();
  const router = useRouter();

  const [selectedCardForChat, setSelectedCardForChat] =
    useState<InboxCardType | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7d');
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupBy, setGroupBy] = useState<
    'none' | 'vendor' | 'amount' | 'frequency'
  >('none');
  const [isChatVisible, setIsChatVisible] = useState(true);

  const [syncJobId, setSyncJobId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Combine all initial loading states into one
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    data: gmailConnection,
    isLoading: isCheckingConnection,
    refetch: refetchConnection,
  } = api.inbox.checkGmailConnection.useQuery();

  const processingStatus = api.inbox.getGmailProcessingStatus.useQuery(
    undefined,
    {
      enabled: !!gmailConnection?.isConnected,
    },
  );

  const unpaidSummary = api.inbox.getUnpaidSummary.useQuery(
    {},
    {
      enabled:
        !!gmailConnection?.isConnected && !!processingStatus.data?.isEnabled,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  );

  const {
    data: existingCardsData,
    isLoading: isLoadingCards,
    refetch: refetchCards,
  } = api.inboxCards.getUserCards.useQuery({
    limit: 100,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  const { data: latestJobData } = api.inbox.getLatestSyncJob.useQuery(
    undefined,
    {
      refetchOnWindowFocus: true,
    },
  );

  // Get real activity stats from the data
  const { data: stats } = api.inboxCards.getStats.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Track user-initiated sync jobs in this browser session
  const USER_INITIATED_SYNC_KEY = 'zero-finance-active-sync';

  // If a sync from a previous session is still incomplete, we'll store the job id here
  const [incompleteSyncJobId, setIncompleteSyncJobId] = useState<string | null>(
    null,
  );

  // Wait for all initial data to load before showing UI
  useEffect(() => {
    const allDataLoaded =
      !isCheckingConnection &&
      !isLoadingCards &&
      (gmailConnection?.isConnected
        ? processingStatus.data !== undefined
        : true);

    if (allDataLoaded) {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 100);
    }
  }, [
    isCheckingConnection,
    isLoadingCards,
    gmailConnection?.isConnected,
    processingStatus.data,
  ]);

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

    const storedId =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(USER_INITIATED_SYNC_KEY)
        : null;

    if (storedId && storedId === job.id) {
      // This sync was started by the user in the current session – resume tracking only, do NOT auto-start.
      setSyncJobId(job.id);
      if (syncStatus !== 'syncing') setSyncStatus('syncing');
      if (job.startedAt) {
        setSyncMessage(
          `Sync in progress (started at ${new Date(job.startedAt).toLocaleTimeString()})...`,
        );
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
      enabled: !!syncJobId && syncStatus === 'syncing',
      refetchInterval: 1000,
    },
  );

  useEffect(() => {
    if (jobStatusData?.job) {
      const { status, error, cardsAdded, processedCount, currentAction } =
        jobStatusData.job;

      // Refetch cards whenever new cards are added during sync
      if (status === 'RUNNING' || status === 'PENDING') {
        if (cardsAdded && cardsAdded > 0) {
          refetchCards(); // Update UI with new cards in real-time
        }
      }

      if (status === 'COMPLETED') {
        setSyncStatus('success');
        setSyncMessage(
          `Sync completed successfully. ${cardsAdded} new items processed.`,
        );
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
          setSyncMessage(
            `Syncing... ${processedCount} emails processed, ${cardsAdded || 0} cards added.`,
          );
        }
      }
    }
  }, [jobStatusData, refetchCards]);

  useEffect(() => {
    if (existingCardsData?.cards && !isLoadingCards) {
      const uiCards = existingCardsData.cards.map((dbCard) =>
        dbCardToUiCard(dbCard as any),
      );
      setCards(uiCards);
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
          setSyncMessage(
            `Processing... ${data.processed} emails processed so far.`,
          );
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
      import('@/lib/utils/csv').then(
        ({ downloadCSV, generateInboxExportFilename }) => {
          downloadCSV(data.csvContent, generateInboxExportFilename());
        },
      );
    },
    onError: (error) => {
      console.error('Error exporting CSV:', error);
      // You could show a toast notification here
    },
  });

  const handleSyncGmail = () => {
    const dateQuery =
      selectedDateRange && selectedDateRange !== 'all_time_identifier'
        ? `newer_than:${selectedDateRange}`
        : undefined;
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
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 14 Days', value: '14d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'All Time', value: ALL_TIME_VALUE_IDENTIFIER },
  ];

  let chatInputEmailData: any | undefined = undefined;
  if (selectedCardForChat && selectedCardForChat.sourceType === 'email') {
    const details = selectedCardForChat.sourceDetails as any;
    let bodyContent: string | undefined | null = undefined;
    if (details.textBody) {
      bodyContent = details.textBody;
    } else if (details.htmlBody) {
      bodyContent = details.htmlBody;
    } else if (
      details.rawBody &&
      typeof details.rawBody === 'string' &&
      details.rawBody.length < 200000
    ) {
      bodyContent =
        'Raw email body is present but client-side decoding is disabled. Please use processed text/html body.';
    } else {
      bodyContent = 'Email body not available for chat.';
    }

    chatInputEmailData = {
      emailId: details.emailId,
      subject: details.subject,
      body: bodyContent,
    };
  }

  // Refetch cards when tab changes to ensure UI stays in sync
  useEffect(() => {
    if (
      activeTab === 'pending' ||
      activeTab === 'history' ||
      activeTab === 'logs'
    ) {
      refetchCards();
    }
  }, [activeTab, refetchCards]);

  // Calculate real stats from actual data
  const pendingCards = cards.filter((card) => card.status === 'pending');
  const pendingCount = pendingCards.length;
  const executedToday = cards.filter(
    (card) =>
      card.status === 'executed' &&
      card.timestamp &&
      new Date(card.timestamp).toDateString() === new Date().toDateString(),
  ).length;

  // Calculate real trend data from the last 7 days
  const getTrendData = () => {
    const now = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const count = cards.filter(
        (card) =>
          card.timestamp &&
          new Date(card.timestamp).toDateString() === date.toDateString(),
      ).length;
      data.push(count);
    }
    return data;
  };

  const trendData = getTrendData();
  const totalProcessed = cards.filter(
    (card) => card.status === 'executed',
  ).length;
  const avgConfidence = cards.length
    ? Math.round(
        cards.reduce((a, c) => a + (c.confidence || 0), 0) / cards.length,
      )
    : 0;

  // Filter cards based on search
  const filteredCards = cards.filter((card) => {
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
    if (!processingStatus.data?.isEnabled || !gmailConnection?.isConnected) {
      return;
    }

    // Check if we should auto-sync (every 5 minutes)
    const checkAutoSync = () => {
      const lastSync = processingStatus.data?.lastSyncedAt
        ? new Date(processingStatus.data.lastSyncedAt)
        : null;
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
  }, [
    processingStatus.data?.isEnabled,
    processingStatus.data?.lastSyncedAt,
    gmailConnection?.isConnected,
    syncStatus,
  ]);

  // Show loading skeleton while initial data is loading
  if (isInitialLoading) {
    return (
      <div className="flex flex-row h-full w-full bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
        <div className="flex-1 flex flex-col h-full">
          {/* Header skeleton */}
          <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-neutral-200/50">
            <div className="px-4 py-3 md:px-8 md:py-6 space-y-3 md:space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-3">
                  <div className="h-10 w-32 bg-neutral-200 rounded-md animate-pulse" />
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-24 bg-neutral-200 rounded-md animate-pulse" />
                    <div className="h-6 w-24 bg-neutral-200 rounded-md animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-64 bg-neutral-200 rounded-md animate-pulse" />
                <div className="h-10 w-32 bg-neutral-200 rounded-md animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="flex-1 px-4 md:px-8 py-4">
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <InboxCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                              {pendingCount}{' '}
                              <span className="hidden sm:inline">pending</span>
                            </span>
                          </Badge>
                        </motion.div>
                      )}

                      <Badge
                        variant="outline"
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/50 dark:bg-neutral-800/50 text-xs sm:text-sm"
                      >
                        <Activity className="h-3 w-3 mr-1 sm:mr-1.5" />
                        {executedToday}{' '}
                        <span className="hidden sm:inline">today</span>
                      </Badge>

                      <Badge
                        variant="outline"
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/50 dark:bg-neutral-800/50 text-xs sm:text-sm"
                      >
                        <TrendingUp className="h-3 w-3 mr-1 sm:mr-1.5" />
                        {totalProcessed}{' '}
                        <span className="hidden sm:inline">total</span>
                      </Badge>
                    </div>

                    {/* Live sparkline */}
                    <div className="hidden sm:flex items-center gap-2">
                      <MiniSparkline data={trendData} width={80} height={24} />
                      <span className="text-xs text-muted-foreground">
                        7-day activity
                      </span>
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
                    <Button
                      variant="outline"
                      className="h-10 gap-2 bg-white/50 dark:bg-neutral-800/50 text-sm"
                    >
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

                {/* Gmail sync controls - premium design */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* AI Processing Status */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200/50 dark:border-emerald-800/50">
                          <div className="relative">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          </div>
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 hidden sm:inline">
                            AI Active
                          </span>
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 sm:hidden" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="font-medium mb-1">
                          AI Processing Enabled
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Automatically detecting invoices and receipts
                        </p>
                        {processingStatus.data?.lastSyncedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last sync:{' '}
                            {new Date(
                              processingStatus.data.lastSyncedAt,
                            ).toLocaleTimeString()}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Sync Status or Force Sync Button */}
                  {syncStatus === 'syncing' && syncJobId ? (
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/50">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                              <span className="text-xs font-medium text-blue-700 dark:text-blue-300 hidden sm:inline">
                                Syncing
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="font-medium mb-1">Sync in Progress</p>
                            <p className="text-xs text-muted-foreground">
                              {syncMessage}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        onClick={handleCancelSync}
                        disabled={cancelSyncMutation.isPending}
                        size="sm"
                        variant="ghost"
                        className="h-9 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            onClick={() =>
                              syncGmailMutation.mutate({ count: 100 })
                            }
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span className="ml-2 text-xs font-medium hidden sm:inline">
                              Sync Now
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="font-medium mb-1">Force Sync</p>
                          <p className="text-xs text-muted-foreground">
                            Manually check for new emails
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {/* Settings */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          onClick={() =>
                            router.push('/dashboard/settings/integrations')
                          }
                        >
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="font-medium mb-1">Integration Settings</p>
                        <p className="text-xs text-muted-foreground">
                          Manage keywords, filters, and AI rules
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

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

                {/* Premium status indicators - subtle and sophisticated */}
              </div>
            </div>
          </div>

          {/* Financial Summary Cards */}
          {unpaidSummary.data &&
            (unpaidSummary.data.totalUnpaid > 0 ||
              unpaidSummary.data.totalOverdue > 0) && (
              <div className="px-4 py-3 border-b bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl">
                  {/* Total Unpaid */}
                  <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Unpaid
                        </p>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                          ${unpaidSummary.data.totalUnpaid.toFixed(2)}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                        <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  {/* Overdue */}
                  {unpaidSummary.data.totalOverdue > 0 && (
                    <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-sm border border-red-200 dark:border-red-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Overdue
                          </p>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            ${unpaidSummary.data.totalOverdue.toFixed(2)}
                          </p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Due Soon */}
                  {unpaidSummary.data.dueSoon > 0 && (
                    <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-sm border border-amber-200 dark:border-amber-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Due in 7 days
                          </p>
                          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            ${unpaidSummary.data.dueSoon.toFixed(2)}
                          </p>
                        </div>
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Content tabs with glass morphism */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-grow flex flex-col overflow-hidden"
          >
            <div className="px-8 pt-4 pb-2">
              <TabsList className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 overflow-x-auto whitespace-nowrap">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    Pending
                    {pendingCount > 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800"
                >
                  Card Actions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="pending"
              className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0 overflow-auto"
            >
              {!gmailConnection?.isConnected ? (
                <GmailNotConnectedEmptyState
                  onConnectGmail={() =>
                    window.open('/api/auth/gmail/connect', '_blank')
                  }
                />
              ) : !processingStatus.data?.isEnabled ? (
                <AIProcessingDisabledEmptyState
                  onEnableProcessing={() =>
                    router.push('/dashboard/settings/integrations')
                  }
                />
              ) : (
                <div className="space-y-6">
                  {/* Document Drop Zone */}
                  {/*  limit height too like 100px */}
                  <div className="h-100px">
                    <DocumentDropZone
                      onUploadComplete={() => refetchCards()}
                      className="mb-6"
                    />
                  </div>

                  {/* Pending Cards List */}
                  {pendingCards.length === 0 ? (
                    <NoCardsEmptyState
                      onGoToSettings={() =>
                        router.push('/dashboard/settings/integrations')
                      }
                      processingEnabled={processingStatus.data?.isEnabled}
                      lastSyncedAt={
                        processingStatus.data?.lastSyncedAt
                          ? new Date(processingStatus.data.lastSyncedAt)
                          : null
                      }
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
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="history"
              className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0 overflow-auto"
            >
              {!gmailConnection?.isConnected ? (
                <GmailNotConnectedEmptyState
                  onConnectGmail={() =>
                    window.open('/api/auth/gmail/connect', '_blank')
                  }
                />
              ) : !processingStatus.data?.isEnabled ? (
                <AIProcessingDisabledEmptyState
                  onEnableProcessing={() =>
                    router.push('/dashboard/settings/integrations')
                  }
                />
              ) : cards.filter((c) => !['pending'].includes(c.status))
                  .length === 0 ? (
                <NoCardsEmptyState
                  onGoToSettings={() =>
                    router.push('/dashboard/settings/integrations')
                  }
                  processingEnabled={processingStatus.data?.isEnabled}
                  lastSyncedAt={
                    processingStatus.data?.lastSyncedAt
                      ? new Date(processingStatus.data.lastSyncedAt)
                      : null
                  }
                />
              ) : (
                <div className="h-full overflow-auto">
                  <InboxHistoryList
                    cards={cards.filter((c) =>
                      [
                        'executed',
                        'dismissed',
                        'auto',
                        'seen',
                        'done',
                      ].includes(c.status),
                    )}
                    onCardClick={handleCardSelectForChat}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="logs"
              className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0 overflow-auto"
            >
              <div className="h-full overflow-auto">
                <CardActionsDisplay />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* Floating multi-select action bar */}
        <MultiSelectActionBar />
      </div>
    </div>
  );
}
