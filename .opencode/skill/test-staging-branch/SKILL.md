---
name: test-staging-branch
description: Test feature branches on Vercel preview deployments using Chrome automation and Gmail OTP
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: testing
---

## What I Do

End-to-end test feature branches on Vercel preview deployments:

1. Wait for Vercel deployment to complete
2. Login via Chrome MCP (Gmail OTP flow)
3. Test the specific feature
4. Report results on GitHub (without leaking sensitive data)

## Prerequisites

- Chrome DevTools MCP configured
- Vercel CLI authenticated with `--scope prologe`
- Access to Gmail for OTP codes
- GitHub CLI (`gh`) authenticated

## Workflow

### 1. Wait for Deployment

```bash
# Get latest preview deployment for the branch
BRANCH="feat/your-branch-name"
LATEST=$(vercel ls --scope prologe 2>/dev/null | grep -i "$BRANCH" | head -1 | awk '{print $2}')

# Or get the most recent deployment
LATEST=$(vercel ls --scope prologe 2>/dev/null | head -1 | awk '{print $2}')

echo "Deployment URL: $LATEST"

# Wait for Ready status (up to 5 min)
vercel inspect "$LATEST" --scope prologe --wait --timeout 5m
```

**Output to check:**

- `status: ● Ready` → proceed to testing
- `status: ● Building` → still building
- `status: ● Error` → check build logs

### 2. Login Flow (Token-Efficient)

**CRITICAL: Minimize snapshots. Each snapshot costs tokens.**

```javascript
// Step 1: Navigate to preview deployment
chrome_navigate_page({ url: 'https://your-deployment-url.vercel.app' });

// Step 2: Wait for page load, take ONE snapshot
chrome_wait_for({ text: 'Sign in', timeout: 10000 });
chrome_take_snapshot();

// Step 3: Click login button (find uid from snapshot)
chrome_click({ uid: 'login-button-uid' });

// Step 4: Wait for Privy modal, take snapshot
chrome_wait_for({ text: 'Email', timeout: 5000 });
chrome_take_snapshot();

// Step 5: Enter email
chrome_fill({ uid: 'email-input-uid', value: 'ben@0.finance' });
chrome_click({ uid: 'continue-button-uid' });
```

### 3. Get OTP from Gmail

**Navigate to Gmail, find OTP code:**

```javascript
// Open Gmail in new tab
chrome_new_page({ url: 'https://mail.google.com' });

// Wait for inbox
chrome_wait_for({ text: 'Inbox', timeout: 30000 });

// Take snapshot to find latest email
chrome_take_snapshot();

// Click on Privy email (should be recent)
chrome_click({ uid: 'privy-email-row-uid' });

// Wait for email to load
chrome_wait_for({ text: 'verification code', timeout: 5000 });

// Extract OTP with script (faster than snapshot)
chrome_evaluate_script({
  function: `() => {
    const body = document.body.innerText;
    const match = body.match(/\\b\\d{6}\\b/);
    return match ? match[0] : null;
  }`,
});
```

### 4. Complete Login

```javascript
// Switch back to app tab
chrome_list_pages();
chrome_select_page({ pageIdx: 0 });

// Enter OTP
chrome_take_snapshot();
chrome_fill({ uid: 'otp-input-uid', value: '123456' });

// Wait for dashboard
chrome_wait_for({ text: 'Dashboard', timeout: 30000 });
```

**Note**: Login typically takes 2-3 minutes. Be patient.

### 5. Test the Feature

Example for AI Email transfer feature:

```javascript
// Navigate to settings or relevant page
chrome_navigate_page({
  url: 'https://deployment.vercel.app/dashboard/settings',
});
chrome_wait_for({ text: 'Settings', timeout: 10000 });
chrome_take_snapshot();

// Verify new feature elements exist
// Take screenshot for evidence
chrome_take_screenshot({ filePath: 'test-evidence.png' });
```

### 6. Report on GitHub

**NEVER include:**

- Actual balances or amounts
- Email addresses
- OTP codes
- API keys or tokens
- Safe addresses

**DO include:**

- Feature worked/failed
- UI elements verified
- Error messages (sanitized)
- Screenshot paths (local only)

```bash
# Add comment to PR
gh pr comment $PR_NUMBER --body "## Test Results

**Branch**: feat/your-branch
**Deployment**: ✅ Deployed successfully

### Feature Tested
- [x] New balance endpoint returns correct structure
- [x] UI shows idle/earning/spendable breakdown
- [ ] Transfer flow (not tested - requires bank account)

### Evidence
Verified on preview deployment. All API responses match expected schema."
```

## Token-Efficient Patterns

### ❌ DON'T

```javascript
// Taking unnecessary snapshots
chrome_take_snapshot();
chrome_take_snapshot();
chrome_take_snapshot();
```

### ✅ DO

```javascript
// One snapshot, multiple actions
chrome_take_snapshot();
// Use uids from this snapshot for next 2-3 actions
chrome_fill({ uid: 'field1', value: 'x' });
chrome_fill({ uid: 'field2', value: 'y' });
chrome_click({ uid: 'submit' });
// Only snapshot again when page changes
```

