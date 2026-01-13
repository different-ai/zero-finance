import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const fallbackScript = `#!/usr/bin/env bash
set -euo pipefail

if ! command -v bun >/dev/null 2>&1; then
  echo "Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="\${BUN_INSTALL:-$HOME/.bun}"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

if ! command -v bun >/dev/null 2>&1; then
  echo "Bun install failed. See https://bun.sh for manual install." >&2
  exit 1
fi

echo "Installing agent-bank..."
bun add -g agent-bank@latest

echo "agent-bank installed."
echo "Run: finance --version"
`;

export async function GET() {
  let script = fallbackScript;

  try {
    const scriptPath = path.join(
      process.cwd(),
      'scripts',
      'install-agent-bank.sh',
    );
    script = await fs.readFile(scriptPath, 'utf8');
  } catch (error) {
    // Fall back to bundled script for serverless environments.
  }

  return new Response(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
