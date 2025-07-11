"use client"

import { trpc } from "@/utils/trpc"
import { useState } from "react"
import { format } from "date-fns"
import { 
  CheckCircle, 
  XCircle, 
  Tag, 
  MessageSquare, 
  DollarSign, 
  Receipt, 
  Eye, 
  Trash2,
  Bot,
  User,
  Zap,
  Clock,
  AlertCircle,
  Filter,
  Calendar,
  Activity,
  CheckCircle2,
  X,
  CreditCard,
  Bell,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { CardAction } from "@/db/schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const actionTypeOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'marked_seen', label: 'Marked Seen' },
  { value: 'marked_paid', label: 'Marked Paid' },
  { value: 'dismissed', label: 'Dismissed' },
  { value: 'ignored', label: 'Ignored' },
  { value: 'category_added', label: 'Category Added' },
  { value: 'note_added', label: 'Note Added' },
  { value: 'ai_classified', label: 'AI Classified' },
  { value: 'attachment_downloaded', label: 'Downloaded' },
];

const statusOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'approved', label: 'Approved' },
  { value: 'executed', label: 'Executed' },
  { value: 'dismissed', label: 'Ignored' },
  { value: 'deleted', label: 'Deleted' },
  { value: 'marked_fraud', label: 'Marked as Fraud' },
  { value: 'ignored', label: 'Ignored' },
];

const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case 'marked_seen':
      return <Eye className="h-4 w-4" />;
    case 'marked_paid':
      return <DollarSign className="h-4 w-4" />;
    case 'dismissed':
      return <XCircle className="h-4 w-4" />;
    case 'ignored':
      return <X className="h-4 w-4" />;
    case 'snoozed':
      return <Clock className="h-4 w-4" />;
    case 'deleted':
      return <Trash2 className="h-4 w-4" />;
    case 'approved':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'executed':
      return <Zap className="h-4 w-4" />;
    case 'category_added':
    case 'category_removed':
      return <Tag className="h-4 w-4" />;
    case 'note_added':
    case 'note_updated':
      return <MessageSquare className="h-4 w-4" />;
    case 'added_to_expenses':
      return <Receipt className="h-4 w-4" />;
    case 'payment_recorded':
      return <CreditCard className="h-4 w-4" />;
    case 'reminder_set':
    case 'reminder_sent':
      return <Bell className="h-4 w-4" />;
    case 'attachment_downloaded':
      return <Download className="h-4 w-4" />;
    case 'ai_classified':
    case 'ai_auto_approved':
    case 'ai_suggested_update':
      return <Bot className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getActionLabel = (actionType: string) => {
  switch (actionType) {
    case 'marked_seen':
      return 'Marked as Seen';
    case 'marked_paid':
      return 'Marked as Paid';
    case 'dismissed':
      return 'Ignored';
    case 'ignored':
      return 'Ignored';
    case 'snoozed':
      return 'Snoozed';
    case 'deleted':
      return 'Deleted';
    case 'approved':
      return 'Approved';
    case 'executed':
      return 'Executed';
    case 'category_added':
      return 'Category Added';
    case 'category_removed':
      return 'Category Removed';
    case 'note_added':
      return 'Note Added';
    case 'note_updated':
      return 'Note Updated';
    case 'amount_updated':
      return 'Amount Updated';
    case 'due_date_updated':
      return 'Due Date Updated';
    case 'added_to_expenses':
      return 'Added to Expenses';
    case 'payment_recorded':
      return 'Payment Recorded';
    case 'reminder_set':
      return 'Reminder Set';
    case 'reminder_sent':
      return 'Reminder Sent';
    case 'attachment_downloaded':
      return 'Attachment Downloaded';
    case 'shared':
      return 'Shared';
    case 'comment_added':
      return 'Comment Added';
    case 'ai_classified':
      return 'AI Classified';
    case 'ai_auto_approved':
      return 'AI Auto-Approved';
    case 'ai_suggested_update':
      return 'AI Suggested Update';
    default:
      return actionType.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
  }
};

const getActionTypeLabel = (type: string) => {
  switch (type) {
    case 'approved':
      return 'Approved';
    case 'executed':
      return 'Executed';
    case 'dismissed':
      return 'Ignored';
    case 'deleted':
      return 'Deleted';
    case 'marked_fraud':
      return 'Marked as Fraud';
    case 'ignored':
      return 'Ignored';
    default:
      return type;
  }
};

