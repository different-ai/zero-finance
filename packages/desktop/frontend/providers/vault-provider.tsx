import React, { createContext, useContext, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import { useElectron, isElectronAvailable } from '@/hooks/use-electron'

interface VaultConfig {
  enabled: boolean
  path: string
}

interface VaultContextType {
  config: VaultConfig | null
  isLoading: boolean
  error: Error | null
  updateConfig: (newConfig: VaultConfig) => Promise<void>
}

const VaultContext = createContext<VaultContextType | undefined>(undefined)

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const { api } = useElectron()
  const [config, setConfig] = useState<VaultConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const loadVaultConfig = async () => {
    try {
      if (!isElectronAvailable()) {
        console.warn('Running outside Electron - using mock vault config')
        setConfig({ enabled: false, path: '/mock/path' })
        return
      }

      const config = await api.getVaultConfig()
      setConfig(config)
      if (!config) {
        setShowDialog(true)
      }
    } catch (err) {
      console.error('0xHypr', 'Failed to load vault config:', err)
      setError(err instanceof Error ? err : new Error('Failed to load vault config'))
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = async (newConfig: VaultConfig) => {
    try {
      if (!isElectronAvailable()) {
        console.warn('Running outside Electron - mock config update')
        setConfig(newConfig)
        return
      }

      await api.setVaultConfig(newConfig)
      setConfig(newConfig)
    } catch (err) {
      console.error('0xHypr', 'Failed to update vault config:', err)
      throw err
    }
  }

  useEffect(() => {
    loadVaultConfig()
  }, [])

  const value = {
    config,
    isLoading,
    error,
    updateConfig,
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  return (
    <VaultContext.Provider value={value}>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome to HyprSqrl</DialogTitle>
            <DialogDescription>
              Please select an existing vault or create a new one to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button onClick={() => {}} variant="outline">
              Select Existing Vault
            </Button>
            <Button onClick={() => {}}>
              Create New Vault
            </Button>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              A vault is a directory where HyprSqrl stores all your tasks, notes, and data.
              It can be an existing Obsidian vault or a new directory.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {children}
    </VaultContext.Provider>
  )
}

export function useVault() {
  const context = useContext(VaultContext)
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider')
  }
  return context
} 