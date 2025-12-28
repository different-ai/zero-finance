import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Workspace Mapping for AI Email Agent
 *
 * Strategy: Each workspace gets a unique inbound email address.
 * Format: {workspaceId}@ai.0.finance
 *
 * The workspace ID is extracted from the "to" address when emails arrive.
 * This provides instant workspace scoping without requiring email linking.
 *
 * For enhanced security (2FA-style email linking), see:
 * roadmap/ai-email-security-upgrade.md
 */

export interface WorkspaceMapping {
  workspaceId: string;
  workspaceCreatorUserId: string;
  workspaceName: string;
  /** Company/business name from workspace settings */
  companyName: string | null;
  /** First name of workspace owner (for individual workspaces) */
  firstName: string | null;
  /** Last name of workspace owner (for individual workspaces) */
  lastName: string | null;
  /** Whether this is a business or personal workspace */
  workspaceType: 'personal' | 'business' | null;
  isValid: true;
}

export interface WorkspaceMappingError {
  workspaceId: null;
  workspaceCreatorUserId: null;
  workspaceName: null;
  companyName: null;
  firstName: null;
  lastName: null;
  workspaceType: null;
  isValid: false;
  error: string;
}

export type WorkspaceMappingResult = WorkspaceMapping | WorkspaceMappingError;

/**
 * The inbound domain for AI email agent.
 * Emails to *@{domain} are caught by Resend catch-all.
 */
export const AI_EMAIL_INBOUND_DOMAIN =
  process.env.AI_EMAIL_INBOUND_DOMAIN || 'ai.0.finance';

/**
 * Extract workspace ID from the inbound email address.
 *
 * Supported formats:
 * - "abc123@ai.0.finance"
 * - "<abc123@ai.0.finance>"
 * - "AI Agent <abc123@ai.0.finance>"
 *
 * @param toAddress - The "to" address from the email
 * @returns The workspace ID or null if not valid
 */
export function extractWorkspaceIdFromEmail(toAddress: string): string | null {
  // Escape dots in domain for regex
  const escapedDomain = AI_EMAIL_INBOUND_DOMAIN.replace(/\./g, '\\.');

  // Match the local part before @domain
  const pattern = new RegExp(`<?([^@<\\s]+)@${escapedDomain}>?`, 'i');
  const match = toAddress.match(pattern);

  if (!match) {
    return null;
  }

  const workspaceId = match[1].trim();

  // Basic validation - workspace IDs are UUIDs
  // Accept with or without dashes
  const uuidPattern =
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
  if (!uuidPattern.test(workspaceId)) {
    return null;
  }

  // Normalize to dashed format if needed
  if (!workspaceId.includes('-')) {
    return [
      workspaceId.slice(0, 8),
      workspaceId.slice(8, 12),
      workspaceId.slice(12, 16),
      workspaceId.slice(16, 20),
      workspaceId.slice(20, 32),
    ].join('-');
  }

  return workspaceId;
}

/**
 * Validate workspace exists and get the creator's user ID for invoice creation.
 *
 * @param toAddress - The "to" address from the inbound email
 * @returns Workspace mapping with creator info, or error
 */
export async function mapToWorkspace(
  toAddress: string,
): Promise<WorkspaceMappingResult> {
  const workspaceId = extractWorkspaceIdFromEmail(toAddress);

  if (!workspaceId) {
    return {
      workspaceId: null,
      workspaceCreatorUserId: null,
      workspaceName: null,
      companyName: null,
      firstName: null,
      lastName: null,
      workspaceType: null,
      isValid: false,
      error: `Invalid email format. Expected: {workspaceId}@${AI_EMAIL_INBOUND_DOMAIN}`,
    };
  }

  // Verify workspace exists and get company info
  const [workspace] = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      createdBy: workspaces.createdBy,
      companyName: workspaces.companyName,
      firstName: workspaces.firstName,
      lastName: workspaces.lastName,
      workspaceType: workspaces.workspaceType,
    })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace) {
    return {
      workspaceId: null,
      workspaceCreatorUserId: null,
      workspaceName: null,
      companyName: null,
      firstName: null,
      lastName: null,
      workspaceType: null,
      isValid: false,
      error:
        'Workspace not found. Check your AI email address in dashboard settings.',
    };
  }

  return {
    workspaceId: workspace.id,
    workspaceCreatorUserId: workspace.createdBy,
    workspaceName: workspace.name,
    companyName: workspace.companyName,
    firstName: workspace.firstName,
    lastName: workspace.lastName,
    workspaceType: workspace.workspaceType as 'personal' | 'business' | null,
    isValid: true,
  };
}

/**
 * Generate the unique AI email address for a workspace.
 *
 * @param workspaceId - The workspace UUID
 * @returns The email address for this workspace's AI agent
 */
export function getWorkspaceAiEmailAddress(workspaceId: string): string {
  return `${workspaceId}@${AI_EMAIL_INBOUND_DOMAIN}`;
}
