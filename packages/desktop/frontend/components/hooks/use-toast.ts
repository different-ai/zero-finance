import { useCallback, useState } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  type?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

export interface ToastOptions {
  title?: string
  description?: string
  type?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((options: ToastOptions) => {
    const id = crypto.randomUUID()
    const newToast: Toast = { ...options, id }
    setToasts(prev => [...prev, newToast])

    if (options.duration !== Infinity) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, options.duration || 5000)
    }
  }, [])

  return { toast, toasts }
} 