# Transaction Attachments - Roadmap

> **Status**: Phase 1 ✅ | Phase 2 ✅ | Phase 2.2 ✅ | Phase 3 & 4 NOT STARTED
>
> **Last Updated**: December 2024

---

## Problem Statement

Quinn's request: "Ability to upload an attachment to a transaction I send, so that the invoice stays stored with the transaction in my history."

**Use case**: Compliance/tax purposes. When paying a contractor, attach the invoice received from them. Later, pull up the transaction and the invoice is right there.

**Mercury already does this** - it's table stakes for business banking.

---

## Current State (Updated Dec 2024)

### What's Implemented ✅

1. **Database Schema** - `packages/web/src/db/schema/transaction-attachments.ts`
   - Polymorphic attachment linking (invoice, offramp, crypto_incoming, crypto_outgoing, bank_receive)
   - Workspace scoping with proper indexes
   - Soft delete support
   - Upload source tracking (manual, ai_email, mcp)

2. **tRPC Router** - `packages/web/src/server/routers/attachments-router.ts`
   - `list` - Get attachments for a transaction
   - `create` - Create attachment record after blob upload
   - `delete` - Soft delete attachment
   - `get` - Get single attachment by ID

3. **Manual Upload UI** - `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/transaction-attachments.tsx`
   - File picker with upload
   - View/download attachments
   - Delete attachments

4. **AI Email Integration** - `packages/web/src/app/api/ai-email/route.ts`
   - `storeInvoiceAttachments()` function
   - Auto-stores PDF/image attachments when AI creates invoice from forwarded email

5. **Invoice Attachments Display** - `packages/web/src/components/invoice/invoice-attachments.tsx`
   - Read-only view for invoice detail pages
   - Shows "via email" badge for AI-uploaded attachments

6. **Invoice → Payment Linking** - `packages/web/src/lib/attachments/copy-attachments.ts`
   - `copyInvoiceAttachmentsToOfframp()` function
   - Integrated into `align-router.ts` offramp creation procedures
   - `linkedInvoiceId` field on `offrampTransfers` table

### What's NOT Implemented Yet

1. **UI for Invoice Payment Linking** - Frontend needs to pass `linkedInvoiceId` when creating offramp
2. **Smart Features** (Phase 3) - AI categorization, smart matching, bulk export
3. **MCP Integration** (Phase 4) - `attach_document` tool for AI agents

---

## Implementation Plan

### Phase 1: Foundation (MVP for Quinn)

**Goal**: Upload and view attachments on outgoing transactions

#### 1.1 Database Schema

```typescript
// packages/web/src/db/schema/transaction-attachments.ts

export const transactionAttachments = pgTable(
  'transaction_attachments',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Polymorphic link to any transaction type
    transactionType: text('transaction_type', {
      enum: [
        'offramp',
        'crypto_outgoing',
        'crypto_incoming',
        'bank_receive',
        'invoice',
      ],
    }).notNull(),
    transactionId: text('transaction_id').notNull(), // offramp ID, tx hash, or invoice ID

    // File storage
    blobUrl: text('blob_url').notNull(),
    filename: text('filename').notNull(),
    contentType: text('content_type').notNull(),
    fileSize: integer('file_size').notNull(),

    // Audit trail
    uploadedBy: text('uploaded_by').notNull(), // privy DID or 'system:ai-email'
    uploadSource: text('upload_source', {
      enum: ['manual', 'ai_email', 'mcp'],
    }).default('manual'),

    // Workspace scoping
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow(),
    deletedAt: timestamp('deleted_at'), // soft delete
  },
  (table) => ({
    txLookupIdx: index('tx_attachments_lookup_idx').on(
      table.transactionType,
      table.transactionId,
    ),
    workspaceIdx: index('tx_attachments_workspace_idx').on(table.workspaceId),
  }),
);
```

#### 1.2 Vercel Blob Store Setup

```bash
# Create blob store via CLI
vercel blob store add zero-finance-attachments --scope prologe --region iad1

# This generates BLOB_READ_WRITE_TOKEN - add to Vercel env vars
```

#### 1.3 Upload API Enhancement

```typescript
// packages/web/src/app/api/transactions/[id]/attachments/route.ts

export async function POST(req: NextRequest, { params }) {
  const userId = await getUserId();
  const workspaceId = await getWorkspaceId();
  const { id: transactionId } = params;
  const { transactionType } = await req.json(); // or from query

  const file = (await req.formData()).get('file') as File;

  // Validate ownership of transaction
  await validateTransactionOwnership(
    transactionId,
    transactionType,
    workspaceId,
  );

  // Upload to Vercel Blob with workspace-scoped path
  const blob = await put(
    `${workspaceId}/${transactionType}/${transactionId}/${file.name}`,
    file,
    {
      access: 'public', // or 'private' with signed URLs
      addRandomSuffix: true,
    },
  );

  // Store metadata
  await db.insert(transactionAttachments).values({
    transactionType,
    transactionId,
    blobUrl: blob.url,
    filename: file.name,
    contentType: file.type,
    fileSize: file.size,
    uploadedBy: userId,
    workspaceId,
  });

  return NextResponse.json({ url: blob.url, filename: file.name });
}

export async function GET(req: NextRequest, { params }) {
  // List attachments for a transaction
}

export async function DELETE(req: NextRequest, { params }) {
  // Soft delete attachment
}
```

