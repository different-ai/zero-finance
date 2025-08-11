#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import { getAuthenticatedApi } from '../lib/api-client.js';

const accountsCommand = new Command('accounts')
  .description('Manage virtual accounts');

accountsCommand
  .command('list')
  .description('List your virtual accounts')
  .action(async () => {
    const spinner = ora('Fetching virtual accounts...').start();

    try {
      const api = await getAuthenticatedApi();
      const accounts = await api.align.getAllVirtualAccounts.query();

      spinner.stop();

      if (!accounts || accounts.length === 0) {
        console.log(chalk.yellow('No virtual accounts found.'));
        console.log(chalk.dim('Run "zero accounts create" to set up USD & EUR accounts'));
        return;
      }

      console.log(chalk.bold('\nYour Virtual Accounts\n'));

      const table = new Table({
        head: ['Currency', 'Type', 'Bank', 'Details', 'Status'],
        style: { head: ['cyan'] },
        colWidths: [10, 10, 24, 50, 10],
        wordWrap: true,
      });

      for (const acc of accounts) {
        const instr = acc.deposit_instructions || {};
        const currency = instr.currency?.toUpperCase() || acc.source_currency?.toUpperCase() || '-';
        let type = 'ACH';
        let details = '';
        if (instr.iban?.iban_number) {
          type = 'IBAN';
          const iban = instr.iban.iban_number;
          const bic = instr.iban.bic || instr.bic?.bic_code || '-';
          details = `IBAN: ${iban}\nBIC: ${bic}`;
        } else {
          const acct = instr.us?.account_number || instr.account_number || '-';
          const routing = instr.us?.routing_number || instr.routing_number || '-';
          details = `Acct: ${acct}\nRouting: ${routing}`;
        }
        const bank = instr.bank_name || '-';
        const status = acc.status || '-';

        table.push([
          currency,
          type,
          bank,
          details,
          status,
        ]);
      }

      console.log(table.toString());
    } catch (error) {
      spinner.fail('Failed to fetch accounts');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

accountsCommand
  .command('create')
  .description('Create USD & EUR virtual accounts')
  .action(async () => {
    const spinner = ora('Creating virtual accounts (USD & EUR)...').start();
    try {
      const api = await getAuthenticatedApi();
      const res = await api.align.createAllVirtualAccounts.mutate();
      if (res.success) {
        spinner.succeed(res.message || 'Accounts created successfully');
      } else {
        spinner.fail(res.message || 'Failed to create accounts');
      }
      if (res.results?.length) {
        for (const r of res.results) {
          console.log(`  - ${r.currency}: ${r.id} (${r.status})`);
        }
      }
      if (res.errors?.length) {
        console.log(chalk.yellow('\nErrors:'));
        for (const e of res.errors) {
          console.log(`  - ${e.currency}: ${e.error}`);
        }
      }
    } catch (error) {
      spinner.fail('Failed to create accounts');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

export default accountsCommand;
