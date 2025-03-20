export interface CompanyProfile {
  id?: string;
  userId: string;
  businessName: string;
  email?: string;
  phone?: string;
  website?: string;
  taxRegistration?: string;
  registrationNumber?: string;
  industryType?: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  logoUrl?: string;
  brandColor?: string;
  isDefault: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompanyProfileFormData {
  businessName: string;
  email: string;
  phone: string;
  website: string;
  taxRegistration: string;
  registrationNumber: string;
  industryType: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  logoUrl: string;
  brandColor: string;
  isDefault: boolean;
}
