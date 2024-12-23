// Type definitions for the Electron preload bridge

export interface VaultConfig {
  path: string;
  isObsidian?: boolean;
}

export interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  stats?: {
    size: number;
    mtime: Date;
    ctime: Date;
  };
}

export interface MarkdownContent {
  content: string;
  metadata?: Record<string, any>;
}

export interface TaskData {
  title: string;
  content: string;
  details?: string;
}

// Define the API interface that matches your preload.ts exports
export interface ElectronAPI {
  // Vault management
  getVaultConfig: () => Promise<VaultConfig | null>;
  saveVaultConfig: (config: VaultConfig) => Promise<boolean>;
  selectVaultDirectory: () => Promise<{
    success: boolean;
    path?: string;
    isObsidian?: boolean;
  }>;
  createNewVault: () => Promise<{
    success: boolean;
    path?: string;
    isObsidian?: boolean;
  }>;

  // File operations
  readMarkdownFile: (path: string) => Promise<MarkdownContent>;
  writeMarkdownFile: (path: string, content: string) => Promise<boolean>;
  getFileStats: (filePath: string) => Promise<any>;
  listFiles: (directory: string) => Promise<FileInfo[]>;
  
  // Task operations
  createTask: (taskData: { name: string; description: string }) => Promise<any>;
  
  // File watching
  watchFiles: (path: string, callback: (path: string) => void) => Promise<void>;
  unwatchFiles: (path: string) => Promise<void>;
  
  // Folder operations
  listFolderContents: (folderPath: string) => Promise<FileInfo[]>;
  revealInFileSystem: (path: string) => Promise<void>;
  
  // Invoice operations
  createInvoiceRequest: (data: {
    recipient: {
      name: string;
      address?: string;
      email?: string;
    };
    amount: number;
    currency: string;
    description: string;
    dueDate?: string;
  }) => Promise<{ success: boolean; requestId?: string }>;

  // Other operations as needed...
}

// Augment the window interface
declare global {
  interface Window {
    api: ElectronAPI;
  }
} 