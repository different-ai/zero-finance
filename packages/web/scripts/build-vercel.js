#!/usr/bin/env node

// Vercel build script with memory optimizations
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

const { spawn } = require('child_process');

console.log('Starting Vercel-optimized build process...');
console.log('Node memory limit set to 4GB');

// First try migrations with timeout
console.log('Running database migrations...');
const migrateProcess = spawn('pnpm', ['db:migrate'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=2048', // Lower memory for migrations
  }
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
      NODE_OPTIONS: '--max-old-space-size=4096',
    }
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