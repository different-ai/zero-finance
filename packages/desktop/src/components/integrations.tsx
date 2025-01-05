import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Github, 
  Slack, 
  Mail, 
  MessageSquare, 
  GitBranch, 
  BellIcon as BrandTelegram, 
  Monitor,
  Twitter, 
  Plus,
  FolderOpen,
  type LucideIcon 
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useFileExplorerStore } from '@/stores/file-explorer-store'
import { useVaultStore } from '@/stores/vault-store'

type Integration = {
  id: string
  name: string
  icon: LucideIcon
  status: 'Connected' | 'Disconnected'
  type: string
  isDemo?: boolean
  description?: string
  agent?: {
    name: string
    description: string
    configured: boolean
  }
}

const ACTIVE_INTEGRATIONS: Integration[] = [
  {
    id: 'screenpipe',
    name: 'Screenpipe',
    icon: Monitor,
    status: 'Connected',
    type: 'Screen Capture',
    description: 'Captures and processes screen content for task and event detection'
  },
  {
    id: 'file-system',
    name: 'File System',
    icon: FolderOpen,
    status: 'Disconnected',
    type: 'Data Source',
    description: 'Use markdown files from your file system as data source for AI agents'
  }
]

const DEMO_INTEGRATIONS: Integration[] = [
  { 
    id: 'github',
    name: 'GitHub',
    icon: Github,
    status: 'Disconnected',
    type: 'Development',
    isDemo: true,
    description: 'Coming soon: Track issues and PRs directly in your vault'
  },
  { 
    id: 'slack',
    name: 'Slack',
    icon: Slack,
    status: 'Disconnected',
    type: 'Communication',
    isDemo: true,
    description: 'Coming soon: Convert messages to tasks automatically'
  },
  { 
    id: 'linear',
    name: 'Linear',
    icon: GitBranch,
    status: 'Disconnected',
    type: 'Project Management',
    isDemo: true,
    description: 'Coming soon: Sync tasks with Linear tickets'
  },
  { 
    id: 'telegram',
    name: 'Telegram',
    icon: BrandTelegram,
    status: 'Disconnected',
    type: 'Communication',
    isDemo: true,
    description: 'Coming soon: Convert messages to tasks and events'
  }
]

interface VaultSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
}

const VaultSelectionDialog: React.FC<VaultSelectionDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const setVaultConfig = useVaultStore((state) => state.setVaultConfig);
  const setFileExplorerVisible = useFileExplorerStore((state) => state.setIsVisible);

  const handleSelectVault = async () => {
    try {
      const result = await window.api.selectVaultDirectory();
      if (result.success) {
        const config = {
          path: result.path!,
          isObsidian: result.isObsidian
        };
        // Update vault config in store and save to disk
        setVaultConfig(config);
        await window.api.saveVaultConfig(config);
        setFileExplorerVisible(true);
        onClose();
      }
    } catch (error) {
      console.error('0xHypr', 'Failed to select vault:', error);
    }
  };

  const handleCreateVault = async () => {
    try {
      const result = await window.api.createNewVault();
      if (result.success) {
        const config = {
          path: result.path!,
          isObsidian: result.isObsidian
        };
        // Update vault config in store and save to disk
        setVaultConfig(config);
        await window.api.saveVaultConfig(config);
        setFileExplorerVisible(true);
        onClose();
      }
    } catch (error) {
      console.error('0xHypr', 'Failed to create vault:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Data Source</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose an existing folder or create a new one to store your data
          </p>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSelectVault}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Select Existing Folder
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCreateVault}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Folder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function Integrations() {
  const [showDemo, setShowDemo] = useState(false)
  const [isVaultDialogOpen, setIsVaultDialogOpen] = useState(false)
  const { vaultConfig, setVaultConfig } = useVaultStore();
  const setFileExplorerVisible = useFileExplorerStore((state) => state.setIsVisible);

  // Load initial vault config
  useEffect(() => {
    const loadVaultConfig = async () => {
      const config = await window.api.getVaultConfig();
      setVaultConfig(config);
      // Show file explorer if vault is configured
      setFileExplorerVisible(!!config);
    };
    loadVaultConfig();
  }, [setVaultConfig, setFileExplorerVisible]);

  // Update integrations with current status
  const integrations = [...ACTIVE_INTEGRATIONS, ...(showDemo ? DEMO_INTEGRATIONS : [])].map(
    integration => {
      if (integration.id === 'file-system') {
        return {
          ...integration,
          status: vaultConfig ? ('Connected' as const) : ('Disconnected' as const)
        };
      }
      return integration;
    }
  );

  const handleConfigureIntegration = async (integration: Integration) => {
    if (integration.id === 'file-system') {
      if (integration.status === 'Connected') {
        // If connected, show current config or option to disconnect
        const shouldDisconnect = window.confirm('Do you want to disconnect the current vault?');
        if (shouldDisconnect) {
          await window.api.saveVaultConfig(null);
          setVaultConfig(null);
          setFileExplorerVisible(false);
        }
      } else {
        setIsVaultDialogOpen(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Integrations</CardTitle>
              <CardDescription>Connect your tools and services</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDemo(!showDemo)}
            >
              {showDemo ? 'Hide Demo' : 'Show Demo'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {integrations.map((integration) => (
              <Card 
                key={integration.id} 
                className={`p-4 flex flex-col items-center justify-center ${
                  integration.status === 'Connected' ? 'bg-primary/10' : ''
                }`}
              >
                <integration.icon className="h-10 w-10 mb-2" />
                <h3 className="font-semibold text-center">{integration.name}</h3>
                <Badge 
                  variant={integration.isDemo ? 'secondary' : 
                    integration.status === 'Connected' ? 'default' : 'secondary'}
                >
                  {integration.isDemo ? 'Coming Soon' : integration.status}
                </Badge>
                {integration.description && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {integration.description}
                  </p>
                )}
                {!integration.isDemo && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleConfigureIntegration(integration)}
                  >
                    {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                  </Button>
                )}
              </Card>
            ))}
            <Card className="p-4 flex flex-col items-center justify-center border-dashed">
              <Plus className="h-10 w-10 mb-2" />
              <h3 className="font-semibold text-center">Request Integration</h3>
              <Button variant="outline" size="sm" className="mt-2">
                Submit Request
              </Button>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Only show settings for active integrations */}
      {ACTIVE_INTEGRATIONS.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>Configure your connected services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ACTIVE_INTEGRATIONS.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <integration.icon className="h-6 w-6" />
                    <span>{integration.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleConfigureIntegration(integration)}
                  >
                    Configure
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <VaultSelectionDialog 
        isOpen={isVaultDialogOpen}
        onClose={() => setIsVaultDialogOpen(false)}
      />
    </div>
  )
}

