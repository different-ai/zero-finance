import { describe, it, expect } from 'vitest';

describe('Schema imports backward compatibility', () => {
  it('allows importing from main schema file', async () => {
    const { users, userSafes, earnDeposits, workspaces, companies } =
      await import('../db/schema');

    expect(users).toBeDefined();
    expect(userSafes).toBeDefined();
    expect(earnDeposits).toBeDefined();
    expect(workspaces).toBeDefined();
    expect(companies).toBeDefined();
  });

  it('exports all critical tables and relations', async () => {
    const schema = await import('../db/schema');

    const criticalExports = [
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
      'usersRelations',
      'workspacesRelations',
      'companiesRelations',
    ];

    criticalExports.forEach((exportName) => {
      expect(schema).toHaveProperty(exportName);
    });
  });
});
