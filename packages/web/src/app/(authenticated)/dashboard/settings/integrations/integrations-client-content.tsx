'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Key,
  Copy,
  Check,
  Trash2,
  Plus,
  Bot,
  ExternalLink,
  Terminal,
  Mail,
  Loader2,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

function InstallMcpCommand({ apiKey }: { apiKey: string }) {
  const [copiedCommand, setCopiedCommand] = useState(false);

  // In development, point to localhost:3050
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3050'
      : 'https://www.0.finance';

  // Determine if this is a test or live token based on prefix
  const isTestToken = apiKey.startsWith('zf_test_');
  const tokenType = isTestToken ? 'Test' : 'Live';

  const installCommand = `npx install-mcp @anthropic-ai/mcp-server-sse --url ${baseUrl}/api/mcp -H "Authorization: Bearer ${apiKey}" --client claude`;

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopiedCommand(true);
    toast.success('Command copied to clipboard');
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  return (
    <div className="space-y-3 border border-[#101010]/10 bg-[#F7F7F2] p-4">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-[#101010]/60" />
        <span className="text-[13px] font-medium text-[#101010]">
          Quick Install
        </span>
        <span
          className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${isTestToken ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#10B981]/10 text-[#10B981]'}`}
        >
          {tokenType} Token
        </span>
      </div>
      <p className="text-[12px] text-[#101010]/60">
        Run this command in your terminal to add 0 Finance to Claude Desktop:
      </p>
      <div className="relative">
        <pre className="bg-[#101010] p-3 pr-12 font-mono text-[12px] text-[#10B981] overflow-x-auto whitespace-pre-wrap break-all">
          {installCommand}
        </pre>
        <button
          onClick={handleCopyCommand}
          className="absolute right-2 top-2 h-8 w-8 flex items-center justify-center bg-[#101010]/50 border border-[#101010]/30 hover:bg-[#101010]/70 transition-colors"
        >
          {copiedCommand ? (
            <Check className="h-4 w-4 text-[#10B981]" />
          ) : (
            <Copy className="h-4 w-4 text-white/60" />
          )}
        </button>
      </div>
      <p className="text-[12px] text-[#101010]/60">
        This command uses install-mcp to configure Claude Desktop with your 0
        Finance account.
      </p>
    </div>
  );
}

function EmailVerificationStatus() {
  const {
    data: verificationStatus,
    isLoading,
    refetch,
  } = trpc.settings.emailVerification.checkCurrentUserStatus.useQuery();

  const verifyMutation =
    trpc.settings.emailVerification.verifyCurrentUser.useMutation({
      onSuccess: () => {
        toast.success('Verification email sent! Please check your inbox.');
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to send verification email');
      },
    });

  if (isLoading) {
    return <div className="h-16 animate-pulse bg-[#101010]/5" />;
  }

  if (!verificationStatus?.email) {
    return null;
  }

  if (verificationStatus.isVerified) {
    return (
      <div className="flex items-center gap-3 border border-[#10B981]/20 bg-[#10B981]/5 p-4">
        <div className="flex h-8 w-8 items-center justify-center bg-[#10B981]/10">
          <Check className="h-4 w-4 text-[#10B981]" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-medium text-[#101010]">
            Email Verified
          </p>
          <p className="text-[12px] text-[#101010]/60">
            You can receive AI responses at {verificationStatus.email}
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus.status === 'Pending') {
    return (
      <div className="space-y-3 border border-[#f59e0b]/20 bg-[#f59e0b]/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-[#f59e0b]/10">
            <Mail className="h-4 w-4 text-[#f59e0b]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-[#101010]">
              Verification Pending
            </p>
            <p className="text-[12px] text-[#101010]/60">
              Check your inbox for the verification email
            </p>
          </div>
        </div>
        <p className="text-[12px] text-[#101010]/60">
          Click the link in the email from Amazon Web Services to complete
          verification. It may take a few minutes to arrive.
        </p>
        <button
          onClick={() => refetch()}
          className="w-full border border-[#f59e0b]/30 bg-white text-[#101010] text-[12px] px-3 py-2 hover:bg-[#f59e0b]/5 transition-colors"
        >
          Check Status
        </button>
      </div>
    );
  }

  // Not verified - show verification button
  return (
    <div className="space-y-3 border border-[#101010]/10 bg-[#F7F7F2] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center bg-[#1B29FF]/10">
          <Mail className="h-4 w-4 text-[#1B29FF]" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-medium text-[#101010]">
            Verify Your Email
          </p>
          <p className="text-[12px] text-[#101010]/60">
            Required to receive AI responses
          </p>
        </div>
      </div>
      <p className="text-[12px] text-[#101010]/60">
        To receive emails from the AI agent, verify your email address.
        You&apos;ll receive a confirmation email from Amazon Web Services.
      </p>
      <button
        onClick={() => verifyMutation.mutate()}
        disabled={verifyMutation.isPending}
        className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white text-[12px] font-medium px-3 py-2 transition-colors disabled:opacity-50"
      >
        {verifyMutation.isPending ? 'Sending...' : 'Send Verification Email'}
      </button>
    </div>
  );
}

function AiEmailSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { data: currentWorkspace, isLoading: isLoadingWorkspace } =
    api.workspace.getOrCreateWorkspace.useQuery();

  const {
    data: aiEmailData,
    isLoading: isLoadingEmail,
    refetch: refetchEmail,
  } = api.workspace.getAiEmailAddress.useQuery(
    { workspaceId: currentWorkspace?.workspaceId ?? '' },
    { enabled: !!currentWorkspace?.workspaceId },
  );

  const regenerateMutation = api.workspace.regenerateAiEmailHandle.useMutation({
    onSuccess: () => {
      toast.success('AI email address regenerated');
      refetchEmail();
      setIsRegenerating(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to regenerate email address');
      setIsRegenerating(false);
    },
  });

  const isLoading = isLoadingWorkspace || isLoadingEmail;
  const aiEmailAddress = aiEmailData?.email ?? null;

  const handleCopyEmail = async () => {
    if (aiEmailAddress) {
      await navigator.clipboard.writeText(aiEmailAddress);
      setCopiedEmail(true);
      toast.success('Email address copied to clipboard');
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleRegenerate = () => {
    if (!currentWorkspace?.workspaceId) return;
    setIsRegenerating(true);
    regenerateMutation.mutate({ workspaceId: currentWorkspace.workspaceId });
  };

  return (
    <div className="bg-white border border-[#101010]/10">
      {/* Header */}
      <div className="p-4 border-b border-[#101010]/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-[#1B29FF]/10">
            <Mail className="h-5 w-5 text-[#1B29FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-medium text-[#101010]">
                AI Email Agent
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-[#1B29FF]/10 text-[#1B29FF]">
                Beta
              </span>
            </div>
            <p className="text-[12px] text-[#101010]/60 mt-0.5">
              Create invoices and attach documents by emailing your AI assistant
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="h-20 animate-pulse bg-[#101010]/5" />
        ) : aiEmailAddress ? (
          <>
            <EmailVerificationStatus />

            <div className="space-y-2">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                Your AI Email Address
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 border border-[#101010]/10 bg-[#F7F7F2] px-4 py-3">
                  <code className="text-[13px] font-medium text-[#101010]">
                    {aiEmailAddress}
                  </code>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="h-12 w-12 flex items-center justify-center border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                  title="Copy email address"
                >
                  {copiedEmail ? (
                    <Check className="h-4 w-4 text-[#10B981]" />
                  ) : (
                    <Copy className="h-4 w-4 text-[#101010]/60" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#101010]/50">
                Only workspace members can send emails to this address.
              </p>
            </div>

            <div className="bg-[#F7F7F2] p-4 space-y-2">
              <p className="text-[13px] font-medium text-[#101010]">
                How it works
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[12px] text-[#101010]/70">
                <li>
                  Forward any email with invoice details to your AI email
                  address
                </li>
                <li>
                  AI extracts recipient, amount, and description automatically
                </li>
                <li>Review and confirm the invoice via email reply</li>
                <li>Invoice is sent to your client instantly</li>
              </ol>
            </div>

            <div className="border border-[#f59e0b]/20 bg-[#f59e0b]/5 p-3 text-[12px] text-[#101010]/80">
              <strong className="text-[#101010]">Tip:</strong> Forward emails
              from clients with project details, quotes, or agreements. The AI
              will extract invoice information automatically.
            </div>

            {/* Regenerate Handle Section */}
            <details className="mt-4">
              <summary className="cursor-pointer text-[12px] text-[#101010]/50 hover:text-[#101010]/70 transition-colors">
                Advanced options
              </summary>
              <div className="mt-3 p-3 border border-[#101010]/10 bg-[#F7F7F2]/50 space-y-2">
                <p className="text-[12px] text-[#101010]/70">
                  If your AI email address has been compromised or you want a
                  new one, you can regenerate it. The old address will stop
                  working immediately.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={isRegenerating}
                      className="text-[12px] text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {isRegenerating && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      Regenerate email address
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[18px] font-medium text-[#101010]">
                        Regenerate AI Email Address?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-[13px] text-[#101010]/60">
                        This will create a new AI email address and immediately
                        disable the current one. Any emails sent to the old
                        address will no longer work.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel className="border border-[#101010]/10 hover:bg-[#F7F7F2] text-[#101010] text-[12px] px-4 py-2">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white text-[12px] font-medium px-4 py-2"
                        onClick={handleRegenerate}
                      >
                        Regenerate
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </details>
          </>
        ) : (
          <div className="border border-dashed border-[#101010]/20 p-6 text-center">
            <Mail className="mx-auto h-8 w-8 text-[#101010]/30" />
            <p className="mt-2 text-[13px] text-[#101010]/60">
              Unable to load AI email address. Please try refreshing the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function IntegrationsClientContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const utils = trpc.useUtils();

  const { data: apiKeys, isLoading } = trpc.settings.apiKeys.list.useQuery();

  const createKeyMutation = trpc.settings.apiKeys.create.useMutation({
    onSuccess: (data) => {
      setNewKey(data.rawKey);
      setKeyName('');
      utils.settings.apiKeys.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create API key');
    },
  });

  const revokeKeyMutation = trpc.settings.apiKeys.revoke.useMutation({
    onSuccess: () => {
      toast.success('API key revoked');
      utils.settings.apiKeys.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to revoke API key');
    },
  });

  const handleCreateKey = () => {
    if (!keyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }
    createKeyMutation.mutate({ name: keyName.trim() });
  };

  const handleCopyKey = async () => {
    if (newKey) {
      await navigator.clipboard.writeText(newKey);
      setCopied(true);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseCreateDialog = () => {
    setIsCreateOpen(false);
    setNewKey(null);
    setKeyName('');
  };

  const activeKeys = apiKeys?.filter((k) => !k.isRevoked) ?? [];
  const revokedKeys = apiKeys?.filter((k) => k.isRevoked) ?? [];

  return (
    <div className="pt-6 w-full space-y-8 px-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-[24px] font-medium tracking-[-0.01em] text-[#101010]">
          Integrations
        </h1>
        <p className="mt-1 text-[14px] text-[#101010]/60">
          Connect AI agents and external services to your workspace.
        </p>
      </div>

      {/* AI Email Agent Section */}
      <AiEmailSection />

      {/* MCP API Keys Section */}
      <div className="bg-white border border-[#101010]/10">
        {/* Header */}
        <div className="p-4 border-b border-[#101010]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#1B29FF]/10">
              <Bot className="h-5 w-5 text-[#1B29FF]" />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-[#101010]">
                AI Agent Access (MCP)
              </h3>
              <p className="text-[12px] text-[#101010]/60 mt-0.5">
                Create API keys to allow AI agents to interact with your account
              </p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <button className="bg-[#1B29FF] hover:bg-[#1420CC] text-white text-[12px] font-medium px-3 py-2 transition-colors inline-flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                Create Key
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              {newKey ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-[18px] font-medium text-[#101010]">
                      API Key Created
                    </DialogTitle>
                    <DialogDescription className="text-[13px] text-[#101010]/60">
                      Copy this key now. It will not be shown again.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-1">
                        Your API Key
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          value={newKey}
                          readOnly
                          className="flex-1 h-10 px-3 font-mono text-[13px] border border-[#101010]/10 bg-[#F7F7F2] text-[#101010]"
                        />
                        <button
                          onClick={handleCopyKey}
                          className="h-10 w-10 flex items-center justify-center border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-[#10B981]" />
                          ) : (
                            <Copy className="h-4 w-4 text-[#101010]/60" />
                          )}
                        </button>
                      </div>
                    </div>
                    <InstallMcpCommand apiKey={newKey} />
                    <div className="border border-[#f59e0b]/20 bg-[#f59e0b]/5 p-3 text-[12px] text-[#101010]/80">
                      <strong className="text-[#101010]">Important:</strong>{' '}
                      Store this key securely. You won&apos;t be able to see it
                      again.
                    </div>
                  </div>
                  <DialogFooter>
                    <button
                      onClick={handleCloseCreateDialog}
                      className="bg-[#1B29FF] hover:bg-[#1420CC] text-white text-[12px] font-medium px-4 py-2 transition-colors"
                    >
                      Done
                    </button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-[18px] font-medium text-[#101010]">
                      Create API Key
                    </DialogTitle>
                    <DialogDescription className="text-[13px] text-[#101010]/60">
                      Give your API key a descriptive name to identify it later.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                        Key Name
                      </p>
                      <input
                        id="keyName"
                        placeholder="e.g., Claude Desktop, Cursor Agent"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateKey();
                        }}
                        className="w-full h-10 px-3 border border-[#101010]/10 focus:border-[#1B29FF] focus:ring-1 focus:ring-[#1B29FF]/20 text-[14px] placeholder:text-[#101010]/40 transition-colors outline-none"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <button
                      onClick={() => setIsCreateOpen(false)}
                      className="border border-[#101010]/10 hover:bg-[#F7F7F2] text-[#101010] text-[12px] px-4 py-2 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateKey}
                      disabled={createKeyMutation.isPending}
                      className="bg-[#1B29FF] hover:bg-[#1420CC] text-white text-[12px] font-medium px-4 py-2 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {createKeyMutation.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {createKeyMutation.isPending
                        ? 'Creating...'
                        : 'Create Key'}
                    </button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="text-[13px] text-[#101010]/60">Loading...</div>
          ) : activeKeys.length === 0 ? (
            <div className="border border-dashed border-[#101010]/20 p-6 text-center">
              <Key className="mx-auto h-8 w-8 text-[#101010]/30" />
              <p className="mt-2 text-[13px] text-[#101010]/60">
                No API keys yet. Create one to enable AI agent access.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between border border-[#101010]/10 p-4 hover:bg-[#F7F7F2]/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-[#101010]">
                        {key.name}
                      </span>
                      <code className="bg-[#101010]/5 px-2 py-0.5 text-[11px] font-mono text-[#101010]/70">
                        {key.keyPrefix}...
                      </code>
                    </div>
                    <div className="text-[11px] text-[#101010]/50">
                      Created{' '}
                      {key.createdAt
                        ? formatDistanceToNow(new Date(key.createdAt), {
                            addSuffix: true,
                          })
                        : 'recently'}
                      {key.lastUsedAt && (
                        <>
                          {' · Last used '}
                          {formatDistanceToNow(new Date(key.lastUsedAt), {
                            addSuffix: true,
                          })}
                        </>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="h-8 w-8 flex items-center justify-center text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[18px] font-medium text-[#101010]">
                          Revoke API Key
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[13px] text-[#101010]/60">
                          This will immediately disable the key &quot;{key.name}
                          &quot;. Any agents using this key will lose access.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="border border-[#101010]/10 hover:bg-[#F7F7F2] text-[#101010] text-[12px] px-4 py-2">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 text-white text-[12px] font-medium px-4 py-2"
                          onClick={() =>
                            revokeKeyMutation.mutate({ keyId: key.id })
                          }
                        >
                          Revoke Key
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}

          {/* MCP Setup Instructions */}
          <div className="bg-[#F7F7F2] p-4 space-y-2">
            <p className="text-[13px] font-medium text-[#101010]">
              How to connect an AI agent
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[12px] text-[#101010]/70">
              <li>Create an API key above</li>
              <li>
                Configure your AI agent with the MCP endpoint:{' '}
                <code className="bg-[#101010]/5 px-1 text-[11px] font-mono">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/api/mcp`
                    : '/api/mcp'}
                </code>
              </li>
              <li>
                Set the Authorization header:{' '}
                <code className="bg-[#101010]/5 px-1 text-[11px] font-mono">
                  Bearer your_api_key
                </code>
              </li>
            </ol>
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[12px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
            >
              Learn more about MCP
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Revoked Keys (collapsed) */}
          {revokedKeys.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-[12px] text-[#101010]/50 hover:text-[#101010]/70 transition-colors">
                {revokedKeys.length} revoked key
                {revokedKeys.length === 1 ? '' : 's'}
              </summary>
              <div className="mt-2 space-y-2">
                {revokedKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between border border-dashed border-[#101010]/10 p-3 opacity-50"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] line-through text-[#101010]/60">
                          {key.name}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-[#101010]/5 text-[#101010]/60">
                          Revoked
                        </span>
                      </div>
                      <div className="text-[11px] text-[#101010]/40">
                        {key.revokedAt
                          ? `Revoked ${formatDistanceToNow(new Date(key.revokedAt), { addSuffix: true })}`
                          : 'Revoked'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
