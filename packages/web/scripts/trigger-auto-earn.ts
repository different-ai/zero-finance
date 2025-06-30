#!/usr/bin/env tsx
/**
 * Manual trigger for auto-earn sweep
 * Usage: pnpm tsx scripts/trigger-auto-earn.ts
 * 
 * This runs the same logic as the cron job would
 */

// Simply import and run the worker
import './auto-earn-worker'; 