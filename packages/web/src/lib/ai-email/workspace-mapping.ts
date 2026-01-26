import { db } from '@/db';
import { workspaces, workspaceMembers, users } from '@/db/schema';
import { eq, and, ilike } from 'drizzle-orm';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { randomInt } from 'crypto';

/**
 * Workspace Mapping for AI Email Agent
 *
 * Security Model (Three-Layer Protection):
 * 1. Handle exists? → If no: generic error
 * 2. Sender is workspace member? → If no: generic error
 * 3. Process email → Only if 1) AND 2) pass
 *
 * Supported formats:
 * - New: ai-{firstname}.{lastname}@zerofinance.ai (human-readable)
 * - Legacy: {workspaceId}@ai.0.finance (UUID-based, for backwards compatibility)
 *
 * For security documentation, see: roadmap/ai-email-security-upgrade.md
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
  /** The AI email handle (e.g., ai-clara.mitchell) */
  aiEmailHandle: string | null;
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
  aiEmailHandle: null;
  isValid: false;
  error: string;
}

export type WorkspaceMappingResult = WorkspaceMapping | WorkspaceMappingError;

/**
 * The inbound domain for AI email agent.
 * Emails to *@{domain} are caught by Resend catch-all.
 */
export const AI_EMAIL_INBOUND_DOMAIN =
  process.env.AI_EMAIL_INBOUND_DOMAIN || 'zerofinance.ai';

/**
 * Generic error message for security - same message for all rejection cases
 * to prevent information leakage about handle existence or authorization status.
 */
const GENERIC_ERROR_MESSAGE =
  'This email address is not available or you do not have access.';

/**
 * Extract the local part (handle or workspace ID) from an email address.
 *
 * Supported formats:
 * - "ai-clara.mitchell@zerofinance.ai"
 * - "<ai-clara.mitchell@zerofinance.ai>"
 * - "AI Agent <ai-clara.mitchell@zerofinance.ai>"
 * - Legacy: "abc123-def456@ai.0.finance" (UUID format)
 *
 * @param toAddress - The "to" address from the email
 * @returns The local part (handle or workspace ID) or null if not valid
 */
export function extractLocalPartFromEmail(toAddress: string): string | null {
  // Escape dots in domain for regex
  const escapedDomain = AI_EMAIL_INBOUND_DOMAIN.replace(/\./g, '\\.');

  // Match the local part before @domain
  const pattern = new RegExp(`<?([^@<\\s]+)@${escapedDomain}>?`, 'i');
  const match = toAddress.match(pattern);

  if (!match) {
    return null;
  }

  return match[1].trim().toLowerCase();
}

/**
 * Check if a local part is a UUID (legacy format).
 */
function isUuidFormat(localPart: string): boolean {
  const uuidPattern =
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
  return uuidPattern.test(localPart);
}

/**
 * Normalize UUID to dashed format.
 */
function normalizeUuid(uuid: string): string {
  if (uuid.includes('-')) {
    return uuid;
  }
  return [
    uuid.slice(0, 8),
    uuid.slice(8, 12),
    uuid.slice(12, 16),
    uuid.slice(16, 20),
    uuid.slice(20, 32),
  ].join('-');
}

/**
 * Extract just the email address from a potentially formatted email string.
 * Handles formats like:
 * - "ben@example.com"
 * - "<ben@example.com>"
 * - "Benjamin Shafii <ben@example.com>"
 */
function extractEmailAddress(emailString: string): string {
  // Try to extract email from angle brackets first
  const angleMatch = emailString.match(/<([^>]+)>/);
  if (angleMatch) {
    return angleMatch[1].toLowerCase().trim();
  }
  // Otherwise just clean up the string
  return emailString.toLowerCase().trim();
}

/**
 * Check if a sender email belongs to a workspace member.
 * Uses the users.email column (synced from Privy) for fast database lookup.
 *
 * @param workspaceId - The workspace to check membership for
 * @param senderEmail - The email address of the sender (may include display name)
 * @returns true if sender is a member, false otherwise
 */
async function isSenderWorkspaceMember(
  workspaceId: string,
  senderEmail: string,
): Promise<boolean> {
  const normalizedEmail = extractEmailAddress(senderEmail);

  // Single query: join workspace_members with users to check membership + email
  const result = await db
    .select({ userId: workspaceMembers.userId })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.privyDid))
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        ilike(users.email, normalizedEmail),
      ),
    )
    .limit(1);

  if (result.length > 0) {
    console.log(
      `[AI Email] Sender ${normalizedEmail} verified as workspace member`,
    );
    return true;
  }

  console.log(
    `[AI Email] Sender ${normalizedEmail} is NOT a member of workspace ${workspaceId}`,
  );
  return false;
}

