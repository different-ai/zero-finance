import { loadConfig, resolveBaseUrl } from './config.js';

type RequestOptions = {
  method?: string;
  body?: unknown;
  adminToken?: string;
  apiKey?: string;
  baseUrl?: string;
};

function stringifyUnknown(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  try {
    const text = JSON.stringify(value);
    return text ?? String(value);
  } catch (error) {
    return String(value);
  }
}

function extractMessage(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && 'message' in value) {
    const messageValue = (value as { message?: unknown }).message;
    if (typeof messageValue === 'string') {
      return messageValue;
    }
  }

  return stringifyUnknown(value);
}

function coerceErrorMessage(payload: unknown): string | null {
  if (payload === null || payload === undefined) {
    return null;
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (typeof payload === 'object') {
    if ('error' in payload) {
      const errorValue = (payload as { error?: unknown }).error;
      const message = extractMessage(errorValue);
      if (message) {
        return message;
      }
    }

    if ('message' in payload) {
      const messageValue = (payload as { message?: unknown }).message;
      const message = extractMessage(messageValue);
      if (message) {
        return message;
      }
    }
  }

  return extractMessage(payload);
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
) {
  const storedConfig = await loadConfig();
  const baseUrl = resolveBaseUrl(options.baseUrl ?? storedConfig.baseUrl);
  const apiKey = options.apiKey ?? storedConfig.apiKey;

  if (process.env.ZERO_FINANCE_DEBUG === 'true') {
    console.error('[zero] baseUrl:', baseUrl);
    console.error('[zero] path:', path);
  }

  if (!apiKey && !options.adminToken) {
    throw new Error(
      'Missing API key. Run `zero auth connect` or `zero auth login --api-key <key>`',
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
  const trimmed = text.trim();
  let payload: unknown = null;

  if (trimmed) {
    try {
      payload = JSON.parse(trimmed);
    } catch (error) {
      payload = trimmed;
    }
  }

  if (!response.ok) {
    const message = coerceErrorMessage(payload) ?? response.statusText;
    const hint =
      message === 'Not found'
        ? ' Check that your base URL is https://www.0.finance (not /api/cli).'
        : '';
    throw new Error(`${message}${hint}`);
  }

  return payload as T;
}
