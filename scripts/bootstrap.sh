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

# Check if running interactively (not piped)
if [ -t 0 ]; then
    INTERACTIVE=true
else
    INTERACTIVE=false
fi

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
        if [ "$INTERACTIVE" = true ]; then
            echo ""
            read -p "Continue anyway? (y/N): " CONTINUE
            if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
                exit 1
            fi
        else
            print_warning "Continuing with older Node.js version..."
        fi
    fi
else
    print_error "Node.js not found"
    echo ""
    
    # Try to auto-install Node.js
    if [ "$OS" = "macos" ]; then
        # Check for Homebrew
        if command -v brew &> /dev/null; then
            print_step "Installing Node.js via Homebrew..."
            brew install node@22
            brew link node@22 --force --overwrite
            
            # Re-check
            if command -v node &> /dev/null; then
                NODE_VERSION=$(node --version)
                print_success "Node.js installed: $NODE_VERSION"
            else
                print_error "Failed to install Node.js via Homebrew"
                exit 1
            fi
        else
            print_warning "Homebrew not found. Installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            
            # Add Homebrew to PATH for this session
            if [ -f "/opt/homebrew/bin/brew" ]; then
                eval "$(/opt/homebrew/bin/brew shellenv)"
            elif [ -f "/usr/local/bin/brew" ]; then
                eval "$(/usr/local/bin/brew shellenv)"
            fi
            
            print_step "Installing Node.js via Homebrew..."
            brew install node@22
            brew link node@22 --force --overwrite
            
            if command -v node &> /dev/null; then
                NODE_VERSION=$(node --version)
                print_success "Node.js installed: $NODE_VERSION"
            else
                print_error "Failed to install Node.js"
                echo ""
                echo "Please install Node.js manually:"
                echo "  brew install node@22"
                echo "  brew link node@22 --force"
                echo ""
                echo "Then re-run this script."
                exit 1
            fi
        fi
    elif [ "$OS" = "linux" ]; then
        print_step "Installing Node.js via nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
        
        # Load nvm for this session
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        nvm install 22
        nvm use 22
        
        if command -v node &> /dev/null; then
            NODE_VERSION=$(node --version)
            print_success "Node.js installed: $NODE_VERSION"
        else
            print_error "Failed to install Node.js via nvm"
            echo ""
            echo "Please install Node.js manually and re-run this script."
            exit 1
        fi
    else
        echo "To install Node.js:"
        echo "  1. Install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash"
        echo "  2. Restart terminal"
        echo "  3. Run: nvm install 22"
        echo ""
        echo "Or download from: https://nodejs.org"
        echo ""
        
        if [ "$INTERACTIVE" = true ]; then
            read -p "Press Enter after installing Node.js, or Ctrl+C to exit..."
            
            # Re-check
            if ! command -v node &> /dev/null; then
                print_error "Node.js still not found. Please install and try again."
                exit 1
            fi
        else
            print_error "Cannot auto-install Node.js on this platform."
            echo "Please install Node.js manually and re-run this script."
            exit 1
        fi
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

REPO_URL="https://github.com/different-ai/zero-finance.git"
REPO_DIR="zero-finance"

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
    if [ "$INTERACTIVE" = true ]; then
        read -p "Reinstall? (y/N): " REINSTALL
        if [[ "$REINSTALL" =~ ^[Yy]$ ]]; then
            pnpm install
        fi
    else
        print_warning "Skipping reinstall in non-interactive mode"
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
    
    # Check for required variables
    REQUIRED_VARS=("POSTGRES_URL" "NEXT_PUBLIC_PRIVY_APP_ID" "PRIVY_APP_SECRET")
    MISSING_VARS=()
    
    for var in "${REQUIRED_VARS[@]}"; do
        if ! grep -q "^${var}=" packages/web/.env.local 2>/dev/null; then
            MISSING_VARS+=("$var")
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        print_warning "Missing required environment variables:"
        for var in "${MISSING_VARS[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo "The @bootstrap agent will help you configure these."
    else
        print_success "All required environment variables are set"
    fi
else
    print_warning "No .env.local found"
    if [ -f "packages/web/.env.example" ]; then
        echo "Creating .env.local from .env.example..."
        cp packages/web/.env.example packages/web/.env.local
        print_success "Created packages/web/.env.local (needs configuration)"
        echo ""
        echo "You'll need to configure at minimum:"
        echo "  - POSTGRES_URL (database connection)"
        echo "  - NEXT_PUBLIC_PRIVY_APP_ID (auth)"
        echo "  - PRIVY_APP_SECRET (auth)"
        echo ""
        echo "The @bootstrap agent will guide you through this."
    fi
fi

# ============================================
# Phase 5.5: Check Docker (for local database)
# ============================================

print_step "Checking Docker (optional, for local database)..."

if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        print_success "Docker is installed and running"
    else
        print_warning "Docker is installed but not running"
        echo "Start Docker Desktop to use local database mode (pnpm lite)"
    fi
else
    print_warning "Docker not installed (optional)"
    echo "Without Docker, you'll need an external database (e.g., Neon)"
    echo "Install Docker from: https://docker.com/get-started"
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

# Check if opencode is available
if command -v opencode &> /dev/null; then
    if [ "$INTERACTIVE" = true ]; then
        read -p "Press Enter to launch OpenCode, or Ctrl+C to exit..."
        echo ""
        print_step "Launching OpenCode..."
        echo ""
        opencode --prompt "@bootstrap"
    else
        echo ""
        print_success "Bootstrap complete! To finish setup, run:"
        echo ""
        echo "  cd $REPO_ROOT"
        echo "  opencode --prompt \"@bootstrap\""
        echo ""
    fi
else
    print_warning "OpenCode not in PATH. Try running manually:"
    echo ""
    echo "  cd $REPO_ROOT"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
    echo "  opencode --prompt \"@bootstrap\""
    echo ""
    echo "Or restart your terminal first to pick up the new PATH."
    echo ""
fi
