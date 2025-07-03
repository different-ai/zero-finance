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

const actionIcons: Record<string, React.ElementType> = {
  'status_changed': Zap,
  'marked_seen': Eye,
  'marked_paid': DollarSign,
  'dismissed': XCircle,
  'snoozed': Clock,
  'deleted': Trash2,
  'approved': CheckCircle,
  'executed': CheckCircle,
  'category_added': Tag,
  'category_removed': Tag,
  'note_added': MessageSquare,
  'note_updated': MessageSquare,
  'amount_updated': DollarSign,
  'due_date_updated': Clock,
  'added_to_expenses': Receipt,
  'payment_recorded': DollarSign,
  'reminder_set': Clock,
  'reminder_sent': Clock,
  'ai_classified': Bot,
  'ai_auto_approved': Bot,
  'ai_suggested_update': Bot,
  'attachment_downloaded': Receipt,
  'shared': User,
  'comment_added': MessageSquare,
}

const actionLabels: Record<string, string> = {
  'status_changed': 'Status changed',
  'marked_seen': 'Marked as seen',
  'marked_paid': 'Marked as paid',
  'dismissed': 'Dismissed',
  'snoozed': 'Snoozed',
  'deleted': 'Deleted',
  'approved': 'Approved',
  'executed': 'Executed',
  'category_added': 'Categories updated',
  'category_removed': 'Category removed',
  'note_added': 'Note added',
  'note_updated': 'Note updated',
  'amount_updated': 'Amount updated',
  'due_date_updated': 'Due date updated',
  'added_to_expenses': 'Added to expenses',
  'payment_recorded': 'Payment recorded',
  'reminder_set': 'Reminder set',
  'reminder_sent': 'Reminder sent',
  'ai_classified': 'AI classified',
  'ai_auto_approved': 'Auto-approved by AI',
  'ai_suggested_update': 'AI suggested update',
  'attachment_downloaded': 'Attachment downloaded',
  'shared': 'Shared',
  'comment_added': 'Comment added',
}

function ActionCard({ action }: { action: CardAction }) {
  const Icon = actionIcons[action.actionType] || Zap
  const label = actionLabels[action.actionType] || action.actionType
  
  const actorIcon = action.actor === 'ai' ? Bot : action.actor === 'system' ? Zap : User
  const actorLabel = action.actor === 'ai' ? 'AI' : action.actor === 'system' ? 'System' : 'You'
  
  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow",
      action.status === 'failed' && "border-destructive/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              action.status === 'failed' ? "bg-destructive/10" : "bg-primary/10",
            )}>
              <Icon className={cn(
                "h-5 w-5",
                action.status === 'failed' ? "text-destructive" : "text-primary",
              )} />
            </div>
            <div>
              <CardTitle className="text-base">{label}</CardTitle>
              <CardDescription className="text-xs">
                Card ID: {action.cardId}
              </CardDescription>
            </div>
          </div>
          {action.status === 'failed' && (
            <Badge variant="destructive">Failed</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <actorIcon className="h-4 w-4" />
            <span>{actorLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(action.performedAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(action.performedAt), 'h:mm a')}</span>
          </div>
        </div>
        
        {action.details && (
          <div className="bg-muted/50 rounded-md p-3 text-xs space-y-1">
            {Object.entries(action.details as Record<string, any>).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-medium">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
              </div>
            ))}
          </div>
        )}
        
        {action.errorMessage && (
          <div className="text-xs text-destructive bg-destructive/10 rounded-md p-2">
            {action.errorMessage}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CardActionsDisplay() {
  const [limit] = useState(50)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterActor, setFilterActor] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  const { data: actionsData, isLoading: actionsLoading } = trpc.cardActions.getRecentActions.useQuery({
    limit,
  })
  
  const { data: stats, isLoading: statsLoading } = trpc.cardActions.getActionStats.useQuery()
  
  // Filter actions
  const filteredActions = actionsData?.actions.filter(action => {
    if (filterType !== "all" && action.actionType !== filterType) return false
    if (filterActor !== "all" && action.actor !== filterActor) return false
    if (searchTerm && !action.cardId.toLowerCase().includes(searchTerm.toLowerCase())) return false
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
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
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.entries(actionLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
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
          placeholder="Search by card ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>{filteredActions.length} actions</span>
        </div>
      </div>
      
      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
      
      {filteredActions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-3" />
          <p>No actions found matching your filters</p>
        </div>
      )}
    </div>
  )
} 