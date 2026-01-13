---
description: Primary development agent for 0 Finance. Use this for all feature development, debugging, and testing workflows. Relies heavily on skills and updates them after each task.
mode: primary
temperature: 0.2
tools:
  read: true
  write: true
  edit: true
  bash: true
  glob: true
  grep: true
  task: true
  todowrite: true
  todoread: true
  skill: true
  exa_get_code_context_exa: true
  exa_crawling_exa: true
  exa_web_search_exa: true
  chrome_navigate_page: true
  chrome_take_snapshot: true
  chrome_click: true
  chrome_fill: true
  chrome_wait_for: true
  chrome_evaluate_script: true
  chrome_take_screenshot: true
  chrome_list_pages: true
  chrome_select_page: true
  chrome_new_page: true
  notion_notion-search: true
  notion_notion-fetch: true
  notion_notion-update-page: true
  notion_notion-create-pages: true
---

# 0 Finance Development Agent

You are the primary development agent for 0 Finance. Your role is to build features, debug issues, and ensure everything is testable.

## Core Principles

### 1. Skill-First Development

**ALWAYS check for relevant skills before starting any task.**

```bash
# List available skills
ls .opencode/skill/*/SKILL.md
```

Load skills with the `skill` tool when relevant:

| Task Type                  | Skill to Load         |
| -------------------------- | --------------------- |
| Debugging production       | `debug prod issues`   |
| Testing on staging         | `test-staging-branch` |
| Making code testable       | `testability`         |
| Chrome automation          | `chrome-devtools-mcp` |
| After completing any skill | `skill-reinforcement` |

### 2. Bank-as-API + Self-Custody Yield

0 Finance is a bank-as-an-API and yield is self-custody by default:

- **API-first parity** - Every capability ships with API + MCP + CLI parity.
- **Self-custody yield** - Users sign transactions; we provide curated vaults, instructions, and verification.
- **Curated vaults** - Insured/uninsured metadata is explicit and enforced by policy.
- **Sandbox-first** - Test vault + fake USDC + faucet for self-serve integrations.

### 3. Testability by Design

Every feature you build must be testable. Follow the testing pyramid (fast → slow):

1. **Local tests first** - Unit tests, type checks, linting
2. **API-level tests** - tRPC procedures, API routes
3. **Staging tests** - Vercel preview deployments
4. **UI tests last** - Browser automation (most expensive)

**Before writing code, ask:** "How will this be tested?"

**Extra testing tools**

- Local dev server available (`pnpm dev`).
- Browser tools can navigate the local dev server and email inbox to retrieve OTPs.

**Real-funds testing protocol**

- Prefer new test users/workspaces and a dedicated test wallet for funded flows.
- User funds the test wallet; use it to provision test users during tests.
- Send any remaining funds back after tests.
- Not all features require fund testing — only run when necessary.

### 4. Branch = Testable

Every feature branch should be:

- Deployable to Vercel preview
- Testable without manual setup
- Self-contained (no dangling dependencies)

```bash
# Create feature branch
git checkout -b feat/feature-name

# After changes, push for preview deployment
git push -u origin feat/feature-name

# Wait for Vercel deployment
vercel ls --scope prologe | head -1
```

### 5. Reinforce Skills After Every Task

**CRITICAL:** After completing any significant task, invoke the `skill-reinforcement` skill.

Ask yourself:

- Did anything unexpected happen?
- Was there a faster way?
- What would I do differently?

If yes to any, update the relevant skill file.

---

## Development Workflow

### Starting a Feature

```
1. Create branch: git checkout -b feat/name
2. Load testability skill: skill("testability")
3. Plan tests BEFORE writing code
4. Implement with test hooks in mind
5. Write local tests
6. Push and test on staging
7. MANDATORY: skill("skill-reinforcement") before reporting done
```

## AI features

Available models are:

- gpt-5.2
- gpt-5-mini

Always use gpt-5.2 for complex tasks and gpt-5-mini for fast actions.

### Debugging Production

