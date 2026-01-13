#!/usr/bin/env node
import { execFile } from 'child_process';
import { randomBytes } from 'crypto';
import http from 'http';
import { Command } from 'commander';
import fs from 'fs/promises';
import { stdin as stdinStream, stdout as stdoutStream } from 'process';
import readline from 'readline/promises';
import { promisify } from 'util';
import { apiRequest } from './client.js';
import { clearConfig, saveConfig } from './config.js';

const program = new Command();

function output(data: unknown) {
  if (typeof data === 'string') {
    console.log(data);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

const execFileAsync = promisify(execFile);
const DEFAULT_BASE_URL = 'https://0.finance';
const CONNECT_TIMEOUT_MS = 120_000;

function createStateToken() {
  return randomBytes(16).toString('hex');
}

async function openBrowser(url: string) {
  const platform = process.platform;
  let command = 'xdg-open';
  let args = [url];

  if (platform === 'darwin') {
    command = 'open';
  } else if (platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '', url];
  }

  try {
    await execFileAsync(command, args, { windowsHide: true });
    return true;
  } catch (error) {
    return false;
  }
}

async function startCallbackServer(state: string) {
  let resolveToken: (token: string) => void;
  let resolved = false;

  const tokenPromise = new Promise<string>((resolve) => {
    resolveToken = resolve;
  });

  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    if (url.pathname !== '/callback') {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const token = url.searchParams.get('token');
    const requestState = url.searchParams.get('state');

    if (!token) {
      res.statusCode = 400;
      res.end('Missing token');
      return;
    }

    if (requestState && requestState !== state) {
      res.statusCode = 400;
      res.end('Invalid state');
      return;
    }

    if (!resolved) {
      resolved = true;
      resolveToken(token);
    }

    res.statusCode = 200;
    res.end('CLI connected. You can close this tab.');
  });

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    server.close();
    throw new Error('Failed to start callback server');
  }

  const redirectUri = `http://127.0.0.1:${address.port}/callback`;

  return {
    redirectUri,
    tokenPromise,
    close: () => server.close(),
  };
}

async function waitForToken(
  tokenPromise: Promise<string>,
  timeoutMs = CONNECT_TIMEOUT_MS,
) {
  let timeoutId: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => resolve(null), timeoutMs);
  });

  const token = await Promise.race([tokenPromise, timeoutPromise]);

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  return token ?? null;
}

async function promptForApiKey() {
  const prompt = readline.createInterface({
    input: stdinStream,
    output: stdoutStream,
  });

  const answer = await prompt.question('Paste your API key: ');
  prompt.close();
  return answer.trim();
}

async function runAuthConnect(options: {
  baseUrl?: string;
  browser?: boolean;
  manual?: boolean;
}) {
  const baseUrl = options.baseUrl || DEFAULT_BASE_URL;
  const state = createStateToken();

  let redirectUri: string | null = null;
  let tokenPromise: Promise<string> | null = null;
  let closeServer: (() => void) | null = null;

  if (!options.manual) {
    const callback = await startCallbackServer(state);
    redirectUri = callback.redirectUri;
    tokenPromise = callback.tokenPromise;
    closeServer = callback.close;
  }

  const connectUrl = new URL('/cli/connect', baseUrl);
  connectUrl.searchParams.set('state', state);
  if (redirectUri) {
    connectUrl.searchParams.set('redirect_uri', redirectUri);
  }

  const targetUrl = connectUrl.toString();
  let opened = false;

  if (options.browser !== false) {
    opened = await openBrowser(targetUrl);
  }

  if (!opened) {
    console.log(`Open this URL in your browser:\n${targetUrl}`);
  }

  let apiKey: string | null = null;

  if (tokenPromise) {
    apiKey = await waitForToken(tokenPromise);
  }

  if (!apiKey) {
    console.log('If the browser flow did not complete, paste your API key.');
    apiKey = await promptForApiKey();
  }

  if (!apiKey) {
    throw new Error('API key is required to continue.');
  }

  if (closeServer) {
    closeServer();
  }

  await saveConfig({ apiKey, baseUrl });
  output({
    success: true,
    method: 'browser',
    next: 'Run `finance auth whoami` to verify the connection.',
  });
}

function resolveAdminToken(token?: string) {
  return token || process.env.ZERO_FINANCE_ADMIN_TOKEN || '';
}

async function readJsonFile(path: string) {
  const content = await fs.readFile(path, 'utf8');
  return JSON.parse(content);
}

