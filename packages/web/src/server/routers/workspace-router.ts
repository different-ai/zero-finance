import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import {
  workspaces,
  workspaceMembers,
  workspaceInvites,
  users,
  companies,
  userSafes,
  userProfilesTable,
} from '@/db/schema';
import { eq, and, or, desc, isNull } from 'drizzle-orm';
import crypto from 'crypto';

import {
  hasWorkspaceFeature,
  getWorkspaceFeatures,
  checkWorkspaceFeatures,
} from '@/lib/workspace-features';

const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_API_BASE_URL = 'https://app.loops.so/api/v1';

export const workspaceRouter = router({
  /**
   * Get active features for a workspace
   */
  getFeatures: protectedProcedure
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

      const features = await getWorkspaceFeatures(input.workspaceId);
      return features;
    }),

  /**
   * Update workspace with company name and notify founders
   */
  updateCompanyName: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        companyName: z.string().min(1).max(100),
        userName: z.string().optional(),
        userEmail: z.string().email().optional(),
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

      // Update workspace name
      await ctx.db
        .update(workspaces)
        .set({
          name: input.companyName,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, input.workspaceId));

      // Send notification to founders via Loops
      if (LOOPS_API_KEY) {
        try {
          await fetch(`${LOOPS_API_BASE_URL}/transactional`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${LOOPS_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'founders@0.finance',
              transactionalId: 'cmcoz1sx04doqzc0iq66v9ewj', // Using same as feedback
              dataVariables: {
                userEmail: input.userEmail || 'Not provided',
                feedback: `New signup - Company: ${input.companyName}, User: ${input.userName || 'Unknown'}, Email: ${input.userEmail || 'Not provided'}`,
                submittedAt: new Date().toISOString(),
              },
            }),
          });
        } catch (error) {
          console.error('Failed to send signup notification:', error);
          // Don't fail the mutation if notification fails
        }
      }

      return { success: true };
    }),

  /**
   * Ensure the user has a default workspace, creating one on demand.
   * Returns the user's primary workspace if set, otherwise their first workspace.
   */
  getOrCreateWorkspace: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
      });
    }

    // First, check if user has a primary workspace set
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.privyDid, userId))
      .limit(1);

    // If user has a primary workspace, use that
    if (user?.primaryWorkspaceId) {
      const membership = await ctx.db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, userId),
            eq(workspaceMembers.workspaceId, user.primaryWorkspaceId),
          ),
        )
        .limit(1);

      if (membership.length > 0) {
        const workspace = await ctx.db
          .select()
          .from(workspaces)
          .where(eq(workspaces.id, user.primaryWorkspaceId))
          .limit(1);

        if (workspace.length > 0) {
          return {
            workspaceId: user.primaryWorkspaceId,
            workspace: workspace[0],
            membership: membership[0],
          };
        }
      }
    }

    // Otherwise, get any workspace the user is a member of
    const existingMembership = await ctx.db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.userId, userId))
      .limit(1);

    if (existingMembership.length > 0) {
      const workspace = await ctx.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, existingMembership[0].workspaceId))
        .limit(1);

      // Set this as primary workspace if none was set
      await ctx.db
        .update(users)
        .set({ primaryWorkspaceId: existingMembership[0].workspaceId })
        .where(eq(users.privyDid, userId));

      return {
        workspaceId: existingMembership[0].workspaceId,
        workspace: workspace[0],
        membership: existingMembership[0],
      };
    }

    // No workspace exists, create a new one
    const newWorkspace = await ctx.db
      .insert(workspaces)
      .values({
        name: 'Personal Workspace',
        createdBy: userId,
      })
      .returning();

    const membership = await ctx.db
      .insert(workspaceMembers)
      .values({
        workspaceId: newWorkspace[0].id,
        userId,
        role: 'owner',
      })
      .returning();

    // Set as primary workspace
    await ctx.db
      .update(users)
      .set({ primaryWorkspaceId: newWorkspace[0].id })
      .where(eq(users.privyDid, userId));

    return {
      workspaceId: newWorkspace[0].id,
      workspace: newWorkspace[0],
      membership: membership[0],
    };
  }),

  /**
   * V2: Simplified workspace creation for welcome screen
   * Creates workspace and membership without touching primaryWorkspaceId
   * Returns the first workspace with isPrimary=true, or creates one if none exists
   */
  getOrCreateWorkspaceV2: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
      });
    }

    return await ctx.db.transaction(async (tx) => {
      // Find any workspace where user is a member with isPrimary=true
      const primaryMembership = await tx
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, userId),
            eq(workspaceMembers.isPrimary, true),
          ),
        )
        .limit(1);

      if (primaryMembership.length > 0) {
        // Found primary workspace, return it
        const workspace = await tx
          .select()
          .from(workspaces)
          .where(eq(workspaces.id, primaryMembership[0].workspaceId))
          .limit(1);

        if (workspace.length > 0) {
          return {
            workspaceId: primaryMembership[0].workspaceId,
            workspace: workspace[0],
            membership: primaryMembership[0],
          };
        }
      }

      // No primary workspace exists - check for any workspace membership
      const anyMembership = await tx
        .select()
        .from(workspaceMembers)
        .where(eq(workspaceMembers.userId, userId))
        .limit(1);

      if (anyMembership.length > 0) {
        // User has a workspace but it's not marked primary, mark it now
        await tx
          .update(workspaceMembers)
          .set({ isPrimary: true })
          .where(eq(workspaceMembers.id, anyMembership[0].id));

        const workspace = await tx
          .select()
          .from(workspaces)
          .where(eq(workspaces.id, anyMembership[0].workspaceId))
          .limit(1);

        return {
          workspaceId: anyMembership[0].workspaceId,
          workspace: workspace[0],
          membership: { ...anyMembership[0], isPrimary: true },
        };
      }

      // No workspace at all - create a new one (bootstrap)
      const newWorkspace = await tx
        .insert(workspaces)
        .values({
          name: 'Personal Workspace',
          createdBy: userId,
        })
        .returning();

      const newMembership = await tx
        .insert(workspaceMembers)
        .values({
          workspaceId: newWorkspace[0].id,
          userId,
          role: 'owner',
          isPrimary: true,
        })
        .returning();

      return {
        workspaceId: newWorkspace[0].id,
        workspace: newWorkspace[0],
        membership: newMembership[0],
      };
    });
  }),

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

      // Get all members with user details from profiles table
      const members = await ctx.db
        .select({
          id: workspaceMembers.id,
          userId: workspaceMembers.userId,
          role: workspaceMembers.role,
          joinedAt: workspaceMembers.joinedAt,
          email: userProfilesTable.email,
          name: userProfilesTable.businessName,
        })
        .from(workspaceMembers)
        .leftJoin(
          userProfilesTable,
          eq(workspaceMembers.userId, userProfilesTable.privyDid),
        )
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

      // Mark onboarding as complete for team members joining existing workspace
      // They don't need to go through personal Safe setup
      await ctx.db
        .insert(userProfilesTable)
        .values({
          privyDid: userId,
          skippedOrCompletedOnboardingStepper: true,
        })
        .onConflictDoUpdate({
          target: userProfilesTable.privyDid,
          set: {
            skippedOrCompletedOnboardingStepper: true,
          },
        });

      // Check if invite includes Safe ownership
      let pendingSafeOwnership = null;
      if (inviteData.addAsSafeOwner) {
        // Get inviter's primary Safe
        const primarySafe = await ctx.db.query.userSafes.findFirst({
          where: and(
            eq(userSafes.userDid, inviteData.createdBy),
            eq(userSafes.safeType, 'primary'),
            eq(userSafes.workspaceId, inviteData.workspaceId),
          ),
        });

        if (primarySafe) {
          // Get invitee's wallet address from context
          const inviteeWallet = ctx.user?.wallet?.address;

          if (inviteeWallet) {
            pendingSafeOwnership = {
              safeAddress: primarySafe.safeAddress,
              newOwner: inviteeWallet,
              inviterUserId: inviteData.createdBy,
            };
          }

          // IMPORTANT: Create a userSafes record for the new member
          // This allows them to access the shared safe when they switch to this workspace
          try {
            await ctx.db
              .insert(userSafes)
              .values({
                userDid: userId,
                workspaceId: inviteData.workspaceId,
                safeAddress: primarySafe.safeAddress,
                safeType: 'primary',
                isEarnModuleEnabled: primarySafe.isEarnModuleEnabled,
              })
              .onConflictDoNothing();

            console.log(
              `Created userSafes record for ${userId} to access shared safe ${primarySafe.safeAddress} in workspace ${inviteData.workspaceId}`,
            );
          } catch (error) {
            console.error(
              'Failed to create userSafes record for team member:',
              error,
            );
            // Don't fail the invite if this fails - user can still be added as co-owner manually
          }
        }
      }

      return {
        success: true,
        workspaceId: inviteData.workspaceId,
        pendingSafeOwnership,
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
        addAsSafeOwner: z.boolean().optional().default(false),
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
          addAsSafeOwner: input.addAsSafeOwner,
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

  /**
   * Set active workspace for the user
   */
  setActiveWorkspace: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
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

      // Verify user is a member of this workspace
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

      // Update user's primary workspace
      await ctx.db
        .update(users)
        .set({ primaryWorkspaceId: input.workspaceId })
        .where(eq(users.privyDid, userId));

      return { success: true, workspaceId: input.workspaceId };
    }),

  /**
   * Rename workspace
   */
  renameWorkspace: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        name: z.string().min(1).max(100),
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
          message: 'Only workspace owners and admins can rename workspace',
        });
      }

      // Update workspace name
      const [updated] = await ctx.db
        .update(workspaces)
        .set({
          name: input.name,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, input.workspaceId))
        .returning();

      return updated;
    }),

  /**
   * Get workspace details
   */
  getWorkspace: protectedProcedure
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

      // Get workspace
      const [workspace] = await ctx.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .limit(1);

      if (!workspace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workspace not found',
        });
      }

      return workspace;
    }),
});
