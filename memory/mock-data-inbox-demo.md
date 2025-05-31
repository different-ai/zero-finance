# Mock Data: Inbox Demo

## What was implemented
- Created a browser window wrapper around the InboxContent component for the landing page demo
- Added realistic demo financial actions in `packages/web/src/lib/demo-data.ts`

## Mock data includes:
1. **Cash sweep operation** - $12,500 to high-yield vault earning 10.2% APY
2. **Invoice payment received** - $8,500 from Acme Corp via ACH  
3. **Tax optimization** - Q4 withholding adjustment saving $3,200
4. **Weekly USDC transfer** - $2,000 to DeFi vault earning 8.4% APY
5. **AWS bill approval** - $1,247.82 requiring manual approval

## Technical implementation:
- Browser window component: `packages/web/src/components/ui/browser-window.tsx`
- Demo data generator: `packages/web/src/lib/demo-data.ts`
- Updated InboxCard types to match existing component structure
- All existing inbox components are working (InboxContent, InboxCard, etc.)

## TODO: Replace with real data
- [ ] Connect to actual financial data sources
- [ ] Replace `generateDemoCards()` with real data fetching
- [ ] Remove mock data generator
- [ ] Update store to handle real data flows

## Current status: ✅ Working demo for landing page
The browser window makes it clear this is a demo interface, perfect for showing potential users what the inbox feature looks like. 