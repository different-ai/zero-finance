// connected-apps.tsx
import React, { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Monitor, Plus, FolderOpen, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/stores/dashboard-store'
import { useVaultStore } from '@/stores/vault-store'
import { ACTIVE_INTEGRATIONS } from './integrations'

type Integration = {
  id: string
  name: string
  icon: LucideIcon
  status: 'Connected' | 'Disconnected'
  type: string
  isDemo?: boolean
  description?: string
}

const INTEGRATIONS: Integration[] = ACTIVE_INTEGRATIONS;

export function ConnectedApps() {
  const { setActivePanel } = useDashboardStore()
  const { vaultConfig, setVaultConfig } = useVaultStore()

  // Load initial vault config
  useEffect(() => {
    const loadVaultConfig = async () => {
      const config = await window.api.getVaultConfig();
      setVaultConfig(config);
    };
    loadVaultConfig();
  }, [setVaultConfig]);

  // Update integrations with current status
  const activeIntegrations = INTEGRATIONS.map(integration => {
    if (integration.id === 'file-system') {
      return {
        ...integration,
        status: vaultConfig ? ('Connected' as const) : ('Disconnected' as const)
      };
    }
    return integration;
  }).filter(integration => integration.status === 'Connected');

  if (!activeIntegrations.length) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-muted-foreground text-sm">No active integrations</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActivePanel('integrations')}
            >
              View Available
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {activeIntegrations.map((integration) => (
            <Card 
              key={integration.id} 
              className="relative p-6 flex flex-col bg-card border-0 shadow-none"
            >
              <div className="flex flex-col space-y-2">
                <integration.icon className="h-8 w-8 text-foreground mb-2" />
                <h3 className="font-semibold text-lg">{integration.name}</h3>
                <Badge 
                  variant="default" 
                  className="w-fit text-xs font-medium"
                >
                  {integration.status}
                </Badge>
                {integration.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {integration.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
          <Card 
            className="relative p-6 flex flex-col items-center justify-center border border-dashed bg-background/50 hover:bg-background/80 transition-colors"
          >
            <div className="flex flex-col items-center space-y-2">
              <Plus className="h-8 w-8 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Add Integration</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActivePanel('integrations')}
              >
                View Available
              </Button>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}