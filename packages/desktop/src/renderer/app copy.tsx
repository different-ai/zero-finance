import React, { useState, useEffect } from 'react';
import { Button } from '@/renderer/components/ui/button';
import { MarkdownEditor } from './components/markdown-editor';
import type { VaultConfig } from '@/renderer/types';
import { FileExplorer } from './components/file-explorer';
import { TaskDashboard } from './components/task-dashboard';
import { Folder, FileText } from 'lucide-react';
import { useEditorStore } from './stores/editor-store';
import { cn } from '@/lib/utils';

export function App() {
  const [vaultConfig, setVaultConfig] = useState<VaultConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFileExplorerCollapsed, setIsFileExplorerCollapsed] = useState(true);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(true);
  const { activeFile } = useEditorStore();

  // Load vault config
  useEffect(() => {
    const checkVaultConfig = async () => {
      try {
        const config = await window.api.getVaultConfig();
        if (config?.path) {
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

  return (
    <div className="h-screen grid" style={{
      gridTemplateColumns: `
        ${isFileExplorerCollapsed ? '3rem' : '250px'} 
        1fr 
        ${!isEditorCollapsed ? '400px' : '3rem'}
      `
    }}>
      {/* File Explorer */}
      {isFileExplorerCollapsed ? (
        <div className="border-r bg-background flex flex-col items-center py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFileExplorerCollapsed(false)}
          >
            <Folder className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="border-r bg-background relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => setIsFileExplorerCollapsed(true)}
          >
            <Folder className="h-5 w-5" />
          </Button>
          {vaultConfig && (
            <FileExplorer
              vaultPath={vaultConfig.path}
              onSelectVault={() => {}}
              onCreateVault={() => {}}
            />
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="overflow-auto">
        {vaultConfig && <TaskDashboard vaultPath={vaultConfig.path} />}
      </div>

      {/* Editor */}
      <div className={cn(
        "border-l bg-background transition-all duration-200",
        isEditorCollapsed && !activeFile && "hidden"
      )}>
        {isEditorCollapsed ? (
          <div className="flex flex-col items-center py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditorCollapsed(false)}
            >
              <FileText className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="h-full relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setIsEditorCollapsed(true)}
            >
              <FileText className="h-5 w-5" />
            </Button>
            <MarkdownEditor />
          </div>
        )}
      </div>
    </div>
  );
}
