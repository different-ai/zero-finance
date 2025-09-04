'use client';

import React from 'react';
import type { InboxItemData } from '@/context/demo-timeline-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, AlertTriangle, Sparkles, Mail, Check, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ActionDetailsSidebarProps {
  item: InboxItemData | null;
  isOpen: boolean;
  onClose: () => void;
  showDemoControlsColumn?: boolean; // Prop to indicate if the 20% demo column is active
}

export function ActionDetailsSidebar({
  item,
  isOpen,
  onClose,
  showDemoControlsColumn,
}: ActionDetailsSidebarProps) {
  const IconComponent = item?.icon || AlertTriangle;

  const formatCurrency = (value?: number) => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  // Calculate the 'right' offset for the sidebar
  // On desktop (md+), if the demo controls column is shown, offset by 20vw.
  // Otherwise (mobile or no demo column), it's at the viewport edge (0px).
  const rightOffset = showDemoControlsColumn ? '20vw' : '0px';

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 h-full w-full max-w-md bg-card border-l shadow-xl z-50 flex flex-col"
          // Apply dynamic right offset using style prop
          // Use window.innerWidth to check for mobile vs desktop for accurate 'right' calculation
          style={{
            right:
              typeof window !== 'undefined' && window.innerWidth < 768
                ? '0px'
                : rightOffset,
          }}
        >
          {/* Header */}
          <div className="p-4 border-b flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {React.createElement(IconComponent, {
                className: 'h-6 w-6 mt-1 text-primary flex-shrink-0',
              })}
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-grow">
            <div className="p-4 space-y-6">
              {/* AI Suggestion */}
              {item.aiSuggestion && (
                <section>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      {React.createElement(Sparkles, {
                        className: 'h-5 w-5 text-blue-600 mr-2',
                      })}
                      <h3 className="text-md font-semibold text-blue-700">
                        {item.aiSuggestion.title}
                      </h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">
                      {item.aiSuggestion.description}
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      {item.aiSuggestion.applyActionLabel}
                    </Button>
                  </div>
                </section>
              )}

              {/* Source */}
              {item.source && (
                <section>
                  <h3 className="text-xs uppercase text-muted-foreground mb-1 font-semibold">
                    Source
                  </h3>
                  <div className="flex items-center text-sm p-3 border rounded-md">
                    {item.source.icon ? (
                      React.createElement(item.source.icon, {
                        className: 'h-4 w-4 mr-2 text-muted-foreground',
                      })
                    ) : (
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{item.source.name}</span>
                    {item.source.details && (
                      <span className="text-muted-foreground ml-1 truncate">
                        ({item.source.details})
                      </span>
                    )}
                  </div>
                </section>
              )}

              {/* Chain of Thought */}
              {item.chainOfThought && item.chainOfThought.length > 0 && (
                <section>
                  <h3 className="text-xs uppercase text-muted-foreground mb-3 font-semibold">
                    Chain of Thought
                  </h3>
                  <div className="relative pl-6">
                    {item.chainOfThought.map((step, index) => (
                      <div key={step.id} className="relative pb-6">
                        {/* Vertical line */}
                        {index < (item.chainOfThought?.length ?? 0) - 1 && (
                          <div className="absolute left-[7px] top-4 -ml-px mt-0.5 h-full w-0.5 bg-border" />
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center ring-4 ring-background">
                              {step.icon ? (
                                React.createElement(step.icon, {
                                  className: 'h-2.5 w-2.5 text-primary',
                                })
                              ) : (
                                <Check className="h-2.5 w-2.5 text-primary" />
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5 text-sm">
                            {step.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Impact */}
              {item.impact && (
                <section>
                  <h3 className="text-xs uppercase text-muted-foreground mb-2 font-semibold">
                    Impact
                  </h3>
                  <div className="p-3 border rounded-md space-y-1 text-sm">
                    {item.impact.currentBalance !== undefined && (
                      <div className="flex justify-between">
                        <span>Current balance:</span>
                        <span>
                          {formatCurrency(item.impact.currentBalance)}
                        </span>
                      </div>
                    )}
                    {item.impact.postActionBalance !== undefined && (
                      <div className="flex justify-between font-medium">
                        <span>Post-action balance:</span>
                        <span>
                          {formatCurrency(item.impact.postActionBalance)}
                        </span>
                      </div>
                    )}
                    {item.impact.details?.map((detail, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Log Information */}
              {item.logInfo && (
                <section>
                  <h3 className="text-xs uppercase text-muted-foreground mb-2 font-semibold">
                    Log Information
                  </h3>
                  <div className="p-3 border rounded-md space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>ID:</span>{' '}
                      <span className="font-mono text-xs">
                        {item.logInfo.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timestamp:</span>{' '}
                      <span>
                        {format(
                          new Date(item.logInfo.timestamp),
                          'MMM d, yyyy, h:mm:ss a',
                        )}
                      </span>
                    </div>
                    {item.logInfo.confidence !== undefined && (
                      <div className="flex justify-between">
                        <span>Confidence:</span>{' '}
                        <Badge
                          variant={
                            item.logInfo.confidence > 90
                              ? 'default'
                              : item.logInfo.confidence > 70
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {item.logInfo.confidence}%
                        </Badge>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Discussion - Placeholder */}
              <section>
                <h3 className="text-xs uppercase text-muted-foreground mb-2 font-semibold">
                  Discussion
                </h3>
                <div className="p-3 border rounded-md text-sm text-muted-foreground text-center">
                  <Info className="h-4 w-4 inline mr-1" />
                  Discussion and comments will appear here.
                </div>
              </section>
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
