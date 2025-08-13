import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import {
  workspaces,
  workspaceMembers,
  workspaceInvites,
  users,
  companies,
} from '@/db/schema';
import { eq, and, or, desc, isNull } from 'drizzle-orm';
import crypto from 'crypto';

export const workspaceRouter = router({
  /**
   * Get team members for a workspace
   */
  getTeamMembers: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Verify user is member of workspace
      const membership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, userId),
          ),
        )
        .limit(1);

      if (!membership.length) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not a member of this workspace',
        });
      }

      // Get all members with user details - joining with companies for business info
      const members = await ctx.db
        .select({
          id: workspaceMembers.id,
          userId: workspaceMembers.userId,
          role: workspaceMembers.role,
          joinedAt: workspaceMembers.joinedAt,
          // TODO: Fix these fields once user.email is available
          // email: users.email,
          // name: users.businessName,
        })
        .from(workspaceMembers)
        // TODO: Add proper joins once user table has email field
        // .leftJoin(users, eq(workspaceMembers.userId, users.privyDid))
        .where(eq(workspaceMembers.workspaceId, input.workspaceId));

      return members;
    }),

  /**
   * Get pending team invites
   */
  getTeamInvites: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Verify user is admin/owner of workspace
      const membership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, userId),
            or(
              eq(workspaceMembers.role, 'owner'),
              eq(workspaceMembers.role, 'admin'),
            ),
          ),
        )
        .limit(1);

      if (!membership.length) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only workspace owners and admins can view invites',
        });
      }

      // Get pending invites - those where usedAt is null
      const invites = await ctx.db
        .select()
        .from(workspaceInvites)
        .where(
          and(
            eq(workspaceInvites.workspaceId, input.workspaceId),
            isNull(workspaceInvites.usedAt),
          ),
        );

      return invites;
    }),

  /**
   * Create a team invite
   */
  createTeamInvite: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        companyId: z.string().uuid().optional(),
        shareInbox: z.boolean().default(true),
        shareCompanyData: z.boolean().default(true),
        role: z.enum(['admin', 'member', 'viewer']).default('member'),
        email: z.string().email().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Verify user is admin/owner of workspace
      const membership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, userId),
            or(
              eq(workspaceMembers.role, 'owner'),
              eq(workspaceMembers.role, 'admin'),
            ),
          ),
        )
        .limit(1);

      if (!membership.length) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only workspace owners and admins can create invites',
        });
      }

      // Generate unique token
      const token = crypto.randomBytes(32).toString('hex');

      // Create invite
      const invite = await ctx.db
        .insert(workspaceInvites)
        .values({
          workspaceId: input.workspaceId,
          companyId: input.companyId,
          token,
          createdBy: userId,
          email: input.email,
          role: input.role,
          shareInbox: input.shareInbox,
          shareCompanyData: input.shareCompanyData,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        })
        .returning();

      return {
        success: true,
        invite: invite[0],
        inviteUrl: `/join-team?token=${token}`,
      };
    }),

  /**
   * Accept a team invite
   */
  acceptTeamInvite: protectedProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Find the invite
      const invite = await ctx.db
        .select()
        .from(workspaceInvites)
        .where(eq(workspaceInvites.token, input.token))
        .limit(1);

      if (!invite.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid or expired invite',
        });
      }

      const inviteData = invite[0];

      // Check if already used
      if (inviteData.usedAt) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This invite has already been used',
        });
      }

      // Check if expired
      if (inviteData.expiresAt && new Date(inviteData.expiresAt) < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This invite has expired',
        });
      }

      // Check if user is already a member
      const existingMembership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, inviteData.workspaceId),
            eq(workspaceMembers.userId, userId),
          ),
        )
        .limit(1);

      if (existingMembership.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already a member of this workspace',
        });
      }

      // Add user to workspace
      await ctx.db.insert(workspaceMembers).values({
        workspaceId: inviteData.workspaceId,
        userId,
        role: inviteData.role || 'member',
      });

      // Mark invite as used
      await ctx.db
        .update(workspaceInvites)
        .set({
          usedAt: new Date(),
          usedBy: userId,
        })
        .where(eq(workspaceInvites.id, inviteData.id));

      return {
        success: true,
        workspaceId: inviteData.workspaceId,
      };
    }),

  /**
   * Remove a team member
   */
  removeTeamMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        memberId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Verify user is admin/owner of workspace
      const membership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, userId),
            or(
              eq(workspaceMembers.role, 'owner'),
              eq(workspaceMembers.role, 'admin'),
            ),
          ),
        )
        .limit(1);

      if (!membership.length) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only workspace owners and admins can remove members',
        });
      }

      // Don't allow removing the owner
      const memberToRemove = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(eq(workspaceMembers.id, input.memberId))
        .limit(1);

      if (memberToRemove[0]?.role === 'owner') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot remove the workspace owner',
        });
      }

      // Remove the member
      await ctx.db
        .delete(workspaceMembers)
        .where(eq(workspaceMembers.id, input.memberId));

      return { success: true };
    }),

  /**
   * Create workspace invite (simplified version for frontend compatibility)
   */
  createInvite: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        role: z.enum(['admin', 'member', 'viewer']).default('member'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Verify user is admin/owner of workspace
      const membership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, userId),
            or(
              eq(workspaceMembers.role, 'owner'),
              eq(workspaceMembers.role, 'admin'),
            ),
          ),
        )
        .limit(1);

      if (!membership.length) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only workspace owners and admins can create invites',
        });
      }

      // Generate unique token
      const token = crypto.randomBytes(32).toString('hex');

      // Create invite with default settings
      const [invite] = await ctx.db
        .insert(workspaceInvites)
        .values({
          workspaceId: input.workspaceId,
          token,
          createdBy: userId,
          role: input.role,
          shareInbox: true,
          shareCompanyData: true,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        })
        .returning();

      return {
        ...invite,
        token, // Ensure token is included for frontend
      };
    }),

  /**
   * Update workspace settings
   */
  updateWorkspaceSettings: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        shareInbox: z.boolean().optional(),
        shareCompanyData: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Verify user is admin/owner of workspace
      const membership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, userId),
            or(
              eq(workspaceMembers.role, 'owner'),
              eq(workspaceMembers.role, 'admin'),
            ),
          ),
        )
        .limit(1);

      if (!membership.length) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only workspace owners and admins can update settings',
        });
      }

      // Update workspace settings
      // Note: The workspaces table doesn't have shareInbox or shareCompanyData columns
      // These are stored in workspace_invites table per invite
      // This procedure might need to be adjusted based on the actual requirements
      const [updated] = await ctx.db
        .update(workspaces)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, input.workspaceId))
        .returning();

      return updated;
    }),

  /**
   * Get workspace invites
   */
  getWorkspaceInvites: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Verify user is member of workspace
      const membership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, userId),
          ),
        )
        .limit(1);

      if (!membership.length) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not a member of this workspace',
        });
      }

      // Get all invites for the workspace
      const invites = await ctx.db
        .select()
        .from(workspaceInvites)
        .where(eq(workspaceInvites.workspaceId, input.workspaceId))
        .orderBy(desc(workspaceInvites.createdAt));

      return invites;
    }),

  /**
   * Delete workspace invite
   */
  deleteWorkspaceInvite: protectedProcedure
    .input(
      z.object({
        inviteId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Get the invite to check workspace
      const [invite] = await ctx.db
        .select()
        .from(workspaceInvites)
        .where(eq(workspaceInvites.id, input.inviteId))
        .limit(1);

      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invite not found',
        });
      }

      // Verify user is admin/owner of workspace
      const membership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, invite.workspaceId),
            eq(workspaceMembers.userId, userId),
            or(
              eq(workspaceMembers.role, 'owner'),
              eq(workspaceMembers.role, 'admin'),
            ),
          ),
        )
        .limit(1);

      if (!membership.length) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only workspace owners and admins can delete invites',
        });
      }

      // Delete the invite
      await ctx.db
        .delete(workspaceInvites)
        .where(eq(workspaceInvites.id, input.inviteId));

      return { success: true };
    }),

  /**
   * Get user's workspaces
   */
  getUserWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
      });
    }

    // Get all workspaces user is a member of
    const memberships = await ctx.db
      .select({
        workspaceId: workspaceMembers.workspaceId,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
        workspaceName: workspaces.name,
      })
      .from(workspaceMembers)
      .leftJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId));

    return memberships;
  }),
});
