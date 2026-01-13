import { execFile } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { clearConfig, loadConfig, saveConfig } from '../src/config.js';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_BASE_URL = 'http://localhost:3050';

function getArg(flag: string) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function buildEmail() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `ben+cli-e2e-${stamp}@0.finance`;
}

function parseJsonOutput(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const lines = trimmed.split('\n').filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      try {
        return JSON.parse(lines[i]);
      } catch (err) {
        // keep trying
      }
    }
    return { raw: trimmed };
  }
}

function assertNoError(payload: unknown, context: string) {
  if (!payload || typeof payload !== 'object') return;
  if ('error' in payload && payload.error) {
    throw new Error(`${context}: ${payload.error}`);
  }
}

async function runCli(args: string[], label: string) {
  const tsxPath = path.resolve(__dirname, '../node_modules/.bin/tsx');
  const cliPath = path.resolve(__dirname, '../src/index.ts');

  const { stdout, stderr } = await execFileAsync(tsxPath, [cliPath, ...args], {
    env: process.env,
  });

  if (stderr?.trim()) {
    console.error(stderr.trim());
  }

  const payload = parseJsonOutput(stdout);
  assertNoError(payload, label);
  return payload;
}

async function main() {
  const baseUrl = getArg('--base-url') ?? DEFAULT_BASE_URL;
  const adminToken =
    getArg('--admin-token') ??
    process.env.ADMIN_SECRET_TOKEN ??
    process.env.ZERO_FINANCE_ADMIN_TOKEN;
  const email = getArg('--email') ?? buildEmail();

  if (!adminToken) {
    throw new Error(
      'Missing admin token. Pass --admin-token or set ADMIN_SECRET_TOKEN.',
    );
  }

  const originalConfig = await loadConfig();
  const shouldRestoreConfig = Object.keys(originalConfig).length > 0;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zf-cli-e2e-'));

  try {
    console.log('Creating CLI user...');
    const userResult = await runCli(
      ['users', 'create', '--email', email, '--admin-token', adminToken],
      'users.create',
    );

    if (!userResult?.api_key) {
      throw new Error('users.create did not return api_key');
    }

    console.log('Saving CLI auth config...');
    await runCli(
      ['auth', 'login', '--api-key', userResult.api_key, '--base-url', baseUrl],
      'auth.login',
    );

    console.log('Verifying workspace context...');
    await runCli(['auth', 'whoami'], 'auth.whoami');

    console.log('Creating saved bank account...');
    const bankAccountPayload = {
      account_name: 'CLI Test Account',
      bank_name: 'Test Bank',
      account_holder_type: 'individual',
      account_holder_first_name: 'Test',
      account_holder_last_name: 'User',
      country: 'United States',
      city: 'San Francisco',
      street_line_1: '123 Market St',
      postal_code: '94105',
      account_type: 'iban',
      iban_number: 'DE89370400440532013000',
      bic_swift: 'COBADEFFXXX',
      is_default: true,
    };

    const bankAccountPath = path.join(tempDir, 'bank-account.json');
    await fs.writeFile(bankAccountPath, JSON.stringify(bankAccountPayload));

    const bankAccountResult = await runCli(
      ['bank', 'accounts', 'create', '--json', bankAccountPath],
      'bank.accounts.create',
    );

    const bankAccountId = bankAccountResult?.bank_account?.id;
    if (!bankAccountId) {
      throw new Error('bank.accounts.create did not return bank_account.id');
    }

    console.log('Listing saved bank accounts...');
    await runCli(['bank', 'accounts', 'list'], 'bank.accounts.list');

    console.log('Proposing bank transfer...');
    await runCli(
      [
        'bank',
        'transfers',
        'propose',
        '--amount',
        '25',
        '--currency',
        'eur',
        '--bank-account-id',
        bankAccountId,
        '--reason',
        'CLI E2E test transfer',
      ],
      'bank.transfers.propose',
    );

    console.log('Listing bank proposals...');
    await runCli(['bank', 'proposals', 'list'], 'bank.proposals.list');

    console.log('Creating invoice...');
    const invoiceResult = await runCli(
      [
        'invoices',
        'create',
        '--recipient-email',
        email,
        '--amount',
        '25',
        '--currency',
        'usd',
        '--description',
        'CLI E2E test invoice',
        '--recipient-name',
        'CLI Test',
        '--notes',
        'Generated by CLI E2E script',
      ],
      'invoices.create',
    );

    const invoiceId = invoiceResult?.invoice_id;
    if (!invoiceId) {
      throw new Error('invoices.create did not return invoice_id');
    }

    console.log('Listing invoices...');
    await runCli(['invoices', 'list', '--limit', '5'], 'invoices.list');

    console.log('Fetching invoice details...');
    await runCli(
      ['invoices', 'get', '--invoice-id', invoiceId],
      'invoices.get',
    );

    console.log('Sending invoice...');
    await runCli(
      ['invoices', 'send', '--invoice-id', invoiceId],
      'invoices.send',
    );

    console.log('E2E CLI flow complete.');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });

    if (shouldRestoreConfig) {
      await saveConfig(originalConfig);
    } else {
      await clearConfig();
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
