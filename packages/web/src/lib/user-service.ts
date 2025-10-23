import { db } from '@/db';
import {
  userProfilesTable,
  userWalletsTable,
  userRequestsTable,
  users,
  userSafes,
  userFundingSources,
  workspaces,
  workspaceMembers,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { userProfileService } from './user-profile-service';

export class UserService {
  /**
   * Completely deletes a user and all associated data from the system
   * @param privyDid The Privy DID of the user to delete
   * @returns Object containing success status and message
   */
  async deleteUser(privyDid: string) {
    try {
      // First get the user profile
      const userProfiles = await db
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.privyDid, privyDid))
        .limit(1);

      const userProfile = userProfiles.length ? userProfiles[0] : null;

      // Begin transaction to ensure all deletions succeed or fail together
      return await db.transaction(async (tx) => {
        // Delete in order based on foreign key dependencies

        // 1. Delete user requests
        await tx
          .delete(userRequestsTable)
          .where(eq(userRequestsTable.userId, privyDid));

        // 2. Delete user safes
        await tx.delete(userSafes).where(eq(userSafes.userDid, privyDid));

        // 3. Delete user funding sources
        await tx
          .delete(userFundingSources)
          .where(eq(userFundingSources.userPrivyDid, privyDid));

        // 4. Delete user wallets
        await tx
          .delete(userWalletsTable)
          .where(eq(userWalletsTable.userId, privyDid));

        // 5. Delete user profile
        if (userProfile?.id) {
          await tx
            .delete(userProfilesTable)
            .where(eq(userProfilesTable.privyDid, privyDid));
        }

        // 6. Finally delete the user record
        await tx.delete(users).where(eq(users.privyDid, privyDid));

        return {
          success: true,
          message: `User ${privyDid} successfully deleted`,
        };
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: `Failed to delete user: ${error.message}`,
      };
    }
  }

  /**
   * Gets a list of all users in the system
   * @returns Array of users with basic info and workspace memberships
   */
  async listUsers() {
    try {
      const usersList = await db
        .select({
          privyDid: userProfilesTable.privyDid,
          email: userProfilesTable.email,
          businessName: userProfilesTable.businessName,
          createdAt: userProfilesTable.createdAt,
          skippedOrCompletedOnboardingStepper:
            userProfilesTable.skippedOrCompletedOnboardingStepper,
          alignCustomerId: users.alignCustomerId,
          kycStatus: users.kycStatus,
          kycFlowLink: users.kycFlowLink,
          kycSubStatus: users.kycSubStatus,
        })
        .from(userProfilesTable)
        .leftJoin(users, eq(userProfilesTable.privyDid, users.privyDid))
        .orderBy(userProfilesTable.createdAt);

      // Fetch workspace memberships for all users
      const usersWithWorkspaces = await Promise.all(
        usersList.map(async (user) => {
          const memberships = await db
            .select({
              workspaceId: workspaceMembers.workspaceId,
              workspaceName: workspaces.name,
              role: workspaceMembers.role,
              isPrimary: workspaceMembers.isPrimary,
            })
            .from(workspaceMembers)
            .leftJoin(
              workspaces,
              eq(workspaceMembers.workspaceId, workspaces.id),
            )
            .where(eq(workspaceMembers.userId, user.privyDid));

          return {
            ...user,
            workspaces: memberships.map((m) => ({
              id: m.workspaceId,
              name: m.workspaceName || 'Unknown',
              role: m.role,
              isPrimary: m.isPrimary,
            })),
          };
        }),
      );

      return usersWithWorkspaces;
    } catch (error: any) {
      console.error('Error listing users:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const userService = new UserService();
