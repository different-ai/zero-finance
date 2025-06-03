import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { db } from '@/db';
import { oauthStates } from '@/db/schema';
import { PrivyClient } from '@privy-io/server-auth';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3050/api/auth/gmail/callback';

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// Helper to get user from Privy token in request
async function getPrivyUserFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const authToken = request.cookies.get('privy-token')?.value;
    if (!authToken) {
      console.warn('[GMAIL_CONNECT] No Privy auth token found in cookies.');
      return null;
    }
    const { userId } = await privyClient.verifyAuthToken(authToken);
    return userId;
  } catch (error) {
    console.error('[GMAIL_CONNECT] Error verifying Privy token:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    // Potentially redirect to an error page or return a JSON error
    return NextResponse.json({ error: 'Google Client ID or Secret not configured' }, { status: 500 });
  }

  const userPrivyDid = await getPrivyUserFromRequest(request);
  if (!userPrivyDid) {
    // User is not authenticated with Privy, cannot initiate OAuth flow tied to a user
    // Redirect to login or an error page. For now, returning an error.
    // Consider redirecting to /oauth-debug or a more user-friendly error page.
    return NextResponse.redirect(new URL('/oauth-debug?status=error_auth&reason=privy_auth_required_for_connect', request.url));
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  // Generate a secure, unique state parameter
  const state = crypto.randomBytes(32).toString('hex');
  const stateExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

  try {
    // Store the state and user DID in the database
    await db.insert(oauthStates).values({
      state: state,
      userPrivyDid: userPrivyDid,
      provider: 'gmail',
      expiresAt: stateExpiresAt,
    });
    console.log('[GMAIL_CONNECT] Stored OAuth state for user:', userPrivyDid, 'State:', state);
  } catch (dbError) {
    console.error('[GMAIL_CONNECT] Failed to store OAuth state:', dbError);
    // Redirect to an error page or return a JSON error
    return NextResponse.redirect(new URL('/oauth-debug?status=error_db&reason=failed_to_store_oauth_state', request.url));
  }

  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: state, // Include the state parameter
  });

  return NextResponse.redirect(authUrl);
} 