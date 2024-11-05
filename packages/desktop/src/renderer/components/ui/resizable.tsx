import React, { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ResizableProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  className?: string
}

export function Resizable({
  children,
  defaultWidth = 400,
  minWidth = 300,
  maxWidth = 800,
  className
}: ResizableProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth)
      }
    }
  }, [isResizing, minWidth, maxWidth])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    }

    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  return (
    <div 
      className={cn("relative", className)}
      style={{ width: `${width}px` }}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 cursor-ew-resize select-none",
          "hover:bg-blue-500/20 transition-colors",
          isResizing && "bg-blue-500/40"
        )}
        onMouseDown={startResizing}
      />
      {children}
    </div>
  )
} 