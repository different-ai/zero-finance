---
name: tweet-rl-tracker
description: Create and manage a Notion-based tweet performance tracking system for "poor man's reinforcement learning"
license: MIT
compatibility: opencode
metadata:
  service: notion
  category: content
---

## What I Do

Set up a Notion database to track tweet performance and enable a feedback loop for improving tweet quality over time. This is "poor man's reinforcement learning" - manually logging outcomes to discover what works.

## The RL Loop

```
1. WRITE   -> Draft tweet with a hypothesis (hook type, topic, etc.)
2. POST    -> Publish to Twitter/X
3. LOG     -> Record in Notion after 24-48hrs with metrics
4. SCORE   -> Mark "Worked?" based on engagement rate
5. REVIEW  -> Weekly: compare winners vs losers, extract patterns
6. REPEAT  -> Apply learnings to step 1
```

## Database Schema

### Core Fields (Outcomes)

| Property    | Type     | Purpose                                    |
| ----------- | -------- | ------------------------------------------ |
| Tweet       | title    | The tweet text                             |
| Likes       | number   | Primary engagement signal                  |
| Impressions | number   | Reach/views                                |
| Score       | formula  | `Likes / Impressions * 100` (engagement %) |
| Worked?     | checkbox | Binary gut-check - was this a win?         |

### Input Features (What You Controlled)

| Property | Type   | Options                                                           |
| -------- | ------ | ----------------------------------------------------------------- |
| Hook     | select | Question, Bold Claim, Story, List, How-To, Contrarian, Data/Stats |
| Topic    | select | (customize to your niche)                                         |
| Posted   | date   | When you posted                                                   |

### Optional Extensions

| Property | Type      | Purpose                |
| -------- | --------- | ---------------------- |
| Replies  | number    | Conversation signal    |
| Retweets | number    | Amplification signal   |
| Link     | url       | Link to original tweet |
| Notes    | rich_text | Why did it work/fail?  |

## Setup Instructions

### Step 1: Create the Page and Database

Use the Notion MCP tools to create:

```
notion_notion-create-pages with:
- title: "Tweet Lab" (or your preferred name)
- content: Brief intro about the system

Then inside that page, create a database with:
notion_notion-create-database with the schema above
```

### Step 2: Example Notion Tool Calls

**Create the container page:**

```json
{
  "pages": [
    {
      "properties": { "title": "Tweet Lab" },
      "content": "## Tweet Performance Tracker\n\nA simple system to track what works and improve over time.\n\n### The Loop\n1. Post tweet\n2. Log metrics after 24-48hrs\n3. Mark if it \"Worked\"\n4. Weekly: review patterns\n\n<database>Tweets</database>"
    }
  ]
}
```

**Create the database (after getting page_id):**

```json
{
  "parent": { "page_id": "<page-id-from-above>" },
  "title": [{ "type": "text", "text": { "content": "Tweets" } }],
  "properties": {
    "Tweet": { "type": "title", "title": {} },
    "Likes": { "type": "number", "number": { "format": "number" } },
    "Impressions": { "type": "number", "number": { "format": "number" } },
    "Score": {
      "type": "formula",
      "formula": {
        "expression": "if(prop(\"Impressions\") > 0, prop(\"Likes\") / prop(\"Impressions\") * 100, 0)"
      }
    },
    "Worked?": { "type": "checkbox", "checkbox": {} },
    "Hook": {
      "type": "select",
      "select": {
        "options": [
          { "name": "Question", "color": "blue" },
          { "name": "Bold Claim", "color": "red" },
          { "name": "Story", "color": "green" },
          { "name": "List", "color": "yellow" },
          { "name": "How-To", "color": "purple" },
          { "name": "Contrarian", "color": "orange" },
          { "name": "Data/Stats", "color": "pink" }
        ]
      }
    },
    "Topic": {
      "type": "select",
      "select": { "options": [] }
    },
    "Posted": { "type": "date", "date": {} }
  }
}
```

## Using the System

### Daily: Log Tweets

After 24-48 hours, add a row:

- Copy tweet text
- Pull Likes and Impressions from Twitter analytics
- Select the Hook type you used
- Select or create a Topic tag

### Weekly: Review Session

1. **Sort by Score** (descending) - what performed best?
2. **Filter by "Worked?" = true** - what patterns emerge?
3. **Group by Hook** - which hook types win?
4. **Group by Topic** - which topics resonate?

### Monthly: Form Hypotheses

Based on patterns, create hypotheses to test:

- "Questions about [topic] get 2x engagement"
- "Bold claims underperform for my audience"
- "Threads outperform single tweets"

Then deliberately test these in the next month.

## Key Insights

### What Makes This Work

1. **Track inputs, not just outputs** - Without knowing what you tried (hook, topic), you can't learn what caused success
2. **Binary "Worked?" is powerful** - Forces a clear decision, easier to analyze than continuous scores
3. **Review regularly** - Data without reflection is useless
4. **Test hypotheses deliberately** - Don't just observe, experiment

### Common Pitfalls

- Logging inconsistently (do it same time each day/week)
- Not tracking input features (hook, topic)
- Never reviewing the data
- Optimizing for wrong metric (likes vs. replies vs. followers)

## Customization

### Different Goals = Different Metrics

| Goal       | Primary Metric                  | Formula            |
| ---------- | ------------------------------- | ------------------ |
| Virality   | Retweets / Impressions          | Amplification rate |
| Engagement | (Likes + Replies) / Impressions | Interaction rate   |
| Growth     | Profile clicks / Impressions    | Curiosity rate     |
| Community  | Replies / Impressions           | Conversation rate  |

### Add Your Topics

Update the Topic select options based on your niche. Examples:

- Tech founder: Product, Fundraising, Hiring, Lessons, Industry
- Creator: Process, Tools, Mindset, Results, Behind-the-scenes

## Troubleshooting

### "I forget to log tweets"

- Set a daily/weekly calendar reminder
- Add a "Logged?" checkbox to your posting workflow
- Batch log once per week instead of daily

### "I don't know what hook I used"

- Decide BEFORE posting, not after
- Add hook type to your tweet drafting process
- When in doubt, pick the closest match

### "My Score is always low"

- Engagement rates are typically 1-5% - this is normal
- Compare relative performance, not absolute numbers
- Consider using a different base metric for "Worked?"
