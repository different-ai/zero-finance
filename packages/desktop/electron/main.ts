import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import isDev from 'electron-is-dev';
import { Stats } from 'fs';
import * as chokidar from 'chokidar';
import fg from 'fast-glob';
import { RequestService } from './services/request-service';
import { getInvoiceBaseUrl, generateInvoiceUrl } from '../frontend/lib/env';
import matter from 'gray-matter';
import { extractSnippet, fuzzyMatch } from './utils/text-utils';
import { WalletService } from './services/wallet-service';
import fs from 'node:fs';
import { MercuryService } from './services/mercury-service';

// Setup __dirname equivalent for ES modules
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path configurations
process.env.APP_ROOT = path.join(__dirname, '../..');
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

// Windows-specific configurations
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration();
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

// Single instance lock
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Window management
let win: BrowserWindow | null = null;
const preload = path.join(__dirname, './preload.js');

// Replace electron-store with custom store implementation
class VaultStore {
  private storePath: string;
  private cache: Record<string, any> = {};

  constructor() {
    // Store in user data directory
    const userDataPath = app.getPath('userData');
    this.storePath = path.join(userDataPath, 'vault-config.json');
    this.loadStore();
  }

  private async loadStore() {
    try {
      const data = await fs.promises.readFile(this.storePath, 'utf8');
      this.cache = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is invalid, start with empty cache
      this.cache = {};
    }
  }

  private async saveStore() {
    try {
      await fs.promises.writeFile(this.storePath, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.error('Failed to save store:', error);
    }
  }

  get(key: string) {
    return this.cache[key];
  }

  async set(key: string, value: any) {
    this.cache[key] = value;
    await this.saveStore();
  }
}

const store = new VaultStore();

class WalletStore {
  private storePath: string;
  private cache: {
    addresses: Array<{ address: string; isDefault: boolean }>;
  } = {
    addresses: []
  };

  constructor() {
    const userDataPath = app.getPath('userData');
    this.storePath = path.join(userDataPath, 'wallet-config.json');
    this.loadStore();
  }

  private async loadStore() {
    try {
      const data = await fs.promises.readFile(this.storePath, 'utf8');
      this.cache = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is invalid, start with empty cache
      this.cache = { addresses: [] };
    }
  }

  private async saveStore() {
    try {
      await fs.promises.writeFile(this.storePath, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.error('Failed to save wallet store:', error);
    }
  }

  async getAddresses() {
    return this.cache.addresses;
  }

  async getDefaultAddress() {
    const defaultAddress = this.cache.addresses.find(a => a.isDefault);
    return defaultAddress?.address || null;
  }

  async setDefaultAddress(address: string) {
    this.cache.addresses = this.cache.addresses.map(a => ({
      ...a,
      isDefault: a.address === address
    }));
    await this.saveStore();
  }

  async addAddress(address: string) {
    const exists = this.cache.addresses.some(a => a.address === address);
    if (!exists) {
      const isFirst = this.cache.addresses.length === 0;
      this.cache.addresses.push({
        address,
        isDefault: isFirst
      });
      await this.saveStore();
    }
  }

  async removeAddress(address: string) {
    const wasDefault = this.cache.addresses.find(a => a.address === address)?.isDefault;
    this.cache.addresses = this.cache.addresses.filter(a => a.address !== address);
    
    // If we removed the default address and there are other addresses, make the first one default
    if (wasDefault && this.cache.addresses.length > 0) {
      this.cache.addresses[0].isDefault = true;
    }
    
    await this.saveStore();
  }
}

const walletStore = new WalletStore();

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC!, 'favicon.ico'),
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

// App lifecycle events
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// Keep your existing IPC handlers but add this new one:
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(path.join(RENDERER_DIST, 'index.html'), { hash: arg });
  }
});

// Handle IPC events
ipcMain.handle('vault:get-config', async () => {
  return store.get('vaultConfig');
});