const getActionSummary = (action: CardAction & { cardInfo?: any }) => {
  switch (action.actionType) {
    case 'ai_classified':
      const ruleName = action.actorDetails && (action.actorDetails as any).ruleName;
      const confidence = action.actorDetails && (action.actorDetails as any).confidence;
      return `AI classified using rule "${ruleName}" with ${confidence}% confidence`;
    
    case 'classification_auto_approved':
      const matchedRules = action.actorDetails && (action.actorDetails as any).matchedRules;
      return `Auto-approved by classification rules: ${matchedRules ? matchedRules.join(', ') : 'unknown'}`;
    
    case 'category_added':
      const categories = action.newValue && (action.newValue as any).categories;
      return `Added categories: ${categories ? categories.join(', ') : 'unknown'}`;
    
    case 'executed':
      const txId = action.details && (action.details as any).transactionId;
      return `Payment executed${txId ? ` (TX: ${txId})` : ''}`;
    
    case 'deleted':
      const prevStatus = action.previousValue && (action.previousValue as any).status;
      return `Deleted card (was ${prevStatus || 'unknown'} status)`;
    
    case 'marked_seen':
      return 'User marked as seen';
    
    case 'marked_paid':
      return 'User marked as paid';
    
    case 'dismissed':
      return 'User dismissed this card';
    
    default:
      return `Performed ${getActionLabel(action.actionType).toLowerCase()}`;
  }
};

