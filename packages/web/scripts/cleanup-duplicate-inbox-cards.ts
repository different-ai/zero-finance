import { db } from '@/db';
import { inboxCards } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function cleanupDuplicateInboxCards() {
  console.log('Starting duplicate inbox cards cleanup...');
  
  try {
    // Get all users with inbox cards
    const usersWithCards = await db
      .selectDistinct({ userId: inboxCards.userId })
      .from(inboxCards);
    
    console.log(`Found ${usersWithCards.length} users with inbox cards`);
    
    let totalDuplicatesRemoved = 0;
    
    for (const { userId } of usersWithCards) {
      console.log(`\nProcessing user: ${userId}`);
      
      // Get all cards for this user, ordered by timestamp (newest first)
      const userCards = await db
        .select()
        .from(inboxCards)
        .where(eq(inboxCards.userId, userId))
        .orderBy(desc(inboxCards.timestamp));
      
      console.log(`  Found ${userCards.length} total cards`);
      
      // Group cards by logId (email ID)
      const cardsByLogId = new Map<string, typeof userCards>();
      
      for (const card of userCards) {
        const logId = card.logId;
        if (!cardsByLogId.has(logId)) {
          cardsByLogId.set(logId, []);
        }
        cardsByLogId.get(logId)!.push(card);
      }
      
      // Find and remove duplicates
      const duplicateIds: string[] = [];
      
      for (const [logId, cards] of cardsByLogId) {
        if (cards.length > 1) {
          console.log(`  Found ${cards.length} cards for email ${logId}`);
          
          // Keep the newest card (first in the array since we ordered by timestamp desc)
          const [keepCard, ...duplicates] = cards;
          
          console.log(`    Keeping card: ${keepCard.id} (created: ${keepCard.createdAt})`);
          
          for (const duplicate of duplicates) {
            console.log(`    Removing duplicate: ${duplicate.id} (created: ${duplicate.createdAt})`);
            duplicateIds.push(duplicate.id);
          }
        }
      }
      
      // Also check for cards with identical subjects from the same sender within a short time window
      const cardsByContent = new Map<string, typeof userCards>();
      
      for (const card of userCards) {
        const sourceDetails = card.sourceDetails as any;
        if (!sourceDetails) continue;
        
        // Create a key based on normalized subject and sender
        const normalizedSubject = (sourceDetails.subject || '')
          .toLowerCase()
          .replace(/^(re:|fwd?:|fw:)\s*/gi, '')
          .trim();
        const sender = (sourceDetails.fromAddress || '').toLowerCase();
        const contentKey = `${sender}|${normalizedSubject}`;
        
        if (!cardsByContent.has(contentKey)) {
          cardsByContent.set(contentKey, []);
        }
        cardsByContent.get(contentKey)!.push(card);
      }
      
      // Find near-duplicates (same content within 1 hour)
      for (const [contentKey, cards] of cardsByContent) {
        if (cards.length > 1) {
          // Sort by timestamp to keep the oldest
          const sortedCards = cards.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
          for (let i = 1; i < sortedCards.length; i++) {
            const prevCard = sortedCards[i - 1];
            const currCard = sortedCards[i];
            
            const timeDiff = new Date(currCard.timestamp).getTime() - 
                            new Date(prevCard.timestamp).getTime();
            
            // If cards are within 1 hour of each other, consider them duplicates
            if (timeDiff < 60 * 60 * 1000 && !duplicateIds.includes(currCard.id)) {
              console.log(`  Found near-duplicate: ${currCard.id} (within 1 hour of ${prevCard.id})`);
              duplicateIds.push(currCard.id);
            }
          }
        }
      }
      
      // Remove duplicates
      if (duplicateIds.length > 0) {
        await db
          .delete(inboxCards)
          .where(
            and(
              eq(inboxCards.userId, userId),
              sql`${inboxCards.id} IN (${sql.join(duplicateIds.map(id => sql`${id}`), sql`, `)})`
            )
          );
        
        console.log(`  Removed ${duplicateIds.length} duplicate cards`);
        totalDuplicatesRemoved += duplicateIds.length;
      } else {
        console.log(`  No duplicates found`);
      }
    }
    
    console.log(`\nCleanup complete! Removed ${totalDuplicatesRemoved} duplicate cards total.`);
    
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the cleanup
cleanupDuplicateInboxCards(); 