#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import { getAuthenticatedApi } from '../lib/api-client.js';

const transfersCommand = new Command('transfers')
  .description('List recent transfers');

transfersCommand
  .action(async () => {
    const spinner = ora('Fetching transfers...').start();
    try {
      const api = await getAuthenticatedApi();
      const [onramps, offramps] = await Promise.all([
        api.align.listOnrampTransfers.query({ limit: 10 }),
        api.align.listOfframpTransfers.query({ limit: 10 }),
      ]);
      spinner.stop();

      console.log(chalk.bold('\nOnramp Transfers (Fiat → Crypto)\n'));
      if (!onramps || onramps.length === 0) {
        console.log(chalk.dim('No onramp transfers found.'));
      } else {
        const onTable = new Table({ head: ['ID', 'Amount', 'From → To', 'Status'], style: { head: ['cyan'] } });
        onramps.forEach((t) => {
          const amount = `${t.amount} ${t.source_currency.toUpperCase()}`;
          const route = `${t.source_currency.toUpperCase()} → ${t.destination_token.toUpperCase()} (${t.destination_network})`;
          onTable.push([t.id, amount, route, t.status]);
        });
        console.log(onTable.toString());
      }

      console.log(chalk.bold('\nOfframp Transfers (Crypto → Fiat)\n'));
      if (!offramps || offramps.length === 0) {
        console.log(chalk.dim('No offramp transfers found.'));
      } else {
        const offTable = new Table({ head: ['ID', 'Amount', 'From → To', 'Status'], style: { head: ['cyan'] } });
        offramps.forEach((t) => {
          const amount = `${t.amount} ${t.source_token.toUpperCase()}`;
          const route = `${t.source_token.toUpperCase()} (${t.source_network}) → ${t.destination_currency.toUpperCase()}`;
          offTable.push([t.id, amount, route, t.status]);
        });
        console.log(offTable.toString());
      }
    } catch (error) {
      spinner.fail('Failed to fetch transfers');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

export default transfersCommand;
