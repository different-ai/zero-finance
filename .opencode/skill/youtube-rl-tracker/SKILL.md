---
name: youtube-rl-tracker
description: Track YouTube video performance for "poor man's reinforcement learning" - learn what thumbnails, titles, and hooks work
license: MIT
compatibility: opencode
metadata:
  service: notion, youtube
  category: content
---

## What I Do

Track YouTube video performance to discover patterns in what works. This is "poor man's reinforcement learning" - manually logging outcomes to improve over time.

## The RL Loop

```
1. PUBLISH  -> Upload video with hypothesis (thumbnail style, title hook, topic)
2. WAIT     -> Let it run for 48-72 hours
3. LOG      -> Record in Notion with views, CTR, retention
4. ANALYZE  -> Compare winners vs losers
5. REPEAT   -> Apply learnings to next video
```

## Key Insight from First Data Point

**Video 1:** "Using AI agents to pay bills and send invoices"

- 8 views in 1 day
- Plain talking head thumbnail
- Generic title

**Video 2:** "Paying My Contractor Through Claude | AI-Powered Finance"

- 133 views in 5 days (16x better!)
- Thumbnail shows: Face + Product UI overlay + Text "I Let AI Pay My Bills"
- Title has: Specific action + Brand name (Claude) + Category tag

### What Made Video 2 Win:

1. **Thumbnail has TEXT overlay** - "I Let AI Pay My Bills" creates curiosity
2. **Shows the PRODUCT** - UI screenshot proves it's real, not just talk
3. **Face + Context** - Person looking at the UI, not just talking
4. **Specific title** - "Paying My Contractor" > "pay bills" (concrete vs abstract)
5. **Brand name in title** - "Claude" attracts AI-interested audience
6. **Category tag** - "AI-Powered Finance" helps discoverability

### Hypothesis to Test:

> Thumbnails with TEXT + PRODUCT UI + FACE outperform plain talking head thumbnails by 10x+

## Database Schema

### Core Fields (Outcomes)

| Property  | Type     | Purpose                            |
| --------- | -------- | ---------------------------------- |
| Title     | title    | Video title                        |
| Views     | number   | Total views                        |
| CTR       | number   | Click-through rate (%)             |
| Retention | number   | Average view duration (%)          |
| Days Live | number   | Days since publish                 |
| Views/Day | formula  | `Views / Days Live`                |
| Worked?   | checkbox | Binary gut-check - was this a win? |

### Input Features (What You Controlled)

| Property        | Type     | Options                                         |
| --------------- | -------- | ----------------------------------------------- |
| Thumbnail Style | select   | Talking Head, Face+UI, Face+Text, UI Only, Meme |
| Has Text        | checkbox | Does thumbnail have text overlay?               |
| Has Product     | checkbox | Does thumbnail show the product/UI?             |
| Title Hook      | select   | How-To, Story, Listicle, Question, Bold Claim   |
| Has Brand       | checkbox | Does title mention a brand (Claude, ChatGPT)?   |
| Topic           | select   | AI Finance, Automation, Product Demo, Tutorial  |
| Duration        | number   | Video length in minutes                         |
| Posted          | date     | When published                                  |

### Reference Fields

| Property  | Type      | Purpose                 |
| --------- | --------- | ----------------------- |
| URL       | url       | Link to video           |
| Thumbnail | files     | Screenshot of thumbnail |
| Notes     | rich_text | Why did it work/fail?   |

## First Entry: The Baseline

```
Video 1 (LOSER):
- Title: "Using AI agents to pay bills and send invoices"
- Views: 8
- Days Live: 1
- Thumbnail Style: Talking Head
- Has Text: No
- Has Product: No
- Title Hook: How-To
- Has Brand: No
- Notes: Plain talking head, generic title, no visual hook

Video 2 (WINNER):
- Title: "Paying My Contractor Through Claude | AI-Powered Finance"
- Views: 133
- Days Live: 5
- Views/Day: 26.6
- Thumbnail Style: Face+UI
- Has Text: Yes ("I Let AI Pay My Bills")
- Has Product: Yes (shows invoice payment UI)
- Title Hook: Story
- Has Brand: Yes (Claude)
- Notes: Text overlay creates curiosity, UI proves it's real, specific action in title
```

## Thumbnail Patterns to Test

Based on initial data:

| Pattern          | Example | Hypothesis                                          |
| ---------------- | ------- | --------------------------------------------------- |
| Face + UI + Text | Video 2 | Best performer - proves reality + creates curiosity |
| Face + Bold Text | -       | May work for controversial takes                    |
| UI Only          | -       | Good for tutorials, may lack personality            |
| Talking Head     | Video 1 | Worst - no visual hook                              |
| Before/After     | -       | Good for transformation content                     |

## Title Patterns to Test

| Pattern                 | Example                               | Hypothesis                     |
| ----------------------- | ------------------------------------- | ------------------------------ |
| Specific Action + Brand | "Paying My Contractor Through Claude" | Winner - concrete + searchable |
| Generic Action          | "Using AI to pay bills"               | Loser - too vague              |
| Question                | "Can AI Really Pay Your Bills?"       | Untested - may drive curiosity |
| Number + Outcome        | "I Automated 5 Hours of Finance Work" | Untested - quantified value    |

## Weekly Review Process

1. **Sort by Views/Day** - normalize for time live
2. **Filter by Worked? = true** - what patterns emerge?
3. **Group by Thumbnail Style** - which visuals win?
4. **Group by Title Hook** - which hooks work?
5. **Compare Has Text vs No Text** - does text help?
6. **Compare Has Brand vs No Brand** - do brand names help?

## Integration with YouTube Studio Skill

Use `skill("youtube-studio")` to:

- Upload new videos with test hypotheses
- Update thumbnails based on learnings
- Track which changes improve performance

## Reference Image

The winning thumbnail (133 views) vs losing thumbnail (8 views):

![YouTube Comparison](/Users/benjaminshafii/git/zerofinance/.opencode/skill/youtube-rl-tracker/reference-comparison.png)

**Key visual differences:**

- Winner: Face looking at UI, text overlay "I Let AI Pay My Bills", product screenshot visible
- Loser: Plain talking head against brick wall, no text, no product context
