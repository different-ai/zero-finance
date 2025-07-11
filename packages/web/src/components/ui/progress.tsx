"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  indeterminate?: boolean
}

function Progress({
  className,
  value,
  indeterminate = false,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {indeterminate ? (
        <div className="h-full w-full relative">
          <div className="absolute inset-0 bg-primary/30 animate-pulse" />
          <div className="absolute h-full w-1/3 bg-primary animate-[progress-indeterminate_1.5s_ease-in-out_infinite]" />
        </div>
      ) : (
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-primary h-full w-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      )}
    </ProgressPrimitive.Root>
  )
}

export { Progress }
