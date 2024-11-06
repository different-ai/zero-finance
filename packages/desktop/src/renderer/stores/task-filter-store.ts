import { create } from 'zustand'
import { addDays, subDays, subMonths, subYears, startOfDay } from 'date-fns'

type SortOrder = 'most-recent' | 'least-recent'
type DateRange = '7-days' | '14-days' | '30-days' | '3-months' | '1-year' | 'custom'

interface FilterState {
  status: 'all' | 'open' | 'completed'
  search: string
  sortOrder: SortOrder
  dateRange: DateRange
  customDateFrom: Date | null
  customDateTo: Date | null
  setStatus: (status: 'all' | 'open' | 'completed') => void
  setSearch: (search: string) => void
  setSortOrder: (order: SortOrder) => void
  setDateRange: (range: DateRange) => void
  setCustomDateRange: (from: Date | null, to: Date | null) => void
  getDateRangeLabel: () => string
  getDateRange: () => { from: Date; to: Date }
}

export const useFilterStore = create<FilterState>((set, get) => ({
  status: 'all',
  search: '',
  sortOrder: 'most-recent',
  dateRange: '7-days',
  customDateFrom: null,
  customDateTo: null,

  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
  setSortOrder: (order) => set({ sortOrder }),
  setDateRange: (range) => set({ 
    dateRange: range,
    // Reset custom dates when switching to preset range
    ...(range !== 'custom' && {
      customDateFrom: null,
      customDateTo: null
    })
  }),
  setCustomDateRange: (from, to) => set({ 
    dateRange: 'custom',
    customDateFrom: from,
    customDateTo: to 
  }),

  getDateRangeLabel: () => {
    const { dateRange } = get()
    switch (dateRange) {
      case '7-days': return 'Last 7 days'
      case '14-days': return 'Last 14 days'
      case '30-days': return 'Last 30 days'
      case '3-months': return 'Last 3 months'
      case '1-year': return 'Last year'
      case 'custom': return 'Custom range'
    }
  },

  getDateRange: () => {
    const { dateRange, customDateFrom, customDateTo } = get()
    const today = startOfDay(new Date())

    if (dateRange === 'custom' && customDateFrom && customDateTo) {
      return { from: customDateFrom, to: customDateTo }
    }

    switch (dateRange) {
      case '7-days':
        return { from: subDays(today, 7), to: today }
      case '14-days':
        return { from: subDays(today, 14), to: today }
      case '30-days':
        return { from: subDays(today, 30), to: today }
      case '3-months':
        return { from: subMonths(today, 3), to: today }
      case '1-year':
        return { from: subYears(today, 1), to: today }
      default:
        return { from: subDays(today, 7), to: today }
    }
  }
})) 