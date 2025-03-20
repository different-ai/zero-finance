import { db } from "../db";
import { companyProfilesTable, CompanyProfile, NewCompanyProfile } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class CompanyProfileService {
  // Get company profiles for a user
  async getCompanyProfiles(userId: string): Promise<CompanyProfile[]> {
    try {
      const profiles = await db
        .select()
        .from(companyProfilesTable)
        .where(eq(companyProfilesTable.userId, userId))
        .orderBy(companyProfilesTable.createdAt);
      
      return profiles;
    } catch (error) {
      console.error("Error getting company profiles:", error);
      return [];
    }
  }

  // Get a company profile by ID
  async getCompanyProfile(id: string, userId: string): Promise<CompanyProfile | null> {
    try {
      const results = await db
        .select()
        .from(companyProfilesTable)
        .where(
          and(
            eq(companyProfilesTable.id, id),
            eq(companyProfilesTable.userId, userId)
          )
        )
        .limit(1);
      
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error("Error getting company profile:", error);
      return null;
    }
  }

  // Get default company profile for a user
  async getDefaultCompanyProfile(userId: string): Promise<CompanyProfile | null> {
    try {
      const results = await db
        .select()
        .from(companyProfilesTable)
        .where(
          and(
            eq(companyProfilesTable.userId, userId),
            eq(companyProfilesTable.isDefault, true)
          )
        )
        .limit(1);
      
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error("Error getting default company profile:", error);
      return null;
    }
  }

  // Create a company profile
  async createCompanyProfile(data: NewCompanyProfile): Promise<CompanyProfile> {
    try {
      // If this is the default profile, ensure no other profiles are default
      if (data.isDefault) {
        await this.clearDefaultProfileFlag(data.userId);
      }

      const result = await db
        .insert(companyProfilesTable)
        .values(data)
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating company profile:", error);
      throw new Error("Failed to create company profile");
    }
  }

  // Update a company profile
  async updateCompanyProfile(
    id: string,
    userId: string,
    data: Partial<Omit<NewCompanyProfile, "userId">>
  ): Promise<CompanyProfile | null> {
    try {
      // If setting as default, clear other default flags
      if (data.isDefault) {
        await this.clearDefaultProfileFlag(userId);
      }

      const result = await db
        .update(companyProfilesTable)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(companyProfilesTable.id, id),
            eq(companyProfilesTable.userId, userId)
          )
        )
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error updating company profile:", error);
      return null;
    }
  }

  // Delete a company profile
  async deleteCompanyProfile(id: string, userId: string): Promise<boolean> {
    try {
      // Check if this is the default profile
      const profile = await this.getCompanyProfile(id, userId);
      if (!profile) return false;

      // Don't allow deleting the default profile if it's the only one
      if (profile.isDefault) {
        const allProfiles = await this.getCompanyProfiles(userId);
        if (allProfiles.length <= 1) {
          return false;
        }
      }

      const result = await db
        .delete(companyProfilesTable)
        .where(
          and(
            eq(companyProfilesTable.id, id),
            eq(companyProfilesTable.userId, userId)
          )
        )
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting company profile:", error);
      return false;
    }
  }

  // Clear the default flag for all company profiles
  private async clearDefaultProfileFlag(userId: string): Promise<void> {
    try {
      await db
        .update(companyProfilesTable)
        .set({ isDefault: false })
        .where(eq(companyProfilesTable.userId, userId));
    } catch (error) {
      console.error("Error clearing default profile flag:", error);
    }
  }
}

export const companyProfileService = new CompanyProfileService();
