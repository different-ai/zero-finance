import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getUserId } from '@/lib/auth';

/**
 * Max file size: 10MB
 */
const MAX_SIZE = 10 * 1024 * 1024;

/**
 * Allowed content types for transaction attachments
 */
const ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'text/plain',
];

/**
 * POST /api/upload
 *
 * Upload a file to Vercel Blob storage.
 *
 * Query params (optional):
 * - transactionType: Type of transaction (offramp, crypto_outgoing, etc.)
 * - transactionId: ID of the transaction
 *
 * Returns: { url, filename, contentType, fileSize }
 */
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the file from the request
    const data = await req.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 },
      );
    }

    // Get optional transaction context from query params
    const { searchParams } = new URL(req.url);
    const transactionType = searchParams.get('transactionType');
    const transactionId = searchParams.get('transactionId');

    // Validate content type for transaction attachments
    if (transactionType && transactionId) {
      if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `File type not allowed. Allowed: PDF, images, text files.`,
          },
          { status: 400 },
        );
      }
    }

    // Build storage path with user context
    // Workspace scoping is handled at the tRPC layer when creating attachment records
    const storagePath =
      transactionType && transactionId
        ? `attachments/${transactionType}/${transactionId}/${file.name}`
        : `uploads/${userId}/${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(storagePath, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    console.log(
      `[Upload] File uploaded: ${file.name} (${file.size} bytes) -> ${blob.url}`,
    );

    // Return full metadata for client to use with tRPC create
    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      contentType: file.type,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('[Upload] Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 },
    );
  }
}