async function readFileBase64(path: string) {
  const content = await fs.readFile(path);
  return content.toString('base64');
}

program.name('finance').description('0 Finance CLI').version('0.1.5');

const auth = program.command('auth').description('Authentication');

auth
  .option('--base-url <url>', 'Base URL for the API', DEFAULT_BASE_URL)
  .option('--no-browser', 'Do not open browser automatically')
  .option('--manual', 'Paste API key manually instead of callback')
  .action(async (opts) => {
    await runAuthConnect({
      baseUrl: opts.baseUrl,
      browser: opts.browser,
      manual: opts.manual,
    });
  });

auth
  .command('connect')
  .description('Open the browser and connect the CLI')
  .option('--base-url <url>', 'Base URL for the API', DEFAULT_BASE_URL)
  .option('--no-browser', 'Do not open browser automatically')
  .option('--manual', 'Paste API key manually instead of callback')
  .action(async (opts) => {
    await runAuthConnect({
      baseUrl: opts.baseUrl,
      browser: opts.browser,
      manual: opts.manual,
    });
  });

auth
  .command('login')
  .description('Store API key and base URL')
  .requiredOption('--api-key <key>', 'Workspace API key')
  .option('--base-url <url>', 'Base URL for the API', DEFAULT_BASE_URL)
  .action(async (opts) => {
    await saveConfig({ apiKey: opts.apiKey, baseUrl: opts.baseUrl });
    output({ success: true });
  });

auth
  .command('whoami')
  .description('Show workspace context for current API key')
  .action(async () => {
    const data = await apiRequest('/api/cli/whoami');
    output(data);
  });

auth
  .command('logout')
  .description('Remove saved API credentials')
  .action(async () => {
    await clearConfig();
    output({ success: true });
  });

program
  .command('login')
  .description('Open the browser and connect the CLI')
  .option('--base-url <url>', 'Base URL for the API', DEFAULT_BASE_URL)
  .option('--no-browser', 'Do not open browser automatically')
  .option('--manual', 'Paste API key manually instead of callback')
  .action(async (opts) => {
    await runAuthConnect({
      baseUrl: opts.baseUrl,
      browser: opts.browser,
      manual: opts.manual,
    });
  });

const bank = program.command('bank').description('Bank operations');

const bankAccounts = bank
  .command('accounts')
  .description('Saved bank accounts');

bankAccounts
  .command('list')
  .description('List saved bank accounts')
  .action(async () => {
    const data = await apiRequest('/api/cli/bank-accounts');
    output(data);
  });

bankAccounts
  .command('create')
  .description('Create a saved bank account from JSON')
  .requiredOption('--json <path>', 'Path to JSON payload')
  .action(async (opts) => {
    const payload = await readJsonFile(opts.json);
    const data = await apiRequest('/api/cli/bank-accounts', {
      method: 'POST',
      body: payload,
    });
    output(data);
  });

const bankTransfers = bank
  .command('transfers')
  .alias('transfer')
  .description('Bank transfers');

bankTransfers
  .command('propose')
  .description('Propose a bank transfer for approval')
  .requiredOption('--amount <amount>', 'Amount in USDC')
  .requiredOption('--currency <currency>', 'Destination currency (usd|eur)')
  .requiredOption('--bank-account-id <id>', 'Saved bank account ID')
  .option('--reason <reason>', 'Reason for proposal')
  .action(async (opts) => {
    const payload = {
      amount_usdc: opts.amount,
      destination_currency: opts.currency,
      saved_bank_account_id: opts.bankAccountId,
      reason: opts.reason,
    };
    const data = await apiRequest('/api/cli/bank-transfers/proposals', {
      method: 'POST',
      body: payload,
    });
    output(data);
  });

const bankProposals = bank
  .command('proposals')
  .description('Bank transfer proposals');

bankProposals
  .command('list')
  .description('List bank transfer proposals')
  .option('--include-completed', 'Include completed proposals')
  .action(async (opts) => {
    const url = opts.includeCompleted
      ? '/api/cli/bank-transfers/proposals?include_completed=true'
      : '/api/cli/bank-transfers/proposals';
    const data = await apiRequest(url);
    output(data);
  });

bankProposals
  .command('dismiss')
  .description('Dismiss a bank transfer proposal')
  .requiredOption('--proposal-id <id>', 'Proposal ID')
  .action(async (opts) => {
    const data = await apiRequest(
      `/api/cli/bank-transfers/proposals/${opts.proposalId}/dismiss`,
      { method: 'POST' },
    );
    output(data);
  });

