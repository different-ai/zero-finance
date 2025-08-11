#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import QRCode from 'qrcode';
import { getAuthenticatedApi } from '../lib/api-client.js';

const qrCommand = new Command('qr')
  .description('Show QR code for account details');

async function printTerminalQR(text) {
  const qr = await QRCode.toString(text, { type: 'terminal', small: true });
  console.log(qr);
}

function buildEpcQR({ name, iban, bic, amount, remittance }) {
  // EPC QR payload lines
  const lines = [
    'BCD',
    '001',
    '1',
    'SCT',
    bic || '',
    name || '',
    iban || '',
    amount ? `EUR${amount}` : '',
    remittance ? remittance.substring(0, 140) : '',
    '',
  ];
  return lines.join('\n');
}

qrCommand
  .command('usd')
  .description('Show QR for USD (ACH) account')
  .option('-a, --amount <amount>', 'Optional amount (for reference only)')
  .action(async (opts) => {
    const spinner = ora('Fetching USD account...').start();
    try {
      const api = await getAuthenticatedApi();
      const accounts = await api.align.getAllVirtualAccounts.query();
      spinner.stop();

      const usd = accounts.find((a) => (a.deposit_instructions?.currency || a.source_currency) === 'usd');
      if (!usd) {
        console.log(chalk.yellow('No USD account found. Run "zero accounts create" first.'));
        return;
      }
      const instr = usd.deposit_instructions || {};
      const acct = instr.us?.account_number || instr.account_number;
      const routing = instr.us?.routing_number || instr.routing_number;
      const bank = instr.bank_name;
      const beneficiary = instr.beneficiary_name || instr.account_beneficiary_name || 'Beneficiary';

      console.log(chalk.bold('\nUSD Virtual Account (ACH/Wire)\n'));
      // Non-standard: encode a simple text block for easy copying
      const payload = `Bank: ${bank}\nBeneficiary: ${beneficiary}\nAccount: ${acct}\nRouting: ${routing}\nAmount: ${opts.amount || ''}`;
      await printTerminalQR(payload);

      console.log(chalk.cyan('\nBank Details:'));
      console.log(`  Bank:     ${bank}`);
      console.log(`  Beneficiary: ${beneficiary}`);
      console.log(`  Account:  ${acct}`);
      console.log(`  Routing:  ${routing}`);
      if (opts.amount) console.log(`  Amount:   ${opts.amount}`);
    } catch (error) {
      spinner.fail('Failed to generate QR');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

qrCommand
  .command('eur')
  .description('Show QR for EUR (SEPA) account (EPC standard)')
  .option('-a, --amount <amount>', 'Optional amount in EUR (e.g., 100.50)')
  .option('-r, --remittance <text>', 'Optional remittance information')
  .action(async (opts) => {
    const spinner = ora('Fetching EUR account...').start();
    try {
      const api = await getAuthenticatedApi();
      const accounts = await api.align.getAllVirtualAccounts.query();
      spinner.stop();

      const eur = accounts.find((a) => (a.deposit_instructions?.currency || a.source_currency) === 'eur');
      if (!eur) {
        console.log(chalk.yellow('No EUR account found. Run "zero accounts create" first.'));
        return;
      }
      const instr = eur.deposit_instructions || {};
      const iban = instr.iban?.iban_number;
      const bic = instr.iban?.bic || instr.bic?.bic_code || '';
      const bank = instr.bank_name;
      const beneficiary = instr.beneficiary_name || instr.account_beneficiary_name || 'Beneficiary';

      console.log(chalk.bold('\nEUR Virtual Account (SEPA)\n'));
      const payload = buildEpcQR({ name: beneficiary, iban, bic, amount: opts.amount, remittance: opts.remittance });
      await printTerminalQR(payload);

      console.log(chalk.cyan('\nBank Details:'));
      console.log(`  Bank:     ${bank}`);
      console.log(`  Beneficiary: ${beneficiary}`);
      console.log(`  IBAN:     ${iban}`);
      console.log(`  BIC:      ${bic}`);
      if (opts.amount) console.log(`  Amount:   EUR ${opts.amount}`);
      if (opts.remittance) console.log(`  Remittance: ${opts.remittance}`);
    } catch (error) {
      spinner.fail('Failed to generate QR');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

export default qrCommand;
