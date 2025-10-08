'use client';

import { api } from '@/trpc/react';
import { usePrivy } from '@privy-io/react-auth';
import { Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export function WorkspaceDebugView() {
  const { user } = usePrivy();
  const {
    data: workspaceDebug,
    isLoading,
    error,
  } = api.workspace.getDebugInfo.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B29FF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[15px] font-medium text-red-900">
                  Error Loading Debug Info
                </h3>
                <p className="text-[13px] text-red-700 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workspaceDebug) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b border-[#101010]/10">
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <Link
            href="/settings"
            className="text-[13px] text-[#101010]/60 hover:text-[#101010] mr-4"
          >
            ← Settings
          </Link>
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mr-3">
            DEBUG
          </p>
          <h1 className="font-serif text-[24px] sm:text-[28px] leading-[1] text-[#101010]">
            Workspace Info
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
        {/* User Info */}
        <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6 mb-6">
          <h2 className="text-[16px] font-medium text-[#101010] mb-4">
            User Information
          </h2>
          <div className="space-y-2 text-[13px]">
            <div className="flex gap-2">
              <span className="text-[#101010]/60 w-32">DID:</span>
              <span className="font-mono text-[12px] text-[#101010]">
                {workspaceDebug.userDid}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#101010]/60 w-32">Name:</span>
              <span className="text-[#101010]">{workspaceDebug.userName}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#101010]/60 w-32">Primary Workspace:</span>
              <span className="font-mono text-[12px] text-[#101010]">
                {workspaceDebug.primaryWorkspaceId || 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Memberships */}
        <div className="space-y-6">
          <h2 className="text-[18px] font-medium text-[#101010]">
            Workspace Memberships ({workspaceDebug.workspaces.length})
          </h2>

          {workspaceDebug.workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6"
            >
              {/* Workspace Header */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-[#101010]/5">
                <div>
                  <h3 className="text-[16px] font-medium text-[#101010]">
                    {workspace.name}
                  </h3>
                  <p className="text-[12px] font-mono text-[#101010]/60 mt-1">
                    {workspace.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {workspace.isOwner && (
                    <span className="px-2 py-1 text-[11px] font-medium bg-[#1B29FF]/10 text-[#1B29FF] rounded">
                      OWNER
                    </span>
                  )}
                  <span className="px-2 py-1 text-[11px] font-medium bg-[#101010]/5 text-[#101010]/70 rounded uppercase">
                    {workspace.role}
                  </span>
                  {workspace.isPrimary && (
                    <span className="px-2 py-1 text-[11px] font-medium bg-green-100 text-green-800 rounded">
                      PRIMARY
                    </span>
                  )}
                </div>
              </div>

              {/* Workspace Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-2">
                    Membership
                  </p>
                  <div className="space-y-1 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#101010]/60">Joined:</span>
                      <span className="text-[#101010]">
                        {new Date(workspace.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#101010]/60">Created:</span>
                      <span className="text-[#101010]">
                        {new Date(workspace.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-2">
                    KYC & Banking
                  </p>
                  <div className="space-y-1 text-[13px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#101010]/60">Status:</span>
                      <div className="flex items-center gap-1.5">
                        {workspace.kycStatus === 'approved' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        ) : workspace.kycStatus === 'pending' ? (
                          <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-[#101010]/30" />
                        )}
                        <span className="text-[#101010]">
                          {workspace.kycStatus || 'none'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#101010]/60">Marked Done:</span>
                      <span className="text-[#101010]">
                        {workspace.kycMarkedDone ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Align IDs */}
              <div className="bg-[#F7F7F2] rounded p-3 mb-6">
                <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-2">
                  Align Integration
                </p>
                <div className="space-y-1 text-[12px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#101010]/60">Customer ID:</span>
                    <span className="text-[#101010]">
                      {workspace.alignCustomerId || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#101010]/60">
                      Virtual Account ID:
                    </span>
                    <span className="text-[#101010]">
                      {workspace.alignVirtualAccountId || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safes */}
              <div className="mb-6">
                <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-3">
                  Safes ({workspace.safes.length})
                </p>
                {workspace.safes.length === 0 ? (
                  <p className="text-[13px] text-[#101010]/50 italic">
                    No safes
                  </p>
                ) : (
                  <div className="space-y-2">
                    {workspace.safes.map((safe, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-[#F7F7F2] rounded"
                      >
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                            {safe.type}
                          </span>
                          <p className="text-[12px] font-mono text-[#101010] mt-0.5">
                            {safe.address}
                          </p>
                        </div>
                        {safe.isMine && (
                          <span className="px-2 py-1 text-[10px] font-medium bg-[#1B29FF]/10 text-[#1B29FF] rounded">
                            MINE
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Funding Sources */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-3">
                  Funding Sources ({workspace.fundingSources.length})
                </p>
                {workspace.fundingSources.length === 0 ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-[13px] text-yellow-800">
                      ⚠️ No funding sources - virtual accounts not created
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {workspace.fundingSources.map((source, idx) => (
                      <div key={idx} className="p-3 bg-[#F7F7F2] rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                            {source.type} ({source.currency})
                          </span>
                          {source.isMine && (
                            <span className="px-2 py-1 text-[10px] font-medium bg-[#1B29FF]/10 text-[#1B29FF] rounded">
                              MINE
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] font-mono text-[#101010]">
                          {source.accountNumber}
                        </p>
                        <p className="text-[11px] text-[#101010]/60 mt-1">
                          Provider: {source.provider}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
