---
name: self-improve
description: Update skill documentation and extend OpenCode capabilities based on learnings
license: MIT
compatibility: opencode
metadata:
  audience: ai-agents
  workflow: meta-learning
  trigger: continuous
---

## Who I Am

I am **OpenCode** - a powerful AI coding agent built for the terminal by SST. I run as a TUI (Terminal User Interface) and have access to an extensible system of:

- **Skills** - Markdown docs I read to learn how to use APIs/services (`.opencode/skill/`)
- **Agents** - Specialized AI assistants for specific tasks (`.opencode/agent/`)
- **Plugins** - JavaScript/TypeScript hooks into my events (`.opencode/plugin/`)
- **Custom Tools** - Functions I can call during conversations (`.opencode/tool/`)
- **MCP Servers** - External tools via Model Context Protocol (`opencode.json`)

I should use this knowledge to extend my own capabilities when needed.

---

## Core Principles

This repository is designed to be **self-bootstrapping**. After a fresh `git clone`, it should guide anyone to a fully working state.

1. **Self-aware** - I can reference my own code at `.opencode/` and understand my quirks
2. **Self-building** - I construct what I need when I need it (skills, tools, agents)
3. **Self-improving** - I update my own docs, prompts, and skills when things don't work
4. **Self-fixing** - I detect broken states and attempt repair automatically
5. **Reconstructable** - I can rebuild state from scratch by prompting for core info
6. **Portable** - Anyone can fork this repo and make it their own
7. **Open source** - Everything is shareable and inspectable as-is
8. **Boring where possible** - Prefer open standards, existing tools, predictable failures
9. **Graceful degradation** - If credentials are missing, guide the user to obtain them

### What This Means in Practice

- **Fresh clone?** → Run `@bootstrap` to set everything up
- **Something broke?** → Run `@debug-workspace` to diagnose
- **Missing feature?** → Create a skill/agent/tool, don't hardcode
- **Found a better way?** → Update the skill immediately, don't wait
- **Credentials missing?** → Guide user to get them, don't fail silently

---

## Self-Improvement Triggers

Update documentation **immediately** when:

1. **API behavior differs from docs** - e.g., endpoint requires different format
2. **Commands fail** - document the fix and correct syntax
3. **New workflow discovered** - add it to the skill
4. **Missing information** - add credentials location, gotchas, etc.
5. **User confirms something works** - lock in the correct approach
6. **Repeated task** - if I do something twice, make it a skill/tool
7. **Token waste detected** - found a faster way to accomplish the same thing
8. **Bootstrap issue** - something wasn't covered in setup flow
9. **Graceful degradation needed** - feature should work without full config

---

## What I Can Extend

### 1. Skills (Markdown Docs)

**Location:** `.opencode/skill/<name>/SKILL.md`
**Purpose:** Reference docs I read to learn APIs, credentials, workflows
**When to use:** New service integration, API docs, multi-step workflows

```
.opencode/skill/
├── chrome-devtools-mcp/   # Browser automation
├── test-staging-branch/   # Vercel preview testing
├── linkedin-post/         # Content creation
├── self-improve/          # This file
└── skill-reinforcement/   # Post-use learning capture
```

### 2. Agents (Specialized AI)

**Location:** `.opencode/agent/<name>.md`
**Purpose:** Focused assistants with custom prompts/models/tools
**When to use:** Recurring specialized tasks, different model needs

```markdown
# .opencode/agent/code-reviewer.md

---

description: Review code for best practices and potential issues
mode: subagent
model: anthropic/claude-sonnet-4-20250514
tools:
write: false
edit: false

---

You are a code reviewer. Focus on security, performance, and maintainability.
```

**Existing agents in this project:**

- `safe-infrastructure` - Safe wallet operations (uses Claude Opus)
- `setup-workspace` - Initialize outreach from Notion
- `draft-message` - Outreach message drafting
- `pull-sales` - PULL framework sales analysis
- `new-vault-implementation` - Adding new DeFi vaults

**Invoke with:** `@agent-name` in messages, or Tab to switch primary agents

### 3. Plugins (Event Hooks)

**Location:** `.opencode/plugin/<name>.ts`
**Purpose:** Hook into my events, modify behavior, add tools
**When to use:** Notifications, protections, custom integrations

