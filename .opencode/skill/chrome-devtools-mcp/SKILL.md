---
name: chrome-devtools-mcp
description: Browser automation using Chrome DevTools MCP - control Chrome for debugging, automation, and performance analysis
license: MIT
compatibility: opencode
metadata:
  service: chrome-devtools
  category: browser-automation
---

## What I Do

Control and inspect a live Chrome browser using Chrome DevTools MCP. This gives you access to the full power of Chrome DevTools for reliable automation, in-depth debugging, and performance analysis.

Key features:

- Performance insights via Chrome DevTools trace recording
- Advanced browser debugging (network, console, screenshots)
- Reliable automation using Puppeteer with automatic waits

## Prerequisites

- Node.js v20.19 or newer
- Chrome stable version or newer
- npm

## Installation

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

## Available Tools

### Input Automation

| Tool            | Description                         |
| --------------- | ----------------------------------- |
| `click`         | Click on an element by uid          |
| `drag`          | Drag element to another element     |
| `fill`          | Type text into input/textarea       |
| `fill_form`     | Fill multiple form elements at once |
| `handle_dialog` | Accept or dismiss browser dialogs   |
| `hover`         | Hover over an element               |
| `press_key`     | Press keyboard key or combination   |
| `upload_file`   | Upload a file through file input    |

### Navigation

| Tool            | Description                           |
| --------------- | ------------------------------------- |
| `navigate_page` | Navigate to URL, back/forward, reload |
| `new_page`      | Open a new page/tab                   |
| `list_pages`    | List all open pages                   |
| `select_page`   | Switch to a specific page             |
| `close_page`    | Close a page by index                 |
| `wait_for`      | Wait for text to appear on page       |

### Debugging

| Tool                    | Description                        |
| ----------------------- | ---------------------------------- |
| `take_snapshot`         | Get accessibility tree snapshot    |
| `take_screenshot`       | Capture screenshot of page/element |
| `evaluate_script`       | Execute JavaScript in the page     |
| `list_console_messages` | Get console logs                   |
| `get_console_message`   | Get specific console message       |

### Network

| Tool                    | Description           |
| ----------------------- | --------------------- |
| `list_network_requests` | List network requests |
| `get_network_request`   | Get request details   |

### Performance

| Tool                          | Description                 |
| ----------------------------- | --------------------------- |
| `performance_start_trace`     | Start performance trace     |
| `performance_stop_trace`      | Stop and get trace          |
| `performance_analyze_insight` | Analyze performance insight |

### Emulation

| Tool          | Description                       |
| ------------- | --------------------------------- |
| `emulate`     | Emulate network, CPU, geolocation |
| `resize_page` | Resize browser window             |

---

## Gmail Agent Example

You are a Gmail automation agent. Your job is to help users read, search, and manage their Gmail inbox.

### NAVIGATING TO GMAIL

Always start by navigating to Gmail:

```javascript
navigate_page({ url: 'https://mail.google.com' });
```

If not logged in, the user will need to log in manually. Wait for them:

```javascript
wait_for({ text: 'Inbox' });
```

### TAKING SNAPSHOTS

Before any interaction, take a snapshot to get element uids:

```javascript
take_snapshot();
```

The snapshot returns elements with unique `uid` values you'll use for clicking, filling, etc.

### SEARCHING EMAILS

Use Gmail's search by clicking the search box and typing:

```javascript
// First take snapshot to find search box uid
take_snapshot();

// Click search box (uid from snapshot)
click({ uid: 'search-box-uid' });

// Fill search query
fill({ uid: 'search-input-uid', value: 'from:boss@company.com' });

// Press Enter to search
press_key({ key: 'Enter' });
```

### READING AN EMAIL

```javascript
// Take snapshot of inbox
take_snapshot();

// Click on email row (use uid from snapshot)
click({ uid: 'email-row-uid' });

// Wait for email to load
wait_for({ text: 'Reply' });

// Take snapshot to read email content
take_snapshot();
```

### COMPOSING AN EMAIL

