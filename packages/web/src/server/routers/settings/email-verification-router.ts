import { z } from 'zod';
import { router, protectedProcedure } from '../../create-router';
import { TRPCError } from '@trpc/server';
import {
  SESClient,
  VerifyEmailIdentityCommand,
  GetIdentityVerificationAttributesCommand,
  ListIdentitiesCommand,
  DeleteIdentityCommand,
} from '@aws-sdk/client-ses';

/**
 * Get the SES client configured with environment credentials
 */
function getSESClient(): SESClient {
  const region = process.env.AWS_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'AWS credentials not configured',
    });
  }

  return new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Email Verification Router
 *
 * Manages SES email verification for sandbox mode.
 * This allows users to whitelist email addresses that can receive
 * emails from the AI Email Agent while in SES sandbox.
 */
export const emailVerificationRouter = router({
  /**
   * List all verified email identities
   */
  list: protectedProcedure.query(async () => {
    const client = getSESClient();

    try {
      // List all email identities
      const listCommand = new ListIdentitiesCommand({
        IdentityType: 'EmailAddress',
        MaxItems: 100,
      });
      const listResult = await client.send(listCommand);

      if (!listResult.Identities || listResult.Identities.length === 0) {
        return [];
      }

      // Get verification status for each identity
      const verifyCommand = new GetIdentityVerificationAttributesCommand({
        Identities: listResult.Identities,
      });
      const verifyResult = await client.send(verifyCommand);

      const identities = listResult.Identities.map((email) => {
        const attrs = verifyResult.VerificationAttributes?.[email];
        return {
          email,
          status: attrs?.VerificationStatus || 'NotStarted',
          verificationToken: attrs?.VerificationToken,
        };
      });

      return identities;
    } catch (error) {
      console.error('[EmailVerification] Failed to list identities:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list verified emails',
      });
    }
  }),

  /**
   * Send verification email to an address
   * The user will receive an email with a verification link
   */
  verify: protectedProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
      }),
    )
    .mutation(async ({ input }) => {
      const client = getSESClient();

      try {
        const command = new VerifyEmailIdentityCommand({
          EmailAddress: input.email,
        });
        await client.send(command);

        return {
          success: true,
          message: `Verification email sent to ${input.email}. Please check inbox and click the verification link.`,
        };
      } catch (error) {
        console.error('[EmailVerification] Failed to verify email:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send verification email',
        });
      }
    }),

  /**
   * Check verification status of an email
   */
  checkStatus: protectedProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
      }),
    )
    .query(async ({ input }) => {
      const client = getSESClient();

      try {
        const command = new GetIdentityVerificationAttributesCommand({
          Identities: [input.email],
        });
        const result = await client.send(command);

        const attrs = result.VerificationAttributes?.[input.email];

        return {
          email: input.email,
          status: attrs?.VerificationStatus || 'NotStarted',
          isVerified: attrs?.VerificationStatus === 'Success',
        };
      } catch (error) {
        console.error('[EmailVerification] Failed to check status:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check verification status',
        });
      }
    }),

  /**
   * Remove a verified email identity
   */
  remove: protectedProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
      }),
    )
    .mutation(async ({ input }) => {
      const client = getSESClient();

      try {
        const command = new DeleteIdentityCommand({
          Identity: input.email,
        });
        await client.send(command);

        return {
          success: true,
          message: `Removed ${input.email} from verified emails`,
        };
      } catch (error) {
        console.error('[EmailVerification] Failed to remove identity:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove email',
        });
      }
    }),
});
