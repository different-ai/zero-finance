import { useEffect, useState } from 'react';
import type { ElectronAPI } from '../types/electron';

export function useElectron() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if we're in Electron environment
    const isElectronEnv = window?.api !== undefined;
    setIsElectron(isElectronEnv);
  }, []);

  if (!isElectron) {
    console.warn('Running outside of Electron environment');
    // Return mock API for development/testing
    return {
      api: {
        getVaultConfig: async () => ({ enabled: false, path: '/mock/path' }),
        setVaultConfig: async () => true,
        // Add other mock APIs as needed
      },
    };
  }

  return window;
}

// Type guard for checking electron availability
export function isElectronAvailable(): boolean {
  return window?.api !== undefined;
}

// Example of a more specific hook for a particular feature
export const useVault = () => {
  const api = useElectron();

  const getConfig = useCallback(async () => {
    return api.getVaultConfig();
  }, [api]);

  const saveConfig = useCallback(async (config: Parameters<ElectronAPI['saveVaultConfig']>[0]) => {
    return api.saveVaultConfig(config);
  }, [api]);

  return {
    getConfig,
    saveConfig,
  };
};                                                