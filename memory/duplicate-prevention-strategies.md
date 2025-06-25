# Duplicate Prevention Strategies for Email Processing

## Current State Analysis

### Existing Prevention Methods ✅
1. **Basic EmailId Check** (in `lib/store.ts`):
   - Uses `emailId` from `sourceDetails` to detect duplicates
   - Client-side prevention during sync process
   - Works for Gmail message IDs

2. **Database LogId Field** (in `db/schema.ts`):
   - `logId` field stores original source system ID
   - Used for linking back to source (Gmail Message ID, Stripe Event ID, etc.)

### Current Limitations ❌
- **No database-level constraints** - duplicates can slip through
- **Client-side only** - vulnerable if client state is reset
- **Single identifier dependency** - relies only on `emailId`
- **No content-based deduplication** - same email with different IDs could duplicate
- **No batch operation safeguards** - concurrent syncs could create duplicates

## Comprehensive Duplicate Prevention Strategies

### 1. Multi-Level Hash Strategy 🔥 **RECOMMENDED**

#### Primary Hash: Content-Based
```typescript
// Hash combination of: subject + sender + date + body_snippet
function generateContentHash(email: SimplifiedEmail): string {
  const content = [
    email.subject?.trim().toLowerCase() || '',
    email.from?.trim().toLowerCase() || '',
    email.date || '',
    email.textBody?.substring(0, 500).trim() || email.htmlBody?.substring(0, 500).trim() || ''
  ].join('|');
  
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}
```

#### Secondary Hash: Metadata-Based
```typescript
// Hash combination of: thread_id + message_id + timestamp
function generateMetadataHash(email: SimplifiedEmail): string {
  const metadata = [
    email.id || '',
    email.threadId || '',
    new Date(email.date || '').getTime().toString()
  ].join('|');
  
  return crypto.createHash('sha256').update(metadata).digest('hex').substring(0, 16);
}
```

### 2. Database Schema Enhancements

#### Add Composite Unique Constraints
```sql
-- Add new columns to inbox_cards table
ALTER TABLE inbox_cards ADD COLUMN content_hash VARCHAR(16);
ALTER TABLE inbox_cards ADD COLUMN metadata_hash VARCHAR(16);
ALTER TABLE inbox_cards ADD COLUMN source_message_id TEXT;

-- Create composite unique constraints
CREATE UNIQUE INDEX CONCURRENTLY inbox_cards_content_unique 
ON inbox_cards (user_id, content_hash) 
WHERE source_type = 'email';

CREATE UNIQUE INDEX CONCURRENTLY inbox_cards_metadata_unique 
ON inbox_cards (user_id, metadata_hash, source_type);

CREATE UNIQUE INDEX CONCURRENTLY inbox_cards_source_message_unique 
ON inbox_cards (user_id, source_message_id, source_type) 
WHERE source_message_id IS NOT NULL;
```

### 3. Enhanced Email Processor with Multi-Hash Validation

```typescript
// Enhanced duplicate detection in email-processor.ts
async function isDuplicateEmail(
  email: SimplifiedEmail, 
  userId: string
): Promise<boolean> {
  const contentHash = generateContentHash(email);
  const metadataHash = generateMetadataHash(email);
  
  // Check database for any matching hashes
  const existingCard = await db.query.inboxCards.findFirst({
    where: and(
      eq(inboxCards.userId, userId),
      or(
        eq(inboxCards.contentHash, contentHash),
        eq(inboxCards.metadataHash, metadataHash),
        eq(inboxCards.sourceMessageId, email.id)
      )
    )
  });
  
  return !!existingCard;
}
```

### 4. Transaction-Safe Batch Processing

```typescript
// Atomic batch insertion with conflict resolution
async function insertCardsAtomically(
  newCards: InboxCard[], 
  userId: string
): Promise<{ inserted: number, skipped: number }> {
  const results = { inserted: 0, skipped: 0 };
  
  await db.transaction(async (tx) => {
    for (const card of newCards) {
      try {
        await tx.insert(inboxCards).values({
          ...card,
          userId,
          contentHash: generateContentHash(card.sourceDetails),
          metadataHash: generateMetadataHash(card.sourceDetails),
          sourceMessageId: card.logId
        });
        results.inserted++;
      } catch (error) {
        // Handle unique constraint violations gracefully
        if (error.code === '23505') { // PostgreSQL unique violation
          console.log(`Skipping duplicate card: ${card.title}`);
          results.skipped++;
        } else {
          throw error;
        }
      }
    }
  });
  
  return results;
}
```

### 5. Time-Based Deduplication Window

