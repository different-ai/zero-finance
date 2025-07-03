# card action tracking system

implemented a comprehensive action tracking system for inbox cards to record all actions performed by humans, ai, and the system.

## database schema

- **card_actions table**: tracks all actions with:
  - cardId: reference to the inbox card
  - actionType: type of action performed (marked_paid, category_added, etc)
  - actor: who performed it (human/ai/system)
  - previousValue/newValue: what changed
  - details: additional context
  - status: success/failed/pending
  - performedAt: timestamp

## key components

1. **CardActionsService** (`packages/web/src/server/services/card-actions-service.ts`)
   - trackAction: record single action
   - trackBatchActions: record multiple actions
   - getCardActions: get all actions for a card
   - getUserRecentActions: get recent actions across all cards
   - getActionStats: get statistics

2. **useCardActions hook** (`packages/web/src/hooks/use-card-actions.ts`)
   - provides easy interface for tracking actions in components
   - handles mutation state and cache invalidation

3. **CardActionTimeline** (`packages/web/src/components/card-action-timeline.tsx`)
   - displays action history for a specific card
   - shown in inbox detail sidebar
   - expandable details for each action

4. **CardActionsDisplay** (`packages/web/src/components/card-actions-display.tsx`)
   - comprehensive view of all actions
   - filtering by type, actor, card id
   - statistics dashboard

## action types tracked

- status changes: marked_seen, marked_paid, dismissed, snoozed, deleted, approved, executed
- data modifications: category_added/removed, note_added/updated, amount_updated, due_date_updated
- financial actions: added_to_expenses, payment_recorded, reminder_set/sent
- ai actions: ai_classified, ai_auto_approved, ai_suggested_update
- other: attachment_downloaded, shared, comment_added

## usage example

```tsx
const { trackAction } = useCardActions()

// track when user marks card as paid
await trackAction(card.id, 'marked_paid', {
  previousValue: { paymentStatus: 'unpaid' },
  newValue: { paymentStatus: 'paid' },
  details: { amount: card.amount, paymentMethod: 'manual' }
})
```

## integration points

- inbox card component tracks all user actions
- ai classification system can track when rules are applied
- detail sidebar shows full action history
- action logs page provides comprehensive view

this system provides full traceability of what happens to each inbox card throughout its lifecycle. 