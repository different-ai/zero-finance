import { create } from 'zustand'

interface FilterState {
  status: 'all' | 'open' | 'completed'
  search: string
  setStatus: (status: 'all' | 'open' | 'completed') => void
  setSearch: (search: string) => void
}

export const useFilterStore = create<FilterState>((set) => ({
  status: 'all',
  search: '',
  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
})) 