export interface CompanyProfile {
  id: string;
  userId: string;
  businessName: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  taxRegistration?: string | null;
  registrationNumber?: string | null;
  industryType?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  logoUrl?: string | null;
  brandColor?: string | null;
  isDefault: boolean;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}
