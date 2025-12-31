---
name: tweet-rl-tracker
description: Create and manage a Notion-based tweet performance tracking system for "poor man's reinforcement learning"
license: MIT
compatibility: opencode
metadata:
  service: notion, chrome-devtools-mcp
  category: content
---

## What I Do

Set up a Notion database to track tweet performance and enable a feedback loop for improving tweet quality over time. This is "poor man's reinforcement learning" - manually logging outcomes to discover what works.

**NEW: Screenshot Capture** - Automatically capture screenshots from tweet links (including video frames at 10 seconds) using Chrome DevTools MCP.

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

---

## Screenshot Capture with Chrome MCP

### Prerequisites

- Chrome DevTools MCP configured in your MCP client
- Logged into Twitter/X in the Chrome profile

### Database Field

The Tweets database includes a `Screenshot` field (type: files) to store captured images.

**Data Source ID**: `a6913492-bfdc-4f6a-b539-ea98b57a2738`

### Workflow: Capture Tweet Screenshot

Given a tweet URL like `https://x.com/username/status/1234567890`:

#### Step 1: Navigate to Tweet

```javascript
// Open new page with the tweet
new_page({ url: 'https://x.com/username/status/1234567890' });

// Wait for tweet to load
wait_for({ text: 'Reply' }); // or wait for specific tweet content
```

#### Step 2: Take Screenshot of Tweet

```javascript
// Take full page screenshot
take_screenshot({ fullPage: false });

// Or screenshot specific element (the tweet article)
take_snapshot(); // Get element uids first
take_screenshot({ uid: 'tweet-article-uid' });
```

#### Step 3: For Video Tweets - Capture Frame at 10 Seconds

```javascript
// 1. Find and click the video to start playing
take_snapshot();
click({ uid: 'video-player-uid' });

// 2. Wait 10 seconds for video to play
// (Use evaluate_script to seek if possible)
evaluate_script({
  function: `() => {
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = 10;
      video.pause();
      return { success: true, duration: video.duration };
    }
    return { success: false };
  }`,
});

// 3. Take screenshot of the video frame
take_screenshot({ fullPage: false });
```

#### Step 4: Extract Tweet Metadata

```javascript
evaluate_script({
  function: `() => {
    // Extract tweet text
    const tweetText = document.querySelector('[data-testid="tweetText"]')?.textContent || '';
    
    // Extract author
    const author = document.querySelector('[data-testid="User-Name"]')?.textContent || '';
    
    // Extract metrics (likes, retweets, etc.)
    const metrics = {};
    document.querySelectorAll('[data-testid="like"], [data-testid="retweet"]').forEach(el => {
      const label = el.getAttribute('aria-label') || '';
      if (label.includes('like')) metrics.likes = parseInt(label) || 0;
      if (label.includes('repost')) metrics.retweets = parseInt(label) || 0;
    });
    
    // Check if video exists
    const hasVideo = !!document.querySelector('video');
    const hasImage = !!document.querySelector('[data-testid="tweetPhoto"]');
    
    return {
      text: tweetText,
      author,
      metrics,
      mediaType: hasVideo ? 'Video' : hasImage ? 'Image' : 'None'
    };
  }`,
});
```

### Complete Example: Add Tweet with Screenshot

```
User: Add this tweet to the tracker: https://x.com/unvalley_/status/2005899617775542298

Agent workflow:
1. new_page({ url: 'https://x.com/unvalley_/status/2005899617775542298' })
2. wait_for({ text: 'Reply' })
3. take_snapshot() - to see page structure
4. evaluate_script() - extract tweet text, author, media type
5. If video: seek to 10s and pause
6. take_screenshot() - capture the visual
7. Save screenshot to local file (screenshot is returned as base64)
8. Create Notion page with extracted data + screenshot file
```

### Saving Screenshot to Notion

**Important**: Notion's files property requires external URLs. The workflow is:

1. Take screenshot with Chrome MCP (returns base64)
2. Save to a publicly accessible location (e.g., upload to S3, Cloudinary, or use a temp file host)
3. Add the URL to the Notion page's Screenshot field

```javascript
// After taking screenshot, you'll get base64 data
// Save it locally first:
const fs = require('fs');
const screenshotPath = `/tmp/tweet-${Date.now()}.png`;
fs.writeFileSync(screenshotPath, Buffer.from(base64Data, 'base64'));

// Then upload to your preferred hosting and get URL
// Finally, create Notion page with the screenshot URL
```

### Quick Reference: Chrome MCP Tools for Tweet Capture

| Tool              | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `new_page`        | Navigate to tweet URL                      |
| `wait_for`        | Wait for tweet to load                     |
| `take_snapshot`   | Get accessibility tree (find element uids) |
| `take_screenshot` | Capture visual screenshot                  |
| `evaluate_script` | Extract tweet data, control video playback |
| `click`           | Click play button on video                 |

### Troubleshooting Screenshots

**"Tweet not loading"**

- Check if logged into Twitter in Chrome profile
- Twitter may require login for some content
- Try `wait_for` with longer timeout

**"Video won't seek"**

- Some videos are streaming and don't support seeking
- Try clicking play first, then waiting 10 seconds naturally
- Use `setTimeout` in evaluate_script if needed

**"Screenshot is blank"**

- Wait longer for content to render
- Check if page has overlay/modal blocking content
- Try `fullPage: true` to capture everything

**"Can't upload to Notion"**

- Notion files require external URLs
- Use a file hosting service (S3, Cloudinary, imgur)
- Or embed screenshot as image in page content instead
