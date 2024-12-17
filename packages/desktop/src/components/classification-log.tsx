import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useClassificationStore } from '@/stores/classification-store'
import { formatDistanceToNow } from 'date-fns'
import { cn } from "@/lib/utils"

export function ClassificationLog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const logs = useClassificationStore(state => state.logs)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Classification Log</DialogTitle>
          <DialogDescription>
            History of content classifications from your screen
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-4">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="p-4 border rounded-lg space-y-2"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">
                    {formatDistanceToNow(new Date(log.timestamp))} ago
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    log.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}>
                    {log.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {log.content.substring(0, 100)}...
                </p>
                {log.error && (
                  <p className="text-sm text-red-500">{log.error}</p>
                )}
                {log.results && (
                  <div className="text-sm space-y-1">
                    <p>Found:</p>
                    <ul className="list-disc pl-4">
                      {log.results.map((result, i) => (
                        <li key={i}>
                          {result.type}: {result.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 