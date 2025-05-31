"use client"

import { useEffect } from "react"

type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  action: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !shortcut.ctrlKey === !event.ctrlKey
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !shortcut.shiftKey === !event.shiftKey
        const metaMatch = shortcut.metaKey ? event.metaKey : !shortcut.metaKey === !event.metaKey

        if (keyMatch && ctrlMatch && shiftMatch && metaMatch) {
          event.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts])
}
