import { create } from 'zustand'

const API_KEY_STORAGE_KEY = 'openai-api-key'

interface ApiKeyState {
  apiKey: string | null
  setApiKey: (key: string | null) => void
  removeApiKey: () => void
}

export const useApiKeyStore = create<ApiKeyState>((set) => ({
  apiKey: localStorage.getItem(API_KEY_STORAGE_KEY),
  setApiKey: (key: string | null) => {
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key)
    }
    set({ apiKey: key })
  },
  removeApiKey: () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY)
    set({ apiKey: null })
  },
})) 