```typescript
// Prevent processing same email multiple times within time window
interface ProcessingLock {
  emailId: string;
  processedAt: Date;
  expiresAt: Date;
}

const processingLocks = new Map<string, ProcessingLock>();

function isRecentlyProcessed(emailId: string, windowMinutes = 30): boolean {
  const lock = processingLocks.get(emailId);
  if (!lock) return false;
  
  if (new Date() > lock.expiresAt) {
    processingLocks.delete(emailId);
    return false;
  }
  
  return true;
}

function markAsProcessing(emailId: string, windowMinutes = 30): void {
  const now = new Date();
  processingLocks.set(emailId, {
    emailId,
    processedAt: now,
    expiresAt: new Date(now.getTime() + windowMinutes * 60 * 1000)
  });
}
```

### 6. Fuzzy Content Matching for Near-Duplicates

```typescript
// Detect emails with minor variations (forwards, replies, etc.)
import { distance } from 'fastest-levenshtein';

function calculateContentSimilarity(email1: SimplifiedEmail, email2: SimplifiedEmail): number {
  const content1 = `${email1.subject} ${email1.textBody?.substring(0, 1000)}`.toLowerCase().trim();
  const content2 = `${email2.subject} ${email2.textBody?.substring(0, 1000)}`.toLowerCase().trim();
  
  const maxLength = Math.max(content1.length, content2.length);
  if (maxLength === 0) return 1;
  
  const editDistance = distance(content1, content2);
  return 1 - (editDistance / maxLength);
}

async function checkFuzzyDuplicates(
  email: SimplifiedEmail, 
  userId: string,
  threshold = 0.85
): Promise<boolean> {
  // Get recent cards from same sender
  const recentCards = await db.query.inboxCards.findMany({
    where: and(
      eq(inboxCards.userId, userId),
      eq(inboxCards.sourceType, 'email'),
      gte(inboxCards.timestamp, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // 7 days
    ),
    limit: 100
  });
  
  for (const card of recentCards) {
    const cardEmail = card.sourceDetails as any;
    if (cardEmail.fromAddress === email.from) {
      const similarity = calculateContentSimilarity(email, cardEmail);
      if (similarity > threshold) {
        console.log(`Fuzzy duplicate detected: ${similarity} similarity`);
        return true;
      }
    }
  }
  
  return false;
}
```

### 7. Configuration-Based Duplicate Strategy

```typescript
interface DuplicationConfig {
  enableContentHashing: boolean;
  enableMetadataHashing: boolean;
  enableFuzzyMatching: boolean;
  fuzzyThreshold: number;
  timeWindowMinutes: number;
  strictMode: boolean; // Reject any potential duplicate vs. merge
}

const defaultConfig: DuplicationConfig = {
  enableContentHashing: true,
  enableMetadataHashing: true,
  enableFuzzyMatching: true,
  fuzzyThreshold: 0.85,
  timeWindowMinutes: 30,
  strictMode: true
};
```

### 8. Audit Trail for Duplicate Detection

```typescript
// Track all duplicate detection events
export const duplicateDetectionLog = pgTable('duplicate_detection_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  emailId: text('email_id').notNull(),
  detectionMethod: text('detection_method').notNull(), // 'content_hash', 'metadata_hash', 'fuzzy', etc.
  originalCardId: text('original_card_id'),
  similarity: real('similarity'),
  action: text('action').notNull(), // 'skipped', 'merged', 'flagged'
  createdAt: timestamp('created_at').defaultNow().notNull()
});
```

## Implementation Priority

### Phase 1: Critical (Week 1) 🚨
1. **Database constraints** - Add unique indexes
2. **Content hashing** - Implement primary hash strategy
3. **Transaction safety** - Atomic insertion with conflict handling

### Phase 2: Enhanced (Week 2) 📈
1. **Metadata hashing** - Secondary hash validation
2. **Time-based locks** - Processing window protection
3. **Improved error handling** - Better duplicate resolution

### Phase 3: Advanced (Week 3) 🔬
1. **Fuzzy matching** - Near-duplicate detection
2. **Audit logging** - Track all duplicate events
3. **Configuration system** - Flexible duplicate rules

## Monitoring & Alerting

```typescript
// Metrics to track
interface DuplicateMetrics {
  totalEmailsProcessed: number;
  duplicatesDetectedByMethod: Record<string, number>;
  duplicateRate: number; // percentage
  processingErrors: number;
  averageProcessingTime: number;
}

// Alert thresholds
const ALERT_THRESHOLDS = {
  duplicateRateHigh: 15, // > 15% duplicates
  processingErrorsHigh: 5, // > 5 errors per hour
  processingTimeSlow: 10000 // > 10 seconds per email
};
```

## Testing Strategy

1. **Unit tests** for hash generation functions
2. **Integration tests** for database constraints
3. **Load tests** with concurrent sync operations
4. **Edge case tests** for malformed emails
5. **Performance tests** for large email batches

This comprehensive strategy should virtually eliminate duplicate emails while maintaining performance and providing detailed insights into the deduplication process. 