program
  .command('balance')
  .description('Show spendable balance breakdown')
  .action(async () => {
    const data = await apiRequest('/api/cli/balance');
    output(data);
  });

const invoices = program.command('invoices').description('Invoice operations');

invoices
  .command('create')
  .requiredOption('--recipient-email <email>', 'Recipient email')
  .requiredOption('--amount <amount>', 'Invoice amount')
  .requiredOption('--currency <currency>', 'Currency')
  .requiredOption('--description <text>', 'Description')
  .option('--recipient-name <name>', 'Recipient name')
  .option('--due-date <date>', 'Due date (YYYY-MM-DD)')
  .option('--notes <notes>', 'Notes')
  .action(async (opts) => {
    const payload = {
      recipient_email: opts.recipientEmail,
      recipient_name: opts.recipientName,
      amount: Number(opts.amount),
      currency: opts.currency,
      description: opts.description,
      due_date: opts.dueDate,
      notes: opts.notes,
    };
    const data = await apiRequest('/api/cli/invoices', {
      method: 'POST',
      body: payload,
    });
    output(data);
  });

invoices
  .command('update')
  .requiredOption('--invoice-id <id>', 'Invoice ID')
  .option('--recipient-email <email>', 'Recipient email')
  .option('--recipient-name <name>', 'Recipient name')
  .option('--amount <amount>', 'Amount')
  .option('--currency <currency>', 'Currency')
  .option('--description <text>', 'Description')
  .action(async (opts) => {
    const payload: Record<string, unknown> = {};
    if (opts.recipientEmail) payload.recipient_email = opts.recipientEmail;
    if (opts.recipientName) payload.recipient_name = opts.recipientName;
    if (opts.amount) payload.amount = Number(opts.amount);
    if (opts.currency) payload.currency = opts.currency;
    if (opts.description) payload.description = opts.description;

    const data = await apiRequest(`/api/cli/invoices/${opts.invoiceId}`, {
      method: 'PATCH',
      body: payload,
    });
    output(data);
  });

invoices
  .command('list')
  .option('--status <status>', 'Filter by status')
  .option('--limit <limit>', 'Limit')
  .action(async (opts) => {
    const query = new URLSearchParams();
    if (opts.status) query.set('status', opts.status);
    if (opts.limit) query.set('limit', opts.limit);
    const url = query.toString()
      ? `/api/cli/invoices?${query}`
      : '/api/cli/invoices';
    const data = await apiRequest(url);
    output(data);
  });

invoices
  .command('get')
  .requiredOption('--invoice-id <id>', 'Invoice ID')
  .action(async (opts) => {
    const data = await apiRequest(`/api/cli/invoices/${opts.invoiceId}`);
    output(data);
  });

invoices
  .command('send')
  .requiredOption('--invoice-id <id>', 'Invoice ID')
  .action(async (opts) => {
    const data = await apiRequest(`/api/cli/invoices/${opts.invoiceId}/send`, {
      method: 'POST',
    });
    output(data);
  });

const transactions = program
  .command('transactions')
  .description('Transaction history');

transactions
  .command('list')
  .option('--status <status>', 'Filter by status')
  .option('--limit <limit>', 'Limit')
  .action(async (opts) => {
    const query = new URLSearchParams();
    if (opts.status) query.set('status', opts.status);
    if (opts.limit) query.set('limit', opts.limit);
    const url = query.toString()
      ? `/api/cli/transactions?${query}`
      : '/api/cli/transactions';
    const data = await apiRequest(url);
    output(data);
  });

transactions
  .command('get')
  .requiredOption('--transaction-id <id>', 'Transaction ID')
  .action(async (opts) => {
    const data = await apiRequest(
      `/api/cli/transactions/${opts.transactionId}`,
    );
    output(data);
  });

const attachments = program
  .command('attachments')
  .description('Transaction attachments');

attachments
  .command('add')
  .requiredOption('--transaction-id <id>', 'Transaction ID')
  .option('--transaction-type <type>', 'Transaction type (offramp|invoice)')
  .option('--type <type>', 'Alias for transaction type')
  .requiredOption('--file <path>', 'Path to file')
  .option('--content-type <type>', 'Content type (optional)')
  .action(async (opts) => {
    const transactionType = opts.transactionType ?? opts.type;
    if (!transactionType) {
      throw new Error(
        'Missing transaction type. Use --type or --transaction-type.',
      );
    }

    const fileBase64 = await readFileBase64(opts.file);
    const payload = {
      transaction_id: opts.transactionId,
      transaction_type: transactionType,
      filename: opts.file.split('/').pop(),
      file_base64: fileBase64,
      content_type: opts.contentType,
    };
    const data = await apiRequest('/api/cli/attachments', {
      method: 'POST',
      body: payload,
    });
    output(data);
  });