#### 1.4 tRPC Router

```typescript
// packages/web/src/server/routers/attachments-router.ts

export const attachmentsRouter = router({
  upload: protectedProcedure
    .input(
      z.object({
        transactionType: z.enum([
          'offramp',
          'crypto_outgoing',
          'crypto_incoming',
          'bank_receive',
          'invoice',
        ]),
        transactionId: z.string(),
        // File handled separately via formData
      }),
    )
    .mutation(async ({ input, ctx }) => {
      /* ... */
    }),

  list: protectedProcedure
    .input(
      z.object({
        transactionType: z.string(),
        transactionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return db.query.transactionAttachments.findMany({
        where: and(
          eq(transactionAttachments.transactionType, input.transactionType),
          eq(transactionAttachments.transactionId, input.transactionId),
          eq(transactionAttachments.workspaceId, ctx.workspaceId),
          isNull(transactionAttachments.deletedAt),
        ),
      });
    }),

  delete: protectedProcedure
    .input(z.object({ attachmentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      /* soft delete */
    }),
});
```

#### 1.5 UI Changes

```typescript
// In unified-activity.tsx TransactionRow expanded view

// Add to AccordionContent:
<TransactionAttachments
  transactionType={tx.category === 'bank_send' ? 'offramp' : 'crypto_outgoing'}
  transactionId={tx.alignTransferId || tx.transactionHash}
/>

// New component:
function TransactionAttachments({ transactionType, transactionId }) {
  const { data: attachments } = trpc.attachments.list.useQuery({ transactionType, transactionId });
  const uploadMutation = trpc.attachments.upload.useMutation();

  return (
    <div className="border-t border-gray-200 mt-3 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] text-gray-500">Attachments</span>
        <label className="cursor-pointer text-[#1B29FF] text-[13px] hover:underline">
          <Paperclip className="h-3.5 w-3.5 inline mr-1" />
          Add file
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {attachments?.map(att => (
        <AttachmentRow key={att.id} attachment={att} />
      ))}
    </div>
  );
}
```

---

### Phase 2: AI Email Integration

**Goal**: Forwarded invoices automatically attach to created invoices

#### 2.1 Store Attachments in AI Email Flow

```typescript
// In /api/ai-email/route.ts, after invoice creation:

if (invoiceCreated && preparedAttachments.length > 0) {
  for (const attachment of preparedAttachments.filter((a) => a.supported)) {
    // Upload to Vercel Blob
    const fileBuffer = Buffer.from(attachment.base64Content!, 'base64');
    const blob = await put(
      `${workspaceId}/invoice/${invoiceId}/${attachment.filename}`,
      fileBuffer,
      { access: 'public', contentType: attachment.contentType },
    );

    // Store metadata
    await db.insert(transactionAttachments).values({
      transactionType: 'invoice',
      transactionId: invoiceId,
      blobUrl: blob.url,
      filename: attachment.filename,
      contentType: attachment.contentType,
      fileSize: fileBuffer.length,
      uploadedBy: 'system:ai-email',
      uploadSource: 'ai_email',
      workspaceId,
    });
  }

  console.log(
    `[AI Email] Stored ${preparedAttachments.length} attachments for invoice ${invoiceId}`,
  );
}
```

#### 2.2 Link Invoice Attachments to Payments ✅ IMPLEMENTED

When an invoice is paid (offramp created to pay it), attachments are automatically copied.

**Implementation Details:**

1. **Schema Change** - Added `linkedInvoiceId` to `offrampTransfers` table:

   ```typescript
   // packages/web/src/db/schema.ts
   linkedInvoiceId: text('linked_invoice_id').references(
     () => userRequestsTable.id,
     { onDelete: 'set null' },
   ),
   ```

2. **Utility Function** - `packages/web/src/lib/attachments/copy-attachments.ts`:

   ```typescript
   export async function copyInvoiceAttachmentsToOfframp(
     invoiceId: string,
     offrampId: string,
     workspaceId: string,
   ): Promise<number>;
   ```

3. **Integration** - Updated `align-router.ts` procedures:
   - `createOfframpTransferFromQuote` - accepts optional `linkedInvoiceId`
   - `createOfframpTransfer` - accepts optional `linkedInvoiceId` in both manual and saved bank account modes
   - Both procedures automatically copy attachments after offramp creation

**Usage:**

```typescript
// When creating an offramp to pay an invoice:
const result = await trpc.align.createOfframpTransferFromQuote.mutate({
  quoteId: '...',
  // ... other fields
  linkedInvoiceId: invoice.id, // Optional: links invoice attachments
});
```

---

### Phase 3: Smart Features

**Goal**: AI-powered organization and matching

#### 3.1 Auto-Categorization

