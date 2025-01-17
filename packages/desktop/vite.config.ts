import { rmSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'frontend'),
    },
  },

  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
        onstart(args) {
          if (process.env.VSCODE_DEBUG) {
            console.log('[startup] Electron App');
          } else {
            args.startup();
          }
        },
        vite: {
          build: {
            outDir: 'dist-electron/',
            rollupOptions: {
              external: ['electron', ...Object.keys(process.versions)],
            },
          },
        },
      },
      preload: {
        input: 'electron/preload.ts',
        vite: {
          build: {
            outDir: 'dist-electron/',
            rollupOptions: {
              external: ['electron', ...Object.keys(process.versions)],
            },
          },
        },
      },
      renderer: {},
    }),
  ],

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: ['buffer', 'process'],
  },

  build: {
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
});
