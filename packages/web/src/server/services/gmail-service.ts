import { google, gmail_v1 } from 'googleapis';
import { JWT } from 'google-auth-library';

const GMAIL_CLIENT_EMAIL = process.env.GMAIL_CLIENT_EMAIL;
const GMAIL_PRIVATE_KEY = process.env.GMAIL_PRIVATE_KEY?.replace(/\\n/g, '\\n'); // Ensure newlines are correct
const GMAIL_TARGET_EMAIL = process.env.GMAIL_TARGET_EMAIL; // For service account impersonation

// For OAuth client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// The redirect URI is not strictly needed for client instantiation server-side when using an existing token,
// but good to have available if the client object is used for more.
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3050/api/auth/gmail/callback';

const gmailScopes = ['https://www.googleapis.com/auth/gmail.readonly'];

function getGmailClient(accessToken?: string): gmail_v1.Gmail | null {
  if (accessToken && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    try {
      console.log('[GmailService] Attempting to use OAuth with provided access token.');
      const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
      );
      oauth2Client.setCredentials({ access_token: accessToken });
      return google.gmail({ version: 'v1', auth: oauth2Client });
    } catch (error) {
      console.error('[GmailService] Error creating Gmail client with OAuth token:', error);
      // Fallback to service account if OAuth fails with token for some reason, or just return null
      // For now, let's not fall back if a token was provided but failed, to make issues clear.
      return null;
    }
  } else if (GMAIL_CLIENT_EMAIL && GMAIL_PRIVATE_KEY && GMAIL_TARGET_EMAIL) {
    console.log('[GmailService] Using Service Account credentials.');
    try {
      const auth = new JWT({
        email: GMAIL_CLIENT_EMAIL,
        key: GMAIL_PRIVATE_KEY,
        scopes: gmailScopes,
        subject: GMAIL_TARGET_EMAIL, 
      });
      return google.gmail({ version: 'v1', auth });
    } catch (error) {
      console.error('[GmailService] Error creating Gmail client with Service Account:', error);
      return null;
    }
  } else {
    console.warn(
      '[GmailService] Missing OAuth credentials (and no token provided) AND Service Account credentials. Gmail integration will be disabled.',
    );
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

export interface FetchEmailsResult {
  emails: SimplifiedEmail[];
  nextPageToken?: string | null;
}

export async function fetchEmails(
  count = 50,
  keywords = ['invoice', 'receipt', 'bill', 'payment'],
  dateQuery?: string, // e.g., "newer_than:7d" or full query like "(invoice OR bill) after:123456"
  accessToken?: string, // Optional access token for OAuth
  pageToken?: string // Add pageToken for pagination
): Promise<FetchEmailsResult> {
  // Pass the accessToken to getGmailClient. 
  // For Day 3, if accessToken is undefined, it will use service account.
  const gmail = getGmailClient(accessToken);
  if (!gmail) {
    console.log('[GmailService] Gmail client not available, cannot fetch emails.');
    return { emails: [] };
  }

  // The GMAIL_TARGET_EMAIL is used for service account impersonation.
  // For OAuth, the user is determined by the access token, so 'me' is appropriate.
  const userIdForGmailApi = accessToken ? 'me' : GMAIL_TARGET_EMAIL;
  if (!userIdForGmailApi && !accessToken) { // GMAIL_TARGET_EMAIL must be present for service account
      console.error('[GmailService] Target email for service account not set, cannot fetch emails.');
      return { emails: [] };
  }

  try {
    let constructedQuery = '';
    
    // Check if dateQuery already contains a full query (with keywords)
    if (dateQuery && (dateQuery.includes(' OR ') || dateQuery.includes(' AND '))) {
      // dateQuery is actually a full query, use it as-is
      constructedQuery = dateQuery;
    } else {
      // Build query from keywords
      constructedQuery = `(${keywords.join(' OR ')})`;
      if (dateQuery) {
        constructedQuery += ` ${dateQuery}`;
      }
    }
    
    console.log(`[GmailService] Executing query: ${constructedQuery}`);

    const listResponse = await gmail.users.messages.list({
      userId: userIdForGmailApi, // Use 'me' for OAuth, GMAIL_TARGET_EMAIL for service account
      maxResults: count,
      q: constructedQuery.trim(),
      pageToken: pageToken, // Add pagination support
    });

    const messages = listResponse.data.messages;
    const nextPageToken = listResponse.data.nextPageToken;
    
    if (!messages || messages.length === 0) {
      console.log('No messages found matching query.');
      return { emails: [], nextPageToken };
    }

    const detailedEmails: SimplifiedEmail[] = [];

    for (const messageInfo of messages) {
      if (!messageInfo.id) continue;
      try {
        const msgResponse = await gmail.users.messages.get({
          userId: userIdForGmailApi, // Use 'me' for OAuth
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
    return { emails: detailedEmails, nextPageToken };
  } catch (error) {
    console.error('Error fetching emails:', error);
    return { emails: [] };
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
export async function downloadAttachment(messageId: string, attachmentId: string, accessToken?: string): Promise<Buffer | null> {
  const gmail = getGmailClient(accessToken);
  if (!gmail) {
    console.warn('[GmailService] Gmail client not available, cannot download attachment.');
    return null;
  }
  
  const userIdForGmailApi = accessToken ? 'me' : GMAIL_TARGET_EMAIL;
   if (!userIdForGmailApi && !accessToken) {
      console.error('[GmailService] Target email for service account not set or no access token, cannot download attachment.');
      return null;
  }

  try {
    const response = await gmail.users.messages.attachments.get({
      userId: userIdForGmailApi, // Use 'me' for OAuth
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