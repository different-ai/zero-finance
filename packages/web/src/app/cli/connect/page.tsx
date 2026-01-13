import { Suspense } from 'react';
import CliConnectClient from './cli-connect-client';

export default function CliConnectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center px-4">
          <div className="w-full max-w-[520px] rounded-lg border border-[#101010]/10 bg-white p-6">
            <p className="text-[14px] text-[#101010]/70">Loading…</p>
          </div>
        </div>
      }
    >
      <CliConnectClient />
    </Suspense>
  );
}
