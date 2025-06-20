"use client"

import type { ActivityItem } from "@/context/demo-timeline-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

interface ActivityFeedProps {
  items: ActivityItem[]
  showFeedIndicator?: boolean
}

export function ActivityFeed({ items, showFeedIndicator }: ActivityFeedProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {showFeedIndicator && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96">
        <DropdownMenuLabel className="px-3 py-2">Activity Feed</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items && items.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {items.map((item) => (
              <DropdownMenuItem key={item.id} className="flex gap-3 items-start p-3">
                {item.icon && <item.icon className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm leading-snug">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <p className="p-3 text-sm text-muted-foreground">No recent activity.</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