attachments
  .command('list')
  .option('--transaction-id <id>', 'Transaction ID')
  .option('--transaction-type <type>', 'Transaction type')
  .option('--limit <limit>', 'Limit')
  .action(async (opts) => {
    const query = new URLSearchParams();
    if (opts.transactionId) query.set('transaction_id', opts.transactionId);
    if (opts.transactionType)
      query.set('transaction_type', opts.transactionType);
    if (opts.limit) query.set('limit', opts.limit);
    const url = query.toString()
      ? `/api/cli/attachments?${query}`
      : '/api/cli/attachments';
    const data = await apiRequest(url);
    output(data);
  });

attachments
  .command('remove')
  .requiredOption('--attachment-id <id>', 'Attachment ID')
  .action(async (opts) => {
    const data = await apiRequest(`/api/cli/attachments/${opts.attachmentId}`, {
      method: 'DELETE',
    });
    output(data);
  });

const paymentDetails = program
  .command('payment-details')
  .description('Payment details');

paymentDetails.command('show').action(async () => {
  const data = await apiRequest('/api/cli/payment-details');
  output(data);
});

paymentDetails
  .command('share')
  .requiredOption('--recipient-email <email>', 'Recipient email')
  .option('--recipient-name <name>', 'Recipient name')
  .action(async (opts) => {
    const payload = {
      recipient_email: opts.recipientEmail,
      recipient_name: opts.recipientName,
    };
    const data = await apiRequest('/api/cli/payment-details/share', {
      method: 'POST',
      body: payload,
    });
    output(data);
  });

const crypto = program.command('crypto').description('Crypto transfers');

const cryptoTransfers = crypto
  .command('transfers')
  .description('Token transfers');

cryptoTransfers
  .command('propose')
  .description('Propose a crypto transfer')
  .requiredOption('--to <address>', 'Recipient address')
  .requiredOption('--token-address <address>', 'Token contract address')
  .requiredOption('--amount <amount>', 'Token amount')
  .option('--token-decimals <decimals>', 'Token decimals')
  .option('--token-symbol <symbol>', 'Token symbol')
  .option('--chain-id <id>', 'Chain ID')
  .option('--reason <text>', 'Reason for proposal')
  .action(async (opts) => {
    const payload = {
      to_address: opts.to,
      token_address: opts.tokenAddress,
      amount: opts.amount,
      token_decimals: opts.tokenDecimals
        ? Number(opts.tokenDecimals)
        : undefined,
      token_symbol: opts.tokenSymbol,
      chain_id: opts.chainId ? Number(opts.chainId) : undefined,
      reason: opts.reason,
    };
    const data = await apiRequest('/api/cli/crypto-transfers/proposals', {
      method: 'POST',
      body: payload,
    });
    output(data);
  });

const cryptoProposals = crypto
  .command('proposals')
  .description('Crypto transfer proposals');

cryptoProposals
  .command('list')
  .option('--include-completed', 'Include completed proposals')
  .action(async (opts) => {
    const url = opts.includeCompleted
      ? '/api/cli/crypto-transfers/proposals?include_completed=true'
      : '/api/cli/crypto-transfers/proposals';
    const data = await apiRequest(url);
    output(data);
  });

cryptoProposals
  .command('dismiss')
  .requiredOption('--proposal-id <id>', 'Proposal ID')
  .action(async (opts) => {
    const data = await apiRequest(
      `/api/cli/crypto-transfers/proposals/${opts.proposalId}/dismiss`,
      { method: 'POST' },
    );
    output(data);
  });

const savings = program.command('savings').description('Savings proposals');

const savingsDeposits = savings
  .command('deposits')
  .description('Savings deposits');

savingsDeposits
  .command('propose')
  .requiredOption('--vault-address <address>', 'Vault address')
  .requiredOption('--amount <amount>', 'Amount')
  .option('--reason <text>', 'Reason for proposal')
  .action(async (opts) => {
    const payload = {
      vault_address: opts.vaultAddress,
      amount: opts.amount,
      reason: opts.reason,
    };
    const data = await apiRequest('/api/cli/savings/deposits', {
      method: 'POST',
      body: payload,
    });
    output(data);
  });