```typescript
// Add to attachment schema:
category: text('category', {
  enum: ['invoice', 'receipt', 'contract', 'tax_document', 'other']
}),
extractedData: jsonb('extracted_data'), // AI-extracted invoice details

// On upload, run AI extraction:
const extractedData = await extractDocumentData(fileBuffer, contentType);
// Returns: { vendor, amount, date, invoiceNumber, ... }
```

#### 3.2 Smart Matching Suggestions

```typescript
// When viewing unattached transactions:
const suggestAttachments = async (transaction) => {
  // Find unlinked attachments with matching:
  // - Amount (within 5%)
  // - Date (within 7 days)
  // - Vendor name (fuzzy match)

  return db.query.transactionAttachments.findMany({
    where: and(
      isNull(transactionAttachments.transactionId), // orphaned
      // ... matching logic
    ),
  });
};
```

#### 3.3 Bulk Export for Tax Season

```typescript
// New endpoint: GET /api/attachments/export
// Returns ZIP of all attachments for date range with CSV manifest

export async function GET(req: NextRequest) {
  const { year } = parseSearchParams(req);

  const attachments = await db.query.transactionAttachments.findMany({
    where: and(
      eq(transactionAttachments.workspaceId, workspaceId),
      gte(transactionAttachments.createdAt, new Date(`${year}-01-01`)),
      lt(transactionAttachments.createdAt, new Date(`${year + 1}-01-01`)),
    ),
  });

  // Generate ZIP with folder structure:
  // /2024-attachments/
  //   /invoices/
  //   /receipts/
  //   manifest.csv
}
```

---

### Phase 4: MCP Integration (Lower Priority)

**Goal**: Allow AI agents to attach documents

```typescript
// Add to MCP tools:
{
  name: 'attach_document',
  description: 'Attach a document to a pending or completed transaction',
  inputSchema: {
    type: 'object',
    properties: {
      transaction_id: {
        type: 'string',
        description: 'The transaction ID (from list_proposals or transaction history)',
      },
      filename: {
        type: 'string',
        description: 'Name of the file',
      },
      content_base64: {
        type: 'string',
        description: 'Base64-encoded file content',
      },
      content_type: {
        type: 'string',
        description: 'MIME type (e.g., application/pdf, image/png)',
      },
    },
    required: ['transaction_id', 'filename', 'content_base64', 'content_type'],
  },
}
```

**Note**: Base64 encoding is inefficient for large files. Consider:

- Size limit (1MB for MCP uploads)
- Recommend AI email flow for larger documents

---

## Security Considerations

### Access Control

- Attachments scoped to workspace
- Only workspace members can view/upload
- Soft delete (retain for audit trail)

### Storage

- **Option A**: Public URLs (current) - Simple but URLs are guessable
- **Option B**: Signed URLs - More secure, URLs expire
- **Recommendation**: Start with public, add signed URLs in Phase 3

### File Validation

- Allowed types: PDF, images (PNG, JPG, WEBP), text
- Max size: 10MB per file
- Virus scanning: Consider adding in Phase 3

### Retention

- Keep attachments indefinitely (compliance requirement)
- Add `archivedAt` for old transactions
- Consider cold storage for attachments > 2 years old

---

## Metrics & Success Criteria

### Phase 1 Success

- [x] Users can upload attachments to outgoing transactions
- [x] Attachments visible in transaction detail view
- [x] Download works correctly
- [ ] Quinn confirms it meets his needs

### Phase 2 Success

- [x] Forwarded invoice PDFs auto-attach
- [x] Attachments visible on invoice detail pages
- [ ] Invoice → Payment linking works
- [x] No manual upload needed for email-created invoices

### Phase 3 Success

- [ ] AI categorization accuracy > 90%
- [ ] Smart matching suggestions used by > 50% of users
- [ ] Tax export used by > 20% of users in Q1

---

## Timeline Estimate

| Phase   | Effort   | Dependencies     |
| ------- | -------- | ---------------- |
| Phase 1 | 2-3 days | Blob store token |
| Phase 2 | 1-2 days | Phase 1          |
| Phase 3 | 3-5 days | Phase 2          |
| Phase 4 | 1 day    | Phase 1          |

**Recommended order**: Phase 1 → Phase 2 → Phase 4 → Phase 3

Phase 4 (MCP) is quick and useful for power users. Phase 3 (smart features) can wait until we have usage data.

---

## Open Questions

1. **Public vs signed URLs?** - Start public, add signed later?
2. **Storage limits?** - Per workspace? Total across all?
3. **File type restrictions?** - PDF/images only, or allow all?
4. **Retention policy?** - Forever? 7 years (tax compliance)?
5. **AI extraction on all uploads?** - Or only AI email attachments?

---

## Related Files

- `packages/web/src/app/api/upload/route.ts` - Existing upload route
- `packages/web/src/lib/ai-email/attachment-parser.ts` - AI email attachment handling
- `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/unified-activity.tsx` - Transaction history UI
- `packages/web/src/server/routers/safe-router.ts` - Transaction types
- `packages/web/src/app/api/mcp/route.ts` - MCP server
