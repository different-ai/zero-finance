#!/usr/bin/env bash
#
# 0 Finance - Bootstrap
#
# This script ONLY gets OpenCode running, then hands off to the @bootstrap agent
# which handles everything else (node, pnpm, env, etc.)
#

set -e

echo ""
echo "🚀 0 Finance Bootstrap"
echo ""

# Try to find or install OpenCode, then run it
# We try multiple approaches since systems vary wildly

REPO_URL="https://github.com/different-ai/zero-finance.git"
REPO_DIR="zero-finance"

# Step 1: Get into the repo (clone if needed)
if [ -f "package.json" ] && grep -q "zero-finance-monorepo" package.json 2>/dev/null; then
    echo "✓ Already in zero-finance repo"
elif [ -d "$REPO_DIR" ]; then
    echo "→ Entering $REPO_DIR..."
    cd "$REPO_DIR"
else
    echo "→ Cloning repository..."
    git clone "$REPO_URL" 2>/dev/null || {
        echo "✗ Git clone failed. Install git first."
        exit 1
    }
    cd "$REPO_DIR"
    echo "✓ Cloned"
fi

REPO_ROOT=$(pwd)

# Step 2: Try to run OpenCode (try every possible way)
run_opencode() {
    # Method 1: opencode in PATH
    if command -v opencode &> /dev/null; then
        echo "→ Running opencode..."
        opencode --prompt "@bootstrap"
        return 0
    fi
    
    # Method 2: Common install locations
    for path in "$HOME/.local/bin/opencode" "/usr/local/bin/opencode" "$HOME/.opencode/bin/opencode"; do
        if [ -x "$path" ]; then
            echo "→ Running $path..."
            "$path" --prompt "@bootstrap"
            return 0
        fi
    done
    
    # Method 3: npx (if node exists)
    if command -v npx &> /dev/null; then
        echo "→ Running via npx..."
        npx opencode --prompt "@bootstrap"
        return 0
    fi
    
    # Method 4: Try to install and run
    echo "→ Installing OpenCode..."
    curl -fsSL https://opencode.ai/install | bash 2>/dev/null || true
    
    # Source shell configs to get new PATH
    [ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc" 2>/dev/null || true
    [ -f "$HOME/.zshrc" ] && source "$HOME/.zshrc" 2>/dev/null || true
    export PATH="$HOME/.local/bin:$PATH"
    
    if command -v opencode &> /dev/null; then
        opencode --prompt "@bootstrap"
        return 0
    fi
    
    # Method 5: Direct binary download for common platforms
    echo "→ Trying direct download..."
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    ARCH=$(uname -m)
    [[ "$ARCH" == "x86_64" ]] && ARCH="amd64"
    [[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]] && ARCH="arm64"
    
    mkdir -p "$HOME/.local/bin"
    OPENCODE_BIN="$HOME/.local/bin/opencode"
    
    # Try to download (this URL pattern may need updating)
    curl -fsSL "https://github.com/opencode-ai/opencode/releases/latest/download/opencode-${OS}-${ARCH}" -o "$OPENCODE_BIN" 2>/dev/null && \
    chmod +x "$OPENCODE_BIN" && \
    "$OPENCODE_BIN" --prompt "@bootstrap" && return 0
    
    return 1
}

if run_opencode; then
    exit 0
fi

# If all else fails, give manual instructions
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Could not auto-start OpenCode. Please run manually:"
echo ""
echo "  1. Install OpenCode: curl -fsSL https://opencode.ai/install | bash"
echo "  2. Restart your terminal"
echo "  3. cd $REPO_ROOT"
echo "  4. opencode --prompt \"@bootstrap\""
echo ""
echo "The @bootstrap agent will handle everything else (node, pnpm, etc.)"
echo ""
