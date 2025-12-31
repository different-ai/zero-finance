import { db } from '@/db';
import {
  aiEmailSessions,
  type AiEmailSession,
  type AiEmailMessage,
  type AiEmailPendingAction,
  type AiEmailExtractedData,
  type AiEmailSessionState,
} from '@/db/schema/ai-email-sessions';
import { eq, and, lt } from 'drizzle-orm';

/**
 * Session Manager for AI Email Agent
 *
 * Handles CRUD operations for email conversation sessions.
 * Sessions track state across multiple email replies in a thread.
 */

/** Session TTL in milliseconds (24 hours) */
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Get or create a session for an email thread.
 *
 * Sessions are identified by:
 * - senderEmail: Who is emailing the AI
 * - threadId: The Message-ID for threading replies
 * - inReplyTo: The In-Reply-To header (for finding existing thread)
 * - references: The References header (fallback for thread lookup)
 *
 * When a user replies to an email, their reply has a NEW messageId.
 * The original message ID is in the In-Reply-To or References header.
 * We need to look up sessions by these headers to maintain thread continuity.
 *
 * @param params - Session identification params
 * @returns Existing or new session
 */
export async function getOrCreateSession(params: {
  senderEmail: string;
  threadId: string;
  workspaceId: string;
  creatorUserId: string;
  /** The In-Reply-To header from the email (references the previous message) */
  inReplyTo?: string;
  /** The References header from the email (list of all messages in thread) */
  references?: string;
}): Promise<AiEmailSession> {
  const {
    senderEmail,
    threadId,
    workspaceId,
    creatorUserId,
    inReplyTo,
    references,
  } = params;

  // Normalize email
  const normalizedEmail = senderEmail.toLowerCase().trim();

  // Build list of possible thread IDs to search for
  // Priority: inReplyTo > references > current messageId
  const possibleThreadIds: string[] = [];

  // In-Reply-To is the most direct reference to the parent message
  if (inReplyTo) {
    // Clean up the message ID (remove angle brackets if present)
    const cleanInReplyTo = inReplyTo.replace(/^<|>$/g, '').trim();
    if (cleanInReplyTo) {
      possibleThreadIds.push(cleanInReplyTo);
    }
  }

  // References header contains all message IDs in the thread
  // Usually in order from oldest to newest
  // Note: Resend returns this as a JSON array string, while standard email uses space-separated
  if (references) {
    let refIds: string[] = [];

    // Check if it's a JSON array (Resend format)
    const trimmedRefs = references.trim();
    if (trimmedRefs.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmedRefs) as string[];
        refIds = parsed
          .map((id) => id.replace(/^<|>$/g, '').trim())
          .filter(Boolean);
      } catch {
        // Fall back to space-separated parsing
        refIds = references
          .split(/\s+/)
          .map((id) => id.replace(/^<|>$/g, '').trim())
          .filter(Boolean);
      }
    } else {
      // Standard space-separated format
      refIds = references
        .split(/\s+/)
        .map((id) => id.replace(/^<|>$/g, '').trim())
        .filter(Boolean);
    }

    possibleThreadIds.push(...refIds);
  }

  // Also try the current message ID (for the first message in a thread)
  // Normalize it by stripping angle brackets for consistency
  const cleanThreadId = threadId.replace(/^<|>$/g, '').trim();
  possibleThreadIds.push(cleanThreadId);

  // Also add versions WITH angle brackets for backwards compatibility
  // (some sessions may have been stored with angle brackets)
  const withBrackets = possibleThreadIds.map((id) =>
    id.startsWith('<') ? id : `<${id}>`,
  );
  const allPossibleIds = [...new Set([...possibleThreadIds, ...withBrackets])];

  // Log all possible thread IDs for debugging
  console.log(
    `[Session] Searching for session with ${allPossibleIds.length} possible threadIds:`,
    allPossibleIds.slice(0, 8), // Log first 8 to show both versions
  );

  // Try to find existing session by any of the thread IDs
  for (const searchThreadId of allPossibleIds) {
    console.log(`[Session] Trying threadId: "${searchThreadId}"`);
    const [existingSession] = await db
      .select()
      .from(aiEmailSessions)
      .where(
        and(
          eq(aiEmailSessions.senderEmail, normalizedEmail),
          eq(aiEmailSessions.threadId, searchThreadId),
        ),
      )
      .limit(1);

    if (existingSession) {
      console.log(
        `[Session] Found session ${existingSession.id} with threadId: "${existingSession.threadId}"`,
      );
      // Check if expired
      if (new Date(existingSession.expiresAt) < new Date()) {
        console.log(`[Session] Session expired, marking and continuing`);
        // Mark as expired and continue searching
        await db
          .update(aiEmailSessions)
          .set({ state: 'expired' as AiEmailSessionState })
          .where(eq(aiEmailSessions.id, existingSession.id));
      } else {
        console.log(
          `[Session] Found existing active session via threadId: ${searchThreadId}`,
        );
        return existingSession;
      }
    }
  }

  // No existing session found - create new one
  // Use the FIRST message ID we find (inReplyTo if available, else current messageId)
  // NORMALIZE by stripping angle brackets for consistent storage
  const canonicalThreadId = (possibleThreadIds[0] || cleanThreadId).replace(
    /^<|>$/g,
    '',
  );

  console.log(
    `[Session] Creating new session with threadId: ${canonicalThreadId}`,
  );

  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const [newSession] = await db
    .insert(aiEmailSessions)
    .values({
      senderEmail: normalizedEmail,
      threadId: canonicalThreadId,
      workspaceId,
      creatorUserId,
      state: 'active',
      messages: [],
      expiresAt,
    })
    .returning();

  return newSession;
}

