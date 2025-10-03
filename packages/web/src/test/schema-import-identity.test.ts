import { describe, it, expect } from 'vitest';
import * as schema from '../db/schema';
import * as usersModule from '../db/schema/users';
import * as workspacesModule from '../db/schema/workspaces';

describe('Schema Import Identity Tests', () => {
  it('should import users table from users module (same object reference)', () => {
    // This verifies that schema.users is actually imported from schema/users.ts
    // and not a duplicate definition
    expect(schema.users).toBe(usersModule.users);
  });

  it('should import User types from users module', () => {
    // TypeScript types are erased at runtime, but we can verify the table is the same
    const user: schema.User = {
      privyDid: 'test',
      createdAt: new Date(),
      firstName: null,
      lastName: null,
      companyName: null,
      beneficiaryType: null,
      alignCustomerId: null,
      kycProvider: null,
      kycStatus: 'none',
      kycFlowLink: null,
      alignVirtualAccountId: null,
      kycMarkedDone: false,
      kycSubStatus: null,
      kycNotificationSent: null,
      kycNotificationStatus: null,
      loopsContactSynced: false,
      userRole: 'startup',
      contractorInviteCode: null,
      primaryWorkspaceId: null,
    };

    // This should compile if types are compatible
    const userFromModule: usersModule.User = user;
    expect(userFromModule).toBeDefined();
  });

  it('should import workspaces table from workspaces module (same object reference)', () => {
    expect(schema.workspaces).toBe(workspacesModule.workspaces);
  });

  it('should import workspaceMembers table from workspaces module (same object reference)', () => {
    expect(schema.workspaceMembers).toBe(workspacesModule.workspaceMembers);
  });

  it('should import workspaceInvites table from workspaces module (same object reference)', () => {
    expect(schema.workspaceInvites).toBe(workspacesModule.workspaceInvites);
  });

  it('should import workspaceMembersExtended table from workspaces module (same object reference)', () => {
    expect(schema.workspaceMembersExtended).toBe(
      workspacesModule.workspaceMembersExtended,
    );
  });

  it('should import workspacesRelations from workspaces module (same object reference)', () => {
    expect(schema.workspacesRelations).toBe(
      workspacesModule.workspacesRelations,
    );
  });

  it('should import workspaceMembersRelations from workspaces module (same object reference)', () => {
    expect(schema.workspaceMembersRelations).toBe(
      workspacesModule.workspaceMembersRelations,
    );
  });

  it('should import workspaceInvitesRelations from workspaces module (same object reference)', () => {
    expect(schema.workspaceInvitesRelations).toBe(
      workspacesModule.workspaceInvitesRelations,
    );
  });

  it('should verify users table has correct table name', () => {
    // Drizzle tables have a Symbol key with table metadata
    const tableSymbol = Object.getOwnPropertySymbols(schema.users).find(
      (sym) => sym.description === 'drizzle:Name',
    );
    expect(tableSymbol).toBeDefined();
    if (tableSymbol) {
      expect((schema.users as any)[tableSymbol]).toBe('users');
    }
  });

  it('should verify workspaces table has correct table name', () => {
    const tableSymbol = Object.getOwnPropertySymbols(schema.workspaces).find(
      (sym) => sym.description === 'drizzle:Name',
    );
    expect(tableSymbol).toBeDefined();
    if (tableSymbol) {
      expect((schema.workspaces as any)[tableSymbol]).toBe('workspaces');
    }
  });
});
