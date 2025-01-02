import { contextBridge, ipcRenderer, IpcRendererEvent, shell } from 'electron';
import type { VaultConfig, FileInfo, MarkdownContent, ElectronAPI, ICreateRequestParameters } from '../src/types/electron';
const debug = (...args: any[]) => {
  console.log('[Preload]', ...args);
};

// Type-safe wrapper for IPC calls
const api: ElectronAPI = {
  // Vault management
  getVaultConfig: async () => {
    debug('Getting vault config');
    return ipcRenderer.invoke(
      'vault:get-config'
    ) as Promise<VaultConfig | null>;
  },
  saveVaultConfig: (config: VaultConfig) =>
    ipcRenderer.invoke('vault:save-config', config) as Promise<boolean>,
  selectVaultDirectory: () =>
    ipcRenderer.invoke('vault:select-directory') as Promise<{
      success: boolean;
      path?: string;
      isObsidian?: boolean;
    }>,
  createNewVault: () =>
    ipcRenderer.invoke('vault:create-new') as Promise<{
      success: boolean;
      path?: string;
      isObsidian?: boolean;
    }>,

  // File operations
  readMarkdownFile: (path: string) => {
    if (!path) throw new Error('Path is required for reading markdown file');
    return ipcRenderer.invoke(
      'file:read-markdown',
      path
    ) as Promise<MarkdownContent>;
  },
  writeMarkdownFile: (path: string, content: string) => {
    console.log('Writing markdown file to:', path);
    if (!path) throw new Error('Path is required for writing markdown file');
    return ipcRenderer.invoke(
      'file:write-markdown',
      path,
      content
    ) as Promise<boolean>;
  },
  getFileStats: async (filePath: string) => {
    return ipcRenderer.invoke('file:get-stats', filePath);
  },
  listFiles: async (directory: string) => {
    debug('Listing files for directory:', directory);
    if (!directory || typeof directory !== 'string') {
      throw new Error(
        `Directory path is required and must be a string. Received: ${typeof directory}`
      );
    }
    try {
      const files = (await ipcRenderer.invoke(
        'file:list',
        directory
      )) as FileInfo[];
      debug('Files received:', files.length);
      return files;
    } catch (error) {
      debug('Error listing files:', error);
      throw error;
    }
  },

  createTask: async (taskData: { name: string; description: string }) => {
    const config = await ipcRenderer.invoke('vault:get-config');
    if (!config?.path) {
      throw new Error('No vault configured');
    }

    return ipcRenderer.invoke('task:create', {
      ...taskData,
      vaultPath: config.path,
    });
  },
  watchFiles: (path: string, callback: (path: string) => void) => {
    debug('Setting up file watcher for:', path);
    
    // Remove any existing listeners
    ipcRenderer.removeAllListeners('file:changed');
    
    // Add new listener that calls the callback with the changed path
    ipcRenderer.on('file:changed', (_, data: { type: string, path: string }) => {
      callback(data.path);
    });
    
    return ipcRenderer.invoke('file:watch', path);
  },

  unwatchFiles: (path: string) => {
    debug('Removing file watcher for:', path);
    ipcRenderer.removeAllListeners('file:changed');
    return ipcRenderer.invoke('file:unwatch', path);
  },

  listFolderContents: async (folderPath: string) => {
    debug('Listing contents for folder:', folderPath);
    if (!folderPath || typeof folderPath !== 'string') {
      throw new Error('Folder path is required and must be a string');
    }
    try {
      const files = (await ipcRenderer.invoke(
        'folder:list-contents',
        folderPath
      )) as FileInfo[];
      debug('Folder contents received:', files.length);
      return files;
    } catch (error) {
      debug('Error listing folder contents:', error);
      throw error;
    }
  },

  revealInFileSystem: (path: string) => {
    debug('Revealing path in file system:', path);
    if (!path || typeof path !== 'string') {
      throw new Error('Path is required and must be a string');
    }
    return ipcRenderer.invoke('file:reveal-in-system', path) as Promise<void>;
  },

  writeMarkdownToVault: async (name: string, content: string) => {
    debug('Writing markdown to vault:', name);

    const config = (await ipcRenderer.invoke(
      'vault:get-config'
    )) as VaultConfig | null;
    if (!config?.path) {
      throw new Error('No vault configured');
    }

    // Ensure name has .md extension
    const fileName = name.endsWith('.md') ? name : `${name}.md`;
    const fullPath = `${config.path}/${fileName}`;

    return ipcRenderer.invoke(
      'file:write-markdown',
      fullPath,
      content
    ) as Promise<boolean>;
  },

  // File watching with correct types
  watchFolder: (
    folderPath: string,
    callback: (event: any, files: FileInfo[]) => void
  ) => {
    debug('Setting up watcher for:', folderPath);
    // Remove any existing listeners first to prevent duplicates
    ipcRenderer.removeAllListeners('folder:changed');
    // Add the new listener
    ipcRenderer.on('folder:changed', callback);
    // Start watching on the main process
    return ipcRenderer.invoke('folder:watch', folderPath);
  },

  unwatchFolder: (folderPath: string) => {
    debug('Removing watcher for:', folderPath);
    ipcRenderer.removeAllListeners('folder:changed');
    // Stop watching on the main process
    return ipcRenderer.invoke('folder:unwatch', folderPath);
  },

  analyzeMarkdownForTasks: async (filePath: string) => {
    const content = await ipcRenderer.invoke('file:read-markdown', filePath);
    // Use regex to find tasks in markdown content
    const taskRegex = /- \[([ x])\] (.*)/g;
    const tasks: Array<{
      completed: boolean;
      title: string;
      tags: string[];
    }> = [];

    let match;
    while ((match = taskRegex.exec(content)) !== null) {
      const completed = match[1] === 'x';
      const title = match[2];
      const tags = title.match(/#[a-zA-Z0-9-_]+/g) || [];
      tasks.push({ completed, title, tags });
    }

    return tasks;
  },


  findLinkedNotes: async (filePath: string) => {
    const content = await ipcRenderer.invoke('file:read-markdown', filePath);
    // Find wiki-style links [[Note Name]]
    const linkRegex = /\[\[(.*?)\]\]/g;
    const links = new Set<string>();

    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      links.add(match[1]);
    }

    return Array.from(links);
  },
  openExternal: (url: string) => {
    debug('Opening external URL:', url);
    if (!url) throw new Error('URL is required for opening external link');
    return ipcRenderer.invoke('shell:open-external', url);
  },
  listMarkdownFiles: async (directory: string) => {
    debug('Listing markdown files for directory:', directory);
    if (!directory || typeof directory !== 'string') {
      throw new Error(
        `Directory path is required and must be a string. Received: ${typeof directory}`
      );
    }
    try {
      const files = (await ipcRenderer.invoke(
        'file:list-markdown',
        directory
      )) as FileInfo[];
      debug('Markdown files received:', files.length);
      return files;
    } catch (error) {
      debug('Error listing markdown files:', error);
      throw error;
    }
  },

  getAllTasks: async (vaultPath: string) => {
    debug('Getting all tasks from vault:', vaultPath)
    if (!vaultPath) throw new Error('Vault path is required')
    return ipcRenderer.invoke('tasks:get-all', vaultPath)
  },

  addToCalendar: (params: { 
    icsPath: string, 
    content: string,
    event: {
      title: string
      startTime: string
      endTime: string
      location?: string
      description?: string
      attendees?: string[]
    }
  }) => ipcRenderer.invoke('add-to-calendar', params),

  openCalendar: (calendarUrl: string) => ipcRenderer.invoke('open-calendar', calendarUrl),

  // Invoice operations
  processInvoice: (invoice: {
    recipient: {
      name: string;
      address?: string;
      email?: string;
    };
    amount: number;
    currency: string;
    description: string;
    dueDate?: string;
  }) => {
    debug('Sending invoice to main process:', invoice);
    return ipcRenderer.invoke('invoice:process', invoice);
  },

  // Request Network methods
  createInvoiceRequest: async (data: ICreateRequestParameters) => {
    debug('Creating invoice request:', data);
    try {
      const result = await ipcRenderer.invoke('create-invoice-request', data);
      return result;
    } catch (error) {
      debug('Failed to create invoice request:', error);
      throw error;
    }
  },

  getPayeeAddress: async () => {
    debug('Getting payee address');
    try {
      const address = await ipcRenderer.invoke('get-payee-address');
      return address;
    } catch (error) {
      debug('Failed to get payee address:', error);
      throw error;
    }
  },

  getUserRequests: async () => {
    debug('Getting user requests');
    try {
      const requests = await ipcRenderer.invoke('get-user-requests');
      return requests;
    } catch (error) {
      debug('Failed to get user requests:', error);
      throw error;
    }
  },

  // Add missing methods
  updateTaskInFile: async (filePath: string, task: any) => {
    debug('Updating task in file:', { filePath, task });
    return ipcRenderer.invoke('task:update-in-file', filePath, task);
  },

  openFile: async (filePath: string) => {
    debug('Opening file:', filePath);
    return ipcRenderer.invoke('file:open', filePath);
  },

  openInObsidian: async (filePath: string) => {
    debug('Opening file in Obsidian:', filePath);
    return ipcRenderer.invoke('file:open-in-obsidian', filePath);
  }
} satisfies ElectronAPI;

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('api', api as ElectronAPI);

// Export types
export type { ElectronAPI } from '../src/types/electron';

// Note: Window interface is declared in src/types/window.d.ts
