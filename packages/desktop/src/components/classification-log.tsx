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
                    <div className="mt-2 text-sm text-muted-foreground">
                      {log.results.map((result, i) => (
                        <div key={i}>
                          {result.type}: {result.title}
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