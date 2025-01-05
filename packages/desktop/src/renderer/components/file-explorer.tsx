import React, { useState, useEffect } from 'react'
import { FileIcon, FolderIcon, Settings, Key, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/renderer/components/ui/button'
import type { FileInfo } from '@/renderer/types'
import { useApiKeyStore } from '@/stores/api-key-store'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/renderer/components/ui/context-menu'
import { ScrollArea } from '@/renderer/components/ui/scroll-area'
import { useEditorStore } from '@/renderer/stores/editor-store'
import { useFileExplorerStore } from '@/stores/file-explorer-store'

function ApiKeyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { apiKey, setApiKey, removeApiKey } = useApiKeyStore()
  const [tempApiKey, setTempApiKey] = useState('')

  const handleSave = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey)
      setTempApiKey('')
    }
    onClose()
  }

  const handleRemove = () => {
    removeApiKey()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">OpenAI API Key Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current API Key
            </label>
            <input
              type="password"
              value={apiKey || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New API Key
            </label>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700"
            >
              Remove Key
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!tempApiKey.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FileExplorerProps {
  vaultPath: string
  onSelectVault: () => void
  onCreateVault: () => void
}

export function FileExplorer({
  vaultPath,
  onSelectVault,
  onCreateVault,
}: FileExplorerProps) {
  const isVisible = useFileExplorerStore((state) => state.isVisible);
  
  // If not visible, don't render anything
  if (!isVisible) return null;

  const [files, setFiles] = useState<FileInfo[]>([])
  const [currentPath, setCurrentPath] = useState<string>(vaultPath)
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [folderContents, setFolderContents] = useState<Record<string, FileInfo[]>>({})
  
  // Get the setActiveFile from our store
  const { activeFile, setActiveFile } = useEditorStore()

  const loadFiles = async (directoryPath: string) => {
    try {
      if (!directoryPath) return;
      
      const loadedFiles = await window.api.listFiles(directoryPath);
      setFiles(loadedFiles);
      setCurrentPath(directoryPath);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  // Load initial files when vault path changes
  useEffect(() => {
    if (vaultPath) {
      loadFiles(vaultPath);
    }
  }, [vaultPath]);

  const toggleFolder = async (folder: FileInfo) => {
    if (expandedFolders[folder.path]) {
      // Collapse folder
      setExpandedFolders(prev => ({
        ...prev,
        [folder.path]: false
      }))
      return
    }

    try {
      // Expand folder and load contents
      const contents = await window.api.listFolderContents(folder.path)
      setFolderContents(prev => ({
        ...prev,
        [folder.path]: contents
      }))
      setExpandedFolders(prev => ({
        ...prev,
        [folder.path]: true
      }))
    } catch (error) {
      console.error('Failed to load folder contents:', error)
    }
  }

  const handleFileSelect = async (file: FileInfo) => {
    if (!file.isDirectory && isMarkdown(file)) {
      try {
        // Use readMarkdownFile instead of readFile
        const content = await window.api.readMarkdownFile(file.path)
        setActiveFile({
          path: file.path,
          content
        })
      } catch (error) {
        console.error('Failed to load file:', error)
      }
    }
  }

  const handleReveal = async (file: FileInfo) => {
    try {
      // Use revealInFileSystem instead of revealInFileExplorer
      await window.api.revealInFileSystem(file.path)
    } catch (error) {
      console.error('Failed to reveal file:', error)
    }
  }

  const renderFileItem = (file: FileInfo, depth = 0) => {
    if (!file.isDirectory && !isMarkdown(file)) {
      return null
    }

    const isActive = activeFile?.path === file.path

    return (
      <div className="">
        <ContextMenu>
          <ContextMenuTrigger>
            <button
              onClick={() => file.isDirectory ? toggleFolder(file) : handleFileSelect(file)}
              className={cn(
                "w-full flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-accent text-sm",
                "text-left transition-colors",
                isActive && "bg-accent",
                !file.isDirectory && !isMarkdown(file) && "opacity-50 cursor-not-allowed"
              )}
              style={{ paddingLeft: `${(depth + 1) * 0.5}rem` }}
            >
              {file.isDirectory ? (
                <FolderIcon className={cn(
                  "h-4 w-4 transition-transform",
                  expandedFolders[file.path] && "transform rotate-90"
                )} />
              ) : (
                <FileIcon className="h-4 w-4" />
              )}
              <span className="truncate">{file.name}</span>
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleReveal(file)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Reveal in File System
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        
        {/* Add nested folder contents */}
        {expandedFolders[file.path] && folderContents[file.path] && (
          <div className="ml-2">
            {folderContents[file.path]
              .sort((a, b) => {
                if (a.isDirectory !== b.isDirectory) {
                  return a.isDirectory ? -1 : 1
                }
                return a.name.localeCompare(b.name)
              })
              .map(nestedFile => (
                <div key={nestedFile.path}>
                  {renderFileItem(nestedFile, depth + 1)}
                </div>
              ))
            }
          </div>
        )}
      </div>
    )
  }

  const isMarkdown = (file: FileInfo) => file.name.toLowerCase().endsWith('.md')

  const sortedFiles = [...files].sort((a, b) => {
    // Directories first
    if (a.isDirectory !== b.isDirectory) {
      return a.isDirectory ? -1 : 1
    }
    // Then alphabetically
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="w-64 border-r border-border bg-muted/30 flex flex-col h-screen">
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="flex items-center justify-between px-2 mb-4">
            <h2 className="text-lg font-semibold">Files</h2>
          </div>
          <div className="space-y-1">
            {sortedFiles.map(file => <div key={file.path}>{renderFileItem(file)}</div>)}
          </div>
        </div>
      </ScrollArea>
      
      {/* Vault Settings - Fixed at bottom */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full justify-start"
            onClick={onSelectVault}
          >
            <FolderIcon className="h-4 w-4 mr-2" />
            Switch Vault
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full justify-start"
            onClick={onCreateVault}
          >
            <Settings className="h-4 w-4 mr-2" />
            Create New Vault
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full justify-start"
            onClick={() => setIsApiKeyModalOpen(true)}
          >
            <Key className="h-4 w-4 mr-2" />
            API Key Settings
          </Button>
        </div>
      </div>

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  )
} 