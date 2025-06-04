import { db } from '@/db';
import { gmailOAuthTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { google } from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export interface GmailTokenData {
  accessToken: string;
  refreshToken: string;
  expiryDate: Date | null;
}

export class GmailTokenService {
  /**
   * Get valid access token for a user, refreshing if necessary
   */
  static async getValidAccessToken(userPrivyDid: string): Promise<string | null> {
    try {
      // Get tokens from database
      const tokenRecord = await db.query.gmailOAuthTokens.findFirst({
        where: eq(gmailOAuthTokens.userPrivyDid, userPrivyDid),
      });

      if (!tokenRecord) {
        console.log(`No Gmail tokens found for user: ${userPrivyDid}`);
        return null;
      }

      // Check if token is still valid (has at least 5 minutes left)
      const now = new Date();
      const expiryBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (tokenRecord.expiryDate && tokenRecord.expiryDate.getTime() > now.getTime() + expiryBuffer) {
        // Token is still valid
        return tokenRecord.accessToken;
      }

      // Token is expired or expiring soon, refresh it
      console.log(`Access token expired for user ${userPrivyDid}, refreshing...`);
      return await this.refreshAccessToken(userPrivyDid, tokenRecord.refreshToken);
    } catch (error) {
      console.error('Error getting valid access token:', error);
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private static async refreshAccessToken(userPrivyDid: string, refreshToken: string): Promise<string | null> {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('Google OAuth client ID or secret not configured');
      return null;
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET
      );

      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      // Refresh the token
      const { credentials } = await oauth2Client.refreshAccessToken();

      if (!credentials.access_token) {
        console.error('Failed to refresh access token - no access token returned');
        return null;
      }

      // Update the database with new tokens
      await db.update(gmailOAuthTokens)
        .set({
          accessToken: credentials.access_token,
          expiryDate: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
          updatedAt: new Date(),
        })
        .where(eq(gmailOAuthTokens.userPrivyDid, userPrivyDid));

      console.log(`Access token refreshed successfully for user: ${userPrivyDid}`);
      return credentials.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  /**
   * Check if user has Gmail OAuth tokens
   */
  static async hasGmailTokens(userPrivyDid: string): Promise<boolean> {
    try {
      const tokenRecord = await db.query.gmailOAuthTokens.findFirst({
        where: eq(gmailOAuthTokens.userPrivyDid, userPrivyDid),
        columns: { id: true },
      });

      return !!tokenRecord;
    } catch (error) {
      console.error('Error checking Gmail tokens:', error);
      return false;
    }
  }

  /**
   * Remove Gmail OAuth tokens for a user
   */
  static async removeGmailTokens(userPrivyDid: string): Promise<void> {
    try {
      await db.delete(gmailOAuthTokens)
        .where(eq(gmailOAuthTokens.userPrivyDid, userPrivyDid));
      
      console.log(`Gmail tokens removed for user: ${userPrivyDid}`);
    } catch (error) {
      console.error('Error removing Gmail tokens:', error);
      throw error;
    }
  }
} 