### Use wait_for Instead of Snapshot

```javascript
// Instead of snapshot to check if loaded
chrome_wait_for({ text: 'Dashboard' });
// Only snapshot when you need uids
```

### Use evaluate_script for Data (PREFERRED)

```javascript
// Extract data without full snapshot
chrome_evaluate_script({
  function: `() => document.querySelector('.balance')?.innerText`,
});

// Check page state without snapshot
chrome_evaluate_script({
  function: `() => ({ url: window.location.href, hasText: document.body.innerText.includes('Dashboard') })`,
});

// Fill form when UIDs are stale
chrome_evaluate_script({
  function: `() => {
    const input = document.querySelector('input[type="text"]');
    if (input) {
      input.value = '123456';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return 'filled';
    }
    return 'no input';
  }`,
});
```

## Common Issues

### 1. Deployment Not Ready

Wait for `vercel inspect --wait` to complete. Don't proceed on "Building".

### 2. Login Timeout

- Check if already logged in (profile persists)
- Gmail might need manual login first
- OTP expires in 10 minutes

### 3. OTP Email Not Found

- Check spam folder
- OTP might be in "Updates" tab in Gmail
- Try searching: `from:privy.io` or `verification code`

### 4. Wrong Tab Selected

Always use `chrome_list_pages()` then `chrome_select_page()` to ensure correct tab.

## Security Reminders

1. **Never log credentials** - Not even in console.log
2. **Screenshot locally only** - Don't upload to GitHub
3. **Sanitize error messages** - Remove emails, IDs
4. **Clear browser after testing** - Use `--isolated` mode if sensitive

## Real Example: Testing Spendable Balance Feature

### Step 1: Check deployment

```bash
LATEST=$(vercel ls --scope prologe 2>/dev/null | head -1 | awk '{print $1}')
vercel inspect "$LATEST" --scope prologe --wait --timeout 5m
# Output: status: ● Ready
```

### Step 2: Navigate and login

```javascript
// Navigate to preview deployment
chrome_new_page({ url: 'https://zerofinance-xxx-prologe.vercel.app' });
chrome_wait_for({ text: 'Sign in', timeout: 10000 });

// Click Sign in, enter email, submit
chrome_click({ uid: 'sign-in-button' });
chrome_fill({ uid: 'email-input', value: 'ben@0.finance' });
chrome_click({ uid: 'continue-button' });
```

### Step 3: Get OTP from Gmail (token efficient)

```javascript
// Switch to Gmail tab (if already open)
chrome_select_page({ pageIdx: 2 }); // Gmail tab index

// Reload to see new emails
chrome_navigate_page({ type: 'reload' });
chrome_wait_for({ text: 'Inbox', timeout: 15000 });

// OTP is visible in email list preview - no need to open email!
// Look for: "Your code is XXXXXX" in the row text
chrome_take_snapshot();
// Parse the 6-digit code from the snapshot text
```

### Step 4: Enter OTP and wait for dashboard

```javascript
chrome_select_page({ pageIdx: 0 }); // App tab
chrome_fill({ uid: 'otp-input', value: '123456' });
chrome_wait_for({ text: 'Dashboard', timeout: 60000 });
```

### Step 5: Verify feature

```javascript
// Take snapshot to verify UI elements
chrome_take_snapshot();
// Look for expected text like:
// - "SPENDABLE" with amount
// - "EARNING" with amount and APY
// - "IDLE" with amount

// Take screenshot for local evidence
chrome_take_screenshot({ filePath: 'test-evidence.png' });
```

### Step 6: Report on GitHub

```bash
gh pr comment 123 --body "## Test Results

**Branch**: feat/ai-email-transfers-spendable-balance
**Deployment**: ✅ Ready

### Features Verified
- [x] Dashboard shows spendable balance breakdown
- [x] Earning balance displays with APY
- [x] Idle balance shows correctly
- [x] Total = Earning + Idle

### Notes
- Tested on preview deployment
- All balance calculations match expected values"
```

## Token Saving Tips Learned

1. **Gmail OTP visible in preview** - The OTP code shows in the email list row, no need to open the email
2. **Reuse open tabs** - Use `chrome_select_page` instead of opening new pages
3. **wait_for before snapshot** - Confirm page loaded before taking expensive snapshot
4. **One snapshot per page state** - Don't retake unless navigation occurred

## Critical Learnings from Real Usage

### Session Persistence is Your Friend

Chrome MCP **persists login sessions** between runs. Before doing the full login flow:

```javascript
// ALWAYS check if already logged in first!
chrome_new_page({ url: 'https://your-deployment.vercel.app' });
chrome_wait_for({ text: 'Dashboard', timeout: 5000 }).catch(() => null);
// If Dashboard appears, skip login entirely!
```

### Vercel Deployment URL Patterns

The preview URL pattern is predictable:

```
zerofinance-git-{branch-name-slugified}-{hash}-prologe.vercel.app
```

