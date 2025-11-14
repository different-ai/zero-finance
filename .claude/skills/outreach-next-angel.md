# Outreach: Next Angel Investor

This skill helps identify the next angel investor to reach out to and drafts a personalized LinkedIn intro message.

## What this skill does:

1. **Searches Fundraising CRM** for angels with status "Not started" on LinkedIn
2. **Fetches full details** of the first unreached angel
3. **Drafts a 300-character LinkedIn intro** that is:
   - Founder-focused (mentions founders by name + credibility)
   - Personalized to investor's background/interests
   - Technical enough to show builder credibility
   - Asks if they're interested (not pushy)
4. **Provides LinkedIn profile link** for easy outreach

## When to use this skill:

- User asks: "Give me the next angel to reach out to"
- User asks: "Who should I message next on LinkedIn?"
- User asks: "Draft an intro for the next investor"

## Example output:

IMPORTANT: Always output investor details and draft messages in plain text format (no markdown formatting like bold, italics, or headers). This allows the user to easily copy-paste the content.

Format:
```
Investor Name - Co-founder of X
Status: Not started
LinkedIn: https://linkedin.com/in/username

LinkedIn Intro (XXX chars):

[Personalized message based on investor background]
```

For Twitter/X:
```
Investor Name - Co-founder of X
Status: Not started
Twitter: @username

Twitter DM:

[Longer personalized message]
```

## Technical implementation:

### Step 1: Search for next angel investor

Use `mcp__notion__notion-search` with:
```json
{
  "query": "Angel Not started LinkedIn",
  "query_type": "internal",
  "data_source_url": "[YOUR_NOTION_DATABASE_COLLECTION_URL]"
}
```

This searches the Fundraising CRM for angels with "Not started" status who have LinkedIn.

### Step 2: Fetch investor details

For each result from search, use `mcp__notion__notion-fetch` with the page ID to get full details including:
- Context (investor background)
- Notes (any specific angles)
- Best Contact (LinkedIn URL)
- Status (must be "Not started")

**IMPORTANT**: The search returns results sorted by timestamp, so check multiple results to find one with Status = "Not started" (not "Reached out / Introed").

### Step 3: Verify investor background with Exa

**BEFORE drafting the intro**, use `mcp__exa__web_search_exa` to verify:

1. **Investment claims**: Search "[investor name] portfolio investments [company names]"
   - Verify they actually invested in companies mentioned in Context/Notes
   - Check investment dates and roles (angel vs VC fund)

2. **Company affiliations**: Search "[investor name] [company name] role"
   - Verify current/past employment claims
   - Check titles and dates

3. **Public writing/thesis**: Search "[investor name] thesis [topic]"
   - Only reference if you find actual source
   - Never claim "loved your X thesis" without verification

4. **Recent activity**: Search "[investor name] recent news investments 2024 2025"
   - Find recent investments, tweets, or public statements
   - Use for personalization

**Double-check relevance**: Use Exa to verify this investor is actually a good fit:
- Search "[investor name] investment thesis focus areas"
- Search "[investor name] portfolio fintech DeFi stablecoin"
- Only proceed if they show interest in: DeFi, fintech, B2B SaaS, stablecoins, crypto infrastructure
- If they're focused on unrelated areas (gaming, NFTs only, consumer apps), skip and find next investor

### Step 4: Draft intro message

**LinkedIn messages** (300-character limit):
- Keep under 300 characters (LinkedIn connection request limit)
- Use conversational, founder-to-founder tone
- Avoid overused phrases and generic templates
- Follow format: "Hi [Name] - [specific personalized hook]. We're building [YOUR_PRODUCT]: [VALUE_PROP]. [Why relevant to them]. Looking for early supporters. Let's chat?"
- All claims must be verified via Exa (no assumptions)

**Twitter/X DMs** (longer format, 2-3 paragraphs):
- Can be much longer and more detailed than LinkedIn
- Start with personal connection if exists ("we met at [event]")
- Include bullet points showing traction:
  - Built flagship app at [YOUR_DOMAIN]
  - Signed [TRACTION_METRIC] from [CUSTOMER_TYPE]
  - Raised [AMOUNT] from [INVESTORS]
- Explain what you're building: "[PRODUCT_DESCRIPTION]"
- Founder credibility: "[YOUR_BACKGROUND]"
- End with ask: "We're early and looking for early angels/advisors interested in the topic. Let me know if that's you."
- Example template:
  ```
  Hey [Name]! [Optional: personal connection]. I'm now building [PRODUCT] - [ONE_LINE_DESCRIPTION]. In the last [TIMEFRAME] we: - [ACHIEVEMENT_1] - [ACHIEVEMENT_2] - [ACHIEVEMENT_3]. Today, we're [CURRENT_FOCUS]. [FOUNDER_CREDIBILITY]. We're early and are looking for early angels/advisors who are interested in the topic. Let me know if that's you.
  ```

### Step 5: Update Notion after sending

After user sends the message, update the investor page:
```json
{
  "page_id": "[investor-page-id]",
  "command": "update_properties",
  "properties": {
    "Status": "Reached out / Introed",
    "date:last contact:start": "2025-11-13",
    "date:last contact:is_datetime": 0,
    "last action": "LinkedIn message sent"
  }
}
```

Then add a comment with the message sent using `mcp__notion__notion-create-comment`:
```json
{
  "parent": {"type": "page_id", "page_id": "[investor-page-id-no-dashes]"},
  "rich_text": [{"type": "text", "text": {"content": "LinkedIn message sent (Nov 13, 2025):\n\n[actual message]"}}]
}
```

**NOTE**: Remove dashes from page_id when creating comments (e.g., `2a68ed52-4fef-813f-8f01-c80851f57e2f` becomes `2a68ed524fef813f8f01c80851f57e2f`)
