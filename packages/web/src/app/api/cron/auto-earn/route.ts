import { NextResponse, type NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Helper to validate the cron key (to protect endpoint from unauthorized access)
function validateCronKey(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    console.warn('[auto-earn-cron] No authorization header provided');
    return false;
  }
  
  // In production, use a more secure validation method with a strong secret key
  // For development, accept any non-empty key
  return process.env.NODE_ENV === 'development' || authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req: NextRequest) {
  // Validate cron key for security (except in development)
  if (process.env.NODE_ENV !== 'development' && !validateCronKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[auto-earn-cron] Starting auto-earn worker execution...');
    
    // Get the path to the worker script
    const workerPath = path.join(process.cwd(), 'scripts', 'auto-earn-worker.ts');
    
    // Execute the auto-earn worker script using npx tsx directly
    // This is more reliable in cron environments where pnpm might not be in PATH
    const { stdout, stderr } = await execAsync(`npx tsx ${workerPath}`, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        // Ensure PATH includes common node binary locations
        PATH: `/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ''}`
      },
    });
    
    if (stderr) {
      console.error('[auto-earn-cron] Worker stderr:', stderr);
    }
    
    console.log('[auto-earn-cron] Worker stdout:', stdout);
    
    return NextResponse.json({
      success: true,
      message: 'Auto-earn worker executed successfully',
      output: stdout,
    });
  } catch (error) {
    console.error('[auto-earn-cron] Failed to execute auto-earn worker:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute auto-earn worker',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 