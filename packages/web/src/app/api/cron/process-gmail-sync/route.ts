import { NextResponse } from 'next/server';
import { db } from '@/db';
import { gmailSyncJobs, inboxCards } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { fetchEmails } from '@/server/services/gmail-service';
import { processEmailsToInboxCards } from '@/server/services/email-processor';
import { GmailTokenService } from '@/server/services/gmail-token-service';
import { v4 as uuidv4 } from 'uuid';
import type { InboxCard } from '@/types/inbox';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for Pro plan, adjust based on your plan

// Progressive batch sizes: 1, 2, 4, 8, 10, 10...
function getNextBatchSize(currentProcessedCount: number): number {
  if (currentProcessedCount === 0) return 1;
  if (currentProcessedCount === 1) return 2;
  if (currentProcessedCount === 3) return 4;
  if (currentProcessedCount === 7) return 8;
  return 10; // Max batch size
}

export async function GET(request: Request) {
  // Verify this is being called by Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find jobs that need processing
    const pendingJobs = await db.query.gmailSyncJobs.findMany({
      where: and(
        or(
          eq(gmailSyncJobs.status, 'PENDING'),
          eq(gmailSyncJobs.status, 'RUNNING')
        ),
        // Only process jobs that have a nextPageToken (continuation jobs)
        // or are in PENDING status with startedAt set
        // This avoids picking up freshly created jobs that haven't been initialized
      ),
      limit: 5, // Process max 5 jobs per cron run
    });

    const results = [];

    for (const job of pendingJobs) {
      try {
        // Skip if job was just created (no startedAt means it hasn't been initialized)
        if (!job.startedAt) {
          continue;
        }

        // Update job to RUNNING if it was PENDING
        if (job.status === 'PENDING' && job.nextPageToken) {
          await db.update(gmailSyncJobs)
            .set({ status: 'RUNNING', currentAction: 'Continuing sync...' })
            .where(eq(gmailSyncJobs.id, job.id));
        }

        const accessToken = await GmailTokenService.getValidAccessToken(job.userId);
        if (!accessToken) {
          throw new Error('Gmail not connected or token invalid.');
        }

        let totalProcessed = job.cardsAdded || 0;
        let emailsFetched = job.processedCount || 0;
        let pageToken = job.nextPageToken;
        let batchesProcessed = 0;
        const maxBatchesPerRun = 3; // Process max 3 batches per cron run

        while (pageToken && batchesProcessed < maxBatchesPerRun) {
          // Calculate dynamic batch size based on how many emails we've already processed
          const batchSize = getNextBatchSize(emailsFetched);
          
          await db.update(gmailSyncJobs).set({ 
            currentAction: `Fetching next ${batchSize} email${batchSize > 1 ? 's' : ''}...`
          }).where(eq(gmailSyncJobs.id, job.id));

          const result = await fetchEmails(batchSize, undefined, undefined, accessToken, pageToken);
          const emails = result.emails;
          pageToken = result.nextPageToken || null;

          if (!emails || emails.length === 0) break;

          await db.update(gmailSyncJobs).set({ 
            currentAction: `Processing ${emails.length} email${emails.length > 1 ? 's' : ''} with AI...`
          }).where(eq(gmailSyncJobs.id, job.id));

          emailsFetched += emails.length;
          const processedCards = await processEmailsToInboxCards(emails, job.userId);

          if (processedCards.length > 0) {
            const newDbCards = processedCards.map(card => ({
              ...card,
              id: uuidv4(),
              cardId: card.id,
              userId: job.userId,
              subjectHash: card.subjectHash,
              impact: card.impact || {},
              chainOfThought: card.chainOfThought || [],
              comments: card.comments || [],
              timestamp: new Date(card.timestamp),
            }));

            await db.insert(inboxCards).values(newDbCards).onConflictDoNothing({ target: inboxCards.cardId });
            totalProcessed += processedCards.length;
          }

          await db.update(gmailSyncJobs)
            .set({ 
              cardsAdded: totalProcessed,
              processedCount: emailsFetched,
              nextPageToken: pageToken || null,
              currentAction: `Processed ${emailsFetched} emails total, ${totalProcessed} cards created. ${pageToken ? 'Fetching more...' : 'Almost done...'}`
            })
            .where(eq(gmailSyncJobs.id, job.id));

          batchesProcessed++;
          
          // Small delay between batches
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // If no more pages or we hit the limit, update status
        if (!pageToken) {
          await db.update(gmailSyncJobs).set({ 
            status: 'COMPLETED', 
            finishedAt: new Date(),
            currentAction: null,
          }).where(eq(gmailSyncJobs.id, job.id));
          
          results.push({ jobId: job.id, status: 'completed', processed: emailsFetched });
        } else {
          // Still more to process, leave as PENDING
          const nextBatchSize = getNextBatchSize(emailsFetched);
          await db.update(gmailSyncJobs).set({ 
            status: 'PENDING',
            currentAction: `Processed ${emailsFetched} emails so far. Next batch: ${nextBatchSize} emails.`,
          }).where(eq(gmailSyncJobs.id, job.id));
          
          results.push({ jobId: job.id, status: 'partial', processed: emailsFetched });
        }

      } catch (error: any) {
        console.error(`Error processing job ${job.id}:`, error);
        await db.update(gmailSyncJobs).set({ 
          status: 'FAILED', 
          finishedAt: new Date(),
          error: error.message || 'Unknown error',
          currentAction: null,
        }).where(eq(gmailSyncJobs.id, job.id));
        
        results.push({ jobId: job.id, status: 'failed', error: error.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      processedJobs: results.length,
      results 
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 