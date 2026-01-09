---
name: company-admin
description: Access and update company administrative information stored in Notion
---

## What I Do

This skill instructs how to access and update company administrative information. **All data lives in Notion** - this skill just tells you where to find it and how to update it.

---

## Prerequisites

### Required: `.env` file

This skill requires a `.env` file at `.opencode/skill/company-admin/.env` with Notion page IDs.

**If the file doesn't exist or is missing info, ask the user:**

```
I need to set up the company-admin skill. Please provide:
1. MCP Skills page ID (company-level info)
2. Admin/Legal page ID (personal details, sensitive info)
3. Investor Cheat Sheet page ID (optional)

You can find page IDs in the Notion URL after the page title.
```

Then create the `.env` file:

```bash
# Check if .env exists
cat .opencode/skill/company-admin/.env

# If missing, create it with user-provided values
```

### `.env` Template

```env
# Notion Page IDs for Company Admin
# Find these in the Notion URL: notion.so/[page-title]-[PAGE_ID]

NOTION_MCP_SKILLS_PAGE_ID=
NOTION_ADMIN_LEGAL_PAGE_ID=
NOTION_INVESTOR_CHEAT_SHEET_ID=

# External service URLs (non-sensitive)
FIRSTBASE_DASHBOARD_URL=https://app.firstbase.io/company/OR5DEAF6/details
TEAM_CALENDAR_URL=https://cal.com/team/0finance/30
```

---

## Workflow

### Step 1: Load Config

```bash
# First, check for .env file
cat .opencode/skill/company-admin/.env
```

If missing or incomplete → Ask user to provide the page IDs and create the file.

### Step 2: Fetch from Notion

```
# For company-level info (incorporation, officers, addresses)
notion_notion-fetch: id="$NOTION_MCP_SKILLS_PAGE_ID"
→ Look at "Company Admin" section

# For personal details (passport, addresses, stock status)
notion_notion-fetch: id="$NOTION_ADMIN_LEGAL_PAGE_ID"

# For investor questions
notion_notion-fetch: id="$NOTION_INVESTOR_CHEAT_SHEET_ID"
```

### Step 3: Update Notion (when user provides new info)

```
# Update Admin/Legal page (personal info, stock status, etc.)
notion_notion-update-page:
  page_id: "$NOTION_ADMIN_LEGAL_PAGE_ID"
  command: "insert_content_after"
  selection_with_ellipsis: "[find appropriate section]"
  new_str: "[new content]"

# Update MCP Skills page (company-level info)
notion_notion-update-page:
  page_id: "$NOTION_MCP_SKILLS_PAGE_ID"
  command: "insert_content_after" or "replace_content_range"
  ...
```

---

## What Goes Where

| Info Type                                     | Store In                   |
| --------------------------------------------- | -------------------------- |
| Personal details (passport, DOB, citizenship) | Admin/Legal page           |
| Personal addresses (home, mailing)            | Admin/Legal page           |
| Stock/shares status                           | Admin/Legal page           |
| Company details (legal name, state, industry) | MCP Skills → Company Admin |
| Officers/directors/shareholders               | MCP Skills → Company Admin |
| Company addresses (registered agent, bank)    | MCP Skills → Company Admin |
| Service providers (Firstbase, Mercury)        | MCP Skills → Company Admin |
| Investor Q&A                                  | Investor Cheat Sheet       |

---

## Security Rules

### DO

- Store page IDs in `.env` file (gitignored)
- Fetch from Notion for accurate, up-to-date info
- Update Notion when user provides new info
- Ask user to create `.env` if missing

### DON'T

- Hardcode page IDs in the skill file
- Cache sensitive info anywhere locally
- Echo passport numbers, SSN in chat responses
- Guess or make up legal/financial details

---

## Common Tasks

| Task                    | Action                                                   |
| ----------------------- | -------------------------------------------------------- |
| "What's our address?"   | Fetch MCP Skills page → Company Admin → Addresses        |
| "Update my address"     | Update Admin/Legal page in Notion                        |
| "Fill out a form"       | Fetch relevant page, use info, don't echo sensitive data |
| "Add new company info"  | Update MCP Skills page → Company Admin section           |
| "Stock/shares question" | Fetch Admin/Legal page → Stock section                   |

---

## Admin Tasks Management

**Tasks are stored in the Admin/Legal page under "# Admin Tasks" section.**

### Task Structure

```markdown
# Admin Tasks

## Active Tasks

### [Category] (Due: [date])

- [ ] **Task name** - Description
  - Subtask or context
  - Links, phone numbers, etc.
- [ ] Another task

## Completed Tasks

- [x] Completed task - moved here when done
```

### How to Add a Task

```
notion_notion-update-page:
  page_id: "$NOTION_ADMIN_LEGAL_PAGE_ID"
  command: "insert_content_after"
  selection_with_ellipsis: "## Active Tasks...appropriate category"
  new_str: "- [ ] **New task** - Description\n  - Subtask details"
```

### How to Complete a Task

1. Fetch the Admin/Legal page
2. Find the task in "Active Tasks"
3. Move it to "Completed Tasks" section with `[x]` checked

```
notion_notion-update-page:
  page_id: "$NOTION_ADMIN_LEGAL_PAGE_ID"
  command: "replace_content_range"
  selection_with_ellipsis: "- [ ] **Task name**...details"
  new_str: ""  # Remove from Active

# Then add to Completed:
notion_notion-update-page:
  page_id: "$NOTION_ADMIN_LEGAL_PAGE_ID"
  command: "insert_content_after"
  selection_with_ellipsis: "## Completed Tasks"
  new_str: "\n- [x] **Task name** - Done [date]"
```

### How to Add Subtasks

When researching a task reveals subtasks (like Gusto setup), add them nested:

```markdown
- [ ] **Main task**
  - [ ] Subtask 1
  - [ ] Subtask 2
  - Context: links, phone numbers, notes
```

### Task Categories

| Category    | Examples                                |
| ----------- | --------------------------------------- |
| Gusto Setup | Payroll, tax registration, workers comp |
| Stock/Legal | Share issuance, legal filings           |
| Tax         | Filings, registrations, deadlines       |
| Banking     | Mercury setup, account changes          |
| Compliance  | CA requirements, retirement plans       |

---

## First-Time Setup

If `.env` file is missing, run this flow:

1. Ask user for Notion page IDs
2. Create `.env` file:

```bash
cat > .opencode/skill/company-admin/.env << 'EOF'
NOTION_MCP_SKILLS_PAGE_ID=[user-provided]
NOTION_ADMIN_LEGAL_PAGE_ID=[user-provided]
NOTION_INVESTOR_CHEAT_SHEET_ID=[user-provided]
FIRSTBASE_DASHBOARD_URL=https://app.firstbase.io/company/OR5DEAF6/details
TEAM_CALENDAR_URL=https://cal.com/team/0finance/30
EOF
```

3. Verify by fetching a page
4. Confirm setup complete