const savingsWithdrawals = savings
  .command('withdrawals')
  .description('Savings withdrawals');

savingsWithdrawals
  .command('propose')
  .requiredOption('--vault-address <address>', 'Vault address')
  .requiredOption('--amount <amount>', 'Amount')
  .option('--reason <text>', 'Reason for proposal')
  .action(async (opts) => {
    const payload = {
      vault_address: opts.vaultAddress,
      amount: opts.amount,
      reason: opts.reason,
    };
    const data = await apiRequest('/api/cli/savings/withdrawals', {
      method: 'POST',
      body: payload,
    });
    output(data);
  });

const savingsProposals = savings
  .command('proposals')
  .description('Savings proposals');

savingsProposals
  .command('list')
  .option('--include-completed', 'Include completed proposals')
  .action(async (opts) => {
    const url = opts.includeCompleted
      ? '/api/cli/savings/proposals?include_completed=true'
      : '/api/cli/savings/proposals';
    const data = await apiRequest(url);
    output(data);
  });

savings
  .command('positions')
  .description('Show vault positions')
  .action(async () => {
    const data = await apiRequest('/api/cli/savings/positions');
    output(data);
  });

const vaults = program.command('vaults').description('Supported vaults');

vaults
  .command('list')
  .description('List supported vaults')
  .action(async () => {
    const data = await apiRequest('/api/cli/vaults');
    output(data);
  });

const usersCmd = program
  .command('users')
  .description('Privy user provisioning');

usersCmd
  .command('create')
  .option('--email <email>', 'User email')
  .option('--phone <phone>', 'User phone')
  .option('--wallets-json <path>', 'Wallets JSON array')
  .option('--admin-token <token>', 'Admin token')
  .action(async (opts) => {
    const adminToken = resolveAdminToken(opts.adminToken);
    if (!adminToken) {
      throw new Error('Admin token required for user provisioning');
    }

    if (!opts.email && !opts.phone) {
      throw new Error('Provide --email or --phone');
    }

    const wallets = opts.walletsJson
      ? await readJsonFile(opts.walletsJson)
      : undefined;
    const payload = {
      email: opts.email,
      phone: opts.phone,
      wallets,
    };
    const data = await apiRequest('/api/cli/users', {
      method: 'POST',
      body: payload,
      adminToken,
    });
    output(data);
  });

const userWallets = usersCmd
  .command('wallets')
  .description('Privy wallet operations');

userWallets
  .command('pregenerate')
  .requiredOption('--user-id <id>', 'Privy user ID')
  .option('--wallets-json <path>', 'Wallets JSON array')
  .option('--admin-token <token>', 'Admin token')
  .action(async (opts) => {
    const adminToken = resolveAdminToken(opts.adminToken);
    if (!adminToken) {
      throw new Error('Admin token required for wallet provisioning');
    }

    const wallets = opts.walletsJson
      ? await readJsonFile(opts.walletsJson)
      : undefined;
    const payload = { wallets };
    const data = await apiRequest(`/api/cli/users/${opts.userId}/wallets`, {
      method: 'POST',
      body: payload,
      adminToken,
    });
    output(data);
  });

usersCmd
  .command('show')
  .requiredOption('--user-id <id>', 'Privy user ID')
  .option('--admin-token <token>', 'Admin token')
  .action(async (opts) => {
    const adminToken = resolveAdminToken(opts.adminToken);
    if (!adminToken) {
      throw new Error('Admin token required for user lookup');
    }

    const data = await apiRequest(`/api/cli/users/${opts.userId}`, {
      adminToken,
    });
    output(data);
  });

const apiKeys = program.command('api-keys').description('API key management');

apiKeys
  .command('create')
  .requiredOption('--workspace-id <id>', 'Workspace ID')
  .requiredOption('--created-by <id>', 'Privy user ID')
  .option('--name <name>', 'Key name')
  .option('--expires-at <date>', 'ISO date')
  .option('--admin-token <token>', 'Admin token')
  .action(async (opts) => {
    const adminToken = resolveAdminToken(opts.adminToken);
    if (!adminToken) {
      throw new Error('Admin token required for API key creation');
    }

    const payload = {
      workspace_id: opts.workspaceId,
      created_by: opts.createdBy,
      name: opts.name,
      expires_at: opts.expiresAt,
    };
    const data = await apiRequest('/api/cli/api-keys', {
      method: 'POST',
      body: payload,
      adminToken,
    });
    output(data);
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
