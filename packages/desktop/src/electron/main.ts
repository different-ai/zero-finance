import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { invoiceHandler } from './invoice-handler';
import { apiKeyHandler } from './api-key-handler';

// Initialize handlers
apiKeyHandler;
invoiceHandler;

// Ensure required directories exist
async function ensureDirectories() {
  const userDataPath = app.getPath('userData');
  const dirs = ['config', 'calendar', 'vault'];

  for (const dir of dirs) {
    const dirPath = join(userDataPath, dir);
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
  }
}

// Vault operations
ipcMain.handle('get-vault-config', async () => {
  try {
    const configPath = join(app.getPath('userData'), 'config', 'vault-config.json');
    if (!existsSync(configPath)) {
      await writeFile(configPath, JSON.stringify({ path: null }), 'utf-8');
      return null;
    }
    const config = await readFile(configPath, 'utf-8');
    return JSON.parse(config);
  } catch (error) {
    console.error('Error reading vault config:', error);
    return null;
  }
});

ipcMain.handle('read-markdown-file', async (_, path: string) => {
  try {
    const content = await readFile(path, 'utf-8');
    return { content };
  } catch (error) {
    console.error('Error reading markdown file:', error);
    throw error;
  }
});

ipcMain.handle('write-markdown-file', async (_, { path, content }: { path: string; content: string }) => {
  try {
    const dir = join(path, '..');
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    await writeFile(path, content, 'utf-8');
  } catch (error) {
    console.error('Error writing markdown file:', error);
    throw error;
  }
});

// Calendar operations
ipcMain.handle('add-to-calendar', async (_, params) => {
  try {
    const { icsPath, content } = params;
    const calendarDir = join(app.getPath('userData'), 'calendar');
    await writeFile(join(calendarDir, icsPath), content, 'utf-8');
  } catch (error) {
    console.error('Error adding to calendar:', error);
    throw error;
  }
});

async function createWindow() {
  await ensureDirectories();

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.env.PORT || 5173;
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    mainWindow.loadFile(join(app.getAppPath(), 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});