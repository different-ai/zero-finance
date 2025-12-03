# Outreach Pipeline Agents

This directory contains a 3-agent pipeline for LinkedIn Sales Navigator prospecting and outreach.

## Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          OUTREACH PIPELINE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │   AGENT A        │    │   AGENT B        │    │   AGENT C        │       │
│  │                  │    │                  │    │                  │       │
│  │  LinkedIn        │───▶│  PULL Message    │───▶│  Outreach        │       │
│  │  Navigator       │    │  Drafter         │    │  Tracker         │       │
│  │                  │    │                  │    │                  │       │
│  │  (Chrome MCP)    │    │  (Exa + Notion)  │    │  (Notion)        │       │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘       │
│                                                                              │
│  Find prospects         Draft personalized      Update CRM after            │
│  using Sales Nav        message using PULL      message is sent             │
│  filters                framework                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Agents

### 1. `linkedin-navigator` - Find Prospects

**Trigger**: "Help me find CFOs at Series A startups" or "Filter for fintech founders in Europe"

**Uses**: Chrome DevTools MCP (visible browser - not headless)

**Capabilities**:

- Navigate to LinkedIn Sales Navigator
- Apply all filter types (Company, Role, Personal, Buyer Intent, etc.)
- Extract prospect lists with profile URLs
- Screenshot each step so you can watch

**Key Filters Available**:
| Category | Filters |
|----------|---------|
| Company | Current company, headcount, past company, type, HQ location |
| Role | Function, job title, seniority, years in role/company |
| Personal | Geography, industry, experience, groups, school |
| Buyer Intent | Following your company, viewed profile |
| Best Path | Connection degree, past colleagues, shared experiences |
| Recent | Changed jobs, posted on LinkedIn |

### 2. `pull-message-drafter` - Craft Outreach

**Trigger**: "Draft a message for [Name] at [Company]" or "Write an intro for this prospect"

**Uses**: Exa (research) + Notion (context)

**Capabilities**:

- Verify prospect information (role tenure, funding dates, etc.)
- Research their company and recent activity
- Apply PULL framework (Project → Unavoidable → Looking → Limitation)
- Draft message with your contact details included

**Output includes**:

- Verified facts with dates
- PULL analysis
- Message (LinkedIn/Email/Twitter)
- Your cal.com/email for easy response

### 3. `outreach-tracker` - Log Everything

**Trigger**: "I sent it" or "Message sent to [Name]"

**Uses**: Notion MCP

**Capabilities**:

- Find contact in CRM database
- Update status (Not started → Reached out)
- Log the message as a comment
- Update last contact date

### 4. `pull-sales` - Framework Reference

**Purpose**: Contains the full PULL framework documentation for message crafting.

This is the reference agent that `pull-message-drafter` builds on. Use directly when you want deep analysis of buyer demand.

## Workflow Example

```
You: "Help me find early-stage fintech CFOs in the US"

→ linkedin-navigator opens Chrome, goes to Sales Navigator, applies filters

You: "Great, draft a message for the first one - Sarah Chen at Stripe"

→ pull-message-drafter researches Sarah, verifies info, drafts PULL message

You: "Perfect, I sent it"

→ outreach-tracker updates Sarah's record in Notion CRM
```

## Setup Requirements

### Chrome MCP

The Chrome DevTools MCP must be installed. It's configured in `opencode.json`:

```json
"chrome": {
  "type": "local",
  "command": ["npx", "-y", "chrome-devtools-mcp@latest"]
}
```

**Important**: The browser runs VISIBLE (not headless) so you can:

- Watch what the agent does
- Take over if needed
- Log into LinkedIn yourself (agent cannot log in for you)

### Notion MCP

Your Notion workspace should have a CRM database with fields like:

- Name (title)
- Company
- Status (select: Not started, Reached out, etc.)
- Best Contact (URL)
- last contact (date)
- last action (text)

### Exa MCP

Used for research. Already configured in `opencode.json`.

## Tips

1. **Log into LinkedIn first**: Before using `linkedin-navigator`, make sure you're logged into Sales Navigator in Chrome

2. **Provide contact details**: `pull-message-drafter` will ask for your cal.com/email if not known

3. **Say "I sent it"**: After sending a message, tell the agent so it can update the CRM

4. **Review before sending**: Always review drafted messages - AI can make mistakes about company/role details
