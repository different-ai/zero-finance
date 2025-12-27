/**
 * AI Email Invoice Agent
 *
 * This module provides an AI-powered email agent that allows users to
 * create invoices by forwarding emails to their workspace's unique address.
 *
 * Architecture:
 * 1. User forwards email to {workspaceId}@ai.0.finance
 * 2. Resend catches all emails and sends webhook to /api/ai-email
 * 3. We extract workspaceId from the "to" address
 * 4. AI processes the email, creates invoice, asks for confirmation
 * 5. User replies YES/NO
 * 6. Invoice is sent or cancelled
 *
 * For security upgrade path (email linking), see:
 * roadmap/ai-email-security-upgrade.md
 */

// Workspace mapping
export {
  mapToWorkspace,
  extractWorkspaceIdFromEmail,
  getWorkspaceAiEmailAddress,
  AI_EMAIL_INBOUND_DOMAIN,
  type WorkspaceMapping,
  type WorkspaceMappingError,
  type WorkspaceMappingResult,
} from './workspace-mapping';

// Email parsing
export {
  parseForwardedEmail,
  formatEmailForAI,
  isForwardedEmail,
  parseConfirmationReply,
  type ParsedForwardedEmail,
} from './email-parser';

// Session management
export {
  getOrCreateSession,
  getSessionById,
  addMessageToSession,
  updateSessionState,
  setPendingAction,
  clearPendingAction,
  updateExtractedData,
  setInvoiceId,
  completeSession,
  cleanupExpiredSessions,
  findSessionByThread,
  updateSession,
} from './session-manager';

// Invoice service
export {
  createInvoiceForUser,
  getInvoiceById,
  getInvoicePublicLink,
  type CreateInvoiceParams,
  type CreatedInvoice,
} from './invoice-service';

// Prompts
export { getSystemPrompt, emailTemplates } from './prompts';
