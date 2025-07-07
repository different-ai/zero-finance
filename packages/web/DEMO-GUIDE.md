# 0 Finance Interactive Demo Guide

## 🚀 Quick Setup

1. **Set your user ID** (one time only):
   ```bash
   export DEMO_USER_PRIVY_DID="your-actual-privy-user-id"
   ```

2. **Run the interactive demo setup**:
   ```bash
   cd packages/web
   pnpm tsx scripts/setup-interactive-demo.ts
   ```

3. **Start the app** (if not already running):
   ```bash
   pnpm dev
   ```

4. **Navigate to the inbox**:
   http://localhost:3050/dashboard/inbox

## 📋 Demo Script

### Opening

"Hi, I'm Ben. I lost $40k as a solo founder to bad financial admin. Now I'm applying lessons from designing unique user interfaces to finance.

This is my financial inbox. Each line you see is surfaced using custom configuration to help me stay on top of my financial admin. It's connected to my emails and makes sure only signal remains once it hits 0 finance."

### Part 1: Show Current State

1. **Point to the Pending tab** - Show 3 pending items
   - Sightglass Coffee Receipt ($12.45)
   - Acme Corp Invoice ($2,500)
   - Marketing Newsletter

2. **Click on History tab** - Show processed items
   - AWS Monthly Bill (auto-paid)
   - Uber Receipt (categorized)

3. **Click on Card Actions tab** - Show AI decision trail
   - AI classified AWS bill with 99% confidence
   - System executed payment
   - Human marked Uber receipt as seen

### Part 2: AI Classification Demo

1. **Go to Settings > Integrations > AI Rules**
   - Show the 3 configured rules
   - Click on "Sightglass Weekend Personal" rule
   - "I've set up this rule because I often use my company card by mistake on weekends"

2. **Return to Inbox (Pending tab)**

### Part 3: Live Processing Demo

#### Demo 1: Personal Expense Classification

1. **Click on the Sightglass Coffee receipt**
   - "This is a receipt from Sunday afternoon. Unfortunately, I used my company card by mistake."

2. **Open the document drop zone**
   - "Let me show you how our AI processes this"
   - Drag the Sightglass email screenshot into the drop zone

3. **Watch the processing**
   - AI will identify it as a personal expense
   - Check the Card Actions tab to see the classification

#### Demo 2: Auto-Payment Scheduling

1. **Click on the Acme Corp Invoice**
   - "This is a vendor invoice that needs payment"

2. **Process it through the drop zone**
   - AI will schedule payment for 2 business days
   - "Notice we don't execute immediately - you have 2 days to review"

3. **Show the scheduled payment in action log**

#### Demo 3: Spam Filtering

1. **Click on the Marketing Newsletter**
   - "This is just marketing spam"

2. **Process it**
   - AI will auto-dismiss it
   - "It's automatically filtered out so I can focus on what matters"

### Part 4: The Magic

"Here's where the magic happens. 0 finance is not just a financial admin dashboard - it's a bank account at its core. This means we can go beyond bookkeeping.

When that invoice gets processed, we don't just categorize it - we actually execute the payment. But with built-in safeguards like the 2-day review period.

Traditional financial interfaces show you transactions or basic analytics. We show you decisions that have already been made and just require your last approval.

Over time, we improve our decisions significantly by having you intervene in bad decisions and ignore good decisions, leading to an ever-improving decision-making process.

This is the future of financial interfaces - invisible, intelligent, and always learning."

## 🎯 Key Demo Points

### Emphasize These Features:

1. **AI Transparency**
   - Show confidence scores
   - Display decision reasoning
   - Full audit trail in Card Actions

2. **Safety First**
   - 2-day review period for payments
   - Nothing executes without review
   - Easy to cancel scheduled actions

3. **Learning System**
   - Rules improve over time
   - User corrections train the AI
   - Personalized to your business

4. **Beyond Bookkeeping**
   - Not just categorization
   - Actual payment execution
   - True financial automation

## 🔧 Troubleshooting

### If inbox is empty:
```bash
pnpm tsx scripts/setup-interactive-demo.ts
```

### If Card Actions tab is empty:
The demo script populates both `cardActions` and `actionLedger` tables. Refresh the page.

### To reset and start fresh:
```bash
# This will clear all demo data and recreate it
pnpm tsx scripts/setup-interactive-demo.ts
```

## 📝 Demo Customization

Edit `scripts/setup-interactive-demo.ts` to:
- Change vendor names
- Adjust amounts
- Add more cards
- Modify AI rules
- Change timing/dates

## 🎬 Recording Tips

1. **Before recording**:
   - Run fresh setup
   - Clear browser cache
   - Close other tabs
   - Use incognito mode

2. **During recording**:
   - Speak slowly and clearly
   - Pause between sections
   - Show hover states
   - Click deliberately

3. **Focus areas**:
   - Pending items first
   - AI rules configuration
   - Live processing
   - Decision transparency 