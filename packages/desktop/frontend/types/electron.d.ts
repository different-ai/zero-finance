import { Types } from '@requestnetwork/request-client.js';
import { RequestLogicTypes } from '@requestnetwork/types';

export interface FileInfo {
  name: string
  path: string
  isDirectory: boolean
}

export interface MarkdownContent {
  content: string
  frontMatter: any
  stats: {
    birthtime: string
    mtime: string
    atime: string
  }
}

export interface VaultConfig {
  path: string;
  isObsidian?: boolean;
  lastOpened?: string;
  vaultName?: string;
}

export interface ICreateRequestParameters {
  requestInfo: Types.IRequestInfo;
  paymentNetwork?: Types.PaymentNetworkCreateParameters;
  contentData?: any;
}

export interface MarkdownSearchResult {
  type: 'markdown';
  content: {
    text: string;
    filePath: string;
    fileName: string;
    lineNumber?: number;
    matchContext?: string;
    metadata?: {
      title?: string;
      tags?: string[];
      created?: string;
      updated?: string;
      [key: string]: any;
    };
  };
}

export interface ElectronAPI {
  // Vault management
  getVaultConfig: () => Promise<VaultConfig | null>
  saveVaultConfig: (config: VaultConfig) => Promise<{ success: boolean; path: string }>
  selectVaultDirectory: () => Promise<{ success: boolean; path: string; isObsidian?: boolean }>
  createNewVault: () => Promise<{ success: boolean; path: string; isObsidian?: boolean }>
  createVaultDirectory: () => Promise<{ success: boolean; path: string; isObsidian?: boolean }>

  // File operations
  createFolder: (folderPath: string) => Promise<boolean>
  readMarkdownFile: (path: string) => Promise<MarkdownContent>
  writeMarkdownFile: (path: string, content: string) => Promise<boolean>
  listFiles: (directory: string) => Promise<FileInfo[]>
  listMarkdownFiles: (directory: string) => Promise<FileInfo[]>
  openExternal: (url: string) => Promise<void>
  writeMarkdownToVault: (name: string, content: string) => Promise<boolean>
  listFolderContents: (folderPath: string) => Promise<FileInfo[]>
  revealInFileSystem: (path: string) => Promise<void>

  // File watching
  watchFiles: (path: string, callback: (path: string) => void) => Promise<void>
  unwatchFiles: (path: string) => Promise<void>
  watchFolder: (folderPath: string, callback: (event: any, files: FileInfo[]) => void) => Promise<void>
  unwatchFolder: (folderPath: string) => Promise<void>

  // Task management
  createTask: (taskData: { name: string; description: string }) => Promise<any>
  getAllTasks: (vaultPath: string) => Promise<any>
  analyzeMarkdownForTasks: (filePath: string) => Promise<Array<{ completed: boolean; title: string; tags: string[] }>>
  updateTaskInFile: (filePath: string, task: any) => Promise<boolean>
  openFile: (filePath: string) => Promise<void>
  openInObsidian: (filePath: string) => Promise<void>

  // Note operations
  findLinkedNotes: (filePath: string) => Promise<string[]>

  // Calendar operations
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
  }) => Promise<any>
  openCalendar: (calendarUrl: string) => Promise<any>

  // Invoice operations
  processInvoice: (invoice: {
    recipient: {
      name: string
      address?: string
      email?: string
    }
    amount: number
    currency: string
    description: string
    dueDate?: string
  }) => Promise<any>

  // Request Network methods
  createInvoiceRequest: (data: Partial<ICreateRequestParameters>) => Promise<{ success: boolean; requestId: string; token: string; error?: string }>
  getPayeeAddress: () => Promise<string>
  generateInvoiceUrl: (requestId: string, token: string) => Promise<string>
  getUserRequests: () => Promise<Array<{
    requestId: string;
    amount: string;
    currency: {
      type: string;
      value: string;
      network?: string;
    };
    status: string;
    timestamp: number;
    description: string;
    payer?: {
      type: string;
      value: string;
    };
    payee: {
      type: string;
      value: string;
    };
  }>>
  decodeRequest: (requestId: string) => Promise<Types.IRequestData>

  // Search operations
  searchMarkdownFiles: (params: {
    query?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    metadata?: Record<string, any>;
    fuzzyMatch?: boolean;
  }) => Promise<MarkdownSearchResult[]>
  getMarkdownMetadata: (filePath: string) => Promise<Record<string, any>>
  getMarkdownContent: (filePath: string) => Promise<string>

  // Hyperscroll Directory Management
  ensureHyperscrollDir: () => Promise<string>

  // Ephemeral key methods
  generateEphemeralKey: () => Promise<{ token: string; publicKey: string }>
  getEphemeralKey: (token: string) => Promise<string | null>
  storeEphemeralKey: (requestId: string, privateKey: string) => Promise<string>

  // Wallet Methods
  getWalletAddress: () => Promise<string>
  getWalletPrivateKey: () => Promise<string>
  getWalletAddresses: () => Promise<Array<{ address: string; isDefault: boolean }>>
  addWalletAddress: (address: string) => Promise<{ success: boolean }>
  removeWalletAddress: (address: string) => Promise<{ success: boolean }>
  setDefaultWalletAddress: (address: string) => Promise<{ success: boolean }>

  // User data operations
  getUserData: () => Promise<{ success: boolean; data: Record<string, unknown> }>
  decode: (data: string) => Promise<{ success: boolean; data: Record<string, unknown> }>
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
