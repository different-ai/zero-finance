import { NextRequest, NextResponse } from "next/server";
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { companyProfilesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
    // Authenticate the user
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get company profiles for the user
    const companyProfiles = await db
      .select()
      .from(companyProfilesTable)
      .where(eq(companyProfilesTable.userId, userId));

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
    // Authenticate the user
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { name, email, address } = body;
    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Create company profile
    const [companyProfile] = await db
      .insert(companyProfilesTable)
      .values({
        userId,
        name,
        email: email || null,
        address: address || null,
        logo: body.logo || null,
        website: body.website || null,
        taxId: body.taxId || null,
        vatNumber: body.vatNumber || null,
        registrationNumber: body.registrationNumber || null,
        phoneNumber: body.phoneNumber || null,
        notes: body.notes || null,
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