```javascript
// Click Compose button
take_snapshot();
click({ uid: 'compose-button-uid' });

// Wait for compose window
wait_for({ text: 'New Message' });

// Fill form fields
take_snapshot();
fill_form({
  elements: [
    { uid: 'to-field-uid', value: 'recipient@example.com' },
    { uid: 'subject-field-uid', value: 'Meeting Tomorrow' },
    { uid: 'body-field-uid', value: 'Hi, just confirming our meeting...' },
  ],
});

// Click Send
click({ uid: 'send-button-uid' });
```

### EXTRACTING EMAIL DATA

Use `evaluate_script` to extract structured data:

```javascript
evaluate_script({
  function: `() => {
    const emails = document.querySelectorAll('[role="row"]');
    return Array.from(emails).slice(0, 10).map(row => ({
      subject: row.querySelector('[data-thread-perm-id]')?.textContent || '',
      sender: row.querySelector('[email]')?.getAttribute('email') || '',
      snippet: row.querySelector('.y2')?.textContent || ''
    }));
  }`,
});
```

### CHECKING FOR NEW EMAILS

```javascript
// Navigate to inbox
navigate_page({ url: 'https://mail.google.com/mail/u/0/#inbox' });

// Get unread count
evaluate_script({
  function: `() => {
    const unread = document.querySelector('.bsU');
    return { unreadCount: unread?.textContent || '0' };
  }`,
});
```

### LABELING EMAILS

```javascript
// Select email (checkbox)
take_snapshot();
click({ uid: 'checkbox-uid' });

// Click Labels dropdown
click({ uid: 'labels-button-uid' });

// Select label
wait_for({ text: 'Label as:' });
take_snapshot();
click({ uid: 'target-label-uid' });
```

### ERROR HANDLING

1. **Login required** → Tell user "Please log in to Gmail, then say 'ready'"
2. **Element not found** → Take fresh snapshot, element uids change between pages
3. **Timeout** → Page usually loaded anyway, proceed with snapshot
4. **"Chrome busy"** → Close other OpenCode sessions using Chrome

### KEY PRINCIPLES

1. **Always snapshot before interacting** - uids change between page states
2. **Use `wait_for` after navigation** - ensure page is loaded
3. **Use `evaluate_script` for data extraction** - more reliable than parsing snapshots
4. **One action at a time** - snapshot → act → snapshot again
5. **Gmail selectors are complex** - prefer role-based selectors or visible text

---

## Configuration Options

### Common Flags

| Flag            | Description                               |
| --------------- | ----------------------------------------- |
| `--headless`    | Run without visible browser               |
| `--isolated`    | Temporary profile, cleared on close       |
| `--channel`     | Chrome channel: stable, canary, beta, dev |
| `--viewport`    | Initial size, e.g., "1280x720"            |
| `--browser-url` | Connect to running Chrome instance        |

### Example Configurations

**Headless Mode:**

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--headless=true"]
    }
  }
}
```

**Isolated Session (no persistence):**

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--isolated=true"]
    }
  }
}
```

**Connect to Running Chrome:**

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--browser-url=http://127.0.0.1:9222"
      ]
    }
  }
}
```

Start Chrome with debugging enabled first:

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
```

### User Data Directory

Default profile locations:

- macOS/Linux: `$HOME/.cache/chrome-devtools-mcp/chrome-profile-stable`
- Windows: `%HOMEPATH%/.cache/chrome-devtools-mcp/chrome-profile-stable`

Profile persists between sessions unless `--isolated` is used.

---

## Troubleshooting

### Browser Won't Start

- Ensure Chrome is installed
- Try `--headless=true` on servers without display
- Check Node.js version (need v20.19+)

### Elements Not Found

- Always take fresh snapshot before interacting
- uids are only valid for current page state
- Use `wait_for` to ensure dynamic content loaded

### Timeouts

- Increase with `--timeout` flag if needed
- Navigation timeouts usually mean page loaded anyway

### Login/Auth Issues

- Use persistent profile (default) to stay logged in
- Or use `--browser-url` to connect to Chrome you logged into manually

### Performance

- Use `--headless=true` for faster execution
- Close unused pages with `close_page`
- Avoid unnecessary screenshots (snapshots are faster)
