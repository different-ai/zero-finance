---
name: gmail-chrome
description: Automate Gmail actions using Chrome DevTools MCP - search, read, compose, reply, and manage emails
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: automation
---

## What I Do

- Search and read emails in Gmail
- Compose and send new emails
- Reply to existing threads
- Archive, delete, and label emails
- Navigate Gmail efficiently using keyboard shortcuts

## Prerequisites

- Chrome browser open with Gmail tab
- Chrome DevTools MCP server running (configured in opencode.json)
- Logged into Gmail in the browser

## Context Management Strategy

**IMPORTANT**: Gmail's DOM is complex. To prevent context overflow:

1. **Take snapshots sparingly** - Only snapshot when you need to find elements
2. **Use keyboard shortcuts** when possible (faster than clicking)
3. **Work in batches** - Complete one action fully before starting next
4. **Clear context** between major operations

## Core Gmail Operations

### 1. Navigate to Gmail

```
chrome_navigate_page(url: "https://mail.google.com")
chrome_wait_for(text: "Inbox")
```

### 2. Search for Emails

Gmail search is the fastest way to find emails:

```
# Take snapshot to find search box
chrome_take_snapshot()

# Find the search input (usually has placeholder "Search mail")
chrome_fill(uid: "<search-input-uid>", value: "from:sender@example.com")
chrome_press_key(key: "Enter")
chrome_wait_for(text: "results")
```

**Common search operators**:

- `from:email@example.com` - From specific sender
- `to:email@example.com` - To specific recipient
- `subject:keyword` - Subject contains keyword
- `is:unread` - Unread emails only
- `is:starred` - Starred emails
- `has:attachment` - Has attachments
- `after:2024/01/01` - After date
- `before:2024/12/31` - Before date
- `label:important` - Has label

### 3. Read an Email

```
# After search results appear, take snapshot
chrome_take_snapshot()

# Click on email row to open it
chrome_click(uid: "<email-row-uid>")

# Wait for email to load
chrome_wait_for(text: "Reply")

# Take snapshot to read content
chrome_take_snapshot()
```

### 4. Compose New Email

**Using keyboard shortcut (preferred)**:

```
# Press 'c' to compose (Gmail shortcut)
chrome_press_key(key: "c")
chrome_wait_for(text: "New Message")

# Take snapshot to find compose fields
chrome_take_snapshot()

# Fill in the compose form
chrome_fill(uid: "<to-field-uid>", value: "recipient@example.com")
chrome_press_key(key: "Tab")
chrome_fill(uid: "<subject-field-uid>", value: "Email Subject")
chrome_press_key(key: "Tab")
chrome_fill(uid: "<body-field-uid>", value: "Email body content here...")

# Send with Ctrl+Enter or click Send
chrome_press_key(key: "Control+Enter")
```

### 5. Reply to Email

```
# With email open, press 'r' to reply
chrome_press_key(key: "r")
chrome_wait_for(text: "Send")

# Take snapshot to find reply box
chrome_take_snapshot()

# Type reply
chrome_fill(uid: "<reply-body-uid>", value: "Your reply here...")

# Send
chrome_press_key(key: "Control+Enter")
```

### 6. Archive Email

```
# With email open or selected, press 'e' to archive
chrome_press_key(key: "e")
```

### 7. Delete Email

```
# With email open or selected, press '#' to delete
chrome_press_key(key: "Shift+3")  # '#' key
```

### 8. Star/Unstar Email

```
# Press 's' to star/unstar
chrome_press_key(key: "s")
```

### 9. Mark as Read/Unread

```
# Press 'Shift+i' to mark as read
chrome_press_key(key: "Shift+i")

# Press 'Shift+u' to mark as unread
chrome_press_key(key: "Shift+u")
```

### 10. Navigate Between Emails

```
# Press 'j' for next email
chrome_press_key(key: "j")

# Press 'k' for previous email
chrome_press_key(key: "k")

# Press 'u' to go back to list
chrome_press_key(key: "u")
```

## Gmail Keyboard Shortcuts Reference

| Action         | Shortcut      | Notes                        |
| -------------- | ------------- | ---------------------------- |
| Compose        | `c`           | Opens new compose window     |
| Reply          | `r`           | Reply to current email       |
| Reply all      | `a`           | Reply to all recipients      |
| Forward        | `f`           | Forward email                |
| Send           | `Ctrl+Enter`  | Sends composed email         |
| Archive        | `e`           | Archives selected/open email |
| Delete         | `#` (Shift+3) | Moves to trash               |
| Star           | `s`           | Toggle star                  |
| Mark read      | `Shift+i`     | Mark as read                 |
| Mark unread    | `Shift+u`     | Mark as unread               |
| Next email     | `j`           | Move to next in list         |
| Previous email | `k`           | Move to previous             |
| Back to list   | `u`           | Return to inbox view         |
| Search         | `/`           | Focus search box             |
| Select all     | `*+a`         | Select all visible           |
| Deselect all   | `*+n`         | Deselect all                 |

## Element Identification Tips

Gmail elements can be identified by:

1. **Aria labels**: Most buttons have descriptive aria-labels
   - "Compose" button
   - "Send" button
   - "Archive" button

2. **Placeholder text**: Input fields often have placeholders
   - "Search mail"
   - "To"
   - "Subject"

3. **Content text**: Email subjects and sender names

## Example: Find and Reply to Specific Email

```
# 1. Navigate to Gmail
chrome_navigate_page(url: "https://mail.google.com")
chrome_wait_for(text: "Inbox")

# 2. Search for the email
chrome_take_snapshot()  # Find search box
chrome_fill(uid: "<search-uid>", value: "from:important@client.com subject:urgent")
chrome_press_key(key: "Enter")
chrome_wait_for(text: "results")

# 3. Open the email
chrome_take_snapshot()  # Find email row
chrome_click(uid: "<email-row-uid>")
chrome_wait_for(text: "Reply")

# 4. Read the email content
chrome_take_snapshot()
# ... process the email content from snapshot ...

# 5. Reply
chrome_press_key(key: "r")
chrome_wait_for(text: "Send")
chrome_take_snapshot()  # Find reply body
chrome_fill(uid: "<reply-body-uid>", value: "Thank you for your email...")
chrome_press_key(key: "Control+Enter")
```

## Example: Bulk Archive Emails

```
# 1. Search for emails to archive
chrome_fill(uid: "<search-uid>", value: "is:read before:2024/01/01")
chrome_press_key(key: "Enter")
chrome_wait_for(text: "results")

# 2. Select all visible emails
chrome_press_key(key: "*")  # Open selection menu
chrome_press_key(key: "a")  # Select all

# 3. Archive all selected
chrome_press_key(key: "e")
```

## Troubleshooting

### Gmail Not Loading

- Check if logged in
- Try refreshing: `chrome_navigate_page(type: "reload")`

### Compose Window Not Opening

- Ensure keyboard shortcuts are enabled in Gmail settings
- Try clicking compose button instead of 'c' key

### Elements Not Found

- Gmail DOM is dynamic; take a fresh snapshot
- Wait for page to fully load
- Try scrolling to make elements visible

### Slow Response

- Gmail is heavy; allow extra time for actions
- Use `chrome_wait_for()` between major operations

## When to Use This Skill

- Automating email workflows
- Bulk email operations
- Reading and responding to emails programmatically
- Email search and analysis
- Testing email-related features
