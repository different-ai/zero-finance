import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import isDev from 'electron-is-dev';
import { promises as fs, Stats } from 'fs';
import * as chokidar from 'chokidar';
import fg from 'fast-glob';
import { RequestService } from './services/request-service';
import { getInvoiceBaseUrl } from '../src/lib/env';
import matter from 'gray-matter';
import { ensureHyperscrollDir } from './utils/hyperscroll';
import { extractSnippet, fuzzyMatch } from './utils/text-utils';

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
      const data = await fs.readFile(this.storePath, 'utf8');
      this.cache = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is invalid, start with empty cache
      this.cache = {};
    }
  }

  private async saveStore() {
    try {
      await fs.writeFile(this.storePath, JSON.stringify(this.cache, null, 2));
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
    const stats = await fs.stat(filePath);
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
  const files = await fs.readdir(folderPath, { withFileTypes: true });
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
  const isObsidian = await fs
    .access(path.join(vaultPath, '.obsidian'))
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
  await fs.mkdir(path.join(vaultPath, '.hyprsqrl'), { recursive: true });
  await fs.mkdir(path.join(vaultPath, 'Daily'), { recursive: true });
  await fs.mkdir(path.join(vaultPath, 'Tasks'), { recursive: true });
  await fs.mkdir(path.join(vaultPath, 'Notes'), { recursive: true });

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
`;

  await fs.writeFile(readmePath, readmeContent);

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
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
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
  await fs.writeFile(filePath, content);
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
    const files = await fs.readdir(directory, { withFileTypes: true });
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
    const files = await fs.readdir(folderPath, { withFileTypes: true });
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
ipcMain.handle('generate-invoice-url', async (_, requestId: string) => {
  debug('Generating invoice URL for request:', requestId);
  return `${getInvoiceBaseUrl()}/${requestId}`;
});

// Add this with your other IPC handlers
ipcMain.handle('file:list-markdown', async (_, directory) => {
  debug('Listing markdown files for directory:', directory);

  if (!directory || typeof directory !== 'string') {
    debug('Invalid directory argument:', directory);
    throw new Error(
      `Directory path is required and must be a string. Received: ${typeof directory}`
    );
  }

  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    const fileList = files
      .filter(
        (file) =>
          // Include directories and .md files
          file.isDirectory() || file.name.toLowerCase().endsWith('.md')
      )
      .map((file) => ({
        name: file.name,
        isDirectory: file.isDirectory(),
        path: path.join(directory, file.name),
      }));

    debug('Found markdown files:', fileList.length);
    return fileList;
  } catch (error) {
    debug('Error listing markdown files:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to list markdown files: ${error.message}`);
    }
    throw error;
  }
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
    await fs.mkdir(folderPath, { recursive: true });
    return true;
  } catch (error) {
    debug('Error creating folder:', error);
    return false;
  }
});

