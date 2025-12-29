---
description: Initialize the outreach system by loading configuration from your Notion "MCP Skills" page. Run this once after cloning or when configuration changes.
mode: subagent
model: anthropic/claude-opus-4-5-20251101
temperature: 0.2
tools:
  notion_notion-search: true
  notion_notion-fetch: true
  read: true
  write: true
---

# Setup Workspace - Initialize Outreach Configuration

## Step 0: Identify the User

**ALWAYS START BY ASKING:**

> "Who are you - **Benjamin** or **Raghav**?"

This determines which personal configuration to load:

| Person   | Todo Page                                                                                 | Primary Focus                   |
| -------- | ----------------------------------------------------------------------------------------- | ------------------------------- |
| Benjamin | [Benjamin To Dos](https://www.notion.so/Benjamin-To-Dos-2b68ed524fef806395bafa38515b23e4) | Engineering, launches, demos    |
| Raghav   | (Add URL when available)                                                                  | BD, investor relations, content |

Store the user identity in `.opencode/config/workspace.json` under `"current_user"`.

---

## Pre-flight Checklist

Before using the outreach pipeline, ensure all MCP servers are configured:

- [ ] **Exa MCP** - API key configured (get from dashboard.exa.ai)
- [ ] **Notion MCP** - OAuth authenticated (first use prompts login)
- [ ] **Chrome DevTools MCP** - Chrome browser installed and accessible
- [ ] **MCP Skills page** exists in your Notion workspace
- [ ] **Databases created** and linked in MCP Skills page

Run through each section below to complete setup.

---

## MCP Server Setup (REQUIRED FIRST)

The outreach pipeline depends on three MCP servers. **All three must be working** for the full pipeline to function.

### 1. Exa MCP - Web Search & Research

**What it does:**
Exa provides AI-powered web search, code context retrieval, and web crawling. It's used to:

- Research leads and their companies
- Find relevant news and content about prospects
- Get code examples and documentation
- Crawl specific URLs for detailed information

**Setup Steps:**

1. **Get an API Key:**
   - Go to [dashboard.exa.ai](https://dashboard.exa.ai)
   - Sign up or log in with Google
   - Copy your API key from the dashboard

2. **Configure in opencode.json:**
   The Exa MCP is already configured as a remote server. To add your API key, update the URL:

   ```json
   {
     "mcp": {
       "exa": {
         "type": "remote",
         "url": "https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY_HERE&tools=web_search_exa,get_code_context_exa,crawling_exa"
       }
     }
   }
   ```

3. **Available Tools:**
   | Tool | Purpose |
   |------|---------|
   | `web_search_exa` | Search the web for any topic |
   | `get_code_context_exa` | Find code examples and documentation |
   | `crawling_exa` | Extract content from specific URLs |

**What Breaks Without It:**

- ❌ Cannot research leads or their companies
- ❌ Cannot find recent news about prospects
- ❌ Cannot crawl LinkedIn profiles or company websites
- ❌ Cannot get code examples for technical prospects
- ❌ Lead research agent fails completely

---

### 2. Notion MCP - CRM & Knowledge Base

**What it does:**
Notion MCP connects your AI tools directly to your Notion workspace. It's used to:

- Read ICP (Ideal Customer Profile) definitions
- Access the Outreach Tracking database (your CRM)
- Log sent messages to the Opener database
- Read product messaging guidelines
- Access founder bios and credibility info

**Setup Steps:**

1. **First-Time Authentication:**
   - The Notion MCP uses OAuth - no API key needed
   - On first use, you'll be prompted to authorize access
   - Click "Allow" to grant access to your workspace

2. **Configuration (already in opencode.json):**

   ```json
   {
     "mcp": {
       "notion": {
         "type": "local",
         "command": ["npx", "-y", "mcp-remote", "https://mcp.notion.com/mcp"],
         "enabled": true
       }
     }
   }
   ```

3. **Alternative: Connect via Notion App:**
   - Open Notion → Settings → Connections → Notion MCP
   - Choose your AI tool from the gallery
   - Complete the OAuth flow

**What Breaks Without It:**

- ❌ Cannot read ICP definitions (don't know who to target)
- ❌ Cannot access Outreach Tracking database (no lead pipeline)
- ❌ Cannot log sent messages (no record of outreach)
- ❌ Cannot read product messaging (messages off-brand)
- ❌ Cannot access founder info (no credibility in messages)
- ❌ **Entire outreach pipeline fails** - this is the central data store

---

### 3. Chrome DevTools MCP - Browser Automation

**What it does:**
Chrome DevTools MCP lets AI control a live Chrome browser. It's used to:

- Navigate to LinkedIn profiles
- Take screenshots of profiles and posts
- Interact with web pages (click, fill forms)
- Debug and inspect page content
- Automate repetitive browser tasks

**Setup Steps:**

1. **Prerequisites:**
   - Node.js v20.19+ installed
   - Chrome browser (stable version) installed
   - npm available in your PATH

2. **Configuration (already in opencode.json):**

   ```json
   {
     "mcp": {
       "chrome": {
         "type": "local",
         "command": [
           "bash",
           "-c",
           "source ~/.nvm/nvm.sh && npx -y chrome-devtools-mcp@latest"
         ]
       }
     }
   }
   ```

3. **First Run:**
   - The MCP server will automatically start Chrome when needed
   - A new Chrome profile is created at `~/.cache/chrome-devtools-mcp/chrome-profile-stable`
   - This profile persists between sessions

4. **Optional: Connect to Existing Chrome:**
   If you want to use your existing Chrome session:
   ```json
   {
     "mcp": {
       "chrome": {
         "type": "local",
         "command": [
           "bash",
           "-c",
           "source ~/.nvm/nvm.sh && npx -y chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222"
         ]
       }
     }
   }
   ```
   Then start Chrome with: `chrome --remote-debugging-port=9222`

**What Breaks Without It:**

- ❌ Cannot view LinkedIn profiles
- ❌ Cannot take screenshots of prospects
- ❌ Cannot automate browser interactions
- ❌ Cannot verify profile information visually
- ❌ Manual copy-paste required for all web research

---

## Verifying MCP Connections

Run these tests to confirm each MCP is working:

### Test Exa MCP

Ask the agent:

```
Search for "Y Combinator startups 2024" using Exa
```

**Expected:** Returns search results with startup information

### Test Notion MCP

Ask the agent:

```
Search Notion for "MCP Skills"
```

**Expected:** Finds your MCP Skills configuration page

### Test Chrome DevTools MCP

Ask the agent:

```
Navigate to https://example.com and take a screenshot
```

**Expected:** Opens Chrome, navigates to the page, returns screenshot

---

## Troubleshooting

### Exa MCP Issues

| Problem               | Solution                                        |
| --------------------- | ----------------------------------------------- |
| "Invalid API key"     | Verify key at dashboard.exa.ai, check for typos |
| "Rate limit exceeded" | Wait 1 minute, or upgrade your Exa plan         |
| Tools not available   | Check URL includes `tools=` parameter           |

### Notion MCP Issues

| Problem             | Solution                                          |
| ------------------- | ------------------------------------------------- |
| "Not authenticated" | Re-run any Notion tool to trigger OAuth           |
| "Page not found"    | Ensure page is shared with your Notion account    |
| "Permission denied" | Check workspace permissions in Notion settings    |
| Connection timeout  | Restart the MCP server, check internet connection |

### Chrome DevTools MCP Issues

| Problem               | Solution                                        |
| --------------------- | ----------------------------------------------- |
| "Chrome not found"    | Install Chrome or set `--executable-path`       |
| "Port already in use" | Close other Chrome instances or change port     |
| "Sandbox error"       | Try `--no-sandbox` flag (less secure)           |
| Slow startup          | First run downloads Puppeteer, wait ~30 seconds |
| "Node not found"      | Ensure Node.js v20.19+ is installed             |

### General MCP Issues

| Problem               | Solution                                      |
| --------------------- | --------------------------------------------- |
| MCP not connecting    | Check opencode.json syntax is valid JSON      |
| Tools not appearing   | Restart your AI tool/IDE                      |
| Intermittent failures | Check network connection, restart MCP servers |

---

## What This Agent Does

After MCP servers are configured, this agent initializes the outreach pipeline by:

1. Searching Notion for a page titled "MCP Skills"
2. Parsing configuration tables and sections
3. Extracting: database URLs, ICP pages, product context, founder info, messaging framework
4. Writing everything to `.opencode/config/workspace.json`
5. Reporting what was loaded

## When to Run This

- **First time setup** after cloning the repo
- **After updating MCP Skills** page in Notion
- **When switching workspaces** (different Notion account)

---

## Workflow

### Step 1: Find MCP Skills Page

```
Search Notion for "MCP Skills" page
```

If not found, report error and provide template for user to create.

### Step 2: Fetch Full Page Content

```
Fetch the MCP Skills page to get all configuration sections
```

### Step 3: Parse Configuration

Extract the following from the page:

**Database Collection URLs** (from table):

- Outreach Tracking → `databases.outreach_tracking`
- Opener → `databases.opener`

**ICP Page URLs** (from table):

- AI Seed Startup → `pages.icp_ai_seed`
- Crypto-Native → `pages.icp_crypto`
- Family Business → `pages.icp_family`
- FinTech Adjacent → `pages.icp_fintech`
- E-commerce/FBA → `pages.icp_ecommerce`

**Product Messaging**:

- DO Say list → `product.do_say`
- DON'T Say list → `product.dont_say`

**Founder Info** (from table):

- Name, Role, Bio for each → `founders[]`

**5-Element Framework** (from table):

- Elements with weights and examples → `messaging.elements`

**Calendar/Contact**:

- Calendar link → `contact.calendar`

### Step 4: Write Configuration

Write parsed config to `.opencode/config/workspace.json`:

```json
{
  "initialized_at": "2025-12-09T00:00:00Z",
  "source_page": "https://notion.so/MCP-Skills-...",
  "current_user": "benjamin",

  "users": {
    "benjamin": {
      "name": "Benjamin Shafii",
      "todo_page": "https://www.notion.so/Benjamin-To-Dos-2b68ed524fef806395bafa38515b23e4"
    },
    "raghav": {
      "name": "Raghav Aggarwal",
      "todo_page": null
    }
  },

  "mega_goal": {
    "page": "https://www.notion.so/V2-2d28ed524fef803db5a6d5fdbea55bbd",
    "summary": "Convert $2.2M LOIs → $4M pipeline, 20-30% funded (~$1-1.5M AUM)",
    "lever": "Launch = trust bottleneck breaker, inbound > outbound"
  },

  "databases": {
    "outreach_tracking": "collection://...",
    "opener": "collection://..."
  },

  "pages": {
    "icp_ai_seed": "https://notion.so/...",
    "icp_crypto": "https://notion.so/...",
    "icp_family": "https://notion.so/...",
    "icp_fintech": "https://notion.so/...",
    "icp_ecommerce": "https://notion.so/..."
  },

  "product": {
    "name": "...",
    "do_say": ["...", "..."],
    "dont_say": ["...", "..."]
  },

  "founders": [
    {"name": "...", "role": "...", "bio": "..."}
  ],

  "messaging": {
    "elements": [
      {"name": "Vision", "weight": 2, "description": "...", "example": "..."},
      ...
    ],
    "style_rules": ["lowercase", "no links first message", ...],
    "signature": "best, ben"
  },

  "contact": {
    "calendar": "https://cal.com/..."
  },

  "files": {
    "feedback_insights": "research/message-feedback-insights.md",
    "active_draft": "research/active-draft.md",
    "sent_examples": "research/outreach-sent-examples.md"
  }
}
```

### Step 5: Report Results

```
✓ Found MCP Skills page: [URL]
✓ Loaded 2 databases
✓ Loaded 5 ICP pages
✓ Loaded product messaging (5 do's, 4 don'ts)
✓ Loaded 2 founders
✓ Loaded 5-element framework
✓ Config saved to .opencode/config/workspace.json

Ready to use outreach pipeline!
```

---

## MCP Skills Page Template

If the MCP Skills page doesn't exist or is missing sections, provide this template:

```markdown
# MCP Skills

This page configures the outreach pipeline agents.

## Database Collection URLs

| Database          | Collection URL              | Purpose           |
| ----------------- | --------------------------- | ----------------- |
| Outreach Tracking | `collection://YOUR-ID-HERE` | Lead pipeline     |
| Opener            | `collection://YOUR-ID-HERE` | Sent messages log |

## ICP Page URLs

| ICP              | Page URL                    |
| ---------------- | --------------------------- |
| AI Seed Startup  | https://notion.so/YOUR-PAGE |
| Crypto-Native    | https://notion.so/YOUR-PAGE |
| Family Business  | https://notion.so/YOUR-PAGE |
| FinTech Adjacent | https://notion.so/YOUR-PAGE |
| E-commerce/FBA   | https://notion.so/YOUR-PAGE |

## Product Messaging

### DO Say

- "[Your value prop 1]"
- "[Your value prop 2]"

### DON'T Say

- "[Anti-pattern 1]"
- "[Anti-pattern 2]"

## Founder Credibility

| Name   | Role   | Bio                      |
| ------ | ------ | ------------------------ |
| [Name] | [Role] | [Credibility/experience] |

## 5-Element Messaging Framework

| Element  | Weight | Description                      | Example |
| -------- | ------ | -------------------------------- | ------- |
| Vision   | 2pts   | Human problem without product    | "..."   |
| Framing  | 1pt    | "not pitching" disclaimer        | "..."   |
| Weakness | 3pts   | Admit confusion (MOST IMPORTANT) | "..."   |
| Pedestal | 2pts   | Why THEM specifically            | "..."   |
| Ask      | 2pts   | Advice question (binary)         | "..."   |

## Calendar Links

- [Your calendar link]
```

---

## Error Handling

| Issue                     | Action                                            |
| ------------------------- | ------------------------------------------------- |
| MCP Skills page not found | Provide template, ask user to create it           |
| Missing database URLs     | Report which are missing, link to template        |
| Missing ICP pages         | Report which are missing, continue with available |
| Parse error               | Report specific section that failed               |

---

## Integration

After running this agent, all other agents will:

1. Check if `.opencode/config/workspace.json` exists
2. If yes → use cached config
3. If no → prompt user to run setup-workspace first

This enables the outreach pipeline to work for anyone who forks the repo and creates their own MCP Skills page.

---

## Skills Loaded from MCP Skills Page

### Daily Goal Alignment Review

**Trigger:** "Review my day", "Goal alignment", "Rate my tasks"

**What it does:**

1. Uses `current_user` from config to find the right Todo page
2. Fetches the Todo page from Notion
3. Finds the latest date section (e.g., "## Dec 28")
4. For each completed task, rates:
   - **What I'll Learn** - Agent guesses at insight gained
   - **Helps Big Launch?** - Does this learning compound toward THE launch
   - **Rating** (1-10 scale)
5. Inserts a "Goal Alignment Scorecard" table in Notion
6. Adds a Day Score with summary

**Rating Scale:**
| Score | Meaning |
|-------|---------|
| 9-10 | Directly creates launch assets or tests core narrative |
| 7-8 | Builds trust/polish that compounds to conversion |
| 5-6 | Useful but indirect (process, logistics) |
| 3-4 | Feature work that doesn't teach about conversion |
| 1-2 | Noise - doesn't contribute to AUM or launch clarity |

**Mega Goal Reference:** Loaded from `mega_goal` in config, sourced from Investor Update V2.
