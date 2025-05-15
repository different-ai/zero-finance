import { GET as autoEarnTick } from '../auto-earn-tick/route';

// Re-export the same GET handler so that the cron scheduler can
// invoke the task at `/api/cron` (see `vercel.json`).
export const GET = autoEarnTick; 