```typescript
// .opencode/plugin/notification.ts
import type { Plugin } from '@opencode-ai/plugin';

export const NotificationPlugin: Plugin = async () => {
  return {
    event: async ({ event }) => {
      if (event.type === 'session.idle') {
        await Bun.$`osascript -e 'display notification "Task completed!" with title "OpenCode"'`;
      }
    },
  };
};
```

**Available events:**

- `session.idle`, `session.created`, `session.error`
- `tool.execute.before`, `tool.execute.after`
- `file.edited`, `message.updated`
- `permission.replied`

### 4. Custom Tools (Functions I Can Call)

**Location:** `.opencode/tool/<name>.ts`
**Purpose:** New capabilities beyond built-in tools
**When to use:** External APIs, complex operations, reusable functions

```typescript
// .opencode/tool/database.ts
import { tool } from '@opencode-ai/plugin';

export default tool({
  description: 'Query the project database',
  args: {
    query: tool.schema.string().describe('SQL query to execute'),
  },
  async execute(args) {
    // Implementation here
    return `Executed: ${args.query}`;
  },
});
```

**Existing plugin in this project:**

- `browser_control.ts` - Local Chrome automation via native messaging bridge

### 5. MCP Servers (External Tools)

**Location:** `opencode.json`
**Purpose:** Connect to external tool servers
**When to use:** Pre-built integrations, complex external services

Current MCP servers configured:

```json
{
  "mcp": {
    "exa": { "type": "remote", "url": "..." },
    "notion": {
      "type": "local",
      "command": ["npx", "-y", "mcp-remote", "..."]
    },
    "chrome": {
      "type": "local",
      "command": ["...", "chrome-devtools-mcp@latest"]
    },
    "zero-finance": { "type": "remote", "url": "https://www.0.finance/api/mcp" }
  }
}
```

---

## When to Create Each Extension Type

### Create a SKILL when:

- I need to remember **how to use an API or service** (endpoints, auth, formats)
- I keep looking up the **same commands or workflows**
- There's a **multi-step process** I'll repeat (deploy, test, debug cycles)
- I need to document **gotchas and edge cases** for future reference
- **Example triggers:**
  - "How do I call the Stripe API again?"
  - "What's the correct curl format for this endpoint?"
  - "I keep forgetting the steps to deploy to staging"

### Create an AGENT when:

- I need a **different personality or expertise** for a task
- The task requires a **specific model** (e.g., Opus for complex reasoning)
- I want to **restrict tools** for safety (read-only code reviewer)
- The task has a **specialized prompt** that's long and reusable
- **Example triggers:**
  - "I need expert-level blockchain knowledge for this"
  - "Review this code but don't modify anything"
  - "Draft outreach messages with specific sales methodology"

### Create a PLUGIN when:

- I need to **react to events** (session start, file edit, task complete)
- I want to **modify behavior** before/after tool execution
- I need **notifications** or external integrations on events
- I want to **protect against mistakes** (confirm before dangerous operations)
- **Example triggers:**
  - "Notify me when a long task completes"
  - "Log all file edits to a changelog"
  - "Require confirmation before running destructive commands"

### Create a TOOL when:

- I need to **call an external API** that isn't available via MCP
- I have a **complex operation** I want to encapsulate as a single call
- I need to **run code in a specific language** (Python, Ruby, etc.)
- The operation is **stateful or requires persistence**
- **Example triggers:**
  - "Query the local database directly"
  - "Run this Python script with arguments"
  - "Interact with a local service on a specific port"

### Add an MCP SERVER when:

- There's a **pre-built MCP server** for the service I need
- The integration is **complex enough** to warrant a separate process
- I need **persistent connections** (websockets, streaming)
- The server provides **many related tools** I'll use together
- **Example triggers:**
  - "I need full GitHub API access"
  - "Connect to a headless browser for automation"
  - "Integrate with Slack/Discord/etc."

---

## Decision Tree: What Should I Create?

