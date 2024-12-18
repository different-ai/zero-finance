import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppSettings {
  monitoredApps: string[];
  setMonitoredApps: (apps: string[]) => void;
}

export const useSettingsStore = create<AppSettings>()(
  persist(
    (set) => ({
      monitoredApps: ['Telegram', 'Arc'], // Default apps to monitor
      setMonitoredApps: (apps) => set({ monitoredApps: apps }),
    }),
    {
      name: 'app-settings',
    }
  )
); 