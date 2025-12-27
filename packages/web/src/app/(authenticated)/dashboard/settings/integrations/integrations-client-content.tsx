'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Plug,
  Key,
  Copy,
  Check,
  Trash2,
  Plus,
  Bot,
  ExternalLink,
  Terminal,
  Mail,
  Sparkles,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

function InstallMcpCommand({ apiKey }: { apiKey: string }) {
  const [copiedCommand, setCopiedCommand] = useState(false);

  const installCommand = `npx install-mcp https://www.0.finance/api/mcp --client claude --header "Authorization: Bearer ${apiKey}"`;

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopiedCommand(true);
    toast.success('Command copied to clipboard');
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Quick Install</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Run this command in your terminal to add 0 Finance to Claude Desktop:
      </p>
      <div className="relative">
        <pre className="rounded bg-black p-3 pr-12 font-mono text-xs text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
          {installCommand}
        </pre>
        <Button
          size="icon"
          variant="outline"
          onClick={handleCopyCommand}
          className="absolute right-2 top-2 h-8 w-8 bg-black/50 border-gray-600 hover:bg-black/70"
        >
          {copiedCommand ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        For other clients, replace{' '}
        <code className="rounded bg-muted px-1">claude</code> with:{' '}
        <code className="rounded bg-muted px-1">cursor</code>,{' '}
        <code className="rounded bg-muted px-1">vscode</code>,{' '}
        <code className="rounded bg-muted px-1">windsurf</code>, or{' '}
        <code className="rounded bg-muted px-1">cline</code>
      </p>
    </div>
  );
}

function AiEmailCard() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { data: currentWorkspace, isLoading } =
    api.workspace.getOrCreateWorkspace.useQuery();

  // Get the AI email domain from environment or use default
  const aiEmailDomain =
    process.env.NEXT_PUBLIC_AI_EMAIL_DOMAIN || 'ai.0.finance';

  const aiEmailAddress = currentWorkspace?.workspaceId
    ? `${currentWorkspace.workspaceId}@${aiEmailDomain}`
    : null;

  const handleCopyEmail = async () => {
    if (aiEmailAddress) {
      await navigator.clipboard.writeText(aiEmailAddress);
      setCopiedEmail(true);
      toast.success('Email address copied to clipboard');
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Email Agent
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900 dark:to-purple-900 dark:text-blue-300"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Beta
                </Badge>
              </CardTitle>
              <CardDescription>
                Create invoices by forwarding emails to your workspace
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
        ) : aiEmailAddress ? (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Your AI Email Address
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border bg-muted/50 px-4 py-3">
                  <code className="text-sm font-medium">{aiEmailAddress}</code>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyEmail}
                  className="h-12 w-12"
                >
                  {copiedEmail ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-950/50 dark:to-purple-950/50">
              <h4 className="text-sm font-medium">How it works</h4>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
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

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
              <strong>Tip:</strong> Forward emails from clients with project
              details, quotes, or agreements. The AI will extract invoice
              information automatically.
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <Mail className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Unable to load workspace. Please try refreshing the page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
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
    <div className="w-full space-y-8 px-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="mt-2 text-muted-foreground">
          Connect AI agents and external services to your workspace.
        </p>
      </div>

      {/* AI Email Agent Section */}
      <AiEmailCard />

      {/* MCP API Keys Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>AI Agent Access (MCP)</CardTitle>
                <CardDescription>
                  Create API keys to allow AI agents to interact with your
                  account via the Model Context Protocol.
                </CardDescription>
              </div>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Key
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                {newKey ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>API Key Created</DialogTitle>
                      <DialogDescription>
                        Copy this key now. It will not be shown again.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Your API Key
                        </Label>
                        <div className="mt-1 flex items-center gap-2">
                          <Input
                            value={newKey}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCopyKey}
                          >
                            {copied ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <InstallMcpCommand apiKey={newKey} />
                      <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        <strong>Important:</strong> Store this key securely. You
                        won&apos;t be able to see it again.
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCloseCreateDialog}>Done</Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Create API Key</DialogTitle>
                      <DialogDescription>
                        Give your API key a descriptive name to identify it
                        later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyName">Key Name</Label>
                        <Input
                          id="keyName"
                          placeholder="e.g., Claude Desktop, Cursor Agent"
                          value={keyName}
                          onChange={(e) => setKeyName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateKey();
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateKey}
                        disabled={createKeyMutation.isPending}
                      >
                        {createKeyMutation.isPending
                          ? 'Creating...'
                          : 'Create Key'}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : activeKeys.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <Key className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No API keys yet. Create one to enable AI agent access.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{key.name}</span>
                      <code className="rounded bg-muted px-2 py-0.5 text-xs">
                        {key.keyPrefix}...
                      </code>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created{' '}
                      {key.createdAt
                        ? formatDistanceToNow(new Date(key.createdAt), {
                            addSuffix: true,
                          })
                        : 'recently'}
                      {key.lastUsedAt && (
                        <>
                          {' '}
                          &middot; Last used{' '}
                          {formatDistanceToNow(new Date(key.lastUsedAt), {
                            addSuffix: true,
                          })}
                        </>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will immediately disable the key &quot;
                          {key.name}&quot;. Any agents using this key will lose
                          access.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          <div className="mt-4 rounded-lg bg-muted/50 p-4">
            <h4 className="text-sm font-medium">How to connect an AI agent</h4>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Create an API key above</li>
              <li>
                Configure your AI agent with the MCP endpoint:{' '}
                <code className="rounded bg-muted px-1">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/api/mcp`
                    : '/api/mcp'}
                </code>
              </li>
              <li>
                Set the Authorization header:{' '}
                <code className="rounded bg-muted px-1">
                  Bearer your_api_key
                </code>
              </li>
            </ol>
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Learn more about MCP
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Revoked Keys (collapsed) */}
          {revokedKeys.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                {revokedKeys.length} revoked key
                {revokedKeys.length === 1 ? '' : 's'}
              </summary>
              <div className="mt-2 space-y-2">
                {revokedKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between rounded-lg border border-dashed p-3 opacity-50"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm line-through">{key.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          Revoked
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
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
        </CardContent>
      </Card>

      {/* Legacy Integrations Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plug className="h-6 w-6 text-muted-foreground" />
              <div>
                <CardTitle>Email & Document Sync</CardTitle>
                <CardDescription>
                  Automatic inbox ingestion and Gmail-based processing has been
                  retired from the product.
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Unavailable</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your workspace now relies on direct uploads and bank-sync
            automations. If you need a specific integration, drop us a note and
            we&apos;ll reach out as new connectors come online.
          </p>
          <Button className="mt-4" disabled>
            Connect Service
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
