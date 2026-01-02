---
name: linkedin-post
description: Draft high-performing LinkedIn posts using learnings from tweet performance data and 0 Finance messaging guidelines
license: MIT
compatibility: opencode
metadata:
  service: notion
  category: content
---

## What I Do

Draft LinkedIn posts that apply learnings from the Tweet Lab performance tracker, adapted for LinkedIn's professional audience. This skill bridges the gap between Twitter/X learnings and LinkedIn's different engagement patterns.

## The Process

```
1. RESEARCH  -> Check Tweet Lab for what hooks/patterns work
2. CONTEXT   -> Review 0 Finance messaging guidelines (avoid SEC red flags)
3. DRAFT     -> Write post using winning patterns
4. ADAPT     -> Adjust tone for LinkedIn (more professional, same authenticity)
5. REVIEW    -> Check against compliance guidelines
```

## Key Learnings from Tweet Performance Data

### What Works (High Engagement)

| Pattern                         | Example                                       | Why It Works                   |
| ------------------------------- | --------------------------------------------- | ------------------------------ |
| **Personal story hook**         | "I always wished existed"                     | Creates emotional connection   |
| **Demo/Show format**            | Video + screenshots                           | Visual proof > claims          |
| **Relatable pain point**        | "Download PDF, read it, find bank details..." | Audience nods along            |
| **Casual lowercase**            | "thank you claude + playwright mcp"           | Feels authentic, not corporate |
| **Before/After transformation** | Old way vs new way                            | Clear value proposition        |
| **No interface flex**           | "No login, no dashboard"                      | Simplicity is aspirational     |

### What Doesn't Work (Low Engagement)

| Anti-Pattern                      | Example                         | Why It Fails           |
| --------------------------------- | ------------------------------- | ---------------------- |
| **Generic product description**   | "Created a small agent that..." | No hook, no story      |
| **Feature lists without context** | "Features: X, Y, Z"             | No emotional resonance |
| **Corporate tone**                | "We're excited to announce..."  | Feels like marketing   |
| **No visual**                     | Text-only posts                 | Scroll-past material   |

### Hook Types (Ranked by Performance)

1. **Demo/Show** - 96K-172K impressions when done well
2. **Bold Claim** - Can go viral (9.4M) but risky
3. **Personal Story** - Consistent performer
4. **Question** - Good for engagement, lower reach
5. **List** - Works with visuals, fails without

## LinkedIn Adaptations

### Tone Shift

| Twitter       | LinkedIn                         |
| ------------- | -------------------------------- |
| all lowercase | Sentence case (but still casual) |
| "lol" / "tbh" | Remove or use sparingly          |
| Thread format | Single post with line breaks     |
| Memes/jokes   | Professional humor only          |

### Structure That Works on LinkedIn

```
[Hook - 1-2 lines that stop the scroll]

[Context - Why this matters / the problem]

[The insight / solution - What you built/learned]

[Proof - Demo, screenshot, or specific example]

[CTA - Soft ask, not salesy]
```

### LinkedIn-Specific Tips

1. **First line is everything** - Only ~150 chars show before "see more"
2. **Line breaks = readability** - Use them liberally
3. **Bullet points work** - But don't overdo it
4. **Tag sparingly** - Only if genuinely relevant
5. **No hashtags in body** - Put 3-5 at the very end if at all
6. **Video > Image > Text** - Same as Twitter

## 0 Finance Messaging Compliance

### NEVER Say (SEC Red Flags)

- "Earn X% APY"
- "We manage your funds"
- "AI automatically allocates"
- "Guaranteed returns"
- "Start earning today"

### ALWAYS Say Instead

- "Current yields: ~X% APY" or "Historical yields of X-Y%"
- "You control your wallet"
- "Configure your wallet to interact with protocols"
- "Access yields" (not "earn")
- "Your funds, your control"

### Safe Messaging Patterns

```
"Your wallet can be configured to..."
"Non-custodial architecture"
"You maintain full custody"
"Direct protocol interaction"
"Withdraw anytime"
```

