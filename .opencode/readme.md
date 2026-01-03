# 0 Finance - OpenCode Configuration

This directory contains the AI agent configuration for 0 Finance. After a fresh `git clone`, this system can bootstrap itself to a fully working state.

## Quick Start

### One-Line Install (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/0finance/zerofinance/main/scripts/bootstrap.sh | bash
```

This will install everything and launch the bootstrap agent automatically.

### Manual Setup

```bash
# If you've already cloned:
./scripts/bootstrap.sh

# Or if you have OpenCode installed:
opencode
# Then type: @bootstrap
```

The bootstrap process will:

1. Check your environment (Node, pnpm, Chrome, Vercel CLI, GitHub CLI)
2. Install dependencies
3. Test MCP server connections
4. Create workspace configuration
5. Guide you through credential setup
6. Set up browser sessions (LinkedIn, etc.)

## Core Principles

This repo is designed to be:

1. **Self-aware** - AI knows it can read its own code in `.opencode/`
2. **Self-building** - Constructs skills, tools, agents as needed
3. **Self-improving** - Updates its own docs when things don't work
4. **Self-fixing** - Detects broken states and attempts repair
5. **Reconstructable** - Can rebuild from scratch with user input
6. **Gracefully degrading** - Works with partial config, guides to full setup

## Available Agents

| Agent               | Command                 | Purpose                               |
| ------------------- | ----------------------- | ------------------------------------- |
| Sherpa              | `@sherpa`               | Make any repo self-bootstrapping      |
| Bootstrap           | `@bootstrap`            | First-time setup from fresh clone     |
| Debug               | `@debug`                | Fix dev setup issues (Node, deps, DB) |
| Debug Workspace     | `@debug-workspace`      | Test MCP connections, diagnose issues |
| Setup Workspace     | `@setup-workspace`      | Load config from Notion MCP Skills    |
| Safe Infrastructure | `@safe-infrastructure`  | Wallet operations, transactions       |
| Draft Message       | `@draft-message`        | Create outreach messages              |
| Add Leads           | `@add-leads-to-tracker` | Research and add prospects            |
| Update CRM          | `@update-crm`           | Log sent messages to Notion           |

## Directory Structure

```
.opencode/
├── agent/                    # Specialized AI assistants
│   ├── bootstrap.md          # First-time setup
│   ├── debug-workspace.md    # Diagnose issues
│   ├── setup-workspace.md    # Load Notion config
│   ├── safe-infrastructure.md # Wallet operations
│   └── ...
├── skill/                    # Reference documentation
│   ├── self-improve/         # How to extend this system
│   ├── skill-reinforcement/  # When to update skills
│   ├── chrome-devtools-mcp/  # Browser automation
│   └── ...
├── plugin/                   # Event hooks and tools
│   └── browser_control.ts    # Local Chrome control
├── config/                   # Generated configuration
│   └── workspace.json        # Workspace state (gitignored)
└── readme.md                 # This file
```

## MCP Servers

Configured in `opencode.json` at repo root:

| Server    | Type   | Purpose                   |
| --------- | ------ | ------------------------- |
| Exa       | Remote | Web search, code context  |
| Notion    | Local  | CRM, docs, knowledge base |
| Chrome    | Local  | Browser automation        |
| 0 Finance | Remote | Product API (optional)    |

## Workflow

### First Time Setup

```bash
# One-liner (installs everything):
curl -fsSL https://raw.githubusercontent.com/0finance/zerofinance/main/scripts/bootstrap.sh | bash

# Or manually:
git clone https://github.com/0finance/zerofinance.git
cd zerofinance
./scripts/bootstrap.sh
```

### Daily Use

```
@setup-workspace     # Refresh config from Notion
@draft-message       # Create outreach message
@debug-workspace     # If something breaks
```

### When Something Breaks

1. Run `@debug-workspace` to diagnose
2. Follow the fix instructions
3. If the fix should be documented, update the relevant skill

### Extending the System

See `.opencode/skill/self-improve/SKILL.md` for:

- When to create skills vs agents vs tools
- Templates for each extension type
- Examples from this codebase

## Files That Can Be Reconstructed

Everything in `.opencode/` except:

- `config/workspace.json` - Regenerate with `@setup-workspace`
- API keys in `opencode.json` - User must provide

## Files That Cannot Be Reconstructed

- API keys (Exa, etc.) - Must get from providers
- OAuth tokens - Must re-authorize (Notion)
- Database data - Must restore from backup

## Graceful Degradation

The system works with partial configuration:

| Missing    | Impact                 | Fallback          |
| ---------- | ---------------------- | ----------------- |
| Exa MCP    | No web research        | Manual research   |
| Notion MCP | No CRM/docs            | Local development |
| Chrome MCP | No browser automation  | Manual testing    |
| Full env   | Can't run complete app | Frontend-only dev |

Run `@bootstrap` to see what's configured and what's missing.

---

## Creating Bootstrap Systems for Other Repos

The `@sherpa` agent can make any repository self-bootstrapping like this one.

### Usage

```bash
# In any repo with OpenCode:
opencode
# Then type: @sherpa
```

### What Sherpa Does

1. **Reads your repo** - AGENTS.md, opencode.json, .env.example, package.json, docker-compose.yml
2. **Asks what you want** - "What should someone be able to do after bootstrap?"
3. **Confirms the plan** - Shows what it will create before generating
4. **Generates the system** - bootstrap.sh, agents, skills, documentation

### What Sherpa Creates

```
scripts/bootstrap.sh          ← curl-able entry point
.opencode/agent/bootstrap.md  ← AI setup guide
.opencode/agent/debug.md      ← Diagnostics agent
.opencode/skill/self-improve/SKILL.md ← Meta-learning
.opencode/readme.md           ← Documentation
```

### The Three Levels

Sherpa structures bootstraps around three levels:

| Level | Name           | Description                                      |
| ----- | -------------- | ------------------------------------------------ |
| 1     | **Local**      | Everything on your machine (Docker, mocked APIs) |
| 2     | **Preview**    | Connected to staging/sandbox services            |
| 3     | **Production** | Full production config                           |

The generated bootstrap works at any level with graceful degradation.
