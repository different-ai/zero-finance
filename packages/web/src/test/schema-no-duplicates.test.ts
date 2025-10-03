import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Schema Duplicate Detection Tests', () => {
  it('should not have duplicate users table definition in schema.ts', () => {
    const schemaContent = readFileSync(
      join(__dirname, '../db/schema.ts'),
      'utf-8',
    );

    // Count occurrences of "export const users = pgTable"
    const userTableDefinitionRegex = /export const users = pgTable/g;
    const matches = schemaContent.match(userTableDefinitionRegex);

    // Should be 0 (we're importing it, not defining it)
    expect(matches).toBeNull();
  });

  it('should not have duplicate workspaces table definition in schema.ts', () => {
    const schemaContent = readFileSync(
      join(__dirname, '../db/schema.ts'),
      'utf-8',
    );

    // Count occurrences of "export const workspaces = pgTable"
    const workspacesTableDefinitionRegex = /export const workspaces = pgTable/g;
    const matches = schemaContent.match(workspacesTableDefinitionRegex);

    // Should be 0 (we're importing it, not defining it)
    expect(matches).toBeNull();
  });

  it('should not have duplicate workspaceMembers table definition in schema.ts', () => {
    const schemaContent = readFileSync(
      join(__dirname, '../db/schema.ts'),
      'utf-8',
    );

    const workspaceMembersTableDefinitionRegex =
      /export const workspaceMembers = pgTable/g;
    const matches = schemaContent.match(workspaceMembersTableDefinitionRegex);

    expect(matches).toBeNull();
  });

  it('should not have duplicate User type export in schema.ts', () => {
    const schemaContent = readFileSync(
      join(__dirname, '../db/schema.ts'),
      'utf-8',
    );

    // Count occurrences of "export type User = typeof users.$inferSelect"
    const userTypeDefinitionRegex =
      /export type User = typeof users\.\$inferSelect/g;
    const matches = schemaContent.match(userTypeDefinitionRegex);

    // Should be 0 (we're importing and re-exporting it)
    expect(matches).toBeNull();
  });

  it('should have import statement for users from schema/users', () => {
    const schemaContent = readFileSync(
      join(__dirname, '../db/schema.ts'),
      'utf-8',
    );

    // Should have an export statement importing from './schema/users'
    expect(schemaContent).toContain("from './schema/users'");
    expect(schemaContent).toContain('export { users');
  });

  it('should have import statement for workspaces from schema/workspaces', () => {
    const schemaContent = readFileSync(
      join(__dirname, '../db/schema.ts'),
      'utf-8',
    );

    // Should have an export statement importing from './schema/workspaces'
    expect(schemaContent).toContain("from './schema/workspaces'");
    expect(schemaContent).toContain('export {');
    expect(schemaContent).toContain('workspaces,');
  });

  it('should verify schema.ts is significantly smaller after deduplication', () => {
    const schemaContent = readFileSync(
      join(__dirname, '../db/schema.ts'),
      'utf-8',
    );

    const lineCount = schemaContent.split('\n').length;

    // schema.ts should be under 1400 lines after removing duplicates
    // (was 1516 lines before, now should be ~1343)
    expect(lineCount).toBeLessThan(1400);
  });
});
