import { getDefaultConfig } from 'connectkit';
import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

// Polyfill localStorage for Electron
const electronStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Handle error
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle error
    }
  }
};

// Use polyfill if needed
if (typeof localStorage === 'undefined') {
  (window as any).localStorage = electronStorage;
}

const walletConnectProjectId = 'e48c05fe443e5ab53afdde34bcf5ad21';

const metadata = {
  name: 'HyprSqrl',
  description: 'HyprSqrl Desktop App',
  url: 'https://hyprsqrl.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

export const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId,
    appName: metadata.name,
    appDescription: metadata.description,
    appUrl: metadata.url,
    appIcon: metadata.icons[0],
    chains: [mainnet],
    transports: {
      [mainnet.id]: http()
    }
  })
); 