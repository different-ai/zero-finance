import React, { useState, useEffect } from 'react';
import { Button } from '@/renderer/components/ui/button';
import { MarkdownEditor } from './components/markdown-editor';
import type { VaultConfig } from '@/renderer/task-utils';
import { FileExplorer } from './components/file-explorer';
import { Folder, FileText } from 'lucide-react';
import { useEditorStore } from './stores/editor-store';
import { cn } from '@/lib/utils';
import DashboardPage from '@/app/page';
import { useElectron } from '@/hooks/use-electron';

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
