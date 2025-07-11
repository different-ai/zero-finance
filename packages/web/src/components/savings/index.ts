// Main exports for the savings module
export { default as SavingsPanel } from "./savings-panel"
export { default as AllocationSlider } from "./components/allocation-slider"
export { default as AllocationDial } from "./allocation-dial"
export { default as TopUpSheet } from "./components/top-up-sheet"
export { default as SavingsOnboardingSheet } from "./components/savings-onboarding-sheet"

// Hooks
export { useOptimisticSavingsState } from "./hooks/use-optimistic-savings-state"
export { useSavingsRule } from "./hooks/use-savings-rule"

// Types
export type { SavingsState, VaultTransaction } from "./lib/types"

// Constants
export { ALLOC_KEY, FIRST_RUN_KEY } from "./lib/local-storage-keys"