/**
 * Validate workspace exists, sender is authorized, and get workspace info.
 *
 * Security: Uses the same generic error for all rejection cases to prevent
 * information leakage about handle existence or authorization status.
 *
 * @param toAddress - The "to" address from the inbound email
 * @param senderEmail - The sender's email address (for authorization check)
 * @returns Workspace mapping with creator info, or error
 */
export async function mapToWorkspace(
  toAddress: string,
  senderEmail?: string,
): Promise<WorkspaceMappingResult> {
  const localPart = extractLocalPartFromEmail(toAddress);

  if (!localPart) {
    return {
      workspaceId: null,
      workspaceCreatorUserId: null,
      workspaceName: null,
      companyName: null,
      firstName: null,
      lastName: null,
      workspaceType: null,
      aiEmailHandle: null,
      isValid: false,
      error: GENERIC_ERROR_MESSAGE,
    };
  }

  let workspace: {
    id: string;
    name: string;
    createdBy: string;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
    workspaceType: string | null;
    aiEmailHandle: string | null;
  } | null = null;

  // Check if it's a UUID (legacy format) or a handle (new format)
  if (isUuidFormat(localPart)) {
    // Legacy UUID-based lookup
    const workspaceId = normalizeUuid(localPart);
    const [result] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        createdBy: workspaces.createdBy,
        companyName: workspaces.companyName,
        firstName: workspaces.firstName,
        lastName: workspaces.lastName,
        workspaceType: workspaces.workspaceType,
        aiEmailHandle: workspaces.aiEmailHandle,
      })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    workspace = result || null;
  } else {
    // New handle-based lookup
    const [result] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        createdBy: workspaces.createdBy,
        companyName: workspaces.companyName,
        firstName: workspaces.firstName,
        lastName: workspaces.lastName,
        workspaceType: workspaces.workspaceType,
        aiEmailHandle: workspaces.aiEmailHandle,
      })
      .from(workspaces)
      .where(eq(workspaces.aiEmailHandle, localPart))
      .limit(1);

    workspace = result || null;
  }

  // Security: Same error for "not found" and "not authorized"
  if (!workspace) {
    return {
      workspaceId: null,
      workspaceCreatorUserId: null,
      workspaceName: null,
      companyName: null,
      firstName: null,
      lastName: null,
      workspaceType: null,
      aiEmailHandle: null,
      isValid: false,
      error: GENERIC_ERROR_MESSAGE,
    };
  }

  // Sender verification (if sender email provided)
  if (senderEmail) {
    const isAuthorized = await isSenderWorkspaceMember(
      workspace.id,
      senderEmail,
    );

    if (!isAuthorized) {
      // Security: Same error as "not found" to prevent enumeration
      return {
        workspaceId: null,
        workspaceCreatorUserId: null,
        workspaceName: null,
        companyName: null,
        firstName: null,
        lastName: null,
        workspaceType: null,
        aiEmailHandle: null,
        isValid: false,
        error: GENERIC_ERROR_MESSAGE,
      };
    }
  }

  return {
    workspaceId: workspace.id,
    workspaceCreatorUserId: workspace.createdBy,
    workspaceName: workspace.name,
    companyName: workspace.companyName,
    firstName: workspace.firstName,
    lastName: workspace.lastName,
    workspaceType: workspace.workspaceType as 'personal' | 'business' | null,
    aiEmailHandle: workspace.aiEmailHandle,
    isValid: true,
  };
}

/**
 * Generate a unique AI email handle for a workspace using GPT-4o-mini.
 *
 * Format: ai-{firstname}.{lastname} (e.g., ai-clara.mitchell)
 *
 * The AI generates a professional-sounding name that:
 * - Sounds like a real person's name
 * - Is memorable and easy to type
 * - Follows the ai-firstname.lastname format
 *
 * @param workspaceId - The workspace to generate a handle for
 * @returns The generated handle (without @domain) or null if generation failed
 */