ipcMain.handle('vault:save-config', async (_, config) => {
  await store.set('vaultConfig', config);
  return true;
});
// Add this with your other IPC handlers
ipcMain.handle('file:get-stats', async (_, filePath: string) => {
  try {
    const stats = await fs.promises.stat(filePath);
    return {
      birthtime: stats.birthtime.toISOString(),
      mtime: stats.mtime.toISOString(),
      atime: stats.atime.toISOString(),
    };
  } catch (error) {
    console.error('Failed to get file stats:', error);
    throw error;
  }
});

// Keep track of watchers
const watchers = new Map<string, chokidar.FSWatcher>();

// Update the file watching handlers
ipcMain.handle('file:watch', async (event, folderPath: string) => {
  debug('Setting up watcher for folder:', folderPath);

  // Clean up existing watcher if any
  if (watchers.has(folderPath)) {
    const existingWatcher = watchers.get(folderPath);
    if (existingWatcher) {
      await existingWatcher.close();
      watchers.delete(folderPath);
    }
  }

  const watcher = chokidar.watch(folderPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  });

  // Send file change events back to renderer
  watcher
    .on('add', path => event.sender.send('file:changed', { type: 'add', path }))
    .on('change', path => event.sender.send('file:changed', { type: 'change', path }))
    .on('unlink', path => event.sender.send('file:changed', { type: 'unlink', path }));

  watchers.set(folderPath, watcher);
  return true;
});

ipcMain.handle('file:unwatch', async (_, folderPath: string) => {
  debug('Removing watcher for folder:', folderPath);
  const watcher = watchers.get(folderPath);
  if (watcher) {
    await watcher.close();
    watchers.delete(folderPath);
  }
  return true;
});

// Clean up watchers when app quits
app.on('before-quit', () => {
  watchers.forEach(watcher => watcher.close());
  watchers.clear();
});

ipcMain.handle('folder:list-contents', async (_, folderPath) => {
  const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
  return files.map((file) => ({
    name: file.name,
    isDirectory: file.isDirectory(),
    path: path.join(folderPath, file.name),
  }));
});

ipcMain.handle('vault:select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (result.canceled) {
    return { success: false };
  }

  const vaultPath = result.filePaths[0];

  // Check if it's an Obsidian vault by looking for .obsidian folder
  const isObsidian = await fs.promises.access(path.join(vaultPath, '.obsidian'))
    .then(() => true)
    .catch(() => false);

  return {
    success: true,
    path: vaultPath,
    isObsidian,
  };
});

ipcMain.handle('vault:create-new', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (result.canceled) {
    return { success: false };
  }

  const vaultPath = result.filePaths[0];

  // Create necessary directories
  await fs.promises.mkdir(path.join(vaultPath, 'hyprsqrl'), { recursive: true });
  await fs.promises.mkdir(path.join(vaultPath, 'Daily'), { recursive: true });
  await fs.promises.mkdir(path.join(vaultPath, 'Tasks'), { recursive: true });
  await fs.promises.mkdir(path.join(vaultPath, 'Notes'), { recursive: true });

  // Create initial README
  const readmePath = path.join(vaultPath, 'README.md');
  const readmeContent = `---
created: ${new Date().toISOString()}
type: root
---

# Welcome to Your HyprSqrl Vault

This vault is compatible with Obsidian and organized for optimal productivity.

## Folders

- Daily: For your daily notes
- Tasks: For task management
- Notes: For general notes and documentation
- hyprsqrl: For HyprSqrl's internal data (recognized items, statuses, etc.)
`;

  await fs.promises.writeFile(readmePath, readmeContent);

  return {
    success: true,
    path: vaultPath,
    isObsidian: false,
  };
});

// File operations
function parseFrontMatter(content: string) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return {
      data: {},
      content: content
    };
  }

  try {
    const [, frontMatter, markdownContent] = match;
    const data = frontMatter
      .split('\n')
      .filter(line => line.trim())
      .reduce((acc, line) => {
        const [key, ...values] = line.split(':');
        const value = values.join(':').trim();
        // Handle basic types
        if (value === 'true') acc[key.trim()] = true;
        else if (value === 'false') acc[key.trim()] = false;
        else if (!isNaN(Number(value))) acc[key.trim()] = Number(value);
        else acc[key.trim()] = value;
        return acc;
      }, {} as Record<string, any>);

    return {
      data,
      content: markdownContent.trim()
    };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return {
      data: {},
      content: content
    };
  }
}

