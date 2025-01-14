import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useClassificationStore } from '@/stores/classification-store'
import { formatDistanceToNow } from 'date-fns'
import { AgentType } from '@/agents/base-agent'

interface ClassificationLogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClassificationLog({
  open,
  onOpenChange,
}: ClassificationLogProps) {
  const logs = useClassificationStore(state => state.logs)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Classification Log</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {logs.map((log, index) => {
              const timestamp = new Date(log.timestamp)
              const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true })
              
              return (
                <div 
                  key={`${log.timestamp}-${index}`} 
                  className={`p-4 rounded-lg border ${
                    log.error
                      ? 'bg-destructive/10 border-destructive/20' 
                      : log.success
                      ? 'bg-muted/50 border-border'
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">
                      {log.message}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2">
                      {timeAgo}
                    </span>
                  </div>
                  {log.error && (
                    <p className="mt-2 text-sm text-destructive">
                      Error: {log.error}
                    </p>
                  )}
                  {log.results && log.results.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {log.results.map((result, i) => (
                        <div 
                          key={i} 
                          className="text-sm space-y-1"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`
                              px-2 py-0.5 rounded-full text-xs font-medium
                              ${result.type === 'invoice' ? 'bg-blue-100 text-blue-700' : ''}
                              ${result.type === 'task' ? 'bg-green-100 text-green-700' : ''}
                              ${result.type === 'event' ? 'bg-purple-100 text-purple-700' : ''}
                            `}>
                              {result.type}
                            </span>
                            <span className="text-foreground font-medium">
                              {result.title}
                            </span>
                          </div>
                          {result.vitalInformation && (
                            <p className="text-sm text-muted-foreground pl-8">
                              {result.vitalInformation}
                            </p>
                          )}
                          {result.relevantRawContent && (
                            <div className="pl-8 mt-1">
                              <details className="text-xs">
                                <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
                                  Show context
                                </summary>
                                <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                                  {result.relevantRawContent}
                                </p>
                              </details>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 