export async function generateAiEmailHandle(
  workspaceId: string,
): Promise<string | null> {
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

  // Get workspace info for context
  const [workspace] = await db
    .select({
      name: workspaces.name,
      companyName: workspaces.companyName,
      firstName: workspaces.firstName,
      lastName: workspaces.lastName,
      workspaceType: workspaces.workspaceType,
    })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace) {
    return null;
  }

  // Get existing handles to avoid collisions
  const existingHandles = await db
    .select({ handle: workspaces.aiEmailHandle })
    .from(workspaces)
    .where(eq(workspaces.aiEmailHandle, workspaces.aiEmailHandle)); // Not null

  const existingSet = new Set(
    existingHandles.map((h) => h.handle).filter(Boolean),
  );

  // Try up to 5 times to generate a unique handle
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const result = await generateText({
        model: openai('gpt-4o-mini'),
        temperature: 0.9 + attempt * 0.1, // Increase randomness on retries
        prompt: `Generate a professional AI assistant email handle for a business.

Context:
- Workspace name: ${workspace.name}
- Company name: ${workspace.companyName || 'Not set'}
- Owner: ${workspace.firstName || ''} ${workspace.lastName || ''}
- Type: ${workspace.workspaceType || 'business'}

Requirements:
- Format: ai-firstname.lastname (e.g., ai-clara.mitchell, ai-james.chen, ai-sarah.johnson)
- Use realistic first and last names
- Names should sound professional and trustworthy
- Do NOT use the actual owner's name
- Keep it short and easy to type
- Only output the handle, nothing else

Generate a unique handle:`,
      });

      let handle = result.text.trim().toLowerCase();

      // Clean up the handle
      handle = handle.replace(/[^a-z0-9.-]/g, '');

      // Ensure it starts with "ai-"
      if (!handle.startsWith('ai-')) {
        handle = 'ai-' + handle;
      }

      // Validate format: ai-firstname.lastname
      const handlePattern = /^ai-[a-z]+\.[a-z]+$/;
      if (!handlePattern.test(handle)) {
        console.warn(
          `[AI Email] Invalid handle format generated: ${handle}, retrying...`,
        );
        continue;
      }

      // Check uniqueness
      if (existingSet.has(handle)) {
        console.warn(`[AI Email] Handle collision: ${handle}, retrying...`);
        continue;
      }

      return handle;
    } catch (error) {
      console.error(
        `[AI Email] Handle generation attempt ${attempt + 1} failed:`,
        error,
      );
    }
  }

  // Fallback: Generate a random handle using cryptographically secure randomness
  const fallbackNames = [
    'alex.morgan',
    'jordan.lee',
    'taylor.chen',
    'casey.smith',
    'riley.johnson',
    'quinn.davis',
    'avery.wilson',
    'blake.thomas',
  ];
  // Use crypto.randomInt instead of Math.random() for secure randomness
  const randomName = fallbackNames[randomInt(fallbackNames.length)];
  const randomSuffix = randomInt(1000);
  const fallbackHandle = `ai-${randomName}${randomSuffix}`;

  if (!existingSet.has(fallbackHandle)) {
    return fallbackHandle;
  }

  return null;
}

/**
 * Get or generate the AI email handle for a workspace.
 * If the workspace doesn't have a handle, generates one and saves it.
 *
 * @param workspaceId - The workspace ID
 * @returns The AI email handle or null if generation failed
 */
export async function getOrCreateAiEmailHandle(
  workspaceId: string,
): Promise<string | null> {
  // Check if workspace already has a handle
  const [workspace] = await db
    .select({ aiEmailHandle: workspaces.aiEmailHandle })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace) {
    return null;
  }

  if (workspace.aiEmailHandle) {
    return workspace.aiEmailHandle;
  }

  // Generate a new handle
  const handle = await generateAiEmailHandle(workspaceId);

  if (!handle) {
    return null;
  }

  // Save the handle
  try {
    await db
      .update(workspaces)
      .set({ aiEmailHandle: handle })
      .where(eq(workspaces.id, workspaceId));

    return handle;
  } catch (error) {
    // Handle unique constraint violation (race condition)
    console.error('[AI Email] Failed to save handle:', error);
    return null;
  }
}

/**
 * Generate the full AI email address for a workspace.
 *
 * @param workspaceId - The workspace UUID
 * @returns The email address for this workspace's AI agent, or null if no handle
 */
export async function getWorkspaceAiEmailAddress(
  workspaceId: string,
): Promise<string | null> {
  const handle = await getOrCreateAiEmailHandle(workspaceId);

  if (!handle) {
    return null;
  }

  return `${handle}@${AI_EMAIL_INBOUND_DOMAIN}`;
}

/**
 * Legacy function for backwards compatibility.
 * Returns the UUID-based email address.
 *
 * @deprecated Use getWorkspaceAiEmailAddress instead
 */
export function getLegacyWorkspaceAiEmailAddress(workspaceId: string): string {
  return `${workspaceId}@${AI_EMAIL_INBOUND_DOMAIN}`;
}

// Legacy export for backwards compatibility
export { extractLocalPartFromEmail as extractWorkspaceIdFromEmail };
