'use client';

import React from 'react';
import { trpc } from '@/utils/trpc';
import { format } from 'date-fns';
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
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { CardAction } from '@/db/schema';

interface CardActionTimelineProps {
  cardId: string;
}

const actionIcons: Record<string, React.ElementType> = {
  status_changed: Zap,
  marked_seen: Eye,
  marked_paid: DollarSign,
  dismissed: XCircle,
  snoozed: Clock,
  deleted: Trash2,
  approved: CheckCircle,
  executed: CheckCircle,
  category_added: Tag,
  category_removed: Tag,
  note_added: MessageSquare,
  note_updated: MessageSquare,
  amount_updated: DollarSign,
  due_date_updated: Clock,
  added_to_expenses: Receipt,
  payment_recorded: DollarSign,
  reminder_set: Clock,
  reminder_sent: Clock,
  ai_classified: Bot,
  ai_auto_approved: Bot,
  ai_suggested_update: Bot,
  attachment_downloaded: Receipt,
  shared: User,
  comment_added: MessageSquare,
};

const actionLabels: Record<string, string> = {
  status_changed: 'Status changed',
  marked_seen: 'Marked as seen',
  marked_paid: 'Marked as paid',
  dismissed: 'Ignored',
  snoozed: 'Snoozed',
  deleted: 'Deleted',
  approved: 'Approved',
  executed: 'Executed',
  category_added: 'Categories updated',
  category_removed: 'Category removed',
  note_added: 'Note added',
  note_updated: 'Note updated',
  amount_updated: 'Amount updated',
  due_date_updated: 'Due date updated',
  added_to_expenses: 'Added to expenses',
  payment_recorded: 'Payment recorded',
  reminder_set: 'Reminder set',
  reminder_sent: 'Reminder sent',
  ai_classified: 'AI classified',
  ai_auto_approved: 'Auto-approved by AI',
  ai_suggested_update: 'AI suggested update',
  attachment_downloaded: 'Attachment downloaded',
  shared: 'Shared',
  comment_added: 'Comment added',
};

function ActionItem({ action }: { action: CardAction }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = actionIcons[action.actionType] || Zap;
  const label = actionLabels[action.actionType] || action.actionType;

  const ActorIcon =
    action.actor === 'ai' ? Bot : action.actor === 'system' ? Zap : User;
  const actorLabel =
    action.actor === 'ai' ? 'AI' : action.actor === 'system' ? 'System' : 'You';

  const hasDetails = action.details || action.previousValue || action.newValue;

  return (
    <div className="relative flex gap-3 pb-6 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border last:hidden" />

      {/* Icon */}
      <div
        className={cn(
          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background',
          action.status === 'failed' ? 'border-destructive' : 'border-primary',
        )}
      >
        {React.createElement(Icon, {
          className: cn(
            'h-4 w-4',
            action.status === 'failed' ? 'text-destructive' : 'text-primary',
          ),
        })}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{label}</p>
          {action.status === 'failed' && (
            <Badge variant="destructive" className="text-xs">
              Failed
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ActorIcon className="h-3 w-3" />
            <span>{actorLabel}</span>
          </div>
          <span>•</span>
          <span>{format(new Date(action.performedAt), 'MMM d, h:mm a')}</span>
        </div>

        {hasDetails ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            Account Details
          </button>
        ) : null}

        {isExpanded && hasDetails ? (
          <div className="mt-2 space-y-2 text-xs bg-muted/50 rounded-md p-3">
            {action.details ? (
              <div>
                <p className="font-medium text-muted-foreground mb-1">
                  Details:
                </p>
                <pre className="whitespace-pre-wrap text-foreground">
                  {JSON.stringify(action.details, null, 2)}
                </pre>
              </div>
            ) : null}

            {action.previousValue ? (
              <div>
                <p className="font-medium text-muted-foreground mb-1">
                  Previous:
                </p>
                <pre className="whitespace-pre-wrap text-foreground">
                  {JSON.stringify(action.previousValue, null, 2)}
                </pre>
              </div>
            ) : null}

            {action.newValue ? (
              <div>
                <p className="font-medium text-muted-foreground mb-1">New:</p>
                <pre className="whitespace-pre-wrap text-foreground">
                  {JSON.stringify(action.newValue, null, 2)}
                </pre>
              </div>
            ) : null}

            {action.errorMessage ? (
              <div>
                <p className="font-medium text-destructive mb-1">Error:</p>
                <p className="text-destructive">{action.errorMessage}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function CardActionTimeline({ cardId }: CardActionTimelineProps) {
  const { data, isLoading, error } = trpc.cardActions.getCardActions.useQuery({
    cardId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span>Failed to load action history</span>
      </div>
    );
  }

  if (!data?.actions || data.actions.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No actions recorded yet
      </div>
    );
  }

  return (
    <div className="relative">
      {data.actions.map((action) => (
        <ActionItem key={action.id} action={action} />
      ))}
    </div>
  );
}
