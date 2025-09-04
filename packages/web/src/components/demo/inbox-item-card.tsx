'use client';

import React from 'react';
import type { InboxItemData } from '@/context/demo-timeline-context';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  HelpCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface InboxItemCardProps {
  item: InboxItemData;
  onSelect: (item: InboxItemData) => void;
  isHighlighted?: boolean;
}

export function InboxItemCard({
  item,
  onSelect,
  isHighlighted,
}: InboxItemCardProps) {
  const IconComponent = item.icon;

  // Direction indicator
  const DirectionIcon =
    item.direction === 'outbound' ? ArrowUpRight : ArrowDownLeft;
  const directionColor =
    item.direction === 'outbound' ? 'text-blue-600' : 'text-orange-600';
  const directionBg =
    item.direction === 'outbound' ? 'bg-blue-50' : 'bg-orange-50';

  // Format amount with direction context
  const formatAmount = () => {
    if (!item.amount) return null;
    const symbol = item.currencySymbol || '€';
    const amount = `${symbol}${item.amount.toLocaleString()}`;
    return item.direction === 'outbound' ? `+${amount}` : `-${amount}`;
  };

  // Get contextual entity (client or vendor)
  const getEntity = () => {
    if (item.direction === 'outbound' && item.client)
      return `from ${item.client}`;
    if (item.direction === 'inbound' && item.vendor) return `to ${item.vendor}`;
    return '';
  };

  return (
    <Card
      className={cn(
        'w-full cursor-pointer hover:shadow-md transition-all duration-200',
        item.borderColorClass,
        'border-l-4',
        isHighlighted
          ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
          : 'shadow-sm',
      )}
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-3 flex items-start space-x-3">
        <Checkbox
          id={`item-checkbox-${item.id}`}
          className="mt-1"
          aria-label={`Select item ${item.title}`}
        />

        {/* Direction indicator with icon */}
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full mt-0.5',
            directionBg,
          )}
        >
          {React.createElement(DirectionIcon, {
            className: cn('h-4 w-4', directionColor),
          })}
        </div>

        {React.createElement(IconComponent, {
          className: cn(
            'h-5 w-5 mt-1 flex-shrink-0',
            item.borderColorClass.replace('border-', 'text-'),
          ),
        })}

        <div className="flex-grow overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold truncate" title={item.title}>
              {item.title}
            </h3>
            {/* Direction badge */}
            <Badge
              variant="outline"
              className={cn(
                'text-xs px-1.5 py-0.5 h-5',
                item.direction === 'outbound'
                  ? 'text-blue-700 border-blue-300'
                  : 'text-orange-700 border-orange-300',
              )}
            >
              {item.direction === 'outbound' ? 'Expecting' : 'To Pay'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <p
              className="text-xs text-muted-foreground truncate"
              title={item.description}
            >
              {item.description}
            </p>
            {formatAmount() && (
              <span
                className={cn(
                  'text-xs font-medium',
                  item.direction === 'outbound'
                    ? 'text-green-600'
                    : 'text-red-600',
                )}
              >
                {formatAmount()}
              </span>
            )}
          </div>

          {getEntity() && (
            <p className="text-xs text-muted-foreground mb-2">{getEntity()}</p>
          )}

          <div className="flex items-center space-x-2">
            {item.actions.slice(0, 2).map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'secondary'}
                size="sm"
                className="text-xs px-2 py-0.5 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick?.();
                }}
              >
                {action.icon &&
                  React.createElement(action.icon, {
                    className: 'mr-1 h-3 w-3',
                  })}
                {action.label}
              </Button>
            ))}
            {item.actions.length > 2 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {item.actions.slice(2).map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick?.();
                      }}
                    >
                      {action.icon &&
                        React.createElement(action.icon, {
                          className: 'mr-2 h-4 w-4',
                        })}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end space-y-1 w-36 text-right">
          {' '}
          {/* Increased width for source badge */}
          {item.confidence !== undefined && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs text-muted-foreground">
                  Confidence
                </span>
                <span className="text-xs font-medium">{item.confidence}%</span>
              </div>
              <Progress value={item.confidence} className="h-1 w-full" />
            </div>
          )}
          {/* Always show source badge if available */}
          {item.source && (
            <Badge
              variant="outline"
              className="mt-1.5 text-xs px-1.5 py-0.5 h-5 self-end"
              title={item.source.details || item.source.name}
            >
              {item.source.icon &&
                React.createElement(item.source.icon, {
                  className: 'h-3 w-3 mr-1',
                })}
              <span className="truncate">{item.source.name}</span>
            </Badge>
          )}
          <Button
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground p-0 h-auto mt-1"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <HelpCircle className="h-3 w-3 mr-1" /> Why?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
