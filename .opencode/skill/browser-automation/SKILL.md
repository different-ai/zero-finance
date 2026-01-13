---
name: browser-automation
description: Reliable, composable browser automation using minimal OpenCode Browser primitives.
license: MIT
compatibility: opencode
metadata:
  audience: agents
  domain: browser
---

## What I do

- Provide a safe, composable workflow for browsing tasks
- Use `browser_query` list and index selection to click reliably
- Confirm state changes after each action

## Best-practice workflow

1. Inspect tabs with `browser_get_tabs`
2. Open new tabs with `browser_open_tab` when needed
3. Navigate with `browser_navigate` if needed
4. Wait for UI using `browser_query` with `timeoutMs`
5. Discover candidates using `browser_query` with `mode=list`
6. Click, type, or select using `index`
7. Confirm using `browser_query` or `browser_snapshot`

## Selecting options

- Use `browser_select` for native `<select>` elements
- Prefer `value` or `label`; use `optionIndex` when needed
- Example: `browser_select({ selector: "select", value: "plugin" })`

## Query modes

- `text`: read visible text from a matched element
- `value`: read input values
- `list`: list many matches with text/metadata
- `exists`: check presence and count
- `page_text`: extract visible page text

## Opening tabs

- Use `browser_open_tab` to create a new tab, optionally with `url` and `active`
- Example: `browser_open_tab({ url: "https://example.com", active: false })`

## Troubleshooting

- If a selector fails, run `browser_query` with `mode=page_text` to confirm the content exists
- Use `mode=list` on broad selectors (`button`, `a`, `*[role="button"]`) and choose by index
- Confirm results after each action
