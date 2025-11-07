# OpenCode Configuration for 0 Finance

This directory contains OpenCode-specific configuration and custom agents migrated from Claude CLI setup.

## Structure

```
.opencode/
├── agents/
│   ├── notion-company-intel.md      # Company intelligence agent (Notion MCP)
│   └── startup-funding-researcher.md # Startup funding research agent (Exa MCP)
└── README.md                         # This file
```

## Agents

### Custom Agents (in `.opencode/agents/`)

#### 1. `notion-company-intel`
**Purpose**: Company intelligence specialist using Notion MCP
**Use cases**:
- Investor outreach status queries
- Company metrics and KPIs
- Product messaging and value propositions
- Business intelligence from Notion workspace

**Invoke with**: `@notion-company-intel`

**Example**:
```
@notion-company-intel What's the status of our Series A outreach?
```

#### 2. `startup-funding-researcher`
**Purpose**: Startup funding research using Exa MCP
**Use cases**:
- Research latest funding rounds for startups
- Track competitor fundraising
- Maintain companies.json with funding data
- Gather founder profiles and company logos

**Invoke with**: `@startup-funding-researcher`

**Example**:
```
@startup-funding-researcher Research the latest funding for Anthropic
```

### Built-in Agents (configured in `opencode.json`)

#### 3. `notion-intel` (legacy)
Similar to `notion-company-intel` but with inline prompt in config.

#### 4. `research`
General-purpose research agent using Exa for technical context.

#### 5. `git-parallel`
Git worktree specialist for parallel development workflows.

## MCP Servers

Configured in `opencode.json`:

### Exa MCP
- **Type**: Remote
- **URL**: https://mcp.exa.ai/mcp
- **Capabilities**: Web search, code context, technical research
- **Used by**: `research`, `startup-funding-researcher`

### Notion MCP
- **Type**: Local (via npx proxy)
- **Command**: `npx -y mcp-remote https://mcp.notion.com/mcp`
- **Capabilities**: Workspace search, page fetch, comments, users
- **Used by**: `notion-intel`, `notion-company-intel`

## Usage

### Switching Between Agents

In OpenCode TUI:
- Press **Tab** to cycle through primary agents
- Use `@agent-name` to invoke a specific subagent in your message

### Example Workflows

#### Company Intelligence Query
```bash
opencode
# In TUI, type:
@notion-company-intel What are our latest customer metrics?
```

#### Startup Research
```bash
opencode
# In TUI, type:
@startup-funding-researcher Add Perplexity to our companies list
```

#### Parallel Development
```bash
opencode
# In TUI, type:
@git-parallel Create a worktree for feature/new-kyc-flow
```

## Configuration Files

### Global Config
Location: `~/.config/opencode/opencode.json`
Use for: Themes, keybinds, global model settings

### Project Config
Location: `/Users/benjaminshafii/git/zerofinance/opencode.json`
Current setup:
- MCP servers (Exa, Notion)
- Project-specific agents
- Agent tool permissions

### Agent Definitions
Location: `.opencode/agents/*.md`
Format: Frontmatter + system prompt

```markdown
---
name: agent-name
description: When to use this agent...
mode: subagent
model: anthropic/claude-sonnet-4-20250514
---

System prompt content here...
```

## Migration from Claude CLI

The following agents were migrated from `.claude/agents/`:

| Claude Agent | OpenCode Agent | Status |
|--------------|----------------|--------|
| `notion-company-intel.md` | `.opencode/agents/notion-company-intel.md` | ✅ Migrated |
| `startup-funding-researcher.md` | `.opencode/agents/startup-funding-researcher.md` | ✅ Migrated |

### Key Differences

1. **Agent frontmatter**:
   - Claude: `model: sonnet`, `color: yellow`
   - OpenCode: `model: anthropic/claude-sonnet-4-20250514`, `mode: subagent`

2. **Tool configuration**:
   - Claude: Tools configured in main config
   - OpenCode: Tools explicitly listed in agent frontmatter or `opencode.json`

3. **Invocation**:
   - Claude: Automatic based on context
   - OpenCode: Manual with `@agent-name` or via Task tool

## Tool Permissions

### notion-company-intel
- ✅ Notion tools (search, fetch, comments, users)
- ✅ File operations (read, write, edit, list)
- ❌ Shell access (bash)
- ❌ Code search (glob, grep)

### startup-funding-researcher
- ✅ Exa tools (web search, code context)
- ✅ File operations (read, write, edit, list)
- ✅ Shell access (bash) - for curl downloads
- ✅ Code search (glob, grep)

## Environment Variables

### Custom Config Path
```bash
export OPENCODE_CONFIG=/path/to/custom/opencode.json
opencode
```

### Custom Config Directory
```bash
export OPENCODE_CONFIG_DIR=/path/to/custom/config
opencode
```

## Troubleshooting

### MCP Server Not Loading
1. Check MCP is enabled: `"enabled": true` in `opencode.json`
2. Increase timeout: `"timeout": 10000`
3. For Notion MCP, ensure `npx` is available: `which npx`

### Agent Not Found
1. Check agent file exists: `ls .opencode/agents/`
2. Verify frontmatter syntax (YAML between `---`)
3. Ensure `mode: subagent` is set

### Tool Permission Denied
1. Check tool is enabled in agent's `tools` section
2. For MCP tools, verify MCP server is loaded
3. Check tool name matches exactly (e.g., `notion_notion-search` not `notion_search`)

## References

- [OpenCode Docs - Agents](https://opencode.ai/docs/agents/)
- [OpenCode Docs - MCP Servers](https://opencode.ai/docs/mcp-servers/)
- [OpenCode Docs - Config](https://opencode.ai/docs/config/)
- [Exa MCP Documentation](https://docs.exa.ai/mcp)
- [Notion MCP Documentation](https://www.notion.com/mcp)