```
Need to extend my capabilities?
│
├─ Just need to remember docs/commands/workflows?
│  └─ Create a SKILL
│     Examples: API reference, deployment steps, CLI commands
│
├─ Need different AI persona, model, or restricted tools?
│  └─ Create an AGENT
│     Examples: code reviewer, sales drafter, domain expert
│
├─ Need to react to events or modify behavior?
│  └─ Create a PLUGIN
│     Examples: notifications, logging, safety guards
│
├─ Need a new callable function for APIs/scripts?
│  └─ Create a TOOL
│     Examples: database queries, Python scripts, local services
│
└─ Need pre-built complex integration?
   └─ Add an MCP SERVER
      Examples: GitHub, browser automation, Notion
```

---

## Skill Structure Convention

### Recommended Sections

Every skill should have these sections (add if missing):

```markdown
---
name: skill-name
description: One-line description
---

## Quick Usage (Already Configured)

# Most common commands - copy/paste ready

## What I Do

[Core purpose]

## Prerequisites

[Requirements]

## Workflow

[Main steps]

## Common Gotchas

# Things that don't work as expected

## Token Saving Tips

[Efficiency patterns]

## Anti-Patterns to Avoid

[What NOT to do]

## Real Examples

[Actual usage examples from this codebase]

## First-Time Setup

# Only needed once, keep at bottom
```

### Rules for Documentation

1. **Update immediately** - Don't wait until end of conversation
2. **Keep it copy/paste ready** - Commands should work as-is
3. **Document the "why"** - Explain gotchas, not just the fix
4. **Test before documenting** - Only add confirmed working commands
5. **Remove outdated info** - Delete commands that don't work
6. **Use this codebase's patterns** - Reference actual files in `packages/web/src/`

---

## Creating New Extensions

### New Skill

```bash
mkdir -p .opencode/skill/<skill-name>
```

Template:

```markdown
---
name: skill-name
description: One-line description
---

## Quick Usage (Already Configured)

### Action 1

\`\`\`bash
command here
\`\`\`

## Common Gotchas

- Thing that doesn't work as expected

## First-Time Setup (If Not Configured)

### What you need from the user

1. ...
```

### New Agent

```bash
touch .opencode/agent/<agent-name>.md
```

Template:

```markdown
---
description: What this agent does
mode: subagent # or "primary"
model: anthropic/claude-sonnet-4-20250514
temperature: 0.3
tools:
  write: false
  edit: false
  bash: false
---

You are a [role]. Focus on:

- Task 1
- Task 2
```

### New Tool

```bash
touch .opencode/tool/<tool-name>.ts
```

Template:

```typescript
import { tool } from '@opencode-ai/plugin';

export default tool({
  description: 'What this tool does',
  args: {
    param: tool.schema.string().describe('Parameter description'),
  },
  async execute(args, context) {
    // Implementation
    return 'result';
  },
});
```

### Add MCP Server

Edit `opencode.json`:

```json
{
  "mcp": {
    "new-server": {
      "type": "local",
      "command": ["npx", "-y", "@scope/mcp-server-name"]
    }
  }
}
```

---

## Examples of Self-Improvement

### Example 1: Fix Incorrect API Format

**Context:** curl command in skill used wrong flag
**Before:** `curl -d "urls=..."`
**After:** `curl -F "urls=..."` (multipart/form-data required)
**Action:** Updated skill with correct flag

### Example 2: Add Missing Gotcha

**Context:** Assumed `jq` was available, command failed
**Action:** Added to Common Gotchas:

```markdown
## Common Gotchas

- `jq` is NOT installed - use grep/cut for JSON parsing
```

### Example 3: Create Agent for Repeated Task

**Context:** Kept doing Safe wallet debugging manually
**Action:** Created `.opencode/agent/safe-infrastructure.md` with:

- Specialized prompt for wallet architecture
- Higher-tier model (Claude Opus)
- Access to Exa for blockchain docs

### Example 4: Create Tool for API I Use Often

**Context:** Repeatedly calling browser bridge API
**Action:** Created `.opencode/plugin/browser_control.ts` with:

- 12 browser control tools
- Error handling
- JSON response formatting

### Example 5: Document Project-Specific Pattern

**Context:** Discovered Safe address must come from DB, not prediction
**Action:** Added to `safe-infrastructure.md`:

```markdown
**CRITICAL RULE: ALWAYS query Safe addresses from the database. NEVER predict or derive addresses.**
```

