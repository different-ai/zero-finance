import { create } from 'zustand'

export type ModelType = 'gpt-4o' | 'o1-preview'

interface ModelState {
  selectedModel: ModelType
  setSelectedModel: (model: ModelType) => void
}

export const useModelStore = create<ModelState>((set) => ({
  selectedModel: 'gpt-4o',
  setSelectedModel: (model) => set({ selectedModel: model }),
})) 