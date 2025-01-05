import { app, BrowserWindow, ipcMain } from 'electron';
import { mkdir } from 'fs/promises';

// Hyperscroll Directory Management
ipcMain.handle('ensure-hyperscroll-dir', async (_, dir: string) => {
  try {
    await mkdir(dir, { recursive: true });
    return true;
  } catch (error) {
    console.error('Failed to create Hyperscroll directory:', error);
    throw error;
  }
}); 