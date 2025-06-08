interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  shouldRetry?: (error: any) => boolean;
}

const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 8000,
  shouldRetry: (error: any) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return false;
    }
    if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED' || error?.code === 'ETIMEDOUT') {
      return true;
    }
    if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
      return true;
    }
    return true;
  },
};

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...defaultRetryOptions, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === opts.maxRetries) {
        throw error;
      }

      if (opts.shouldRetry && !opts.shouldRetry(error)) {
        throw error;
      }

      const delay = Math.min(
        opts.baseDelay * Math.pow(2, attempt),
        opts.maxDelay
      );
      
      console.warn(`Retry attempt ${attempt + 1}/${opts.maxRetries + 1} failed, retrying in ${delay}ms:`, (error as any)?.message || error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

const responseCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function getCachedResponse<T>(key: string): T | null {
  const cached = responseCache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    responseCache.delete(key);
    return null;
  }
  
  return cached.data;
}

export function setCachedResponse<T>(key: string, data: T, ttlMs: number = 300000): void {
  responseCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  });
}

export function clearCache(): void {
  responseCache.clear();
}
