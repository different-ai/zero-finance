export function getBaseRpcUrl(): string {
  const url = process.env.NEXT_PUBLIC_BASE_RPC_URL || process.env.BASE_RPC_URL;
  if (!url) {
    throw new Error('BASE RPC URL not set. Please configure NEXT_PUBLIC_BASE_RPC_URL or BASE_RPC_URL');
  }
  return url;
} 