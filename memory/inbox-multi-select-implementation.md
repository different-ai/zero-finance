# inbox multi-select implementation

## overview
implemented comprehensive multi-select functionality for the inbox page to allow bulk operations on multiple cards at once.

## features implemented

### 1. api endpoints
- **bulkUpdateStatus**: updates status for multiple cards at once (approve, dismiss, snooze, done)
- **bulkDelete**: permanently deletes multiple selected cards
- both endpoints properly handle action ledger logging for approved actions

### 2. ui components

#### multi-select action bar
- floating action bar at bottom of screen when items are selected
- shows count of selected items
- action buttons:
  - approve: marks cards as 'seen'
  - dismiss: marks cards as 'dismissed'
  - snooze: marks cards as 'snoozed'
  - done: marks cards as 'done'
  - delete: permanently deletes cards (with confirmation)
- animated entrance/exit with framer-motion
- loading states for all actions

#### inbox page header
- select all checkbox to select/deselect all visible cards
- bulk action buttons appear when items are selected
- shows selected count
- integrated with existing sync and export controls

### 3. state management
- uses existing zustand store with selectedCardIds set
- toggleCardSelection method for individual card selection
- clearSelection method to deselect all
- checkbox already rendered in inbox-card component

## usage
1. click checkbox on individual cards to select them
2. use "select all" checkbox in header to select all visible cards
3. use action buttons in header or floating action bar to perform bulk operations
4. selection is cleared after successful bulk operation

## technical details
- uses drizzle orm's `inArray` operator for bulk sql operations
- proper type safety with trpc mutations
- optimistic ui updates with proper error handling
- responsive design with mobile-friendly ui

## future enhancements
- bulk categorization
- bulk payment marking
- bulk reminder setting
- keyboard shortcuts for selection (shift+click, cmd+a, etc.) 