# OpenCode Quick Reference - 0 Finance

## Start OpenCode
```bash
cd /Users/benjaminshafii/git/zerofinance
opencode
```

## Agent Invocation

### @ Mention (Direct)
```
@notion-company-intel What are our Q4 metrics?
@startup-funding-researcher Research Anthropic's latest funding
@git-parallel Create worktree for feature/new-onboarding
```

### Natural Language (Indirect)
```
# Primary agent delegates to appropriate subagent
What's our Series A outreach status?
Add Perplexity to companies.json
Work on two features in parallel
```

## Quick Commands

### Switch Agents
- **Tab** - Cycle through primary agents
- **Ctrl+P** - Open command palette

### Models
```
/models              # Select model
/model anthropic/claude-sonnet-4-20250514
```

### Session Management
```
opencode -c          # Continue last session
opencode -s <id>     # Continue specific session
```

## Agent Cheat Sheet

| Agent | MCP | Use When |
|-------|-----|----------|
| **notion-company-intel** | Notion | Need company data, metrics, investor info |
| **startup-funding-researcher** | Exa | Research startup funding, update companies.json |
| **notion-intel** | Notion | General Notion workspace queries |
| **research** | Exa | Technical research, code examples |
| **git-parallel** | - | Parallel feature development with worktrees |

## MCP Tools Available

### Notion MCP
```
notion_notion-search          # Semantic workspace search
notion_notion-fetch           # Get page/database content
notion_notion-get-comments    # Retrieve page comments
notion_notion-get-users       # List workspace users
notion_notion-create-pages    # Create new pages
notion_notion-update-page     # Update page content/properties
```

### Exa MCP
```
exa_web_search_exa           # Neural web search
exa_get_code_context_exa     # Get code examples/docs
```

## Common Workflows

### 1. Company Intelligence Query
```bash
opencode
# Then:
@notion-company-intel What's the latest from our investor deck?
```

### 2. Startup Research
```bash
opencode
# Then:
@startup-funding-researcher Research the latest funding for Stripe
# Agent will:
# 1. Search Exa for funding news
# 2. Extract company/founder data
# 3. Try Clearbit for logo
# 4. Provide image download checklist
# 5. Update companies.json
```

### 3. Parallel Feature Development
```bash
opencode
# Then:
@git-parallel Create worktrees for feature/kyc and feature/earnings
# Agent will:
# 1. Create separate worktrees
# 2. Set up branches
# 3. Guide you through parallel dev
# 4. Run typecheck/lint before merge
# 5. Clean up worktrees
```

### 4. Technical Research
```bash
opencode
# Then:
@research Find best practices for Next.js 15 server actions
# Agent will:
# 1. Use Exa to search code examples
# 2. Fetch relevant documentation
# 3. Provide curated excerpts
```

## Configuration Locations

| Type | Path | Purpose |
|------|------|---------|
| **Project Config** | `opencode.json` | MCP servers, agents, tool permissions |
| **Agent Definitions** | `.opencode/agents/*.md` | Custom agent prompts |
| **Global Config** | `~/.config/opencode/opencode.json` | Themes, keybinds, global settings |

## Environment Variables

```bash
# Use custom config file
export OPENCODE_CONFIG=/path/to/opencode.json

# Use custom agents directory
export OPENCODE_CONFIG_DIR=/path/to/.opencode

# Start OpenCode
opencode
```

## Troubleshooting

### MCP Not Loading
```bash
# Check config
cat opencode.json | jq '.mcp'

# Test Notion MCP
npx -y mcp-remote https://mcp.notion.com/mcp

# Test Exa MCP
curl -I https://mcp.exa.ai/mcp
```

### Agent Not Found
```bash
# List agents
ls -1 .opencode/agents/

# Verify frontmatter
head -n 10 .opencode/agents/notion-company-intel.md

# Check config
cat opencode.json | jq '.agents | keys'
```

### Tool Permission Denied
```bash
# Check agent tools
cat opencode.json | jq '.agents["notion-company-intel"].tools'

# Enable tool
# Edit opencode.json and set tool to true
```

## Tips & Tricks

### 1. Use Tab Completion
Press **Tab** to cycle through available agents

### 2. Check Context Usage
MCP servers add to context. Use specific agents to minimize token usage.

### 3. Batch Operations
Invoke multiple agents in sequence:
```
@research Find Next.js 15 best practices
@notion-intel Document findings in our Tech Stack page
```

### 4. Customize Prompts
Edit `.opencode/agents/*.md` to refine agent behavior

### 5. Create New Agents
```bash
opencode agent create
# Follow prompts to create custom agent
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab** | Switch agent |
| **Ctrl+P** | Command palette |
| **Ctrl+C** | Cancel/exit |
| **Ctrl+D** | End session |

## File Locations

```
zerofinance/
├── opencode.json                    # Main config (MCP + agents)
├── .opencode/
│   ├── README.md                    # Full documentation
│   ├── QUICK_REFERENCE.md          # This file
│   └── agents/
│       ├── notion-company-intel.md
│       └── startup-funding-researcher.md
└── OPENCODE_MIGRATION.md           # Migration guide
```

## Resources

- **Docs**: https://opencode.ai/docs/
- **Agents**: https://opencode.ai/docs/agents/
- **MCP**: https://opencode.ai/docs/mcp-servers/
- **Issues**: https://github.com/sst/opencode

## Quick Tests

### Test Notion Agent
```
opencode
@notion-company-intel Search workspace for "investor deck"
```

### Test Research Agent
```
opencode
@startup-funding-researcher Find latest funding for Vercel
```

### Test Git Agent
```
opencode
@git-parallel Show current worktrees
```

---

**Need help?** Check `.opencode/README.md` or `OPENCODE_MIGRATION.md`
