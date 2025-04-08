import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/db";
import { companyProfilesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { companyProfileService } from "../../../../../lib/company-profile-service";
import { userProfileService } from "../../../../../lib/user-profile-service";

// Schema for validating company profile updates
const companyProfileUpdateSchema = z.object({
  businessName: z.string().min(1, "Business name is required").optional(),
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
  isDefault: z.boolean().optional(),
  metadata: z.record(z.any()).optional().nullable(),
});

// correct to do params
// export default async function Page({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = await params
//   return <div>My Post: {slug}</div>
// }

// GET: Get a specific company profile
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate the user
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the company profile
    const companyProfile = await db
      .select()
      .from(companyProfilesTable)
      .where(
        and(
          eq(companyProfilesTable.id, params.id),
          eq(companyProfilesTable.userId, userId)
        )
      )
      .limit(1);

    if (companyProfile.length === 0) {
      return NextResponse.json(
        { error: 'Company profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ companyProfile: companyProfile[0] });
  } catch (error) {
    console.error('Error getting company profile:', error);
    return NextResponse.json(
      { error: 'Failed to get company profile' },
      { status: 500 }
    );
  }
}

// PUT: Update a specific company profile
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate the user
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get company profile to verify ownership
    const existingProfile = await db
      .select()
      .from(companyProfilesTable)
      .where(
        and(
          eq(companyProfilesTable.id, params.id),
          eq(companyProfilesTable.userId, userId)
        )
      )
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json(
        { error: 'Company profile not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Update fields that were provided
    const updates: any = { updatedAt: new Date() };
    
    // Only include fields that were provided in the request
    if (body.name !== undefined) updates.name = body.name;
    if (body.email !== undefined) updates.email = body.email;
    if (body.address !== undefined) updates.address = body.address;
    if (body.logo !== undefined) updates.logo = body.logo;
    if (body.website !== undefined) updates.website = body.website;
    if (body.taxId !== undefined) updates.taxId = body.taxId;
    if (body.vatNumber !== undefined) updates.vatNumber = body.vatNumber;
    if (body.registrationNumber !== undefined) updates.registrationNumber = body.registrationNumber;
    if (body.phoneNumber !== undefined) updates.phoneNumber = body.phoneNumber;
    if (body.notes !== undefined) updates.notes = body.notes;

    // Update the company profile
    const [updatedProfile] = await db
      .update(companyProfilesTable)
      .set(updates)
      .where(eq(companyProfilesTable.id, params.id))
      .returning();

    return NextResponse.json({ companyProfile: updatedProfile });
  } catch (error) {
    console.error('Error updating company profile:', error);
    return NextResponse.json(
      { error: 'Failed to update company profile' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific company profile
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate the user
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify the company profile belongs to the user
    const existingProfile = await db
      .select()
      .from(companyProfilesTable)
      .where(
        and(
          eq(companyProfilesTable.id, params.id),
          eq(companyProfilesTable.userId, userId)
        )
      )
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json(
        { error: 'Company profile not found' },
        { status: 404 }
      );
    }

    // Delete the company profile
    await db
      .delete(companyProfilesTable)
      .where(eq(companyProfilesTable.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting company profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete company profile' },
      { status: 500 }
    );
  }
}
