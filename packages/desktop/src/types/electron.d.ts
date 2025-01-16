export interface FileInfo {
  name: string;
  isDirectory: boolean;
  path: string;
}

export interface MarkdownContent {
  content: string;
  frontMatter?: Record<string, unknown>;
}

export interface VaultConfig {
  path: string;
  isObsidian?: boolean;
}

export interface ICreateRequestParameters {
  requestInfo: {
    currency: {
      type: string;
      value: string;
      network?: string;
    };
    expectedAmount: string;
    payee: {
      type: string;
      value: string;
    };
    timestamp: number;
  };
  paymentNetwork?: {
    id: string;
    parameters: {
      paymentAddress: string;
      paymentNetworkName?: string;
      feeAddress?: string;
      feeAmount?: string;
    };
  };
  contentData?: unknown;
}

export interface ElectronAPI {
  // Wallet operations
  getWalletAddress: () => Promise<string>;
  getWalletPrivateKey: () => Promise<string>;
  getWalletAddresses: () => Promise<Array<{ address: string; isDefault: boolean }>>;
  addWalletAddress: (address: string) => Promise<{ success: boolean }>;
  removeWalletAddress: (address: string) => Promise<{ success: boolean }>;
  setDefaultWalletAddress: (address: string) => Promise<{ success: boolean }>;
  getPayeeAddress: () => Promise<string>;

  // File operations
  openFile: (path: string) => Promise<void>;
  readMarkdownFile: (path: string) => Promise<{ content: string; frontMatter?: Record<string, unknown> }>;
  writeMarkdownFile: (path: string, content: string) => Promise<void>;
  openInObsidian: (path: string) => Promise<void>;
  openExternal: (url: string) => Promise<void>;
  revealInFileSystem: (path: string) => Promise<void>;
  createFolder: (folderPath: string) => Promise<boolean>;

  // Vault operations
  getVaultConfig: () => Promise<{ path: string; isObsidian?: boolean } | null>;
  saveVaultConfig: (config: { path: string; isObsidian?: boolean }) => Promise<{ success: boolean; path: string }>;
  selectVaultDirectory: () => Promise<{ success: boolean; path: string; isObsidian?: boolean }>;
  createVaultDirectory: () => Promise<{ success: boolean; path: string; isObsidian?: boolean }>;
  createNewVault: () => Promise<{ success: boolean; path: string; isObsidian?: boolean }>;
  listFiles: (path: string) => Promise<Array<{ name: string; isDirectory: boolean; path: string }>>;
  listFolderContents: (path: string) => Promise<Array<{ name: string; isDirectory: boolean; path: string }>>;

  // Request operations
  getUserRequests: () => Promise<Array<any>>;
  decodeRequest: (requestId: string) => Promise<any>;

  // Task operations
  getAllTasks: (vaultPath: string) => Promise<Array<any>>;
  updateTaskInFile: (filePath: string, task: any) => Promise<void>;

  createTask: (taskData: { name: string; description: string }) => Promise<unknown>;
  analyzeMarkdownForTasks: (filePath: string) => Promise<Array<{ completed: boolean; title: string; tags: string[] }>>;

  // File watching operations
  watchFiles: (path: string, callback: (path: string) => void) => Promise<void>;
  unwatchFiles: (path: string) => Promise<void>;
  watchFolder: (folderPath: string, callback: (event: any, files: FileInfo[]) => void) => Promise<void>;
  unwatchFolder: (folderPath: string) => Promise<void>;

  // Markdown operations
  findLinkedNotes: (filePath: string) => Promise<string[]>;
  writeMarkdownToVault: (name: string, content: string) => Promise<boolean>;
  getMarkdownMetadata: (filePath: string) => Promise<unknown>;
  getMarkdownContent: (filePath: string) => Promise<unknown>;
  searchMarkdownFiles: (options: {
    query?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    metadata?: Record<string, any>;
    fuzzyMatch?: boolean;
  }) => Promise<unknown>;

  // Calendar operations
  addToCalendar: (params: {
    icsPath: string;
    content: string;
    event: {
      title: string;
      startTime: string;
      endTime: string;
      location?: string;
      description?: string;
      attendees?: string[];
    }
  }) => Promise<unknown>;
  openCalendar: (calendarUrl: string) => Promise<unknown>;

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
  }) => Promise<unknown>;
  createInvoiceRequest: (params: any) => Promise<{ success: boolean; requestId?: string; token?: string; error?: string }>;
  generateInvoiceUrl: (requestId: string, token: string) => Promise<string>;
  listMarkdownFiles: (directory: string) => Promise<FileInfo[]>;
  ensureHyperscrollDir: () => Promise<string>;

  // User data operations
  getUserData: () => Promise<{ success: boolean; data: Record<string, unknown> }>;
  decode: (data: string) => Promise<{ success: boolean; data: Record<string, unknown> }>;

  // Ephemeral key operations
  generateEphemeralKey: () => Promise<unknown>;
  storeEphemeralKey: (requestId: string, privateKey: string) => Promise<string>;
  getEphemeralKey: (token: string) => Promise<string>;

  // Additional operations
  saveBusinessProfile: (data: any) => Promise<{ success: boolean }>;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