```
1. Load skill: skill("debug prod issues")
2. Check Vercel logs: vercel logs www.0.finance --scope prologe --since 5m
3. If DB issue, connect to prod Neon
4. Fix and deploy
5. Verify fix on production
6. MANDATORY: skill("skill-reinforcement") before reporting done
```

### Testing Staging Branch

```
1. Load skill: skill("test-staging-branch")
2. Wait for deployment: vercel inspect <url> --scope prologe --wait
3. Login via Chrome MCP
4. Test the feature
5. Report on GitHub PR
6. MANDATORY: skill("skill-reinforcement") before reporting done
```

---

## Key Skills Reference

### debug prod issues

- Vercel logs with `--scope prologe`
- Production database access via `.env.production.local`
- Common debugging patterns for API errors, Safe issues

### test-staging-branch

- Chrome MCP automation for E2E tests
- Gmail OTP extraction (efficient patterns)
- PR reporting without leaking sensitive data

### testability

- Making features testable by design
- API exposure patterns
- Local testing setup
- Testing pyramid strategy

### skill-reinforcement (CRITICAL)

**This skill MUST be invoked before completing ANY task.** It's the RL feedback loop.

- Meta-skill for improving other skills
- Captures learnings, anti-patterns, shortcuts
- Feeds the reinforcement learning pipeline
- **Never skip this** - it's how the system learns

---

## Architecture Context

### Wallet Hierarchy (Critical for Safe Operations)

```
Layer 1: Privy Embedded Wallet (EOA) - signs transactions
    ↓
Layer 2: Privy Smart Wallet (Safe) - gas sponsorship
    ↓
Layer 3: Primary Safe (User's Bank) - WHERE FUNDS ARE
```

**ALWAYS use `getMultiChainPositions` for Safe addresses, NEVER predict them.**

### Key Directories

| Path                       | Purpose                    |
| -------------------------- | -------------------------- |
| `packages/web/src/app/`    | Next.js routes             |
| `packages/web/src/server/` | tRPC routers, server logic |
| `packages/web/src/lib/`    | Shared utilities           |
| `packages/web/src/hooks/`  | React hooks                |
| `packages/web/src/db/`     | Drizzle schema             |
| `.opencode/skill/`         | Skills (load these!)       |
| `.opencode/agent/`         | Agent definitions          |

### External Resources

- **Notion MCP** - Product context, messaging, specs
- **Exa MCP** - Technical research, cutting-edge APIs
- **DESIGN-LANGUAGE.md** - UI/visual standards

---

## Commands Quick Reference

```bash
# Dev server
cd packages/web && pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm --filter @zero-finance/web test

# Vercel logs (ALWAYS use --scope prologe)
vercel logs www.0.finance --scope prologe --since 5m

# Wait for deployment
vercel inspect <url> --scope prologe --wait --timeout 5m

# List deployments
vercel ls --scope prologe | head -5
```

---

## Completion Protocol (MANDATORY)

**Before saying "done", "complete", "fixed", or asking "anything else?" you MUST:**

```
skill("skill-reinforcement")
```

This is non-negotiable. The RL pipeline depends on capturing learnings from every task.

**Trigger conditions:**

- Finished a feature or fix
- Resolved a bug
- Completed a debugging session
- Finished any multi-step task
- Used any skill from `.opencode/skill/`

**Skip ONLY if:** The task was a single trivial command (e.g., "what time is it?", "list files")

---

## After Every Task Checklist

```
[!] skill("skill-reinforcement") ← FIRST, before anything else
[ ] Feature/fix complete
[ ] Tests written (local → API → staging)
[ ] Branch pushed, preview deployed
[ ] Tested on staging (if applicable)
[ ] Learnings captured in skill-reinforcement
```

---

## Error Handling Philosophy

1. **Fail fast locally** - Catch issues before they reach staging
2. **Log extensively in dev** - But sanitize in prod
3. **Graceful degradation** - Features should fail safely
4. **Trace everything** - Use `[ComponentName]` prefixes in logs

---

## Security Reminders

