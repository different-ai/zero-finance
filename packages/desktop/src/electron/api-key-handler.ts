import { ipcMain } from 'electron';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { app } from 'electron';
import { existsSync } from 'fs';

class ApiKeyHandler {
  private apiKeyPath: string;
  private configDir: string;

  constructor() {
    this.configDir = join(app.getPath('userData'), 'config');
    this.apiKeyPath = join(this.configDir, 'api-key.json');
    this.setupHandlers();
    this.initialize();
  }

  private async initialize() {
    try {
      // Ensure config directory exists
      if (!existsSync(this.configDir)) {
        await mkdir(this.configDir, { recursive: true });
      }

      // Create empty API key file if it doesn't exist
      if (!existsSync(this.apiKeyPath)) {
        await writeFile(this.apiKeyPath, JSON.stringify({ apiKey: null }), 'utf-8');
      }

      // Create calendar directory
      const calendarDir = join(app.getPath('userData'), 'calendar');
      if (!existsSync(calendarDir)) {
        await mkdir(calendarDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error initializing API key handler:', error);
    }
  }

  private setupHandlers() {
    ipcMain.handle('get-api-key', async () => {
      try {
        const data = await readFile(this.apiKeyPath, 'utf-8');
        const { apiKey } = JSON.parse(data);
        return apiKey;
      } catch (error) {
        console.error('Error reading API key:', error);
        return null;
      }
    });

    ipcMain.handle('set-api-key', async (_, apiKey: string) => {
      try {
        await writeFile(this.apiKeyPath, JSON.stringify({ apiKey }), 'utf-8');
        return true;
      } catch (error) {
        console.error('Error saving API key:', error);
        return false;
      }
    });
  }
}

export const apiKeyHandler = new ApiKeyHandler(); 