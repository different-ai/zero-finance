# Demoify Skill

Create clean, professional demo screenshots by modifying live web pages via Chrome DevTools MCP.

## Use Cases

- Tweet screenshots (side-by-side format)
- Product demos
- Marketing materials
- Investor decks

## Twitter Image Ratios

| Format                      | Ratio                   | Use Case                     |
| --------------------------- | ----------------------- | ---------------------------- |
| **Single image**            | 16:9 (1200x675)         | Wide screenshots, dashboards |
| **Two images side-by-side** | ~250x290 each (~1:1.16) | Before/after, flow demos     |
| **Four images**             | Square-ish              | Multiple steps               |

**For two-image tweets**: Use tall/narrow format, NOT wide. Resize browser to ~500-600px width.

## Quick Workflow

### 1. Setup

```javascript
// Open target URL in Chrome DevTools MCP
chrome_new_page({ url: 'https://example.com' });

// For side-by-side tweets, resize to narrow format
chrome_resize_page({ width: 600, height: 700 });
```

### 2. DOM Edits - Text Replacement

```javascript
chrome_evaluate_script({
  function: `() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node, changes = [];
    while (node = walker.nextNode()) {
      if (node.textContent.includes('OLD_TEXT')) {
        node.textContent = node.textContent.replace(/OLD_TEXT/g, 'NEW_TEXT');
        changes.push('replaced');
      }
    }
    return changes.length + ' changes';
  }`,
});
```

### 3. DOM Edits - Link Text

```javascript
chrome_evaluate_script({
  function: `() => {
    document.querySelectorAll('a[href*="old-pattern"]').forEach(link => {
      link.textContent = 'new text';
    });
    return 'done';
  }`,
});
```

### 4. Hide UI Elements (Safe Method)

Use `visibility: hidden` instead of `display: none` to avoid layout shifts:

```javascript
chrome_evaluate_script({
  function: `() => {
    // Hide by selector
    const el = document.querySelector('.sidebar');
    if (el) el.style.visibility = 'hidden';
    
    // Hide by role
    const nav = document.querySelector('[role="navigation"]');
    if (nav) nav.style.visibility = 'hidden';
    
    return 'hidden';
  }`,
});
```

### 5. Take Screenshot

```javascript
// Viewport only
chrome_take_screenshot({ filePath: '/path/to/screenshot.png' });

// Full page
chrome_take_screenshot({ filePath: '/path/to/screenshot.png', fullPage: true });

// Specific element
chrome_take_screenshot({
  uid: 'element_uid',
  filePath: '/path/to/screenshot.png',
});
```

## Common Patterns

### Gmail Demo

```javascript
// 1. Change sender name
const firstSender = document.querySelector('[role="gridcell"]');
firstSender.textContent = 'New Name';

// 2. Change email addresses
document.querySelectorAll('a[href*="mailto:"]').forEach((link) => {
  link.textContent = 'new@email.com';
});

// 3. Hide sidebar
document.querySelector('[role="navigation"]').style.visibility = 'hidden';
document.querySelector('iframe[title="Chat"]').style.visibility = 'hidden';
document.querySelector('[role="banner"]').style.visibility = 'hidden';
```

### Invoice/Dashboard Demo

```javascript
// Change names, emails, amounts
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
let node;
while ((node = walker.nextNode())) {
  node.textContent = node.textContent
    .replace(/Real Name/g, 'Demo Name')
    .replace(/real@email.com/g, 'demo@company.co')
    .replace(/\$1,234/g, '$10,000');
}
```

## Tips

1. **Open multiple tabs** - Keep original in one tab so you don't lose edits if you break something
2. **Use visibility:hidden** - Safer than display:none, preserves layout
3. **Reload to reset** - If you break something, just reload the page
4. **Save incrementally** - Take screenshots after each successful edit
5. **Test side-by-side** - Open Twitter composer to verify images look good together

## Realistic Demo Data

### Names (diverse, professional)

- Patrick Chen, Sarah Martinez, James O'Brien, Priya Sharma, Marcus Johnson

### Emails

- patrick@chendesign.co, sarah@martinezlaw.com, james@obrien.io

### Companies

- Chen Design Co, Martinez Legal, O'Brien Consulting

### Amounts

- $10,000, $25,000, $50,000 (round numbers look more intentional)

## Avoid

- "Acme Corp" - too cliché
- "John Doe" - too fake
- "test@test.com" - unprofessional
- Hiding too much UI - page goes blank
- Using display:none on parent containers - breaks layout
