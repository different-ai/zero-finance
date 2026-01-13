'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { CheckCircle2, Copy, Loader2 } from 'lucide-react';

export default function CliConnectPage() {
  const { authenticated } = usePrivy();
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [autoSent, setAutoSent] = useState(false);

  const signInUrl = useMemo(() => {
    const query = searchParams.toString();
    const redirect = `/cli/connect${query ? `?${query}` : ''}`;
    return `/signin?source=cli&redirect=${encodeURIComponent(redirect)}`;
  }, [searchParams]);

  useEffect(() => {
    if (!authenticated || status !== 'idle') {
      return;
    }

    setStatus('loading');

    fetch('/api/cli-auth', { method: 'POST' })
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Failed to create API key');
        }
        return response.json();
      })
      .then((payload) => {
        setApiKey(payload.apiKey ?? null);
        setStatus('ready');
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error',
        );
        setStatus('error');
      });
  }, [authenticated, status]);

  useEffect(() => {
    if (!apiKey || !redirectUri) {
      return;
    }

    try {
      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set('token', apiKey);
      if (state) {
        callbackUrl.searchParams.set('state', state);
      }

      fetch(callbackUrl.toString(), { mode: 'no-cors' })
        .then(() => setAutoSent(true))
        .catch(() => setAutoSent(false));
    } catch (error) {
      setAutoSent(false);
    }
  }, [apiKey, redirectUri, state]);

  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center px-4">
      <div className="w-full max-w-[520px] rounded-lg border border-[#101010]/10 bg-white p-6">
        <p className="uppercase tracking-[0.16em] text-[11px] text-[#101010]/60">
          CLI Connect
        </p>
        <h1 className="mt-2 text-[22px] font-medium text-[#101010]">
          Connect agent-bank
        </h1>
        <p className="mt-2 text-[14px] text-[#101010]/70">
          Approve this CLI to access your 0 Finance workspace. You can revoke
          the key later from Settings → API Keys.
        </p>

        {!authenticated ? (
          <div className="mt-6">
            <Link
              href={signInUrl}
              className="inline-flex items-center px-4 py-2 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
            >
              Sign in to continue
            </Link>
          </div>
        ) : null}

        {authenticated && status === 'loading' ? (
          <div className="mt-6 flex items-center gap-3 text-[14px] text-[#101010]/70">
            <Loader2 className="h-4 w-4 animate-spin text-[#1B29FF]" />
            Generating a secure API key…
          </div>
        ) : null}

        {authenticated && status === 'error' ? (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
            {errorMessage || 'Something went wrong. Please try again.'}
          </div>
        ) : null}

        {authenticated && status === 'ready' && apiKey ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-md border border-[#101010]/10 bg-[#F7F7F2] px-4 py-3 font-mono text-[12px] break-all">
              {apiKey}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#101010]/70">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-[#101010]/10 bg-white px-3 py-2 text-[13px] font-medium text-[#101010] hover:bg-[#F7F7F2] transition-colors"
                onClick={async () => {
                  await navigator.clipboard.writeText(apiKey);
                }}
              >
                <Copy className="h-4 w-4" />
                Copy API key
              </button>
              {autoSent ? (
                <span className="inline-flex items-center gap-2 text-[#1B29FF]">
                  <CheckCircle2 className="h-4 w-4" />
                  Sent to your CLI
                </span>
              ) : null}
            </div>
            <p className="text-[13px] text-[#101010]/60">
              If the CLI did not connect automatically, paste this key into your
              terminal when prompted.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
