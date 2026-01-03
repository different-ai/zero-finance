#!/usr/bin/env bash
#
# 0 Finance - Self-Bootstrap Script
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/different-ai/zero-finance/main/scripts/bootstrap.sh | bash
#
# Or if you've already cloned:
#   ./scripts/bootstrap.sh
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}   ${GREEN}0 Finance${NC} - Self-Bootstrapping Repository              ${BLUE}║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS
OS="unknown"
[[ "$OSTYPE" == "darwin"* ]] && OS="macos"
[[ "$OSTYPE" == "linux-gnu"* ]] && OS="linux"

echo -e "${BLUE}==>${NC} OS: $OS"

# ============================================
# Phase 1: Node.js
# ============================================

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "${YELLOW}⚠${NC} Node.js not found"
    
    if [ "$OS" = "macos" ]; then
        if command -v brew &> /dev/null; then
            echo -e "${BLUE}==>${NC} Installing Node.js via Homebrew..."
            brew install node@22 2>/dev/null || brew install node
            
            # Add to PATH for this session (brew link often fails if other node exists)
            if [ -d "/opt/homebrew/opt/node@22/bin" ]; then
                export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
            elif [ -d "/usr/local/opt/node@22/bin" ]; then
                export PATH="/usr/local/opt/node@22/bin:$PATH"
            fi
            
            # Try to link anyway (may fail, that's ok)
            brew link node@22 --force --overwrite 2>/dev/null || true
        else
            echo -e "${RED}✗${NC} Homebrew not found."
            echo ""
            echo "Run these commands manually, then re-run this script:"
            echo ""
            echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            echo "  brew install node@22"
            echo ""
            exit 1
        fi
    elif [ "$OS" = "linux" ]; then
        echo -e "${BLUE}==>${NC} Installing Node.js via NodeSource..."
        curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - 2>/dev/null || {
            echo -e "${RED}✗${NC} Failed to install Node.js"
            echo "Please install Node.js 22+ manually: https://nodejs.org"
            exit 1
        }
        sudo apt-get install -y nodejs 2>/dev/null || {
            echo -e "${RED}✗${NC} Failed to install Node.js"
            exit 1
        }
    else
        echo -e "${RED}✗${NC} Please install Node.js 22+ manually: https://nodejs.org"
        exit 1
    fi
    
    # Verify
    if command -v node &> /dev/null; then
        echo -e "${GREEN}✓${NC} Node.js installed: $(node --version)"
    else
        echo -e "${RED}✗${NC} Node.js installation failed"
        exit 1
    fi
fi

# ============================================
# Phase 2: pnpm
# ============================================

if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✓${NC} pnpm: $(pnpm --version)"
else
    echo -e "${BLUE}==>${NC} Installing pnpm..."
    npm install -g pnpm
    echo -e "${GREEN}✓${NC} pnpm installed"
fi

# ============================================
# Phase 3: Clone repo
# ============================================

REPO_URL="https://github.com/different-ai/zero-finance.git"
REPO_DIR="zero-finance"

if [ -f "package.json" ] && grep -q "zero-finance-monorepo" package.json 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Already in zero-finance repo"
    REPO_ROOT=$(pwd)
elif [ -d "$REPO_DIR" ]; then
    echo -e "${GREEN}✓${NC} Repo exists, entering..."
    cd "$REPO_DIR"
    REPO_ROOT=$(pwd)
else
    echo -e "${BLUE}==>${NC} Cloning repository..."
    git clone "$REPO_URL"
    cd "$REPO_DIR"
    REPO_ROOT=$(pwd)
    echo -e "${GREEN}✓${NC} Cloned to $REPO_ROOT"
fi

# ============================================
# Phase 4: Install dependencies
# ============================================

echo -e "${BLUE}==>${NC} Installing dependencies..."
pnpm install
echo -e "${GREEN}✓${NC} Dependencies installed"

# ============================================
# Phase 5: Setup .env.local
# ============================================

if [ ! -f "packages/web/.env.local" ]; then
    if [ -f "packages/web/.env.example" ]; then
        cp packages/web/.env.example packages/web/.env.local
        echo -e "${GREEN}✓${NC} Created packages/web/.env.local"
    fi
fi

# ============================================
# Done!
# ============================================

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}   ${BLUE}Bootstrap Complete!${NC}                                     ${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if node@22 path hint is needed
if [ "$OS" = "macos" ] && [ -d "/opt/homebrew/opt/node@22/bin" ]; then
    if ! command -v node &> /dev/null || [[ "$(which node)" != *"node@22"* ]]; then
        echo -e "${YELLOW}Note:${NC} Add Node.js 22 to your PATH permanently:"
        echo ""
        echo "  echo 'export PATH=\"/opt/homebrew/opt/node@22/bin:\$PATH\"' >> ~/.zshrc"
        echo "  source ~/.zshrc"
        echo ""
    fi
fi

echo "Next steps:"
echo ""
echo "  cd $REPO_ROOT"
echo ""
echo "  # Option 1: Local dev with Docker (easiest)"
echo "  pnpm lite"
echo ""
echo "  # Option 2: Full dev (needs .env.local configured)"
echo "  pnpm dev"
echo ""
echo "  # Option 3: AI-guided setup"
echo "  npx opencode"
echo "  # Then type: @bootstrap"
echo ""
