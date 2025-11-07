# Claude CLI → OpenCode Migration Complete

## Summary

Successfully migrated your Claude CLI agent configuration to OpenCode, a compatible CLI tool for working with AI agents.

## What Was Done

### 1. Created OpenCode Directory Structure
```
.opencode/
├── agents/
│   ├── notion-company-intel.md
│   └── startup-funding-researcher.md
└── README.md
```

### 2. Migrated Custom Agents
Both agents from `.claude/agents/` have been converted to OpenCode format:

#### notion-company-intel
- **Purpose**: Company intelligence via Notion workspace
- **MCP**: Notion
- **Tools**: Notion search/fetch, file operations
- **Key difference**: Changed `model: sonnet` → `model: anthropic/claude-sonnet-4-20250514`

#### startup-funding-researcher
- **Purpose**: Startup funding research and tracking
- **MCP**: Exa
- **Tools**: Exa search, file operations, bash (for curl)
- **Key difference**: Added `mode: subagent` to frontmatter

### 3. Updated opencode.json
Enhanced the existing config with:
- Explicit agent definitions with tool permissions
- MCP server configuration (Exa + Notion)
- Timeout settings for better reliability
- Enabled flags for MCP servers

## Key Differences: Claude CLI vs OpenCode

| Feature | Claude CLI | OpenCode |
|---------|-----------|----------|
| **Agent invocation** | Automatic context detection | `@agent-name` mentions |
| **Model format** | `sonnet`, `opus` | `anthropic/claude-sonnet-4-20250514` |
| **Config location** | `.claude/` | `.opencode/` or `opencode.json` |
| **Tool permissions** | Implicit | Explicit per agent |
| **MCP servers** | Auto-detected | Configured in JSON |
| **Agent switching** | Context-based | Tab key or `@mention` |

## How to Use

### Start OpenCode
```bash
cd /Users/benjaminshafii/git/zerofinance
opencode
```

### Invoke Agents

**Method 1: @ Mention**
```
@notion-company-intel What's our Series A status?
```

**Method 2: Natural Language (via Task tool)**
```
Can you research the latest funding for Anthropic?
# The primary agent will invoke @startup-funding-researcher
```

### Switch Primary Agents
Press **Tab** to cycle through primary agents (Build, Plan, etc.)

## MCP Servers Configured

### Exa MCP (Remote)
- **URL**: https://mcp.exa.ai/mcp
- **Purpose**: Web search, code context, technical research
- **Status**: ✅ Enabled

### Notion MCP (Local Proxy)
- **Command**: `npx -y mcp-remote https://mcp.notion.com/mcp`
- **Purpose**: Workspace search, page operations
- **Status**: ✅ Enabled

## Agent Capabilities

### notion-company-intel
```
✅ Search Notion workspace
✅ Fetch page content
✅ Read/write/edit files
✅ List directories
❌ Shell commands
❌ Code search
```

**Use for**:
- Investor outreach status
- Company metrics/KPIs
- Product messaging
- Business intelligence

### startup-funding-researcher
```
✅ Exa web search
✅ Exa code context
✅ Read/write/edit files
✅ Shell commands (curl for logos)
✅ Code search (glob/grep)
```

**Use for**:
- Researching startup funding rounds
- Updating companies.json
- Downloading founder profiles
- Tracking competitor fundraising

## Testing Your Setup

### 1. Test Notion Agent
```bash
opencode
# In TUI:
@notion-company-intel Search for our latest investor deck
```

### 2. Test Research Agent
```bash
opencode
# In TUI:
@startup-funding-researcher Research funding for OpenAI
```

### 3. Check MCP Status
```bash
opencode
# In TUI:
/models
# Should show anthropic/claude-sonnet-4-20250514 available
```

## Configuration Files

### Project Config
**Location**: `opencode.json`
**Contains**:
- MCP servers (Exa, Notion)
- Agent definitions
- Tool permissions

### Agent Definitions
**Location**: `.opencode/agents/*.md`
**Format**:
```markdown
---
name: agent-name
description: Usage description...
mode: subagent
model: anthropic/claude-sonnet-4-20250514
---

System prompt...
```

## Environment Setup (Optional)

### Custom Config Path
```bash
export OPENCODE_CONFIG=/path/to/custom/opencode.json
opencode
```

### Custom Agents Directory
```bash
export OPENCODE_CONFIG_DIR=/path/to/custom/.opencode
opencode
```

## Troubleshooting

### MCP Server Won't Connect

**Exa (Remote)**:
```bash
# Check if URL is reachable
curl -I https://mcp.exa.ai/mcp
```

**Notion (Local Proxy)**:
```bash
# Verify npx is available
which npx
npm install -g npm  # Update npm if needed
```

### Agent Not Found
```bash
# Verify agent files exist
ls -la .opencode/agents/

# Check frontmatter syntax
head -n 10 .opencode/agents/notion-company-intel.md
```

### Tool Permission Error
Check `opencode.json` → `agents` → `[agent-name]` → `tools` section.

Example:
```json
{
  "agents": {
    "notion-company-intel": {
      "tools": {
        "notion_notion-search": true,
        "read": true,
        "write": true
      }
    }
  }
}
```

## Next Steps

### 1. Test Both Agents
Run a few test queries to ensure MCP connections work.

### 2. Customize Prompts (Optional)
Edit `.opencode/agents/*.md` to refine agent behavior for your specific needs.

### 3. Add More Agents (Optional)
Create new agents using:
```bash
opencode agent create
```

### 4. Configure Keybindings (Optional)
Add to `~/.config/opencode/opencode.json`:
```json
{
  "keybinds": {
    "ctrl-n": ["switchAgent", "notion-company-intel"],
    "ctrl-r": ["switchAgent", "startup-funding-researcher"]
  }
}
```

## Resources

- **OpenCode Docs**: https://opencode.ai/docs/
- **Agents Guide**: https://opencode.ai/docs/agents/
- **MCP Servers**: https://opencode.ai/docs/mcp-servers/
- **Config Reference**: https://opencode.ai/docs/config/

## Support

If you encounter issues:
1. Check `.opencode/README.md` for detailed documentation
2. Visit https://github.com/sst/opencode for bug reports
3. Review agent prompts in `.opencode/agents/` for customization

---

**Migration Status**: ✅ Complete
**Agents Migrated**: 2/2
**MCP Servers**: 2/2 configured
**Ready to Use**: Yes