## Template: Video Teaser Post

```
[Personal hook about the problem]

I do most of my work in [X] interfaces:
- [Tool 1]
- [Tool 2]
- [Tool 3]

But [specific task] still felt stuck in [year].

[Describe the old painful way - be specific]

So we built something different.

[Describe the new way - focus on simplicity]

No [thing]. No [thing]. Just [simple action].

Full demo dropping soon. Here's a preview.

[Video/Image]
```

## Template: Product Demo Post

```
[Bold claim or question hook]

[1-2 sentences of context]

Here's how it works:

1. [Step 1 - user action]
2. [Step 2 - what happens]
3. [Step 3 - outcome]

That's it.

[What this means / why it matters]

[Soft CTA]

[Video/Image]
```

## Template: Behind-the-Scenes Post

```
[What you've been working on]

For the past [time period], I've been [doing X].

The problem: [specific pain point]

What we tried:
- [Approach 1] - didn't work because [reason]
- [Approach 2] - got closer but [limitation]
- [Approach 3] - this is the one

[What you learned / the insight]

[Optional: what's next]
```

## Checklist Before Posting

- [ ] First line hooks (would YOU stop scrolling?)
- [ ] Personal angle (not corporate voice)
- [ ] Specific details (not generic claims)
- [ ] Visual attached (video > image > carousel > text)
- [ ] No SEC red flag language
- [ ] Soft CTA (not salesy)
- [ ] Line breaks for readability
- [ ] Under 3000 characters (LinkedIn limit)

## Notion Integration

### Finding Tweet Learnings

```
Search the Tweet Lab database:
notion_notion-search with query: "worked video demo"
data_source_url: "collection://a6913492-bfdc-4f6a-b539-ea98b57a2738"
```

### Checking Compliance

```
Fetch the marketing audit:
notion_notion-fetch with id: "2b58ed524fef813384e1c63e6ae17186"
```

## Example: AI Email Agent Video Teaser

### Input

- Video showing: Forward email to AI, AI reads invoice, queues transfer
- Key features: No login, no dashboard, email-native

### Output (Recommended)

```
I do most of my work in 3 interfaces:

- ChatGPT
- Gmail
- An agentic coding platform

This year, AI has automated away tasks I used to hate but couldn't avoid.

But one thing still felt stuck in 2015: paying invoices.

Download PDF. Read it. Find bank details. Open banking app. Type everything in. Hope I didn't make a typo.

So we built something different.

Now when I get an invoice from a contractor, I just forward the email to our AI agent. It reads the PDF, extracts the bank details, checks if we have enough funds, and queues the transfer for my approval.

No dashboard. No login. Just email.

Full demo dropping soon. Here's a preview.

[Video]
```

### Why This Works

1. **Hook**: "3 interfaces" - specific, relatable to knowledge workers
2. **Pain point**: Invoice payment friction - universal problem
3. **Transformation**: Old way (5 steps) vs new way (1 step)
4. **Proof**: Video demo
5. **Compliance**: No yield promises, focuses on automation not returns
6. **CTA**: Soft teaser, not salesy

---

## Anti-Patterns to Avoid

### The Corporate Announcement

```
We're excited to announce our new AI-powered email agent!
This innovative solution helps businesses streamline their
financial operations with cutting-edge technology.

Learn more: [link]
```

Why it fails: No hook, corporate voice, no specifics, no proof

### The Feature Dump

```
New features in our AI agent:
- Invoice processing
- Balance checking
- Transfer queuing
- Email integration
- PDF parsing

Try it today!
```

Why it fails: No story, no context, no "so what?"

### The Humble Brag

```
Just hit 10,000 users on our platform!
So grateful for this amazing community.
Here's to the next 10,000!
```

Why it fails: Self-congratulatory, no value for reader

---

_Last Updated: January 2026_
_Based on: Tweet Lab performance data + 0 Finance messaging guidelines_
