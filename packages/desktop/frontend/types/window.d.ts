import type { ElectronAPI } from './electron';

declare global {
  interface Window {
    api: ElectronAPI;
  }
}

export {};         