You can also get it directly from the PR:

```bash
# Get deployment URL from GitHub PR comment
gh pr view $PR_NUMBER --json comments --jq '.comments[] | select(.author.login=="vercel") | .body' | grep -oP 'https://zerofinance-git[^)]+\.vercel\.app' | head -1
```

### OTP Extraction - Most Efficient Method

The OTP is **6 digits** and appears in both:

1. Email list preview row (fastest - no click needed)
2. Email body (requires opening email)

```javascript
// BEST: Use evaluate_script to extract OTP without snapshot
chrome_new_page({
  url: 'https://mail.google.com/mail/u/0/#search/from%3Aprivy+newer_than%3A5m',
});
chrome_wait_for({ text: 'Inbox', timeout: 15000 });

// Extract OTP directly via script - NO SNAPSHOT NEEDED
chrome_evaluate_script({
  function: `() => {
    const rows = document.querySelectorAll('tr[role="row"]');
    for (const row of rows) {
      const text = row.innerText;
      if (text.includes('Preview | Dev') && text.includes('Your code is')) {
        const match = text.match(/Your code is (\\d{6})/);
        if (match) return match[1];
      }
    }
    return null;
  }`,
});
// Returns the 6-digit OTP directly!
```

**Key insight**: `evaluate_script` is MUCH cheaper than `take_snapshot`. Use it for:

- Extracting specific data (OTP codes, balances, text)
- Checking page state (`document.body.innerText.includes('Dashboard')`)
- Filling forms when UIDs are stale

### Privy Login Modal UIDs

The Privy modal has consistent element structure:

- Email input: Look for `textbox` with "Email" nearby
- Continue button: Usually `button` with text "Continue" or "Submit"
- OTP inputs: 6 separate `textbox` elements OR one combined input

**Pro tip**: After entering email, Privy redirects. Wait for OTP screen:

```javascript
chrome_wait_for({ text: 'Enter the code', timeout: 10000 });
```

### Dashboard Verification Checklist

When testing balance features, verify these elements exist:

- `SPENDABLE` label with dollar amount
- `EARNING` label with dollar amount and APY percentage
- `IDLE` label with dollar amount
- Total calculation makes sense (SPENDABLE ≈ EARNING + IDLE)

### Common Failure Modes

| Issue               | Symptom                                    | Fix                                  |
| ------------------- | ------------------------------------------ | ------------------------------------ |
| Stale session       | Login works but dashboard shows wrong data | Hard refresh or clear cookies        |
| OTP expired         | "Code expired" error                       | Re-request OTP, they last ~10 min    |
| Wrong deployment    | Features missing                           | Verify branch name in URL matches PR |
| Rate limited        | Gmail blocks automation                    | Wait 30s between email checks        |
| Privy popup blocked | Modal doesn't appear                       | Check for popup blockers in Chrome   |

### Optimal Test Sequence

```
1. Check if already logged in (5 sec check)
   └─ YES → Skip to step 5
   └─ NO → Continue

2. Get deployment URL from Vercel/GitHub (no browser needed)

3. Navigate to deployment, wait for sign-in button

4. Login flow:
   a. Click sign in
   b. Enter email
   c. Switch to Gmail tab (or open new)
   d. Search for recent Privy email
   e. Extract OTP from list preview
   f. Switch back to app
   g. Enter OTP
   h. Wait for Dashboard (up to 60s)

5. Verify feature (1-2 snapshots max)

6. Screenshot evidence (local only)

7. Report on GitHub PR
```

### Parallel Tab Strategy

Keep these tabs open for efficiency:

- Tab 0: App under test
- Tab 1: Gmail (logged in)
- Tab 2: (optional) Another app page

```javascript
// Quick tab reference
chrome_list_pages(); // Always know your tab indices
chrome_select_page({ pageIdx: 0, bringToFront: true });
```

## Anti-Patterns to Avoid

### Don't: Snapshot spam

```javascript
// BAD - 5 snapshots for one flow
chrome_take_snapshot(); // to find button
chrome_click({ uid: 'x' });
chrome_take_snapshot(); // to check result
chrome_take_snapshot(); // just in case
chrome_take_snapshot(); // why not
```

### Do: Strategic snapshots

```javascript
// GOOD - 2 snapshots for full flow
chrome_wait_for({ text: 'Page loaded' });
chrome_take_snapshot(); // Get all UIDs needed
chrome_click({ uid: 'button1' });
chrome_fill({ uid: 'input1', value: 'x' });
chrome_click({ uid: 'submit' });
chrome_wait_for({ text: 'Success' });
chrome_take_snapshot(); // Verify result
```

### Don't: Open new tabs unnecessarily

```javascript
// BAD
chrome_new_page({ url: 'https://mail.google.com' }); // Every time
```

### Do: Reuse existing tabs

```javascript
// GOOD
chrome_list_pages();
// Find Gmail tab by URL, select it
chrome_select_page({ pageIdx: gmailTabIndex });
chrome_navigate_page({ type: 'reload' }); // Refresh to see new emails
```
