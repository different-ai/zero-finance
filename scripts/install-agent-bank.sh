#!/usr/bin/env bash
set -euo pipefail

if ! command -v bun >/dev/null 2>&1; then
  echo "Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

if ! command -v bun >/dev/null 2>&1; then
  echo "Bun install failed. See https://bun.sh for manual install." >&2
  exit 1
fi

echo "Installing agent-bank..."
bun add -g agent-bank

echo "agent-bank installed."
echo "Run: finance --version"
