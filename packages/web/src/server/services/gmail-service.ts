import { google, gmail_v1 } from 'googleapis';
import { JWT } from 'google-auth-library';

const GMAIL_CLIENT_EMAIL = process.env.GMAIL_CLIENT_EMAIL;
const GMAIL_PRIVATE_KEY = process.env.GMAIL_PRIVATE_KEY?.replace(/\\n/g, '\\n'); // Ensure newlines are correct
const GMAIL_TARGET_EMAIL = process.env.GMAIL_TARGET_EMAIL;

if (!GMAIL_CLIENT_EMAIL || !GMAIL_PRIVATE_KEY || !GMAIL_TARGET_EMAIL) {
  console.warn(
    'Gmail Service: Missing one or more GMAIL environment variables. Gmail integration will be disabled.',
  );
}

const gmailScopes = ['https://www.googleapis.com/auth/gmail.readonly'];

function getGmailClient(): gmail_v1.Gmail | null {
  if (!GMAIL_CLIENT_EMAIL || !GMAIL_PRIVATE_KEY || !GMAIL_TARGET_EMAIL) {
    return null;
  }
  try {
    const auth = new JWT({
      email: GMAIL_CLIENT_EMAIL,
      key: GMAIL_PRIVATE_KEY,
      scopes: gmailScopes,
      subject: GMAIL_TARGET_EMAIL, // Impersonate the target email user
    });
    return google.gmail({ version: 'v1', auth });
  } catch (error) {
    console.error('Error creating Gmail client:', error);
    return null;
  }
}

export interface GmailAttachmentMetadata {
  filename: string;
  mimeType: string;
  size: number;
  attachmentId?: string; // If needed for later download
}
export interface SimplifiedEmail {
  id: string;
  threadId?: string | null;
  subject?: string | null;
  from?: string | null;
  date?: string | null;
  snippet?: string | null;
  rawBody?: string | null; // Base64 encoded raw body
  textBody?: string | null;
  htmlBody?: string | null;
  attachments: GmailAttachmentMetadata[];
}

export async function fetchEmails(
  count = 50,
  keywords = ['invoice', 'receipt', 'bill', 'payment'],
  dateQuery?: string // e.g., "newer_than:7d" or "older_than:YYYY/MM/DD newer_than:YYYY/MM/DD"
): Promise<SimplifiedEmail[]> {
  const gmail = getGmailClient();
  if (!gmail) {
    return [];
  }

  try {
    let constructedQuery = `(${keywords.join(' OR ')})`;
    // For Day 1, we had AND has:attachment. Let's make this optional or part of keywords for flexibility.
    // If keywords already include has:attachment, it's fine. If not, and we want it, add it.
    // For now, let's assume keywords are self-sufficient or dateQuery is primary filter.
    // Example: if (!keywords.some(k => k.toLowerCase().includes('has:attachment'))) {
    //  constructedQuery += ' AND has:attachment';
    // }

    if (dateQuery) {
      constructedQuery += ` ${dateQuery}`;
    }
    console.log(`[GmailService] Executing query: ${constructedQuery}`);

    const listResponse = await gmail.users.messages.list({
      userId: GMAIL_TARGET_EMAIL,
      maxResults: count,
      q: constructedQuery.trim(),
    });

    const messages = listResponse.data.messages;
    if (!messages || messages.length === 0) {
      console.log('No messages found matching query.');
      return [];
    }

    const detailedEmails: SimplifiedEmail[] = [];

    for (const messageInfo of messages) {
      if (!messageInfo.id) continue;
      try {
        const msgResponse = await gmail.users.messages.get({
          userId: GMAIL_TARGET_EMAIL,
          id: messageInfo.id,
          format: 'full', // Get full payload to access parts
        });

        const { data: fullMessage } = msgResponse;
        if (!fullMessage || !fullMessage.payload) continue;

        const headers = fullMessage.payload.headers || [];
        const subject = headers.find((h) => h.name === 'Subject')?.value || null;
        const from = headers.find((h) => h.name === 'From')?.value || null;
        const date = headers.find((h) => h.name === 'Date')?.value || null;

        let textBody: string | null = null;
        let htmlBody: string | null = null;
        const attachments: GmailAttachmentMetadata[] = [];

        function findParts(parts: gmail_v1.Schema$MessagePart[] | undefined) {
          if (!parts) return;
          for (const part of parts) {
            if (part.mimeType === 'text/plain' && part.body?.data) {
              textBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
            } else if (part.mimeType === 'text/html' && part.body?.data) {
              htmlBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
            } else if (part.filename && part.body?.attachmentId && part.body?.size) {
              attachments.push({
                filename: part.filename,
                mimeType: part.mimeType || 'application/octet-stream',
                size: part.body.size,
                attachmentId: part.body.attachmentId,
              });
            }
            if (part.parts) {
              findParts(part.parts); // Recursively search in subparts
            }
          }
        }
        
        // If the email itself has a body (not multipart)
        if (fullMessage.payload.body?.data && !fullMessage.payload.parts) {
            if (fullMessage.payload.mimeType === 'text/plain') {
                 textBody = Buffer.from(fullMessage.payload.body.data, 'base64').toString('utf-8');
            } else if (fullMessage.payload.mimeType === 'text/html') {
                 htmlBody = Buffer.from(fullMessage.payload.body.data, 'base64').toString('utf-8');
            }
        }


        findParts(fullMessage.payload.parts);

        detailedEmails.push({
          id: fullMessage.id!,
          threadId: fullMessage.threadId,
          subject,
          from,
          date,
          snippet: fullMessage.snippet,
          rawBody: fullMessage.raw, // Store raw for full reprocessing if needed
          textBody,
          htmlBody,
          attachments,
        });
      } catch (err) {
        console.error(`Error fetching message ID ${messageInfo.id}:`, err);
      }
    }
    console.log(`Fetched ${detailedEmails.length} detailed emails.`);
    return detailedEmails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
}

// Helper to download an attachment - for Day 2 or later
// export async function downloadAttachment(messageId: string, attachmentId: string): Promise<Buffer | null> {
//   const gmail = getGmailClient();
//   if (!gmail) return null;

//   try {
//     const response = await gmail.users.messages.attachments.get({
//       userId: GMAIL_TARGET_EMAIL,
//       messageId: messageId,
//       id: attachmentId,
//     });
//     if (response.data.data) {
//       return Buffer.from(response.data.data, 'base64');
//     }
//     return null;
//   } catch (error) {
//     console.error('Error downloading attachment:', error);
//     return null;
//   }
// }
export async function downloadAttachment(messageId: string, attachmentId: string): Promise<Buffer | null> {
  const gmail = getGmailClient();
  if (!gmail || !GMAIL_TARGET_EMAIL) { // Added GMAIL_TARGET_EMAIL check for safety
    console.warn('[GmailService] Attempted to download attachment but service is not configured.');
    return null;
  }

  try {
    const response = await gmail.users.messages.attachments.get({
      userId: GMAIL_TARGET_EMAIL, // Ensure this is GMAIL_TARGET_EMAIL
      messageId: messageId,
      id: attachmentId,
    });
    if (response.data && response.data.data) {
      return Buffer.from(response.data.data, 'base64');
    }
    console.warn(`[GmailService] No data found for attachment ID ${attachmentId} in message ID ${messageId}.`);
    return null;
  } catch (error) {
    console.error(`[GmailService] Error downloading attachment ID ${attachmentId} for message ID ${messageId}:`, error);
    return null;
  }
} 