---

## Project-Specific Knowledge to Preserve

### Wallet Architecture (3-Layer Hierarchy)

```
Layer 1: Privy Embedded Wallet (EOA) - Signs transactions
Layer 2: Privy Smart Wallet (Safe) - Gas sponsorship via 4337
Layer 3: Primary Safe - User's bank account (WHERE FUNDS ARE)
```

### Key File Locations

| Purpose           | File                                                       |
| ----------------- | ---------------------------------------------------------- |
| Transaction relay | `packages/web/src/hooks/use-safe-relay.ts`                 |
| Safe management   | `packages/web/src/server/earn/multi-chain-safe-manager.ts` |
| Chain constants   | `packages/web/src/lib/constants/chains.ts`                 |
| Design language   | `packages/web/DESIGN-LANGUAGE.md`                          |
| OpenCode config   | `opencode.json`                                            |

### External Resources

| Source          | Tool               | When to Use                    |
| --------------- | ------------------ | ------------------------------ |
| Notion          | `notion_*` MCP     | Product copy, messaging, specs |
| Exa             | `exa_*` MCP        | Technical docs, code examples  |
| Chrome DevTools | `chrome_*` MCP     | Browser automation, testing    |
| Basescan        | `exa_crawling_exa` | On-chain transaction analysis  |

---

## Bootstrapping Flow

This repo is designed to be fully operational from a fresh `git clone`:

```
git clone → @bootstrap → working system
```

### The Bootstrap Agent

Location: `.opencode/agent/bootstrap.md`

What it does:

1. **Detects environment** - Node version, pnpm, Chrome, etc.
2. **Installs dependencies** - `pnpm install`
3. **Tests MCP servers** - Exa, Notion, Chrome
4. **Creates config** - `.opencode/config/workspace.json`
5. **Sets up env vars** - Creates `.env.local` from template
6. **Verifies everything** - Type check, lint, build test

### Graceful Degradation

Not everything needs to work for the repo to be useful:

| Component | If Missing                     | Fallback                   |
| --------- | ------------------------------ | -------------------------- |
| Exa MCP   | Web research unavailable       | Manual research            |
| Notion    | CRM/docs unavailable           | Local-only development     |
| Chrome    | Browser automation unavailable | Manual browser testing     |
| Database  | Can't run full app             | Can still do frontend work |
| Privy     | Can't test auth                | Mock auth in dev mode      |

The system should **always tell the user** what's degraded and how to fix it.

### Reconstructing from Scratch

If everything breaks, delete derived files and re-bootstrap:

```bash
rm -rf node_modules
rm -rf .opencode/config/workspace.json
rm packages/web/.env.local
# Then run @bootstrap
```

The only things that can't be reconstructed:

- API keys (user must provide)
- OAuth tokens (user must re-authorize)
- Database data (must restore from backup)

---

## Integration with Other Meta-Skills

| Skill                 | Role                                        |
| --------------------- | ------------------------------------------- |
| `self-improve`        | **HOW** to update (templates, structures)   |
| `skill-reinforcement` | **WHEN** to update (post-use triggers)      |
| `@bootstrap`          | **SETUP** from scratch (fresh clone)        |
| `@debug-workspace`    | **FIX** broken state (diagnose & repair)    |
| `@setup-workspace`    | **CONFIGURE** from Notion (load MCP Skills) |

After using any skill, the `skill-reinforcement` skill should trigger to:

1. Analyze what worked and what didn't
2. Identify new patterns or shortcuts discovered
3. Update the skill file with learnings
4. Prevent knowledge loss between sessions

---

## Quick Improvement Checklist

```
[ ] Something unexpected happened
[ ] Identified the root cause
[ ] Determined which extension type to use:
    [ ] Skill - just docs/commands
    [ ] Agent - specialized AI persona
    [ ] Plugin - event hooks
    [ ] Tool - new function
    [ ] MCP - external integration
[ ] Created/updated the extension
[ ] Tested the change works
[ ] Validated formatting matches existing style
[ ] Done
```

---

## Meta: Improving This Skill

This skill should also improve itself. Track:

- New extension types or patterns discovered
- Better templates or examples found
- Project-specific knowledge worth preserving
- Integration patterns with other skills
