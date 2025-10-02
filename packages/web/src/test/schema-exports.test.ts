import { describe, it, expect } from 'vitest';
import * as schema from '../db/schema';

describe('Schema exports snapshot', () => {
  it('exports all expected tables', () => {
    const tables = Object.keys(schema).filter(
      (key) =>
        !key.includes('Relations') &&
        !key.startsWith('New') &&
        typeof schema[key as keyof typeof schema] === 'object' &&
        schema[key as keyof typeof schema] !== null,
    );

    expect(tables.sort()).toMatchSnapshot();
  });

  it('exports all expected types and enums', () => {
    const allKeys = Object.keys(schema);
    const tableKeys = Object.keys(schema).filter(
      (key) =>
        !key.includes('Relations') &&
        !key.startsWith('New') &&
        typeof schema[key as keyof typeof schema] === 'object' &&
        schema[key as keyof typeof schema] !== null,
    );
    const relationKeys = Object.keys(schema).filter((key) =>
      key.includes('Relations'),
    );

    const typeKeys = allKeys.filter(
      (key) => !tableKeys.includes(key) && !relationKeys.includes(key),
    );

    expect(typeKeys.sort()).toMatchSnapshot();
  });

  it('exports all relations', () => {
    const relations = Object.keys(schema).filter((key) =>
      key.includes('Relations'),
    );

    expect(relations.sort()).toMatchSnapshot();
  });

  it('exports specific critical tables', () => {
    const criticalTables = [
      'users',
      'userSafes',
      'userFundingSources',
      'userDestinationBankAccounts',
      'offrampTransfers',
      'onrampTransfers',
      'earnDeposits',
      'earnWithdrawals',
      'workspaces',
      'workspaceMembers',
      'companies',
      'chats',
      'chatMessages',
    ];

    criticalTables.forEach((tableName) => {
      expect(schema).toHaveProperty(tableName);
    });
  });
});
