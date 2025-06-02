import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
// TODO: Import a service for securely storing/retrieving user tokens, e.g., from DB
// import { saveUserGmailTokens, getUserFromSession } from '@/server/auth-utils'; 

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3050/api/auth/gmail/callback';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('Google OAuth client ID or secret not configured.');
    return NextResponse.redirect(new URL('/dashboard/settings/integrations?gmail_status=error_config', request.url));
  }

  if (!code) {
    console.error('No authorization code received from Google.');
    return NextResponse.redirect(new URL('/dashboard/settings/integrations?gmail_status=error_code', request.url));
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('Gmail OAuth tokens received:', tokens);
    // TODO: Securely store tokens.refresh_token for the logged-in user.
    // Example: const user = await getUserFromSession(request); // Get user from session
    // if (user && tokens.refresh_token) {
    //   await saveUserGmailTokens(user.id, tokens.access_token, tokens.refresh_token, tokens.expiry_date);
    // }
    if (tokens.refresh_token) {
        console.log('IMPORTANT: Gmail Refresh Token (store securely!): ', tokens.refresh_token);
    }
    if (tokens.access_token) {
        console.log('Gmail Access Token (expires: ', new Date(tokens.expiry_date || 0).toLocaleTimeString(), '): ', tokens.access_token);
    }

    // For Day 3, we are just logging. In a real app, associate with user and redirect.
    // Redirect to a page indicating success
    return NextResponse.redirect(new URL('/dashboard/settings/integrations?gmail_status=success', request.url));
  } catch (error: any) {
    console.error('Error exchanging Google OAuth code for tokens:', error.message);
    return NextResponse.redirect(new URL('/dashboard/settings/integrations?gmail_status=error_token', request.url));
  }
} 