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
            .set({ status: 'RUNNING', currentAction: 'Continuing sync via cron job...' })
            .where(eq(gmailSyncJobs.id, job.id));
        }

        const accessToken = await GmailTokenService.getValidAccessToken(job.userId);
        if (!accessToken) {
          throw new Error('Gmail not connected or token invalid.');
        }

        let totalProcessed = job.cardsAdded || 0;
        let emailsFetched = job.processedCount || 0;
        let pageToken = job.nextPageToken;
        let pagesProcessed = 0;
        const maxPagesPerRun = 3; // Process max 3 pages per cron run

        while (pageToken && pagesProcessed < maxPagesPerRun) {
          await db.update(gmailSyncJobs).set({ 
            currentAction: `Processing emails (batch ${pagesProcessed + 1})...`
          }).where(eq(gmailSyncJobs.id, job.id));

          const result = await fetchEmails(5, undefined, undefined, accessToken, pageToken);
          const emails = result.emails;
          pageToken = result.nextPageToken || null;

          if (!emails || emails.length === 0) break;

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
              currentAction: `Processed ${emailsFetched} emails, ${totalProcessed} cards created.`
            })
            .where(eq(gmailSyncJobs.id, job.id));

          pagesProcessed++;
          
          // Small delay between pages
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
          await db.update(gmailSyncJobs).set({ 
            status: 'PENDING',
            currentAction: `Paused after processing ${pagesProcessed} batches. Will continue in next run.`,
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