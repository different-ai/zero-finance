#!/usr/bin/env bash
#
# 0 Finance - Self-Bootstrap Script
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/0finance/zerofinance/main/scripts/bootstrap.sh | bash
#
# Or if you've already cloned:
#   ./scripts/bootstrap.sh
#
# This script:
#   1. Checks/installs prerequisites (Node, pnpm, OpenCode)
#   2. Clones the repo (if not already in it)
#   3. Installs dependencies
#   4. Launches OpenCode with the @bootstrap agent
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Banner
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}                                                           ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   ${GREEN}0 Finance${NC} - Self-Bootstrapping Repository              ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}                                                           ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   This script will set up everything you need to         ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   start developing on 0 Finance.                         ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}                                                           ${BLUE}║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
fi

print_step "Detected OS: $OS"

# ============================================
# Phase 1: Check Prerequisites
# ============================================

print_step "Checking prerequisites..."

# Check for Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
    
    # Check version >= 22
    NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_MAJOR" -lt 22 ]; then
        print_warning "Node.js version should be >= 22. You have $NODE_VERSION"
        print_warning "Consider upgrading: nvm install 22"
    fi
else
    print_error "Node.js not found"
    echo ""
    echo "To install Node.js:"
    echo "  1. Install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash"
    echo "  2. Restart terminal"
    echo "  3. Run: nvm install 22"
    echo ""
    echo "Or download from: https://nodejs.org"
    echo ""
    read -p "Press Enter after installing Node.js, or Ctrl+C to exit..."
    
    # Re-check
    if ! command -v node &> /dev/null; then
        print_error "Node.js still not found. Please install and try again."
        exit 1
    fi
fi

# Check for pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    print_success "pnpm installed: $PNPM_VERSION"
else
    print_warning "pnpm not found, installing..."
    npm install -g pnpm
    print_success "pnpm installed"
fi

# Check for Git
if command -v git &> /dev/null; then
    print_success "Git installed"
else
    print_error "Git not found. Please install Git first."
    exit 1
fi

# ============================================
# Phase 2: Check/Install OpenCode
# ============================================

print_step "Checking OpenCode..."

if command -v opencode &> /dev/null; then
    OPENCODE_VERSION=$(opencode --version 2>/dev/null || echo "unknown")
    print_success "OpenCode installed: $OPENCODE_VERSION"
else
    print_warning "OpenCode not found, installing..."
    curl -fsSL https://opencode.ai/install | bash
    
    # Source shell config to get opencode in PATH
    if [ -f "$HOME/.bashrc" ]; then
        source "$HOME/.bashrc" 2>/dev/null || true
    fi
    if [ -f "$HOME/.zshrc" ]; then
        source "$HOME/.zshrc" 2>/dev/null || true
    fi
    
    # Check again
    if command -v opencode &> /dev/null; then
        print_success "OpenCode installed"
    else
        print_warning "OpenCode installed but not in PATH yet"
        echo "You may need to restart your terminal or run:"
        echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
    fi
fi

# ============================================
# Phase 3: Clone or Navigate to Repo
# ============================================

print_step "Setting up repository..."

REPO_URL="https://github.com/0finance/zerofinance.git"
REPO_DIR="zerofinance"

# Check if we're already in the repo
if [ -f "package.json" ] && grep -q "zero-finance-monorepo" package.json 2>/dev/null; then
    print_success "Already in zerofinance repository"
    REPO_ROOT=$(pwd)
elif [ -f "../package.json" ] && grep -q "zero-finance-monorepo" ../package.json 2>/dev/null; then
    print_success "Found repository in parent directory"
    cd ..
    REPO_ROOT=$(pwd)
elif [ -d "$REPO_DIR" ]; then
    print_success "Repository already cloned"
    cd "$REPO_DIR"
    REPO_ROOT=$(pwd)
else
    print_warning "Cloning repository..."
    git clone "$REPO_URL"
    cd "$REPO_DIR"
    REPO_ROOT=$(pwd)
    print_success "Repository cloned to $REPO_ROOT"
fi

# ============================================
# Phase 4: Install Dependencies
# ============================================

print_step "Installing dependencies..."

if [ -d "node_modules" ] && [ -f "pnpm-lock.yaml" ]; then
    print_success "Dependencies appear to be installed"
    read -p "Reinstall? (y/N): " REINSTALL
    if [[ "$REINSTALL" =~ ^[Yy]$ ]]; then
        pnpm install
    fi
else
    pnpm install
    print_success "Dependencies installed"
fi

# ============================================
# Phase 5: Check for .env.local
# ============================================

print_step "Checking environment configuration..."

if [ -f "packages/web/.env.local" ]; then
    print_success "Environment file exists: packages/web/.env.local"
else
    print_warning "No .env.local found"
    if [ -f "packages/web/.env.example" ]; then
        echo "Creating .env.local from .env.example..."
        cp packages/web/.env.example packages/web/.env.local
        print_success "Created packages/web/.env.local (needs configuration)"
    fi
fi

# ============================================
# Phase 6: Check OpenCode Config
# ============================================

print_step "Checking OpenCode configuration..."

if [ -f "opencode.json" ]; then
    print_success "OpenCode config found: opencode.json"
else
    print_warning "No opencode.json found"
fi

# Create .opencode/config directory if needed
mkdir -p .opencode/config

# ============================================
# Phase 7: Launch OpenCode Bootstrap
# ============================================

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   ${BLUE}Setup Complete!${NC}                                        ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   Next: OpenCode will launch and run the @bootstrap      ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   agent to complete configuration.                       ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   The agent will:                                        ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   • Test MCP server connections                          ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   • Guide you through credential setup                   ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   • Configure your workspace                             ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   • Set up browser sessions (LinkedIn, etc.)             ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

read -p "Press Enter to launch OpenCode, or Ctrl+C to exit..."

# Check if opencode is available
if command -v opencode &> /dev/null; then
    # Launch OpenCode with the bootstrap prompt
    echo ""
    print_step "Launching OpenCode..."
    echo ""
    
    # Start OpenCode and send the bootstrap command
    opencode --prompt "@bootstrap"
else
    print_warning "OpenCode not in PATH. Try running manually:"
    echo ""
    echo "  cd $REPO_ROOT"
    echo "  opencode"
    echo ""
    echo "Then type: @bootstrap"
    echo ""
fi
