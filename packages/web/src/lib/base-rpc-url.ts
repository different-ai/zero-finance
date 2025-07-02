export function getBaseRpcUrl(): string {
  // Prefer explicit environment variables, but fall back to a public Base RPC
  const url =
    process.env.NEXT_PUBLIC_BASE_RPC_URL ||
    process.env.BASE_RPC_URL ||
    'https://mainnet.base.org';

  // Emit a warning when falling back so devs notice misconfiguration, but
  // do NOT crash the build – this allows CI / static analysis to succeed even
  // when the variable is absent (e.g. for read-only operations during build).
  if (!process.env.NEXT_PUBLIC_BASE_RPC_URL && !process.env.BASE_RPC_URL) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Zero Finance] BASE RPC URL not set – falling back to public https://mainnet.base.org. ' +
        'For write operations provide NEXT_PUBLIC_BASE_RPC_URL or BASE_RPC_URL.',
    );
  }

  return url;
} 