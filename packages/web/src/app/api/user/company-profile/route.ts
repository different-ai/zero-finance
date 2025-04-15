import { NextRequest, NextResponse } from "next/server";
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { companyProfilesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { userProfilesTable } from '@/db/schema';

import { z } from "zod";
import { companyProfileService } from "../../../../lib/company-profile-service";
import { userProfileService } from "../../../../lib/user-profile-service";

// Schema for validating company profile data
const companyProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  taxRegistration: z.string().optional().nullable(),
  registrationNumber: z.string().optional().nullable(),
  industryType: z.string().optional().nullable(),
  streetAddress: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  brandColor: z.string().optional().nullable(),
  isDefault: z.boolean().default(false),
  metadata: z.record(z.any()).optional().nullable(),
});
// // export default async function Page({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = await params
//   return <div>My Post: {slug}</div>
// }

// GET: Get all company profiles
export async function GET(req: NextRequest) {
  try {
    // Authenticate the user and get Privy DID
    const privyDid = await getUserId();
    if (!privyDid) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find the user profile using the Privy DID (stored in clerkId column)
    const userProfileResult = await db
      .select({ id: userProfilesTable.id })
      .from(userProfilesTable)
      .where(eq(userProfilesTable.clerkId, privyDid))
      .limit(1);

    if (userProfileResult.length === 0) {
        console.error(`User profile not found for Privy DID: ${privyDid}`);
        return NextResponse.json(
            { error: 'User profile not found' },
            { status: 404 }
        );
    }

    const userProfileId = userProfileResult[0].id; // This is the UUID

    // Get company profiles for the user using the user profile UUID
    const companyProfiles = await db
      .select()
      .from(companyProfilesTable)
      .where(eq(companyProfilesTable.userId, userProfileId)); // Use the correct UUID

    return NextResponse.json({ companyProfiles });
  } catch (error) {
    console.error('Error getting company profiles:', error);
    return NextResponse.json(
      { error: 'Failed to get company profiles' },
      { status: 500 }
    );
  }
}

// POST: Create a new company profile
export async function POST(req: NextRequest) {
  try {
    // Authenticate the user and get Privy DID
    const privyDid = await getUserId();
    if (!privyDid) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find the user profile using the Privy DID (stored in clerkId column)
    const userProfileResult = await db
      .select({ id: userProfilesTable.id })
      .from(userProfilesTable)
      .where(eq(userProfilesTable.clerkId, privyDid))
      .limit(1);

    if (userProfileResult.length === 0) {
      console.error(`User profile not found for Privy DID: ${privyDid}`);
      return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
      );
    }

    const userProfileId = userProfileResult[0].id; // This is the UUID

    // Parse the request body
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Validate required fields (using the correct schema property name)
    const { businessName, email, address, logo, website, taxId, registrationNumber, phoneNumber } = body;
    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    // Create company profile using correct schema columns and the userProfileId
    const [companyProfile] = await db
      .insert(companyProfilesTable)
      .values({
        userId: userProfileId, // Use the fetched UUID
        businessName, // Corrected from 'name'
        email: email || null,
        streetAddress: address || null, // Mapped 'address' to 'streetAddress'
        logoUrl: logo || null, // Corrected from 'logo'
        website: website || null,
        taxRegistration: taxId || null, // Mapped 'taxId' to 'taxRegistration'
        registrationNumber: registrationNumber || null,
        phone: phoneNumber || null, // Corrected from 'phoneNumber'
        // Omitted vatNumber, notes as they are not in the schema
      })
      .returning();

    return NextResponse.json({ companyProfile });
  } catch (error) {
    console.error('Error creating company profile:', error);
    return NextResponse.json(
      { error: 'Failed to create company profile' },
      { status: 500 }
    );
  }
}
