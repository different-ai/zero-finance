/**
 * AI Email Invoice Agent
 *
 * This module provides an AI-powered email agent that allows users to
 * create invoices by forwarding emails to their workspace's unique address.
 *
 * Architecture:
 * 1. User forwards email to ai-{name}@zerofinance.ai (or legacy {workspaceId}@ai.0.finance)
 * 2. Resend catches all emails and sends webhook to /api/ai-email
 * 3. We extract handle from the "to" address and verify sender is workspace member
 * 4. AI processes the email, creates invoice, asks for confirmation
 * 5. User replies YES/NO
 * 6. Invoice is sent or cancelled
 *
 * Security Model:
 * - Handle-based addressing (human-readable, e.g., ai-clara.mitchell@zerofinance.ai)
 * - Sender verification (only workspace members can use the AI)
 * - Generic errors to prevent enumeration attacks
 *
 * For security documentation, see: roadmap/ai-email-security-upgrade.md
 */

// Workspace mapping
export {
  mapToWorkspace,
  extractWorkspaceIdFromEmail,
  extractLocalPartFromEmail,
  getWorkspaceAiEmailAddress,
  getLegacyWorkspaceAiEmailAddress,
  getOrCreateAiEmailHandle,
  generateAiEmailHandle,
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
  updateInvoiceForUser,
  getInvoiceById,
  getInvoicePublicLink,
  type CreateInvoiceParams,
  type UpdateInvoiceParams,
  type CreatedInvoice,
} from './invoice-service';

// Prompts
export { getSystemPrompt, emailTemplates } from './prompts';
