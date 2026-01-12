import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export type CliConfig = {
  apiKey?: string;
  baseUrl?: string;
};

const CONFIG_DIR = path.join(os.homedir(), '.zero-finance');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

export async function loadConfig(): Promise<CliConfig> {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(data) as CliConfig;
  } catch (error) {
    return {};
  }
}

export async function saveConfig(config: CliConfig) {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export async function clearConfig() {
  try {
    await fs.unlink(CONFIG_PATH);
  } catch (error) {
    // ignore if missing
  }
}

export function resolveBaseUrl(baseUrl?: string) {
  const value = baseUrl?.trim() || 'https://0.finance';
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export async function requireConfig() {
  const config = await loadConfig();
  if (!config.apiKey) {
    throw new Error(
      'Missing API key. Run `finance auth login --api-key <key>`',
    );
  }
  return {
    apiKey: config.apiKey,
    baseUrl: resolveBaseUrl(config.baseUrl),
  };
}
