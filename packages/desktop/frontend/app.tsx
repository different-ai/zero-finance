import React, { useState, useEffect } from 'react';
import type { VaultConfig } from './deprecate/task-utils';
import { useEditorStore } from './deprecate/stores/editor-store';
import DashboardPage from './app/page';
import { useElectron } from './hooks/use-electron';

export function App() {
  const [vaultConfig, setVaultConfig] = useState<VaultConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFileExplorerCollapsed, setIsFileExplorerCollapsed] = useState(true);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(true);
  const { activeFile } = useEditorStore();
  const api = useElectron();

  // Load vault config
  useEffect(() => {
    const checkVaultConfig = async () => {
      try {
        const config = await api.getVaultConfig();
        if (config?.path) {
          // @ts-ignore
          setVaultConfig(config);
        }
      } catch (error) {
        console.error('Failed to get vault config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVaultConfig();
  }, []);

  // Show editor when a file is active
  useEffect(() => {
    if (activeFile && isEditorCollapsed) {
      setIsEditorCollapsed(false);
    }
  }, [activeFile]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <DashboardPage />;
}
