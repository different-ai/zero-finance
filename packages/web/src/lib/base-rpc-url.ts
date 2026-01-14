export function getBaseRpcUrl(): string {
  // Prefer server-only RPC first; fall back to NEXT_PUBLIC for client usage.
  const url =
    process.env.BASE_RPC_URL ||
    process.env.NEXT_PUBLIC_BASE_RPC_URL ||
    'https://mainnet.base.org';

  // Emit a warning when falling back so devs notice misconfiguration, but
  // do NOT crash the build – this allows CI / static analysis to succeed even
  // when the variable is absent (e.g. for read-only operations during build).
  if (!process.env.BASE_RPC_URL && !process.env.NEXT_PUBLIC_BASE_RPC_URL) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Zero Finance] BASE_RPC_URL not set – falling back to public https://mainnet.base.org. ' +
        'Set BASE_RPC_URL for server reads (and NEXT_PUBLIC_BASE_RPC_URL only if you truly need client-side RPC).',
    );
  }

  return url;
}
