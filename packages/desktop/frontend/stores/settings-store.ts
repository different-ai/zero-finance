import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  monitoredApps: string[];
  autoClassifyEnabled: boolean;
  setMonitoredApps: (apps: string[]) => void;
  setAutoClassifyEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      monitoredApps: [],
      autoClassifyEnabled: true, // default to true
      setMonitoredApps: (apps) => set({ monitoredApps: apps }),
      setAutoClassifyEnabled: (enabled) => set({ autoClassifyEnabled: enabled }),
    }),
    {
      name: 'hypr-settings',
      partialize: (state) => ({
        monitoredApps: state.monitoredApps,
        autoClassifyEnabled: state.autoClassifyEnabled,
      }),
    }
  )
); 