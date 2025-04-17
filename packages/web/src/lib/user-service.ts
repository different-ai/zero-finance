import { db } from "@/db";
import { 
  userProfilesTable, 
  userWalletsTable, 
  userRequestsTable, 
  companyProfilesTable,
  users, 
  userSafes, 
  userFundingSources, 
  allocationStates 
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { userProfileService } from "./user-profile-service";

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
        
        // 1. Delete company profiles associated with the user
        if (userProfile?.id) {
          await tx.delete(companyProfilesTable)
            .where(eq(companyProfilesTable.userId, userProfile.id));
        }
        
        // 2. Delete user requests
        await tx.delete(userRequestsTable)
          .where(eq(userRequestsTable.userId, privyDid));
        
        // 3. Delete allocation states and user funding sources
        // First get the user safes
        const userSafeRecords = await tx.select()
          .from(userSafes)
          .where(eq(userSafes.userDid, privyDid));
        
        // Delete allocation states for each safe
        for (const safe of userSafeRecords) {
          await tx.delete(allocationStates)
            .where(eq(allocationStates.userSafeId, safe.id));
        }
        
        // 4. Delete user safes
        await tx.delete(userSafes)
          .where(eq(userSafes.userDid, privyDid));
        
        // 5. Delete user funding sources
        await tx.delete(userFundingSources)
          .where(eq(userFundingSources.userPrivyDid, privyDid));
        
        // 6. Delete user wallets
        await tx.delete(userWalletsTable)
          .where(eq(userWalletsTable.userId, privyDid));
        
        // 7. Delete user profile
        if (userProfile?.id) {
          await tx.delete(userProfilesTable)
            .where(eq(userProfilesTable.privyDid, privyDid));
        }
        
        // 8. Finally delete the user record
        await tx.delete(users)
          .where(eq(users.privyDid, privyDid));
        
        return {
          success: true,
          message: `User ${privyDid} successfully deleted`,
        };
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        message: `Failed to delete user: ${error.message}`,
      };
    }
  }
  
  /**
   * Gets a list of all users in the system
   * @returns Array of users with basic info
   */
  async listUsers() {
    try {
      const usersList = await db.select({
        privyDid: userProfilesTable.privyDid,
        email: userProfilesTable.email,
        businessName: userProfilesTable.businessName,
        createdAt: userProfilesTable.createdAt,
        hasCompletedOnboarding: userProfilesTable.hasCompletedOnboarding,
      })
      .from(userProfilesTable)
      .orderBy(userProfilesTable.createdAt);
      
      return usersList;
    } catch (error: any) {
      console.error("Error listing users:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const userService = new UserService(); 