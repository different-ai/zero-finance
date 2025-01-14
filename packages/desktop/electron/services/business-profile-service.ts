import { app } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

// Schema for business profile
export const businessProfileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Must be a valid email'),
  phone: z.string().optional(),
  taxRegistration: z.string().optional(),
  companyRegistration: z.string().optional(),
  address: z.object({
    'street-address': z.string().optional(),
    locality: z.string().optional(),
    region: z.string().optional(),
    'postal-code': z.string().optional(),
    'country-name': z.string().optional(),
  }).optional(),
  miscellaneous: z.record(z.unknown()).optional(),
});

export type BusinessProfile = z.infer<typeof businessProfileSchema>;

export class BusinessProfileService {
  private static PROFILE_PATH = path.join(app.getPath('userData'), 'business-profile.json');
  private profile: BusinessProfile | null = null;

  async initialize() {
    try {
      const data = await fs.readFile(BusinessProfileService.PROFILE_PATH, 'utf-8');
      this.profile = businessProfileSchema.parse(JSON.parse(data));
      return true;
    } catch (error) {
      console.log('0xHypr', 'No existing profile found or invalid:', error);
      return false;
    }
  }

  async getProfile(): Promise<BusinessProfile | null> {
    if (!this.profile) {
      await this.initialize();
    }
    return this.profile;
  }

  async saveProfile(profile: BusinessProfile): Promise<void> {
    // Validate profile data
    const validatedProfile = businessProfileSchema.parse(profile);
    
    // Save to file
    await fs.writeFile(
      BusinessProfileService.PROFILE_PATH,
      JSON.stringify(validatedProfile, null, 2),
      'utf-8'
    );
    
    this.profile = validatedProfile;
  }

  async hasProfile(): Promise<boolean> {
    try {
      await fs.access(BusinessProfileService.PROFILE_PATH);
      return true;
    } catch {
      return false;
    }
  }

  async deleteProfile(): Promise<void> {
    try {
      await fs.unlink(BusinessProfileService.PROFILE_PATH);
      this.profile = null;
    } catch (error) {
      console.error('0xHypr', 'Error deleting profile:', error);
      throw error;
    }
  }
} 