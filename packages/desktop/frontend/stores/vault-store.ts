import { create } from 'zustand';

interface VaultStore {
  vaultConfig: { path: string; isObsidian?: boolean } | null;
  setVaultConfig: (config: { path: string; isObsidian?: boolean } | null) => void;
}

export const useVaultStore = create<VaultStore>((set) => ({
  vaultConfig: null,
  setVaultConfig: (config) => set({ vaultConfig: config }),
})); 