ipcMain.handle('tasks:get-all', async (_, vaultPath: string) => {
  try {
    // Use dynamic import for fast-glob
    const fg = await import('fast-glob');
    // Find all markdown files in the vault using fast-glob
    const files = await fg.default(['**/*.md'], {
      cwd: vaultPath,
      absolute: true,
      ignore: ['node_modules', '.git', '.obsidian'],
    });
    console.log('Found files:', files);

    const tasks = [];
    const taskRegex = /^- \[([ xX])\] (.+)$/gm;
    const tagsRegex = /#[\w-]+/g;

    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);

        let match;
        while ((match = taskRegex.exec(content)) !== null) {
          const [fullMatch, checkmark, title] = match;
          
          // Get the context by looking at the lines around the task
          const lines = content.split('\n');
          const taskLineIndex = lines.findIndex(line => line.includes(fullMatch));
          const contextStart = Math.max(0, taskLineIndex - 2);
          const contextEnd = Math.min(lines.length, taskLineIndex + 3);
          const context = lines.slice(contextStart, contextEnd).join('\n');

          // Extract tags from the task title
          const tags = title.match(tagsRegex) || [];

          // Generate a stable ID based on file path and task content
          const taskId = Buffer.from(`${filePath}:${fullMatch}`).toString('base64');

          tasks.push({
            id: taskId,
            title: title.trim(),
            completed: checkmark === 'x' || checkmark === 'X',
            filePath,
            tags: tags.map(tag => tag.slice(1)), // Remove # from tags
            context,
            stats: {
              created: stats.birthtime.toISOString(),
              modified: stats.mtime.toISOString(),
            },
            obsidianUrl: `obsidian://open?vault=${encodeURIComponent(path.basename(vaultPath))}&file=${encodeURIComponent(path.relative(vaultPath, filePath))}`,
          });
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        continue;
      }
    }

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
    
    await fs.writeFile(fullPath, content, 'utf-8');

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
const requestService = new RequestService();

// Add invoice processing handler
ipcMain.handle('create-invoice-request', async (event, data) => {
  try {
    const result = await requestService.createInvoiceRequest(data);
    return result;
  } catch (error) {
    console.error('0xHypr', 'Failed to create invoice request:', error);
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
    await fs.mkdir(hyperscrollDir, { recursive: true });
    return hyperscrollDir;
  } catch (error) {
    console.error('Failed to ensure Hyperscroll directory:', error);
    throw error;
  }
});

// Helper function to read and parse markdown files
async function readMarkdownFile(filePath: string) {
  const content = await fs.readFile(filePath, 'utf-8');
  // if matter fail return raw content  
  try {
    const { data: metadata, content: markdownContent } = matter(content);
    return { metadata, content: markdownContent, filePath };
  } catch (error) {
    return { metadata: {}, content: content, filePath };
  }
}

// Search markdown files
ipcMain.handle('search-markdown-files', async (_, options: {
  query?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  metadata?: Record<string, any>;
  fuzzyMatch?: boolean;
  maxResults?: number; // New option for result limiting
}) => {
  try {
    console.log('0xHypr', 'Searching markdown files with options:', options);
    const hyperscrollDir = await ensureHyperscrollDir();
    const vaultConfig = store.get('vaultConfig');
    const { globby } = await import('globby');
    
    // Search in both hyperscroll and vault directories
    const searchDirs = [hyperscrollDir];
    if (vaultConfig?.path) {
      searchDirs.push(vaultConfig.path);
    }

    // Get all markdown files with their stats
    const filesWithStats = await Promise.all(
      (await Promise.all(
        searchDirs.map(dir => 
          globby(['**/*.md'], {
            cwd: dir,
            absolute: true,
            ignore: ['node_modules', '.git', '.obsidian']
          })
        )
      )).flat().map(async (filePath) => {
        const stats = await fs.stat(filePath);
        return {
          filePath,
          mtime: stats.mtime.getTime(),
          stats
        };
      })
    );

    // Sort by modification time (newest first)
    filesWithStats.sort((a, b) => b.mtime - a.mtime);
    console.log('0xHypr', 'Found and sorted files:', filesWithStats.length);

    const results = [];
    const maxResults = options.maxResults || 5; // Default to 5 results

    for (const { filePath, stats } of filesWithStats) {
      const { metadata, content } = await readMarkdownFile(filePath);
      
      // Check metadata constraints
      if (options.metadata) {
        const matchesMetadata = Object.entries(options.metadata).every(
          ([key, value]) => metadata[key] === value
        );
        if (!matchesMetadata) continue;
      }

      // Check tags
      if (options.tags?.length) {
        const fileTags = metadata.tags || [];
        const hasMatchingTag = options.tags.some(tag => fileTags.includes(tag));
        if (!hasMatchingTag) continue;
      }

      // Check dates
      if (options.startDate || options.endDate) {
        const fileDate = metadata.updated || metadata.created || stats.mtime;
        const date = new Date(fileDate);
        if (options.startDate && date < new Date(options.startDate)) continue;
        if (options.endDate && date > new Date(options.endDate)) continue;
      }

      // Search content
      if (options.query) {
        const { matched, index, score } = fuzzyMatch(
          content,
          options.query,
          options.fuzzyMatch ? 0.7 : 1
        );

        if (matched) {
          // Extract snippet around the match
          const { snippet, lineNumber } = extractSnippet(content, index);

          results.push({
            type: 'markdown',
            content: {
              text: snippet,
              filePath: filePath,
              fileName: path.basename(filePath),
              lineNumber,
              matchContext: snippet,
              metadata: {
                ...metadata,
                mtime: stats.mtime.toISOString(),
                created: stats.birthtime.toISOString(),
              },
              matchScore: score,
            },
          });

          // Stop if we've reached the maximum number of results
          if (results.length >= maxResults) {
            console.log('0xHypr', 'Reached max results limit, stopping search...');
            break;
          }
        }
      } else {
        // If no query, include minimal file info with metadata
        results.push({
          type: 'markdown',
          content: {
            text: '', // No content needed when no query
            filePath: filePath,
            fileName: path.basename(filePath),
            metadata: {
              ...metadata,
              mtime: stats.mtime.toISOString(),
              created: stats.birthtime.toISOString(),
            },
          },
        });

        // Also limit results when no query
        if (results.length >= maxResults) {
          console.log('0xHypr', 'Reached max results limit for metadata-only search');
          break;
        }
      }
    }

    // Sort results by match score and recency
    return results.sort((a, b) => {
      // First by match score if available
      const scoreDiff = (b.content.matchScore || 0) - (a.content.matchScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      
      // Then by modification time
      const aTime = new Date(a.content.metadata.mtime).getTime();
      const bTime = new Date(b.content.metadata.mtime).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error searching markdown files:', error);
    throw error;
  }
});

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
                                    
