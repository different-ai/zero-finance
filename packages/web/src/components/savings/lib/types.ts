// No changes from previous version
export interface VaultTransaction {
  id: string
  type: "deposit" | "withdrawal" | "manual_deposit" | "interest"
  amount: number
  skimmedAmount?: number
  timestamp: number
  source?: string
  txHash?: string
}

export interface SavingsState {
  enabled: boolean
  allocation: number
  apy: number
  firstEnabledAt?: number | null
  currentVaultBalance?: number
  recentTransactions?: VaultTransaction[]
}
