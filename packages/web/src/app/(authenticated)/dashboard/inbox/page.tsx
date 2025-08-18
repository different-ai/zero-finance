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
  CheckSquare,
  Square,
  Trash2,
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
import { UnifiedDropzone } from '@/components/inbox/unified-dropzone';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { InboxMock } from '@/components/inbox/inbox-mock';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GmailConnectionBanner,
  AIProcessingBanner,
} from '@/components/inbox/gmail-connection-banner';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export default function InboxPage() {
  const {
    cards,
    setCards,
    selectedCardIds,
    toggleCardSelection,
    clearSelection,
    addToast,
    bulkUpdateCardStatus,
    bulkRemoveCards,
  } = useInboxStore();
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

  // Check if user has access to inbox feature
  const { data: inboxAccess, isLoading: isCheckingAccess } =
    api.userFeatures.hasFeatureAccess.useQuery({
      featureName: 'inbox',
    });

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

  // Track if this is the first visit for a new user
  const [hasTriggeredInitialSync, setHasTriggeredInitialSync] = useState(false);

  // History tab filters
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('all');

  // Multi-select state
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Bulk operation mutations
  const bulkUpdateStatusMutation = api.inboxCards.bulkUpdateStatus.useMutation({
    onMutate: async ({ cardIds, status }) => {
      // Optimistically update the UI
      bulkUpdateCardStatus(cardIds, status);
      return { cardIds, status };
    },
    onSuccess: () => {
      addToast({ message: 'Cards updated successfully', status: 'success' });
      refetchCards();
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error
      if (context) {
        refetchCards(); // Refetch to get correct state
      }
      addToast({
        message: error.message || 'Failed to update cards',
        status: 'error',
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
      addToast({ message: 'Cards deleted successfully', status: 'success' });
      refetchCards();
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error
      if (context) {
        refetchCards(); // Refetch to get correct state
      }
      addToast({
        message: error.message || 'Failed to delete cards',
        status: 'error',
      });
    },
  });

  // Wait for all initial data to load before showing UI
  useEffect(() => {
    const allDataLoaded =
      !isCheckingAccess &&
      !isCheckingConnection &&
      !isLoadingCards &&
      (gmailConnection?.isConnected
        ? !processingStatus.isLoading // Changed from checking data !== undefined
        : true);

    if (allDataLoaded) {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 100);
    }
  }, [
    isCheckingAccess,
    isCheckingConnection,
    isLoadingCards,
    gmailConnection?.isConnected,
    processingStatus.isLoading, // Changed from processingStatus.data
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

  const handleBulkApprove = () => {
    const selectedIds = Array.from(selectedCardIds);
    bulkUpdateStatusMutation.mutate({
      cardIds: selectedIds,
      status: 'seen',
    });
  };

  const handleBulkIgnore = () => {
    const selectedIds = Array.from(selectedCardIds);
    bulkUpdateStatusMutation.mutate({
      cardIds: selectedIds,
      status: 'dismissed',
    });
  };

  const handleBulkDelete = () => {
    if (
      confirm(
        `Are you sure you want to permanently delete ${selectedCardIds.size} cards? This action cannot be undone.`,
      )
    ) {
      const selectedIds = Array.from(selectedCardIds);
      bulkDeleteMutation.mutate({
        cardIds: selectedIds,
      });
    }
  };

  const handleSelectAll = () => {
    // Get filtered cards based on active tab and search query
    let filteredCards: InboxCardType[] = [];

    if (activeTab === 'pending') {
      filteredCards = pendingCards.filter((card) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          card.title.toLowerCase().includes(query) ||
          card.subtitle.toLowerCase().includes(query) ||
          card.from?.toLowerCase().includes(query) ||
          card.to?.toLowerCase().includes(query)
        );
      });
    } else if (activeTab === 'history') {
      filteredCards = cards.filter((c) => {
        // Status filter
        const statusMatch = [
          'executed',
          'dismissed',
          'auto',
          'seen',
          'done',
        ].includes(c.status);
        if (!statusMatch) return false;

        // Specific status filter
        if (historyStatusFilter !== 'all' && c.status !== historyStatusFilter) {
          return false;
        }

        // Search filter
        if (historySearchQuery) {
          const query = historySearchQuery.toLowerCase();
          return (
            c.title.toLowerCase().includes(query) ||
            c.subtitle.toLowerCase().includes(query) ||
            c.from?.toLowerCase().includes(query) ||
            c.to?.toLowerCase().includes(query)
          );
        }

        return true;
      });
    }

    const filteredCardIds = filteredCards.map((c) => c.id);
    const allSelected =
      filteredCardIds.length > 0 &&
      filteredCardIds.every((id) => selectedCardIds.has(id));

    if (allSelected) {
      // Deselect all filtered cards
      filteredCardIds.forEach((id) => {
        if (selectedCardIds.has(id)) {
          toggleCardSelection(id);
        }
      });
    } else {
      // Select all filtered cards
      filteredCardIds.forEach((id) => {
        if (!selectedCardIds.has(id)) {
          toggleCardSelection(id);
        }
      });
    }
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

  // Auto-trigger initial sync for new users
  useEffect(() => {
    // Only run once all initial data has loaded
    if (isInitialLoading) return;

    // Check if user has Gmail connected, AI processing enabled, and no cards yet
    const isNewUser =
      gmailConnection?.isConnected &&
      processingStatus.data?.isEnabled &&
      existingCardsData?.cards?.length === 0 &&
      !latestJobData?.job && // No existing job
      !hasTriggeredInitialSync && // Haven't triggered yet
      syncStatus === 'idle'; // Not currently syncing

    if (isNewUser) {
      console.log('New user detected - triggering initial Gmail sync');
      setHasTriggeredInitialSync(true);

      // Small delay to ensure UI is ready
      setTimeout(() => {
        syncGmailMutation.mutate({
          count: 100,
          dateQuery: 'newer_than:30d', // Start with last 30 days for new users
        });
      }, 500);
    }
  }, [
    isInitialLoading,
    gmailConnection?.isConnected,
    processingStatus.data?.isEnabled,
    existingCardsData?.cards,
    latestJobData?.job,
    hasTriggeredInitialSync,
    syncStatus,
    syncGmailMutation,
  ]);

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

  // Get filtered cards for selection state
  const getFilteredCards = () => {
    if (activeTab === 'pending') {
      return pendingCards.filter((card) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          card.title.toLowerCase().includes(query) ||
          card.subtitle.toLowerCase().includes(query) ||
          card.from?.toLowerCase().includes(query) ||
          card.to?.toLowerCase().includes(query)
        );
      });
    } else if (activeTab === 'history') {
      return cards.filter((c) => {
        const statusMatch = [
          'executed',
          'dismissed',
          'auto',
          'seen',
          'done',
        ].includes(c.status);
        if (!statusMatch) return false;

        if (historyStatusFilter !== 'all' && c.status !== historyStatusFilter) {
          return false;
        }

        if (historySearchQuery) {
          const query = historySearchQuery.toLowerCase();
          return (
            c.title.toLowerCase().includes(query) ||
            c.subtitle.toLowerCase().includes(query) ||
            c.from?.toLowerCase().includes(query) ||
            c.to?.toLowerCase().includes(query)
          );
        }
        return true;
      });
    }
    return [];
  };

  const currentFilteredCards = getFilteredCards();
  const currentFilteredCardIds = currentFilteredCards.map((c) => c.id);
  const allSelected =
    currentFilteredCardIds.length > 0 &&
    currentFilteredCardIds.every((id) => selectedCardIds.has(id));
  const someSelected = currentFilteredCardIds.some((id) =>
    selectedCardIds.has(id),
  );

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
                  <Skeleton variant="text" className="h-10 w-32" />
                  <div className="flex items-center gap-3">
                    <Skeleton variant="text" className="h-6 w-24" />
                    <Skeleton variant="text" className="h-6 w-24" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton variant="button" className="h-10 w-64" />
                <Skeleton variant="button" className="h-10 w-32" />
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content wrapper */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Loading skeleton */}
        {isInitialLoading ? (
          <InboxCardSkeleton />
        ) : (
          <>
            {/* Chat panel */}
            {selectedCardForChat && (
              <InboxChat
                onCardsUpdated={() => refetchCards()}
                onClose={() => setSelectedCardForChat(null)}
              />
            )}
          </>
        )}

        {/* Main content area */}
        <div className="flex flex-col flex-grow">
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
                                <span className="hidden sm:inline">
                                  pending
                                </span>
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
                        <MiniSparkline
                          data={trendData}
                          width={80}
                          height={24}
                        />
                        <span className="text-xs text-muted-foreground">
                          7-day activity
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second row - Actions */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  {/* Gmail sync controls - premium design */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* AI Processing Status - only show if Gmail connected */}
                    {gmailConnection?.isConnected &&
                      processingStatus.data?.isEnabled && (
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
                      )}

                    {/* Sync Status or Force Sync Button - only show if Gmail connected */}
                    {gmailConnection?.isConnected &&
                      (syncStatus === 'syncing' && syncJobId ? (
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
                                <p className="font-medium mb-1">
                                  Sync in Progress
                                </p>
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
                                className="h-9 px-3 text-neutral-900 hover:bg-[#0040ff1a] hover:text-blue-600"
                                onClick={() => {
                                  const dateQuery =
                                    selectedDateRange &&
                                    selectedDateRange !== 'all_time_identifier'
                                      ? `newer_than:${selectedDateRange}`
                                      : undefined;
                                  syncGmailMutation.mutate({
                                    count: 100,
                                    dateQuery,
                                  });
                                }}
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
                      ))}

                    {/* Sync Status Message - only show if Gmail connected */}
                    {gmailConnection?.isConnected &&
                      processingStatus.data?.lastSyncedAt && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Last synced:{' '}
                          {new Date(
                            processingStatus.data.lastSyncedAt,
                          ).toLocaleString()}
                          <br />
                          Next sync: in approximately 10 minutes
                        </div>
                      )}

                    {/* Settings */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 hover:bg-[#0040ff1a] hover:text-blue-600"
                            onClick={() =>
                              router.push('/dashboard/settings/integrations')
                            }
                          >
                            <Settings className="h-3.5 w-3.5 text-inherit" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="font-medium mb-1">
                            Integration Settings
                          </p>
                          <p className="text-xs text-primary-foreground">
                            Manage keywords, filters, and AI rules
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Right-aligned actions - push to the right on desktop */}
                    <div className="flex gap-2 sm:ml-auto">
                      {/* Multi-select controls */}
                      {(activeTab === 'pending' || activeTab === 'history') &&
                        currentFilteredCards.length > 0 && (
                          <div className="flex items-center gap-2">
                            {/* Select All checkbox */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={allSelected}
                                      onCheckedChange={handleSelectAll}
                                      className="h-4 w-4"
                                    />
                                    <span className="text-sm text-muted-foreground hidden sm:inline">
                                      Select all
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Select all {currentFilteredCards.length}{' '}
                                    filtered cards
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Bulk actions when items are selected */}
                            {selectedCardIds.size > 0 && (
                              <>
                                <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700" />
                                <span className="text-sm text-muted-foreground">
                                  {selectedCardIds.size} selected
                                </span>

                                {/* Bulk approve */}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9"
                                        onClick={handleBulkApprove}
                                        disabled={
                                          bulkUpdateStatusMutation.isPending
                                        }
                                      >
                                        {bulkUpdateStatusMutation.isPending ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                          <CheckCircle className="h-3.5 w-3.5" />
                                        )}
                                        <span className="ml-2 hidden sm:inline">
                                          Approve
                                        </span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Approve selected cards</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                {/* Bulk ignore */}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9"
                                        onClick={handleBulkIgnore}
                                        disabled={
                                          bulkUpdateStatusMutation.isPending
                                        }
                                      >
                                        {bulkUpdateStatusMutation.isPending ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                          <X className="h-3.5 w-3.5" />
                                        )}
                                        <span className="ml-2 hidden sm:inline">
                                          Ignore
                                        </span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Ignore selected cards</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                {/* Bulk delete */}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                        onClick={handleBulkDelete}
                                        disabled={bulkDeleteMutation.isPending}
                                      >
                                        {bulkDeleteMutation.isPending ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-3.5 w-3.5" />
                                        )}
                                        <span className="ml-2 hidden sm:inline">
                                          Delete
                                        </span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Permanently delete selected cards</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}
                          </div>
                        )}

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

            {/* Content tabs with glass morphism */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-grow flex flex-col"
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
                className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0"
              >
                <div className="space-y-6">
                  {/* Connection Banners */}
                  {!gmailConnection?.isConnected && (
                    <GmailConnectionBanner
                      onConnect={() =>
                        window.open('/api/auth/gmail/connect', '_blank')
                      }
                      isConnected={gmailConnection?.isConnected}
                    />
                  )}
                  {gmailConnection?.isConnected &&
                    !processingStatus.data?.isEnabled && (
                      <AIProcessingBanner
                        onEnableProcessing={() =>
                          router.push('/dashboard/settings/integrations')
                        }
                        isEnabled={processingStatus.data?.isEnabled}
                      />
                    )}
                  {/* Stats Cards for Pending */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Total Pending</CardDescription>
                        <CardTitle className="text-2xl">
                          {pendingCount}
                        </CardTitle>
                      </CardHeader>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Requires Action</CardDescription>
                        <CardTitle className="text-2xl">
                          {pendingCards.filter((c) => c.requiresAction).length}
                        </CardTitle>
                      </CardHeader>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Processed Today</CardDescription>
                        <CardTitle className="text-2xl">
                          {executedToday}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </div>

                  {/* Main Content Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Pending Items</CardTitle>
                          <CardDescription>
                            Items awaiting your review and action
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      {/* Filters */}
                      <div className="flex flex-col gap-4 p-4 border-b">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              Filters:
                            </span>
                          </div>

                          <Select
                            value={groupBy}
                            onValueChange={(v) => setGroupBy(v as any)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Group by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No grouping</SelectItem>
                              <SelectItem value="vendor">
                                Group by vendor
                              </SelectItem>
                              <SelectItem value="amount">
                                Group by amount
                              </SelectItem>
                              <SelectItem value="frequency">
                                Group by frequency
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            placeholder="Search pending items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-xs"
                          />

                          {/* Select All checkbox */}
                          {pendingCards.filter((card) => {
                            if (!searchQuery) return true;
                            const query = searchQuery.toLowerCase();
                            return (
                              card.title.toLowerCase().includes(query) ||
                              card.subtitle.toLowerCase().includes(query) ||
                              card.from?.toLowerCase().includes(query) ||
                              card.to?.toLowerCase().includes(query)
                            );
                          }).length > 0 && (
                            <div className="flex items-center gap-2 ml-auto">
                              <Checkbox
                                checked={pendingCards
                                  .filter((card) => {
                                    if (!searchQuery) return true;
                                    const query = searchQuery.toLowerCase();
                                    return (
                                      card.title
                                        .toLowerCase()
                                        .includes(query) ||
                                      card.subtitle
                                        .toLowerCase()
                                        .includes(query) ||
                                      card.from
                                        ?.toLowerCase()
                                        .includes(query) ||
                                      card.to?.toLowerCase().includes(query)
                                    );
                                  })
                                  .every((card) =>
                                    selectedCardIds.has(card.id),
                                  )}
                                onCheckedChange={handleSelectAll}
                                className="h-4 w-4"
                              />
                              <span className="text-sm text-muted-foreground">
                                Select all (
                                {
                                  pendingCards.filter((card) => {
                                    if (!searchQuery) return true;
                                    const query = searchQuery.toLowerCase();
                                    return (
                                      card.title
                                        .toLowerCase()
                                        .includes(query) ||
                                      card.subtitle
                                        .toLowerCase()
                                        .includes(query) ||
                                      card.from
                                        ?.toLowerCase()
                                        .includes(query) ||
                                      card.to?.toLowerCase().includes(query)
                                    );
                                  }).length
                                }
                                )
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bulk actions when items are selected */}
                        {selectedCardIds.size > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {selectedCardIds.size} selected
                            </span>
                            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleBulkApprove}
                              disabled={bulkUpdateStatusMutation.isPending}
                            >
                              {bulkUpdateStatusMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3.5 w-3.5" />
                              )}
                              <span className="ml-2">Approve</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleBulkIgnore}
                              disabled={bulkUpdateStatusMutation.isPending}
                            >
                              {bulkUpdateStatusMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <X className="h-3.5 w-3.5" />
                              )}
                              <span className="ml-2">Ignore</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={handleBulkDelete}
                              disabled={bulkDeleteMutation.isPending}
                            >
                              {bulkDeleteMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              <span className="ml-2">Delete</span>
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Upload Options */}
                      <div className="p-4 border-b">
                        <UnifiedDropzone
                          onUploadComplete={() => refetchCards()}
                        />
                      </div>

                      {/* Pending Cards List */}
                      <div>
                        {pendingCards.length === 0 ? (
                          <NoCardsEmptyState
                            onGoToSettings={() =>
                              router.push('/dashboard/settings/integrations')
                            }
                            processingEnabled={
                              gmailConnection?.isConnected &&
                              processingStatus.data?.isEnabled
                            }
                            lastSyncedAt={
                              processingStatus.data?.lastSyncedAt
                                ? new Date(processingStatus.data.lastSyncedAt)
                                : null
                            }
                          />
                        ) : (
                          <InboxPendingList
                            cards={pendingCards.filter((card) => {
                              if (!searchQuery) return true;
                              const query = searchQuery.toLowerCase();
                              return (
                                card.title.toLowerCase().includes(query) ||
                                card.subtitle.toLowerCase().includes(query) ||
                                card.from?.toLowerCase().includes(query) ||
                                card.to?.toLowerCase().includes(query)
                              );
                            })}
                            onCardClick={handleCardSelectForChat}
                            groupBy={groupBy}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent
                value="history"
                className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0"
              >
                <div className="space-y-6">
                  {/* Connection Banners */}
                  {!gmailConnection?.isConnected && (
                    <GmailConnectionBanner
                      onConnect={() =>
                        window.open('/api/auth/gmail/connect', '_blank')
                      }
                      isConnected={gmailConnection?.isConnected}
                    />
                  )}
                  {gmailConnection?.isConnected &&
                    !processingStatus.data?.isEnabled && (
                      <AIProcessingBanner
                        onEnableProcessing={() =>
                          router.push('/dashboard/settings/integrations')
                        }
                        isEnabled={processingStatus.data?.isEnabled}
                      />
                    )}

                  {cards.filter((c) => !['pending'].includes(c.status))
                    .length === 0 ? (
                    <NoCardsEmptyState
                      onGoToSettings={() =>
                        router.push('/dashboard/settings/integrations')
                      }
                      processingEnabled={
                        gmailConnection?.isConnected &&
                        processingStatus.data?.isEnabled
                      }
                      lastSyncedAt={
                        processingStatus.data?.lastSyncedAt
                          ? new Date(processingStatus.data.lastSyncedAt)
                          : null
                      }
                    />
                  ) : (
                    <>
                      {/* Stats Cards for History */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Total Processed</CardDescription>
                            <CardTitle className="text-2xl">
                              {
                                cards.filter(
                                  (c) => !['pending'].includes(c.status),
                                ).length
                              }
                            </CardTitle>
                          </CardHeader>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Executed</CardDescription>
                            <CardTitle className="text-2xl">
                              {
                                cards.filter((c) => c.status === 'executed')
                                  .length
                              }
                            </CardTitle>
                          </CardHeader>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Ignored</CardDescription>
                            <CardTitle className="text-2xl">
                              {
                                cards.filter((c) => c.status === 'dismissed')
                                  .length
                              }
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </div>
                    </>
                  )}

                  {/* Main Content Card */}
                  {cards.filter((c) => !['pending'].includes(c.status)).length >
                    0 && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>History</CardTitle>
                            <CardDescription>
                              All processed items from your inbox
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-0">
                        {/* Filters */}
                        <div className="flex flex-col gap-4 p-4 border-b">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                              <Filter className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                Filters:
                              </span>
                            </div>

                            <Select
                              value={historyStatusFilter}
                              onValueChange={setHistoryStatusFilter}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  All statuses
                                </SelectItem>
                                <SelectItem value="executed">
                                  Executed
                                </SelectItem>
                                <SelectItem value="dismissed">
                                  Ignored
                                </SelectItem>
                                <SelectItem value="auto">
                                  Auto-processed
                                </SelectItem>
                                <SelectItem value="seen">Seen</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder="Search history..."
                              value={historySearchQuery}
                              onChange={(e) =>
                                setHistorySearchQuery(e.target.value)
                              }
                              className="max-w-xs"
                            />

                            {/* Select All checkbox for history */}
                            {cards.filter((c) => {
                              const statusMatch = [
                                'executed',
                                'dismissed',
                                'auto',
                                'seen',
                                'done',
                              ].includes(c.status);
                              if (!statusMatch) return false;

                              if (
                                historyStatusFilter !== 'all' &&
                                c.status !== historyStatusFilter
                              ) {
                                return false;
                              }

                              if (historySearchQuery) {
                                const query = historySearchQuery.toLowerCase();
                                return (
                                  c.title.toLowerCase().includes(query) ||
                                  c.subtitle.toLowerCase().includes(query) ||
                                  c.from?.toLowerCase().includes(query) ||
                                  c.to?.toLowerCase().includes(query)
                                );
                              }
                              return true;
                            }).length > 0 && (
                              <div className="flex items-center gap-2 ml-auto">
                                <Checkbox
                                  checked={cards
                                    .filter((c) => {
                                      const statusMatch = [
                                        'executed',
                                        'dismissed',
                                        'auto',
                                        'seen',
                                        'done',
                                      ].includes(c.status);
                                      if (!statusMatch) return false;

                                      if (
                                        historyStatusFilter !== 'all' &&
                                        c.status !== historyStatusFilter
                                      ) {
                                        return false;
                                      }

                                      if (historySearchQuery) {
                                        const query =
                                          historySearchQuery.toLowerCase();
                                        return (
                                          c.title
                                            .toLowerCase()
                                            .includes(query) ||
                                          c.subtitle
                                            .toLowerCase()
                                            .includes(query) ||
                                          c.from
                                            ?.toLowerCase()
                                            .includes(query) ||
                                          c.to?.toLowerCase().includes(query)
                                        );
                                      }
                                      return true;
                                    })
                                    .every((card) =>
                                      selectedCardIds.has(card.id),
                                    )}
                                  onCheckedChange={handleSelectAll}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm text-muted-foreground">
                                  Select all (
                                  {
                                    cards.filter((c) => {
                                      const statusMatch = [
                                        'executed',
                                        'dismissed',
                                        'auto',
                                        'seen',
                                        'done',
                                      ].includes(c.status);
                                      if (!statusMatch) return false;

                                      if (
                                        historyStatusFilter !== 'all' &&
                                        c.status !== historyStatusFilter
                                      ) {
                                        return false;
                                      }

                                      if (historySearchQuery) {
                                        const query =
                                          historySearchQuery.toLowerCase();
                                        return (
                                          c.title
                                            .toLowerCase()
                                            .includes(query) ||
                                          c.subtitle
                                            .toLowerCase()
                                            .includes(query) ||
                                          c.from
                                            ?.toLowerCase()
                                            .includes(query) ||
                                          c.to?.toLowerCase().includes(query)
                                        );
                                      }
                                      return true;
                                    }).length
                                  }
                                  )
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Bulk actions when items are selected in history */}
                          {selectedCardIds.size > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {selectedCardIds.size} selected
                              </span>
                              <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                onClick={handleBulkDelete}
                                disabled={bulkDeleteMutation.isPending}
                              >
                                {bulkDeleteMutation.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                                <span className="ml-2">Delete</span>
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* History List */}
                        <div>
                          <InboxHistoryList
                            cards={cards.filter((c) => {
                              // Status filter
                              const statusMatch = [
                                'executed',
                                'dismissed',
                                'auto',
                                'seen',
                                'done',
                              ].includes(c.status);
                              if (!statusMatch) return false;

                              // Specific status filter
                              if (
                                historyStatusFilter !== 'all' &&
                                c.status !== historyStatusFilter
                              ) {
                                return false;
                              }

                              // Search filter
                              if (historySearchQuery) {
                                const query = historySearchQuery.toLowerCase();
                                return (
                                  c.title.toLowerCase().includes(query) ||
                                  c.subtitle.toLowerCase().includes(query) ||
                                  c.from?.toLowerCase().includes(query) ||
                                  c.to?.toLowerCase().includes(query)
                                );
                              }

                              return true;
                            })}
                            onCardClick={handleCardSelectForChat}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="logs"
                className="flex-grow px-4 md:px-8 pb-4 outline-none ring-0 focus:ring-0"
              >
                <CardActionsDisplay />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Floating multi-select action bar */}
        <MultiSelectActionBar />
      </div>
    </div>
  );
}
