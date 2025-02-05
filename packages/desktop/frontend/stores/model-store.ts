import { create } from 'zustand'

export type ModelType = 'o3-mini' | 'o1-preview'

interface ModelState {
  selectedModel: ModelType
  setSelectedModel: (model: ModelType) => void
}

export const useModelStore = create<ModelState>((set) => ({
  selectedModel: 'o3-mini',
  setSelectedModel: (model) => set({ selectedModel: model }),
})) 