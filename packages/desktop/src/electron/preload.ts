import { contextBridge, ipcRenderer } from 'electron';
import { join } from 'path';
import { homedir } from 'os';

// ... existing code ...

contextBridge.exposeInMainWorld('api', {
  // ... existing code ...

  // Hyperscroll Directory Management
  ensureHyperscrollDir: async () => {
    const hyperscrollDir = join(homedir(), 'Hyperscroll');
    await ipcRenderer.invoke('ensure-hyperscroll-dir', hyperscrollDir);
    return hyperscrollDir;
  },
}); 