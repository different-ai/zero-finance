import { create } from 'zustand';

interface FileExplorerStore {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  toggleVisibility: () => void;
}

export const useFileExplorerStore = create<FileExplorerStore>((set) => ({
  isVisible: false,
  setIsVisible: (visible) => set({ isVisible: visible }),
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
})); 