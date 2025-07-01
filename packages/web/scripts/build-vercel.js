#!/usr/bin/env node

// Vercel build script with memory and speed optimizations
process.env.NODE_OPTIONS = '--max-old-space-size=6144'; // Increased for faster builds

const { spawn } = require('child_process');

console.log('Starting optimized Vercel build process...');
console.log('Node memory limit set to 6GB for faster compilation');

// Skip migrations in preview deployments for faster builds
const isPreview = process.env.VERCEL_ENV === 'preview';
const skipMigrations = process.env.SKIP_BUILD_MIGRATIONS === 'true' || isPreview;

if (skipMigrations) {
  console.log('Skipping migrations for preview deployment - starting build directly...');
  startBuild();
} else {
  // Run migrations with timeout for production builds
  console.log('Running database migrations...');
  const migrateProcess = spawn('pnpm', ['db:migrate'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=2048', // Lower memory for migrations
    }
  });

  let migrationCompleted = false;

  // Set timeout for migrations (reduced from 90s to 60s)
  const migrationTimeout = setTimeout(() => {
    if (!migrationCompleted) {
      console.log('Migration taking too long, proceeding with build...');
      migrateProcess.kill('SIGTERM');
      startBuild();
    }
  }, 60000); // 60 seconds timeout

  migrateProcess.on('close', (code) => {
    migrationCompleted = true;
    clearTimeout(migrationTimeout);
    
    if (code === 0) {
      console.log('Migrations completed successfully');
    } else {
      console.log('Migrations failed, but proceeding with build...');
    }
    startBuild();
  });

  migrateProcess.on('error', (err) => {
    migrationCompleted = true;
    clearTimeout(migrationTimeout);
    console.log('Migration error:', err.message);
    console.log('Proceeding with build...');
    startBuild();
  });
}

function startBuild() {
  console.log('Starting optimized Next.js build...');
  
  const buildEnv = {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=6144',
    // Optimize for build speed
    NEXT_TELEMETRY_DISABLED: '1',
    // Skip type checking in build - we do it separately
    SKIP_TYPE_CHECK: process.env.VERCEL_ENV === 'preview' ? 'true' : 'false',
  };

  const buildProcess = spawn('pnpm', ['next', 'build'], {
    stdio: 'inherit',
    env: buildEnv
  });

  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Build completed successfully');
      process.exit(0);
    } else {
      console.error('Build failed with code:', code);
      process.exit(code);
    }
  });

  buildProcess.on('error', (err) => {
    console.error('Build error:', err.message);
    process.exit(1);
  });
} 