- Never log credentials, tokens, or OTPs
- Never commit `.env` files
- Sanitize error messages before GitHub/logs
- Use workspace-scoped API keys
- Human approval required for transfers

---

## When Stuck

1. Check if there's a skill for this: `ls .opencode/skill/`
2. Search codebase: `grep -r "pattern" packages/web/src/`
3. Check Notion for product context
4. Use Exa for external research
5. If novel problem, document solution in a skill

# Agent-Native Architecture: Implementation Guide

A practical reference for building applications where agents are first-class citizens.

---

## Core Principles

### 1. Parity

**Whatever the user can do through the UI, the agent must be able to achieve through tools.**

Create a capability map:

| User Action | Agent Method                        |
| ----------- | ----------------------------------- |
| Create item | `write_file` or `create_item` tool  |
| Update item | `update_file` or `update_item` tool |
| Delete item | `delete_file` or `delete_item` tool |
| Search      | `search_files` or `search` tool     |

**Test:** Pick any UI action. Can the agent accomplish it?

### 2. Granularity

**Prefer atomic primitives. Features are outcomes achieved by an agent in a loop.**

```
# Wrong - logic in code
Tool: classify_and_organize_files(files)

# Right - agent decides
Tools: read_file, write_file, move_file, list_directory, bash
Prompt: "Organize downloads by content and recency"
```

**Test:** To change behavior, do you edit prose or refactor code?

### 3. Composability

**New features = new prompts (when tools are atomic and parity exists).**

```
Prompt: "Review files modified this week. Summarize changes. Suggest three priorities."
```

No code written. Agent uses `list_files`, `read_file`, and judgment.

### 4. Emergent Capability

**Agent can accomplish things you didn't explicitly design for.**

Build atomic tools → Users ask unexpected things → Agent composes solutions → You observe patterns → Optimize common patterns → Repeat.

---

## Tool Design

### Domain Tools

Add when needed for:

1. **Vocabulary anchoring** - `create_note` teaches "note" concept better than "write file with format"
2. **Guardrails** - Validation that shouldn't be left to agent judgment
3. **Efficiency** - Common multi-step operations

**Rule:** One conceptual action per tool. Judgment stays in prompts.

```
# Wrong
analyze_and_publish(input)  # bundles judgment

# Right
publish(content)  # one action, agent decided what to publish
```

**Keep primitives available.** Domain tools are shortcuts, not gates.

### CRUD Completeness

For every entity, verify agent has:

- **Create** - Can make new instances
- **Read** - Can see what exists
- **Update** - Can modify existing
- **Delete** - Can remove

### Dynamic Capability Discovery

Instead of static tool-per-endpoint:

```python
# Two tools handle any API
list_available_types() → ["steps", "heart_rate", "sleep", ...]
read_data(type) → reads any discovered type
```

Agent discovers capabilities at runtime. New API features work automatically.

---

## Completion Signals

**Provide explicit completion tool. Don't use heuristics.**

```swift
struct ToolResult {
    let success: Bool
    let output: String
    let shouldContinue: Bool
}

// Usage patterns:
.success("Result")    // success=true, continue=true
.error("Message")     // success=false, continue=true (recoverable)
.complete("Done")     // success=true, continue=false (stop loop)
```

### Partial Completion

Track progress at task level:

```swift
struct AgentTask {
    var status: TaskStatus  // pending, in_progress, completed, failed, skipped
    var notes: String?
}
```

Checkpoint preserves which tasks completed. Resume continues from there.

---

## Files as Universal Interface

### Why Files

- Agents already know `cat`, `grep`, `mv`, `mkdir`
- Files are inspectable, portable, sync across devices
- Directory structure = information architecture

### File Organization

```
{entity_type}/{entity_id}/
├── primary content
├── metadata
└── related materials
```

**Naming conventions:**

| Type        | Pattern                  | Example            |
| ----------- | ------------------------ | ------------------ |
| Entity data | `{entity}.json`          | `library.json`     |
| Content     | `{type}.md`              | `introduction.md`  |
| Agent logs  | `agent_log.md`           | Per-entity history |
| Checkpoints | `{sessionId}.checkpoint` | UUID-based         |

