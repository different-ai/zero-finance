import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '../legacy/task-utils'

interface DashboardState {
  activePanel: string
  isDemoMode: boolean
  setActivePanel: (panel: string) => void
  setDemoMode: (enabled: boolean) => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      activePanel: 'overview',
      isDemoMode: true,
      setActivePanel: (panel) => set({ activePanel: panel }),
      setDemoMode: (enabled) => {
        console.log("0xHypr", "Setting demo mode to", enabled);
        set({ isDemoMode: enabled });
      },
    }),
    {
      name: 'dashboard-store',
      version: 1,
    }
  )
)      