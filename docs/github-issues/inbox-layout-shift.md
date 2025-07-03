# Inbox Dashboard: Layout Shift During Gmail Sync

## Summary
When a Gmail sync is started or finishes on the Inbox dashboard, new status elements (alerts, badges, progress indicators) are mounted and un-mounted **inside the sticky header**. Because these elements are animated with `height` transitions, the entire page content jumps up and down, producing a distracting layout shift. The "Force Sync" button area also resizes as badges/buttons appear and disappear.

## Steps to Reproduce
1. Go to `/dashboard/inbox` (Gmail connected & AI processing enabled).
2. Click **Force Sync**.
3. Observe that the header grows to show a *Syncing…* badge/alert and the whole UI is pushed downward.
4. When the sync completes, the alert animates out and the content snaps back up.
5. Repeat the action – the same shift occurs every time.

## Expected Behaviour
Status changes should **not** move the underlying content. Either the header keeps a fixed height or status messages appear as overlays/toasts that don't affect layout.

## Actual Behaviour
The header's height expands/collapses causing the main content area to shift. Secondary effects:
* Buttons (e.g. *Force Sync*, *Cancel*) jump as badges come and go.
* Alerts briefly flash in/out causing additional jank.

## Root-Cause Analysis (suspected)
1. **Animated alerts inside header**
   ```tsx
   // packages/web/src/app/(authenticated)/dashboard/inbox/page.tsx
   749-828: <AnimatePresence> … <motion.div initial={{opacity:0,height:0}} …>
   ```
   The `<motion.div>` animates `height` from `0` → `auto` and back, altering document flow.
2. **Conditional rendering of sync controls** (`Force Sync`, `Syncing…` badge, `Cancel` button)
   * Header row: roughly lines 560-660 in the same file.
   * These elements are removed from/added to the DOM instead of being hidden, so the flex container re-flows each time.

## Proposed Fixes
* **Toast approach:** Move sync/gmail status messages to a fixed toast/notification system (e.g. top-center overlay) so they no longer occupy layout space.
* **Reserve space:** Give the alert container a constant `min-height` (e.g. equal to the alert's final height) and animate only `opacity`/`translateY`, not `height`.
  ```css
  .sync-alert-wrapper { min-height: 48px; }
  ```
* **Layout-preserving animation:** Use Framer Motion's `layout` prop or `AnimatePresence` `mode="popLayout"` to keep layout flow stable.
* **Button placeholders:** Instead of conditionally rendering buttons/badges, keep them in the DOM with `visibility:hidden` when inactive to maintain width.

## Affected Code
| File | Area |
|------|------|
| `packages/web/src/app/(authenticated)/dashboard/inbox/page.tsx` | Header ‑ `AnimatePresence` alerts (≈ lines 720-830) |
| " | Gmail sync controls flex row (≈ lines 560-660) |

## Additional Notes
* Similar `AnimatePresence` patterns exist in `inbox-chat.tsx`, `mobile-inbox-card.tsx`, etc., but the most disruptive jank is on the main Inbox page.
* Consider standardising status notifications across the app using a dedicated Toast component.