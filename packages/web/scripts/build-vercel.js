#!/usr/bin/env node

// Vercel build script with memory optimizations
// Vercel limits: Hobby=3GB, Pro=8GB, Enterprise=12GB
// Use conservative limits to avoid OOM while maximizing available memory

const TIER_LIMITS = {
  hobby: 2560, // 2.5GB for Hobby tier (3GB total)
  pro: 7168, // 7GB for Pro tier (8GB total)
  enterprise: 10240, // 10GB for Enterprise tier (12GB total)
};

// Detect tier from environment or default to Pro for production
const isProduction = process.env.VERCEL_ENV === 'production';
const tier = process.env.VERCEL_TIER || (isProduction ? 'pro' : 'hobby');
const MEMORY_LIMIT = TIER_LIMITS[tier] || TIER_LIMITS.pro;

process.env.NODE_OPTIONS = `--max-old-space-size=${MEMORY_LIMIT}`;

const { spawn } = require('child_process');

console.log('Starting Vercel-optimized build process...');
console.log(`Detected tier: ${tier}`);
console.log(`Node memory limit set to ${MEMORY_LIMIT}MB`);

// First try migrations with timeout
console.log('Running database migrations...');
const migrateProcess = spawn('pnpm', ['db:migrate'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=1536', // 1.5GB for migrations
  },
});

let migrationCompleted = false;

// Set timeout for migrations
const migrationTimeout = setTimeout(() => {
  if (!migrationCompleted) {
    console.log('Migration taking too long, proceeding with build...');
    migrateProcess.kill('SIGTERM');
    startBuild();
  }
}, 90000); // 90 seconds timeout

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

function startBuild() {
  console.log('Starting Next.js build...');
  const buildProcess = spawn('pnpm', ['next', 'build'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: `--max-old-space-size=${MEMORY_LIMIT}`,
    },
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