/**
 * Get a session by ID.
 */
export async function getSessionById(
  sessionId: string,
): Promise<AiEmailSession | null> {
  const [session] = await db
    .select()
    .from(aiEmailSessions)
    .where(eq(aiEmailSessions.id, sessionId))
    .limit(1);

  return session || null;
}

/**
 * Add a message to a session's conversation history.
 */
export async function addMessageToSession(
  sessionId: string,
  message: AiEmailMessage,
): Promise<void> {
  const session = await getSessionById(sessionId);
  if (!session) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  const updatedMessages = [...(session.messages || []), message];

  await db
    .update(aiEmailSessions)
    .set({
      messages: updatedMessages,
      updatedAt: new Date(),
    })
    .where(eq(aiEmailSessions.id, sessionId));
}

/**
 * Update session state.
 */
export async function updateSessionState(
  sessionId: string,
  state: AiEmailSessionState,
): Promise<void> {
  await db
    .update(aiEmailSessions)
    .set({
      state,
      updatedAt: new Date(),
    })
    .where(eq(aiEmailSessions.id, sessionId));
}

/**
 * Set pending action for confirmation flow.
 */
export async function setPendingAction(
  sessionId: string,
  pendingAction: AiEmailPendingAction,
): Promise<void> {
  await db
    .update(aiEmailSessions)
    .set({
      pendingAction,
      state: 'awaiting_confirmation',
      updatedAt: new Date(),
    })
    .where(eq(aiEmailSessions.id, sessionId));
}

/**
 * Clear pending action (after confirmation or cancellation).
 */
export async function clearPendingAction(sessionId: string): Promise<void> {
  await db
    .update(aiEmailSessions)
    .set({
      pendingAction: null,
      updatedAt: new Date(),
    })
    .where(eq(aiEmailSessions.id, sessionId));
}

/**
 * Update extracted invoice data.
 */
export async function updateExtractedData(
  sessionId: string,
  extractedData: AiEmailExtractedData,
): Promise<void> {
  const session = await getSessionById(sessionId);
  if (!session) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  // Merge with existing data
  const mergedData = {
    ...(session.extractedData || {}),
    ...extractedData,
  };

  await db
    .update(aiEmailSessions)
    .set({
      extractedData: mergedData,
      updatedAt: new Date(),
    })
    .where(eq(aiEmailSessions.id, sessionId));
}

/**
 * Set the invoice ID after creation.
 */
export async function setInvoiceId(
  sessionId: string,
  invoiceId: string,
): Promise<void> {
  await db
    .update(aiEmailSessions)
    .set({
      invoiceId,
      updatedAt: new Date(),
    })
    .where(eq(aiEmailSessions.id, sessionId));
}

/**
 * Mark session as completed.
 */
export async function completeSession(sessionId: string): Promise<void> {
  await db
    .update(aiEmailSessions)
    .set({
      state: 'completed',
      pendingAction: null,
      updatedAt: new Date(),
    })
    .where(eq(aiEmailSessions.id, sessionId));
}

/**
 * Clean up expired sessions.
 * Should be called periodically (e.g., via cron).
 */
export async function cleanupExpiredSessions(): Promise<number> {
  await db
    .update(aiEmailSessions)
    .set({ state: 'expired' })
    .where(
      and(
        lt(aiEmailSessions.expiresAt, new Date()),
        eq(aiEmailSessions.state, 'active'),
      ),
    );

  // Drizzle doesn't return count by default
  return 0;
}

/**
 * Get session by sender email and thread ID.
 * Useful for finding session from reply email.
 */
export async function findSessionByThread(
  senderEmail: string,
  threadId: string,
): Promise<AiEmailSession | null> {
  const normalizedEmail = senderEmail.toLowerCase().trim();

  const [session] = await db
    .select()
    .from(aiEmailSessions)
    .where(
      and(
        eq(aiEmailSessions.senderEmail, normalizedEmail),
        eq(aiEmailSessions.threadId, threadId),
      ),
    )
    .limit(1);

  return session || null;
}

/**
 * Full session update - for complex state changes.
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<
    Pick<
      AiEmailSession,
      | 'state'
      | 'pendingAction'
      | 'messages'
      | 'extractedData'
      | 'invoiceId'
      | 'attachments'
    >
  >,
): Promise<AiEmailSession> {
  const [updated] = await db
    .update(aiEmailSessions)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(aiEmailSessions.id, sessionId))
    .returning();

  return updated;
}
