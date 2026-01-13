import { loadConfig, resolveBaseUrl } from './config.js';

type RequestOptions = {
  method?: string;
  body?: unknown;
  adminToken?: string;
  apiKey?: string;
  baseUrl?: string;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
) {
  const storedConfig = await loadConfig();
  const baseUrl = resolveBaseUrl(options.baseUrl ?? storedConfig.baseUrl);
  const apiKey = options.apiKey ?? storedConfig.apiKey;

  if (process.env.ZERO_FINANCE_DEBUG === 'true') {
    console.error('[finance] baseUrl:', baseUrl);
    console.error('[finance] path:', path);
  }

  if (!apiKey && !options.adminToken) {
    throw new Error(
      'Missing API key. Run `finance auth connect` or `finance auth login --api-key <key>`',
    );
  }

  const url = new URL(path, baseUrl);
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  if (options.adminToken) {
    headers['x-admin-token'] = options.adminToken;
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.error || response.statusText;
    const hint =
      message === 'Not found'
        ? ' Check that your base URL is https://0.finance (not /api/cli).'
        : '';
    throw new Error(`${message}${hint}`);
  }

  return payload as T;
}