ipcMain.handle('file:read-markdown', async (_, filePath) => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const stats = await fs.promises.stat(filePath);
    const { data: frontMatter, content: markdownContent } = parseFrontMatter(content);
    
    return { 
      content: markdownContent, 
      frontMatter,
      stats: {
        created: stats.birthtime.toISOString(),
        modified: stats.mtime.toISOString(),
        accessed: stats.atime.toISOString(),
      }
    };
  } catch (error) {
    console.error('Error reading markdown file:', error);
    throw error;
  }
});

ipcMain.handle('file:write-markdown', async (_, filePath, content) => {
  console.log(content, filePath)
  await fs.promises.writeFile(filePath, content);
  return true;
});

// Add this debug logging function
const debug = (...args: any[]) => {
  if (isDev) {
    console.log('[Main Process]', ...args);
  }
};

ipcMain.handle('file:list', async (_, directory) => {
  debug('Listing files for directory:', directory);

  if (!directory || typeof directory !== 'string') {
    debug('Invalid directory argument:', directory);
    throw new Error(
      `Directory path is required and must be a string. Received: ${typeof directory}`
    );
  }

  try {
    const files = await fs.promises.readdir(directory, { withFileTypes: true });
    const fileList = files.map((file) => ({
      name: file.name,
      isDirectory: file.isDirectory(),
      path: path.join(directory, file.name),
    }));
    debug('Found files:', fileList.length);
    return fileList;
  } catch (error) {
    debug('Error listing files:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
    throw error;
  }
});

// Add this with your other IPC handlers
ipcMain.handle('file:reveal-in-system', async (_event, path: string) => {
  if (!path) {
    throw new Error('Path is required to reveal in file system');
  }

  try {
    // Show the given file in a file manager. If possible, select the file.
    await shell.showItemInFolder(path);
  } catch (error) {
    console.error('Failed to reveal item in file system:', error);
    throw error;
  }
});

// Add this near your other IPC handlers:
ipcMain.handle('folder:watch', async (event, folderPath: string) => {
  debug('Setting up watcher for folder:', folderPath);

  // Clean up existing watcher if any
  if (watchers.has(folderPath)) {
    watchers.get(folderPath)?.close();
    watchers.delete(folderPath);
  }

  const watcher = chokidar.watch(folderPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on('all', async (eventName, path) => {
    debug(`File event: ${eventName} on ${path}`);
    // Send the entire folder contents instead of just the changed path
    const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
    const fileList = files.map((file) => ({
      name: file.name,
      isDirectory: file.isDirectory(),
      // path: path.join(folderPath, file.name)
    }));
    event.sender.send('folder:changed', fileList);
  });

  watchers.set(folderPath, watcher);
  return true;
});

ipcMain.handle('folder:unwatch', async (_, folderPath: string) => {
  debug('Removing watcher for folder:', folderPath);
  const watcher = watchers.get(folderPath);
  if (watcher) {
    await watcher.close();
    watchers.delete(folderPath);
  }
  return true;
});

// Add this when the app is quitting to clean up watchers
app.on('before-quit', () => {
  watchers.forEach((watcher) => watcher.close());
  watchers.clear();
});

// Handle invoice URL generation
ipcMain.handle('generate-invoice-url', async (_, requestId: string, token: string) => {
  debug('Generating invoice URL for request:', requestId);
  return `${getInvoiceBaseUrl()}/${requestId}?token=${token}`;
});





// Add this with your other IPC handlers
ipcMain.handle('shell:open-external', async (_, url: string) => {
  if (!url) {
    throw new Error('URL is required to open external link');
  }

  try {
    await shell.openExternal(url);
    return true;
  } catch (error) {
    console.error('Failed to open external URL:', error);
    throw error;
  }
});

// Add this new IPC handler
ipcMain.handle('file:create-folder', async (_, folderPath: string) => {
  debug('Creating folder:', folderPath);
  try {
    fs.mkdirSync(folderPath, { recursive: true });
    return true;
  } catch (error) {
    debug('Error creating folder:', error);
    return false;
  }
});

// Add task creation handler
ipcMain.handle('tasks:create', async (_, taskData: { title: string; content: string; details?: string; dueDate?: string; priority?: string }) => {
  try {
    const vaultConfig = store.get('vaultConfig');
    if (!vaultConfig?.path) {
      throw new Error('No vault configured');
    }

    const tasksDir = path.join(vaultConfig.path, 'hyprsqrl', 'tasks');
    const tasksFilePath = path.join(tasksDir, 'tasks.md');

    // Ensure tasks directory exists
    if (!fs.existsSync(tasksDir)) {
      fs.mkdirSync(tasksDir, { recursive: true });
    }

    // Read existing content or create new file
    let content = '';
    try {
      content = await fs.promises.readFile(tasksFilePath, 'utf-8');
    } catch {
      content = `# HyprSqrl Tasks\n\nThis file is managed by HyprSqrl. Manual edits are preserved.\n\n## Tasks\n\n`;
    }

    // Format the new task
    const taskEntry = 
      `- [ ] ${taskData.title}\n` +
      `  - Content: ${taskData.content}\n` +
      (taskData.details ? `  - Details: ${taskData.details}\n` : '') +
      (taskData.dueDate ? `  - Due: ${taskData.dueDate}\n` : '') +
      (taskData.priority ? `  - Priority: ${taskData.priority}\n` : '') +
      `  - Created: ${new Date().toISOString()}\n\n`;

    // Add the new task at the top of the tasks section
    const tasksSection = content.indexOf('## Tasks\n');
    if (tasksSection !== -1) {
      content = content.slice(0, tasksSection + 9) + taskEntry + content.slice(tasksSection + 9);
    } else {
      content += `\n## Tasks\n\n${taskEntry}`;
    }

    await fs.promises.writeFile(tasksFilePath, content, 'utf-8');
    console.log('0xHypr', 'Task added:', taskData.title);

    return { success: true, filePath: tasksFilePath };
  } catch (error) {
    console.error('0xHypr', 'Failed to create task:', error);
    throw error;
  }
});

// Update the tasks:get-all handler
ipcMain.handle('tasks:get-all', async (_, vaultPath: string) => {
  try {
    const tasksDir = path.join(vaultPath, 'hyprsqrl', 'tasks');
    const tasksFilePath = path.join(tasksDir, 'tasks.md');

    // Check if tasks file exists
    if (!fs.existsSync(tasksFilePath)) {
      console.log('0xHypr', 'No tasks file found');
      return [];
    }

    const content = await fs.promises.readFile(tasksFilePath, 'utf-8');
    const stats = await fs.promises.stat(tasksFilePath);

    const tasks = [];
    const taskRegex = /^- \[([ xX])\] (.+)(?:\n(?:  - [^:\n]+: [^\n]+)*)/gm;
    const tagsRegex = /#[\w-]+/g;

    let match;
    while ((match = taskRegex.exec(content)) !== null) {
      const [fullMatch, checkmark, title] = match;
      const context = match[0];

      // Extract metadata from the task context
      const metadataRegex = /  - ([^:]+): ([^\n]+)/g;
      const metadata: Record<string, string> = {};
      let metaMatch;
      while ((metaMatch = metadataRegex.exec(context)) !== null) {
        metadata[metaMatch[1].toLowerCase()] = metaMatch[2].trim();
      }

      // Extract tags from the task title and context
      const titleTags = title.match(tagsRegex) || [];
      const contextTags = context.match(tagsRegex) || [];
      const allTags = [...new Set([...titleTags, ...contextTags])].map(tag => tag.slice(1));

      // Generate a stable ID based on file path and task content
      const taskId = Buffer.from(`${tasksFilePath}:${fullMatch}`).toString('base64');

      tasks.push({
        id: taskId,
        title: title.trim(),
        completed: checkmark === 'x' || checkmark === 'X',
        filePath: tasksFilePath,
        tags: allTags,
        content: metadata.content || '',
        details: metadata.details || '',
        dueDate: metadata.due || null,
        priority: (metadata.priority?.toLowerCase() || 'medium') as 'high' | 'medium' | 'low',
        created: metadata.created || stats.birthtime.toISOString(),
        stats: {
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString(),
          accessed: stats.atime.toISOString(),
        },
        obsidianUrl: `obsidian://open?vault=${encodeURIComponent(path.basename(vaultPath))}&file=${encodeURIComponent(path.relative(vaultPath, tasksFilePath))}`,
      });
    }

    // Sort tasks
    tasks.sort((a, b) => {
      // First sort by completion status
      if (!a.completed && b.completed) return -1;
      if (a.completed && !b.completed) return 1;

      // Then sort by due date if available
      if (a.dueDate && b.dueDate) {
        const dateComparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (dateComparison !== 0) return dateComparison;
      } else if (a.dueDate) return -1;
      else if (b.dueDate) return 1;

      // Then sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityComparison !== 0) return priorityComparison;

      // Finally sort by created date (most recent first)
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    console.log('0xHypr', 'Returning sorted tasks:', tasks.length);
    return tasks;
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
});

ipcMain.handle('add-to-calendar', async (_, { icsPath, content, event }) => {
  try {
    // Save ICS file to temp directory
    const tempPath = app.getPath('temp');
    const fullPath = path.join(tempPath, icsPath);
    
    await fs.promises.writeFile(fullPath, content, 'utf-8');

    // On macOS, open with Calendar.app
    if (process.platform === 'darwin') {
      await shell.openPath(fullPath);
      return { success: true };
    } 
    
    throw new Error('Direct calendar integration only supported on macOS');
  } catch (error) {
    console.error('Failed to add to calendar:', error);
    throw error;
  }
});

ipcMain.handle('open-calendar', async (_, calendarUrl: string) => {
  try {
    if (process.platform === 'darwin') {
      // Validate URL
      try {
        new URL(calendarUrl);
      } catch (e) {
        throw new Error(`Invalid calendar URL: ${e.message}`);
      }

      // Ensure we're using webcal:// protocol
      const url = calendarUrl.startsWith('webcal://')
        ? calendarUrl
        : calendarUrl.replace(/^[^:]+:\/\//, 'webcal://');

      console.log('Opening calendar with URL:', url);
      await shell.openExternal(url);
      return { success: true };
    }
    throw new Error('Direct calendar integration only supported on macOS');
  } catch (error) {
    console.error('Failed to open calendar:', error);
    throw error;
  }
});

// Initialize services
// @ts-ignore
const requestService = new RequestService(process.env.USER_PRIVATE_KEY || '');

// Handle invoice request creation
ipcMain.handle('create-invoice-request', async (_, data) => {
  try {
    const result = await requestService.createInvoiceRequest(data);
    const invoiceUrl = generateInvoiceUrl(result.requestId, result.token);
    return { ...result, invoiceUrl };
  } catch (error) {
    console.error('Error creating invoice request:', error);
    throw error;
  }
});

// Add get payee address handler
ipcMain.handle('get-payee-address', async () => {
  try {
    return requestService.getPayeeAddress();
  } catch (error) {
    console.error('0xHypr', 'Failed to get payee address:', error);
    throw error;
  }
});

// Add get user requests handler
ipcMain.handle('get-user-requests', async () => {
  try {
    const requests = await requestService.getUserRequests();
    return requests;
  } catch (error) {
    console.error('0xHypr', 'Failed to get user requests:', error);
    throw error;
  }
});

// Add this with your other IPC handlers
ipcMain.handle('file:open-in-obsidian', async (_, filePath: string) => {
  try {
    // Get the vault config to check if it's an Obsidian vault
    const vaultConfig = store.get('vaultConfig');

    // Construct the obsidian:// URL
    // Format: obsidian://open?vault=VaultName&file=FilePath
    const vaultName = path.basename(vaultConfig.path);
    const relativePath = path.relative(vaultConfig.path, filePath);
    const encodedPath = encodeURIComponent(relativePath);
    const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodedPath}`;

    // Open the URL with the default handler (Obsidian)
    await shell.openExternal(obsidianUrl);
    return true;
  } catch (error) {
    console.error('Failed to open in Obsidian:', error);
    throw error;
  }
});

// Add this with your other IPC handlers
ipcMain.handle('ensure-hyperscroll-dir', async () => {
  const hyperscrollDir = path.join(os.homedir(), 'Hyperscroll');
  try {
    fs.mkdirSync(hyperscrollDir, { recursive: true });
    return hyperscrollDir;
  } catch (error) {
    console.error('Failed to ensure Hyperscroll directory:', error);
    throw error;
  }
});

// Helper function to read and parse markdown files
async function readMarkdownFile(filePath: string) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  // if matter fail return raw content  
  try {
    const { data: metadata, content: markdownContent } = matter(content);
    return { metadata, content: markdownContent, filePath };
  } catch (error) {
    return { metadata: {}, content: content, filePath };
  }
}


// Get markdown metadata
ipcMain.handle('get-markdown-metadata', async (_, filePath: string) => {
  try {
    const { metadata } = await readMarkdownFile(filePath);
    return metadata;
  } catch (error) {
    console.error('Error reading markdown metadata:', error);
    throw error;
  }
});

// Get markdown content
ipcMain.handle('get-markdown-content', async (_, filePath: string) => {
  try {
    const { content } = await readMarkdownFile(filePath);
    return content;
  } catch (error) {
    console.error('Error reading markdown content:', error);
    throw error;
  }
});

// Add ephemeral key handlers
ipcMain.handle('generate-ephemeral-key', async () => {
  try {
    return requestService.generateEphemeralKey();
  } catch (error) {
    console.error('0xHypr', 'Failed to generate ephemeral key:', error);
    throw error;
  }
});


ipcMain.handle('wallet:get-private-key', () => {
  return requestService.getPayeePrivateKey();
});

// Initialize services
const walletService = new WalletService();
const mercuryService = new MercuryService();

// Remove duplicate handlers and keep only these wallet management handlers
ipcMain.handle('wallet:get-addresses', () => {
  debug('Getting all wallet addresses');
  return walletService.getAddresses();
});

ipcMain.handle('wallet:get-address', async () => {
  debug('Getting default wallet address');
  const addresses = walletService.getAddresses();
  const defaultAddress = addresses.find(a => a.isDefault);
  if (!defaultAddress && addresses.length === 0) {
    const requestServiceAddress = await requestService.getPayeeAddress();
    if (requestServiceAddress) {
      walletService.addAddress({ 
        id: Date.now().toString(),
        address: requestServiceAddress,
        isDefault: true,
        network: 'gnosis',
        label: 'Default Address'
      });
      return requestServiceAddress;
    }
  }
  return defaultAddress?.address || null;
});

ipcMain.handle('wallet:set-default-address', (_, addressId: string) => {
  debug('Setting default wallet address:', addressId);
  return walletService.setDefaultAddress(addressId);
});

ipcMain.handle('wallet:add-address', (_, address) => {
  debug('Adding wallet address:', address);
  return walletService.addAddress(address);
});

ipcMain.handle('wallet:remove-address', (_, addressId: string) => {
  debug('Removing wallet address:', addressId);
  return walletService.removeAddress(addressId);
});

// Add decode request handler
ipcMain.handle('decode-request', async (_, requestId: string) => {
  try {
    const request = await requestService.requestClient.fromRequestId(requestId);
    const data = await request.getData();
    console.log('0xHypr', 'Decoded request data:', data);
    return data;
  } catch (error) {
    console.error('0xHypr', 'Failed to decode request:', error);
    throw error;
  }
});

// Utility to get storage paths and ensure directories exist
function getStoragePath(filename: string): string {
  const vaultConfig = store.get('vaultConfig');
  if (!vaultConfig?.path) {
    throw new Error('Vault path not configured');
  }
  
  // Use "hyprsqrl" instead of ".hyprsqrl"
  const storagePath = path.join(vaultConfig.path, 'hyprsqrl');
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }
  
  return path.join(storagePath, filename);
}

// Get paths for specific files
async function getRecognizedItemsPath(): Promise<string> {
  return getStoragePath('recognized-items.md');
}

async function getItemStatusesPath(): Promise<string> {
  return getStoragePath('item-statuses.md');
}

// Load recognized items from markdown file
async function loadRecognizedItemsFromFile(): Promise<any[]> {
  try {
    const filePath = await getRecognizedItemsPath();
    console.log('0xHypr', 'Loading recognized items from:', filePath);
    
    try {
      await fs.promises.access(filePath);
    } catch {
      console.log('0xHypr', 'No existing recognized items file');
      return [];
    }

    const mdContent = await fs.promises.readFile(filePath, 'utf-8');
    console.log('0xHypr', 'Loaded markdown content:', mdContent.substring(0, 100) + '...');
    
    const match = mdContent.match(/```json\n([\s\S]+?)```/);
    if (!match) {
      console.log('0xHypr', 'No JSON content found in markdown');
      return [];
    }
    
    const jsonStr = match[1].trim();
    const items = JSON.parse(jsonStr);
    console.log('0xHypr', 'Loaded items count:', items.length);
    return items;
  } catch (err) {
    console.error('0xHypr', 'Failed to load recognized items:', err);
    return [];
  }
}

// Save recognized items to markdown file
async function saveRecognizedItemsToFile(items: any[]): Promise<void> {
  try {
    const filePath = await getRecognizedItemsPath();
    console.log('0xHypr', 'Saving recognized items to:', filePath);
    console.log('0xHypr', 'Items to save:', items.length);

    const mdContent = `# Recognized Items

This file is managed automatically by Hyprsqrl.
Last updated: ${new Date().toISOString()}

\`\`\`json
${JSON.stringify(items, null, 2)}
\`\`\`
`;

    await fs.promises.writeFile(filePath, mdContent, 'utf-8');
    console.log('0xHypr', 'Successfully saved recognized items');
  } catch (err) {
    console.error('0xHypr', 'Failed to save recognized items:', err);
    throw err;
  }
}

// Load item statuses from markdown file
async function loadItemStatusesFromFile(): Promise<any[]> {
  try {
    const filePath = await getItemStatusesPath();
    console.log('0xHypr', 'Loading item statuses from:', filePath);
    
    try {
      await fs.promises.access(filePath);
    } catch {
      console.log('0xHypr', 'No existing item statuses file');
      return [];
    }

    const mdContent = await fs.promises.readFile(filePath, 'utf-8');
    const match = mdContent.match(/```json\n([\s\S]+?)```/);
    if (!match) {
      console.log('0xHypr', 'No JSON content found in markdown');
      return [];
    }
    
    const jsonStr = match[1].trim();
    const statuses = JSON.parse(jsonStr);
    console.log('0xHypr', 'Loaded statuses count:', statuses.length);
    return statuses;
  } catch (err) {
    console.error('0xHypr', 'Failed to load item statuses:', err);
    return [];
  }
}

// Save item statuses to markdown file
async function saveItemStatusesToFile(statuses: any[]): Promise<void> {
  try {
    const filePath = await getItemStatusesPath();
    console.log('0xHypr', 'Saving item statuses to:', filePath);
    console.log('0xHypr', 'Statuses to save:', statuses.length);

    const mdContent = `# Item Statuses

This file is managed automatically by Hyprsqrl.
Last updated: ${new Date().toISOString()}

\`\`\`json
${JSON.stringify(statuses, null, 2)}
\`\`\`
`;

    // Assuming you have a function to write the content to a file
    await fs.promises.writeFile(filePath, mdContent, 'utf-8');
  } catch (error) {
    console.error('0xHypr', 'Error saving item statuses:', error);
  }
}

// Mercury API handlers
ipcMain.handle('mercury:createPayment', async (_, params) => {
  return mercuryService.createPayment(params);
});

ipcMain.handle('mercury:getApiKey', async () => {
  return mercuryService.getApiKey();
});

ipcMain.handle('mercury:setApiKey', async (_, key: string) => {
  return mercuryService.setApiKey(key);
});

ipcMain.handle('mercury:deleteApiKey', async () => {
  return mercuryService.deleteApiKey();
});