function ActionCard({ action }: { action: CardAction & { cardInfo?: any } }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = Boolean(action.details || action.previousValue || action.newValue || action.errorMessage || action.actorDetails);
  
  // Format amount with currency
  const formatAmount = (amount: string | null, currency: string | null) => {
    if (!amount) return null;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return null;
    
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency || '';
    return `${currencySymbol}${numAmount.toFixed(2)}`;
  };

  // Extract card info from action details if cardInfo is null
  const getCardDisplayInfo = () => {
    if (action.cardInfo && action.cardInfo.title !== 'Unknown Card') {
      return action.cardInfo;
    }
    
    // Try to extract from action details
    if (action.details && typeof action.details === 'object') {
      const details = action.details as any;
      if (details.title || details.amount || details.subtitle) {
        return {
          title: details.title || 'Unknown Transaction',
          subtitle: details.subtitle || 'No description available',
          amount: details.amount,
          currency: details.currency,
          from: details.from || null,
          to: details.to || null,
        };
      }
    }
    
    // Try to extract from newValue or previousValue
    const extractFromValue = (value: any) => {
      if (value && typeof value === 'object') {
        return {
          title: value.title || null,
          subtitle: value.subtitle || null,
          amount: value.amount || null,
          currency: value.currency || null,
          from: value.from || null,
          to: value.to || null,
        };
      }
      return null;
    };
    
    const fromNew = extractFromValue(action.newValue);
    const fromPrevious = extractFromValue(action.previousValue);
    
    if (fromNew?.title || fromPrevious?.title) {
      return {
        title: fromNew?.title || fromPrevious?.title || 'Unknown Transaction',
        subtitle: fromNew?.subtitle || fromPrevious?.subtitle || 'No description available',
        amount: fromNew?.amount || fromPrevious?.amount,
        currency: fromNew?.currency || fromPrevious?.currency,
        from: fromNew?.from || fromPrevious?.from,
        to: fromNew?.to || fromPrevious?.to,
      };
    }
    
    // Fallback to card ID
    return {
      title: `Card Action`,
      subtitle: `Card ID: ${action.cardId.substring(0, 12)}...`,
      amount: null,
      currency: null,
      from: null,
      to: null,
    };
  };

  const cardDisplayInfo = getCardDisplayInfo();
  
  return (
    <Card 
      className={cn(
        "w-full transition-all hover:shadow-md",
        action.status === 'failed' && "border-destructive/50",
        hasDetails && "cursor-pointer"
      )}
      onClick={() => hasDetails && setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Header Row */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                action.actor === 'ai' ? "bg-purple-100 dark:bg-purple-900/20" :
                action.actor === 'system' ? "bg-blue-100 dark:bg-blue-900/20" :
                "bg-gray-100 dark:bg-gray-900/20"
              )}>
                {getActionIcon(action.actionType)}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-base">{getActionLabel(action.actionType)}</h3>
                
                {/* Card Information */}
                <div className="mt-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {cardDisplayInfo.title}
                    {cardDisplayInfo.amount && (
                      <span className="ml-2 text-muted-foreground">
                        • {formatAmount(cardDisplayInfo.amount, cardDisplayInfo.currency)}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {cardDisplayInfo.subtitle}
                  </p>
                  {(cardDisplayInfo.from || cardDisplayInfo.to) && (
                    <p className="text-xs text-muted-foreground">
                      {cardDisplayInfo.from && <span>From: {cardDisplayInfo.from}</span>}
                      {cardDisplayInfo.from && cardDisplayInfo.to && <span> → </span>}
                      {cardDisplayInfo.to && <span>To: {cardDisplayInfo.to}</span>}
                    </p>
                  )}
                  
                  {/* Show action-specific context */}
                  {action.actionType === 'ai_classified' && action.actorDetails && (action.actorDetails as any).ruleName && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Rule: {(action.actorDetails as any).ruleName}
                    </p>
                  )}
                  
                  {action.actionType === 'category_added' && action.newValue && (action.newValue as any).categories && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {((action.newValue as any).categories as string[]).map((cat: string) => (
                        <Badge key={cat} variant="secondary" className="text-xs px-1.5 py-0.5">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {action.actionType === 'executed' && action.details && (action.details as any).transactionId && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-mono">
                      TX: {(action.details as any).transactionId}
                    </p>
                  )}
                  
                  {action.actionType === 'deleted' && action.previousValue && (
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      Previous status: {((action.previousValue as any).status || 'unknown')}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={action.status === 'failed' ? 'destructive' : action.status === 'pending' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {getActionTypeLabel(action.status)}
                </Badge>
                
                {hasDetails && (
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform text-muted-foreground",
                    isExpanded && "rotate-90"
                  )} />
                )}
              </div>
            </div>
            
            {/* Metadata Row */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {format(new Date(action.performedAt), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
              
              <Badge 
                variant={action.actor === 'ai' ? 'secondary' : action.actor === 'system' ? 'outline' : 'default'}
                className="text-xs"
              >
                {action.actor === 'ai' && <Bot className="h-3 w-3 mr-1" />}
                {action.actor === 'system' && <Zap className="h-3 w-3 mr-1" />}
                {action.actor === 'human' && <User className="h-3 w-3 mr-1" />}
                {action.actor}
              </Badge>
              
              {/* Show AI confidence if available */}
              {action.actor === 'ai' && action.actorDetails && (action.actorDetails as any).confidence !== undefined ? (
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    "h-1.5 w-16 bg-muted rounded-full overflow-hidden",
                  )}>
                    <div 
                      className={cn(
                        "h-full transition-all",
                        (action.actorDetails as any).confidence >= 90 
                          ? "bg-green-500"
                          : (action.actorDetails as any).confidence >= 70
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      )}
                      style={{ width: `${(action.actorDetails as any).confidence}%` }}
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    (action.actorDetails as any).confidence >= 90 
                      ? "text-green-600 dark:text-green-400"
                      : (action.actorDetails as any).confidence >= 70
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-gray-600 dark:text-gray-400"
                  )}>
                    {(action.actorDetails as any).confidence}%
                  </span>
                </div>
              ) : null}
            </div>
            
            {/* Action Summary */}
            <div className="text-xs text-muted-foreground">
              {getActionSummary(action)}
            </div>
            
            {/* Expanded Details */}
            {hasDetails && isExpanded ? (
              <div className="mt-4 pt-4 border-t space-y-4">
                {Boolean(action.details) && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">AI Reasoning</h4>
                    <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                      {String((action.details as any).reason)}
                    </p>
                  </div>
                )}
                
                {action.actionType === 'classification_auto_approved' && action.details && (action.details as any).classificationResults && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Classification Results</h4>
                    <div className="bg-muted/50 p-3 rounded-md space-y-2">
                      {((action.details as any).classificationResults.matched || []).map((rule: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{String(rule.name)}</span>
                          <Badge variant="secondary" className="text-xs">
                            {String(rule.confidence)}% confidence
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {action.actionType === 'executed' && action.details && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Execution Details</h4>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md space-y-1">
                      {(action.details as any).paymentMethod && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Payment Method:</span> {String((action.details as any).paymentMethod)}
                        </p>
                      )}
                      {(action.details as any).transactionId && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Transaction:</span> 
                          <span className="font-mono ml-1">{String((action.details as any).transactionId)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {action.actor === 'ai' && action.actorDetails ? (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">AI Details</h4>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md space-y-2">
                      {(action.actorDetails as any).aiModel && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Model:</span>
                          <span className="text-xs font-mono">{String((action.actorDetails as any).aiModel)}</span>
                        </div>
                      )}
                      {(action.actorDetails as any).ruleName && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Rule:</span>
                          <span className="text-xs font-medium">{String((action.actorDetails as any).ruleName)}</span>
                        </div>
                      )}
                      {(action.actorDetails as any).confidence !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <span className="text-xs font-medium">{String((action.actorDetails as any).confidence)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
                
                {Boolean(action.previousValue) || Boolean(action.newValue) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Boolean(action.previousValue) ? (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Previous Value</h4>
                        <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-x-auto">
                          {JSON.stringify(action.previousValue, null, 2)}
                        </pre>
                      </div>
                    ) : null}
                    {Boolean(action.newValue) ? (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">New Value</h4>
                        <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-x-auto">
                          {JSON.stringify(action.newValue, null, 2)}
                        </pre>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                
                {action.errorMessage ? (
                  <div>
                    <h4 className="text-sm font-semibold text-destructive mb-2">Error</h4>
                    <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {action.errorMessage}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CardActionsDisplay() {
  const [limit, setLimit] = useState(100)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterActor, setFilterActor] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  const { data: actionsData, isLoading: actionsLoading } = trpc.cardActions.getRecentActions.useQuery({
    limit,
  })
  
  const { data: stats, isLoading: statsLoading } = trpc.cardActions.getActionStats.useQuery()
  
  // Filter actions
  const filteredActions = actionsData?.actions.filter((action: any) => {
    if (filterType !== "all" && action.actionType !== filterType) return false
    if (filterActor !== "all" && action.actor !== filterActor) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesCardId = action.cardId.toLowerCase().includes(search);
      const matchesTitle = action.cardInfo?.title?.toLowerCase().includes(search) || false;
      const matchesSubtitle = action.cardInfo?.subtitle?.toLowerCase().includes(search) || false;
      const matchesFrom = action.cardInfo?.from?.toLowerCase().includes(search) || false;
      const matchesTo = action.cardInfo?.to?.toLowerCase().includes(search) || false;
      
      if (!matchesCardId && !matchesTitle && !matchesSubtitle && !matchesFrom && !matchesTo) {
        return false;
      }
    }
    return true
  }) || []
  
  if (actionsLoading || statsLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Actions</CardDescription>
            <CardTitle className="text-2xl">{stats?.total || 0}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Human Actions</CardDescription>
            <CardTitle className="text-2xl">{stats?.byActor.human || 0}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AI Actions</CardDescription>
            <CardTitle className="text-2xl">{stats?.byActor.ai || 0}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Failure Rate</CardDescription>
            <CardTitle className="text-2xl">{stats?.failureRate.toFixed(1)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Log Viewer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Action Log</CardTitle>
              <CardDescription>
                Showing {filteredActions.length} of {actionsData?.actions.length || 0} actions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">rows</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 border-b">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Action type" />
              </SelectTrigger>
              <SelectContent>
                {actionTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterActor} onValueChange={setFilterActor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Actor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actors</SelectItem>
                <SelectItem value="human">Human</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Search by card title, vendor, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          {/* Log Table */}
          <div className="overflow-x-auto">
            {filteredActions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-3" />
                <p>No actions found matching your filters</p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {filteredActions.map((action) => (
                  <ActionCard key={action.id} action={action} />
                ))}
              </div>
            )}
          </div>
          
          {/* Load More */}
          {actionsData && actionsData.actions.length >= limit && (
            <div className="p-4 text-center border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLimit(limit + 100)}
                className="gap-2"
              >
                <Loader2 className="h-4 w-4" />
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 