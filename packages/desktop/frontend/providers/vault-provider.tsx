import React, { createContext, useContext, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'

interface VaultConfig {
  path: string
  isObsidian?: boolean
}

interface VaultContextType {
  vaultConfig: VaultConfig | null
  isLoading: boolean
  selectVault: () => Promise<void>
  createNewVault: () => Promise<void>
}

const VaultContext = createContext<VaultContextType | null>(null)

export const useVault = () => {
  const context = useContext(VaultContext)
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider')
  }
  return context
}

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [vaultConfig, setVaultConfig] = useState<VaultConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    loadVaultConfig()
  }, [])

  const loadVaultConfig = async () => {
    try {
      const config = await window.api.getVaultConfig()
      setVaultConfig(config)
      setIsLoading(false)
      if (!config) {
        setShowDialog(true)
      }
    } catch (error) {
      console.error('Failed to load vault config:', error)
      toast.error('Failed to load vault configuration')
      setIsLoading(false)
    }
  }

  const selectVault = async () => {
    try {
      const result = await window.api.selectVaultDirectory()
      if (result.success) {
        const config = { path: result.path, isObsidian: result.isObsidian }
        await window.api.saveVaultConfig(config)
        setVaultConfig(config)
        setShowDialog(false)
        toast.success('Vault configured successfully')
      }
    } catch (error) {
      console.error('Failed to select vault:', error)
      toast.error('Failed to select vault')
    }
  }

  const createNewVault = async () => {
    try {
      const result = await window.api.createNewVault()
      if (result.success) {
        const config = { path: result.path, isObsidian: result.isObsidian }
        await window.api.saveVaultConfig(config)
        setVaultConfig(config)
        setShowDialog(false)
        toast.success('New vault created successfully')
      }
    } catch (error) {
      console.error('Failed to create new vault:', error)
      toast.error('Failed to create new vault')
    }
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  return (
    <VaultContext.Provider value={{ vaultConfig, isLoading, selectVault, createNewVault }}>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome to HyprSqrl</DialogTitle>
            <DialogDescription>
              Please select an existing vault or create a new one to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button onClick={selectVault} variant="outline">
              Select Existing Vault
            </Button>
            <Button onClick={createNewVault}>
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