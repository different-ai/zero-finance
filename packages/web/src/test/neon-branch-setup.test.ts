import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const scriptPath = path.join(__dirname, '../../scripts/setup-neon-branch.ts');

describe('setup-neon-branch', () => {
  it('executes without throwing when Neon env vars are missing', () => {
    const result = spawnSync('tsx', [scriptPath], {
      env: { ...process.env },
      encoding: 'utf8',
    });
    // Expect normal exit (0) or early exit (0) with warning.
    expect(result.status).toBe(0);
  });
});