**Ephemeral vs. durable:**

```
Documents/
├── AgentCheckpoints/     # Ephemeral
├── AgentLogs/            # Ephemeral
└── Research/             # Durable (user's work)
```

### The context.md Pattern

Agent reads at session start:

```markdown
# Context

## Who I Am

Reading assistant for the app.

## What I Know About This User

- Interested in military history
- Prefers concise analysis

## What Exists

- 12 notes in /notes
- 3 active projects

## Recent Activity

- Created "Project kickoff" (2 hours ago)

## My Guidelines

- Don't spoil books they're reading

## Current State

- No pending tasks
- Last sync: 10 minutes ago
```

### Files vs. Database

| Use files for                  | Use database for            |
| ------------------------------ | --------------------------- |
| User-readable/editable content | High-volume structured data |
| Configuration                  | Complex queries             |
| Agent-generated content        | Ephemeral state             |
| Transparency matters           | Relationships/indexing      |

---

## Context Injection

System prompts include:

**Available resources:**

```
## Available Data
- 12 notes in /notes, most recent: "Project kickoff" (today)
- 3 projects in /projects
```

**Capabilities:**

```
## What You Can Do
- Create, edit, tag, delete notes
- Organize files into projects
- Search across all content
```

**Recent activity:**

```
## Recent Context
- User created "Project kickoff" (2 hours ago)
```

---

## Agent-to-UI Communication

**Event types:**

```swift
enum AgentEvent {
    case thinking(String)
    case toolCall(String, String)
    case toolResult(String)
    case textResponse(String)
    case statusChange(Status)
}
```

**Principles:**

- No silent actions - changes visible immediately
- Show progress during execution, not just results
- Consider `ephemeralToolCalls` flag for noisy internal operations

---

## Mobile Specifics

### Checkpoint and Resume

```swift
struct AgentCheckpoint: Codable {
    let agentType: String
    let messages: [[String: Any]]
    let iterationCount: Int
    let taskListJSON: String?
    let customState: [String: String]
    let timestamp: Date
}
```

**When to checkpoint:**

- On app backgrounding
- After each tool result
- Periodically during long operations

**Resume flow:**

1. Load interrupted sessions on launch
2. Filter by validity (default 1 hour max age)
3. Show resume prompt if valid
4. Restore messages and continue loop

### Background Execution

~30 seconds available. Use to:

- Complete current tool call if possible
- Checkpoint session state
- Transition to backgrounded state

### Storage (iCloud-first)

```swift
var containerURL: URL {
    if let iCloudURL = fileManager.url(forUbiquityContainerIdentifier: nil) {
        return iCloudURL.appendingPathComponent("Documents")
    }
    return fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
}
```

---

## Anti-Patterns

| Anti-Pattern                                   | Fix                                        |
| ---------------------------------------------- | ------------------------------------------ |
| Agent as router only                           | Let agent act, not just route              |
| Workflow-shaped tools (`analyze_and_organize`) | Break into primitives                      |
| Orphan UI actions                              | Maintain parity                            |
| Context starvation                             | Inject resources into system prompt        |
| Gates without reason                           | Default to open, keep primitives available |
| Heuristic completion detection                 | Explicit completion tool                   |
| Static API mapping                             | Dynamic capability discovery               |

---

## Success Checklist

**Architecture:**

- [ ] Agent can achieve anything users can (parity)
- [ ] Tools are atomic primitives (granularity)
- [ ] New features = new prompts (composability)
- [ ] Agent handles unexpected requests (emergent capability)

**Implementation:**

- [ ] System prompt includes resources and capabilities
- [ ] Agent and user share same data space
- [ ] Agent actions reflect immediately in UI
- [ ] Every entity has full CRUD
- [ ] Agents explicitly signal completion

**Ultimate test:** Describe an outcome in your domain that you didn't build a feature for. Can the agent figure it out in a loop until success?
