import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { db } from '@/db';
import { gmailOAuthTokens, oauthStates } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3050/api/auth/gmail/callback';

export async function GET(request: NextRequest) {
  console.log('[GMAIL_CALLBACK] Gmail OAuth callback initiated.');
  const code = request.nextUrl.searchParams.get('code');
  const stateFromGoogle = request.nextUrl.searchParams.get('state');

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('[GMAIL_CALLBACK] Google OAuth client ID or secret not configured.');
    return NextResponse.redirect(new URL('/oauth-debug?status=error_config&reason=missing_google_creds', request.url));
  }

  if (!code) {
    console.error('[GMAIL_CALLBACK] No authorization code received from Google.');
    return NextResponse.redirect(new URL('/oauth-debug?status=error_code&reason=no_google_code', request.url));
  }

  if (!stateFromGoogle) {
    console.error('[GMAIL_CALLBACK] No state parameter received from Google.');
    return NextResponse.redirect(new URL('/oauth-debug?status=error_state&reason=no_state_from_google', request.url));
  }

  let userPrivyDid: string | null = null;
  try {
    const now = new Date();
    const storedState = await db.query.oauthStates.findFirst({
      where: and(
        eq(oauthStates.state, stateFromGoogle),
        eq(oauthStates.provider, 'gmail'),
        gt(oauthStates.expiresAt, now)
      ),
    });

    if (!storedState) {
      console.error('[GMAIL_CALLBACK] Invalid, mismatched, or expired state parameter:', stateFromGoogle);
      return NextResponse.redirect(new URL('/oauth-debug?status=error_state&reason=invalid_or_expired_state', request.url));
    }

    userPrivyDid = storedState.userPrivyDid;
    console.log('[GMAIL_CALLBACK] State validated. UserPrivyDid from state:', userPrivyDid);

    await db.delete(oauthStates).where(eq(oauthStates.state, stateFromGoogle));
    console.log('[GMAIL_CALLBACK] OAuth state deleted from DB:', stateFromGoogle);

  } catch (dbError: any) {
    console.error('[GMAIL_CALLBACK] Database error during state validation or deletion:', dbError.message);
    return NextResponse.redirect(new URL('/oauth-debug?status=error_db&reason=state_validation_db_error', request.url));
  }

  if (!userPrivyDid) {
    console.error('[GMAIL_CALLBACK] UserPrivyDid could not be determined from state. This should not happen.');
    return NextResponse.redirect(new URL('/oauth-debug?status=error_internal&reason=user_did_not_resolved_from_state', request.url));
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  try {
    console.log('[GMAIL_CALLBACK] Exchanging Google code for tokens for user:', userPrivyDid);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log('[GMAIL_CALLBACK] Google OAuth tokens received.');

    if (!tokens.access_token || !tokens.refresh_token) {
      console.error('[GMAIL_CALLBACK] Missing access_token or refresh_token from Google.');
      return NextResponse.redirect(new URL('/oauth-debug?status=error_token&reason=google_token_missing', request.url));
    }

    console.log('[GMAIL_CALLBACK] Storing tokens in database for user:', userPrivyDid);
    const existingTokens = await db.query.gmailOAuthTokens.findFirst({
      where: eq(gmailOAuthTokens.userPrivyDid, userPrivyDid),
    });

    if (existingTokens) {
      console.log('[GMAIL_CALLBACK] Updating existing tokens for user:', userPrivyDid);
      await db.update(gmailOAuthTokens)
        .set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          scope: tokens.scope || 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email',
          updatedAt: new Date(),
        })
        .where(eq(gmailOAuthTokens.userPrivyDid, userPrivyDid));
    } else {
      console.log('[GMAIL_CALLBACK] Inserting new tokens for user:', userPrivyDid);
      await db.insert(gmailOAuthTokens).values({
        userPrivyDid,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scope: tokens.scope || 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email',
      });
    }
    console.log('[GMAIL_CALLBACK] Gmail OAuth tokens stored successfully for user:', userPrivyDid);
    return NextResponse.redirect(new URL('/dashboard/inbox', request.url));
  } catch (error: any) {
    console.error('[GMAIL_CALLBACK] Error exchanging Google OAuth code for tokens or DB error:', error.message, error.stack);
    let reason = 'token_exchange_or_db_error';
    if (error.message && error.message.includes('redirect_uri_mismatch')) {
        reason = 'redirect_uri_mismatch_in_google_exchange';
    } else if (error.message && error.message.includes('invalid_grant')) {
        reason = 'invalid_grant_from_google';
    }
    return NextResponse.redirect(new URL(`/oauth-debug?status=error_token_exchange&reason=${reason}&message=${encodeURIComponent(error.message)}`, request.url));
  }
} 