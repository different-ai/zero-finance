'use server';

import { companyProfileService } from "@/lib/company-profile-service";
import { CompanyProfile } from "@/db/schema";
import { getAuthUserId } from "@/lib/auth";

// A server action to get the default company profile for the current user
export async function getDefaultCompanyProfile(): Promise<CompanyProfile | null> {
  try {
    // Get the current authenticated user
    const userId = await getAuthUserId();
    
    // If no user is authenticated, return null
    if (!userId) {
      console.error("No authenticated user found when getting default company profile");
      return null;
    }
    
    // Get the default company profile for the user
    const defaultProfile = await companyProfileService.getDefaultCompanyProfile(userId);
    return defaultProfile;
  } catch (error) {
    console.error("Error getting default company profile:", error);
    return null;
  }
}

/**
 * Retrieves all company profiles associated with the current user.
 */
async function getUserCompanyProfiles(): Promise<CompanyProfile[]> {
  try {
    // Get the current authenticated user
    const userId = await getAuthUserId();
    
    // If no user is authenticated, return empty array
    if (!userId) {
      console.error("No authenticated user found when getting company profiles");
      return [];
    }
    
    // Get all company profiles for the user
    const profiles = await companyProfileService.getCompanyProfiles(userId);
    return profiles;
  } catch (error) {
    console.error("Error getting company profiles:", error);
    return [];
  }
} 