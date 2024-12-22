import type { API } from '@/electron/preload';

declare global {
  interface Window {
    api: API;
  }
}

export {}; 