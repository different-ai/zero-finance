# 80/20 Intelligent Assistant Solution - 2 Day Launch Plan

## Executive Summary
Focus on leveraging existing infrastructure to deliver immediate value with minimal new development. The key is to enhance the current inbox system with proactive notifications and basic financial insights.

## Day 1: Backend Intelligence Layer

### 1. Enhanced Inbox Processing (4 hours)
**What exists**: AI-powered email/document processing with classification
**Quick win**: Add financial insight extraction to existing processing

```typescript
// Enhance existing inbox card processing
interface FinancialInsights {
  type: 'payment_due' | 'low_balance' | 'tax_reminder' | 'uncategorized_expense' | 'invoice_overdue';
  urgency: 'high' | 'medium' | 'low';
  suggestedAction?: string;
  relatedAmount?: number;
  dueDate?: Date;
}

// Add to existing AI extraction
const extractFinancialInsights = (content: string, metadata: any): FinancialInsights[] => {
  // Leverage existing o3 model to extract:
  // - Payment due dates
  // - Invoice amounts and status
  // - Tax-related mentions
  // - Expense categories
}
```

### 2. Simple Analytics Service (3 hours)
**What exists**: Transaction data, safe balances, expense tracking
**Quick win**: Calculate basic metrics using existing data

```typescript
// New tRPC endpoints
export const analyticsRouter = router({
  getBurnRate: protectedProcedure.query(async ({ ctx }) => {
    // Calculate from last 30 days of expenses
    const expenses = await ctx.db.query.actionLedger.findMany({
      where: and(
        eq(actionLedger.userId, ctx.userId),
        eq(actionLedger.type, 'expense'),
        gte(actionLedger.createdAt, thirtyDaysAgo)
      )
    });
    return calculateMonthlyBurnRate(expenses);
  }),
  
  getCashRunway: protectedProcedure.query(async ({ ctx }) => {
    // Current balance / monthly burn rate
    const balance = await getCurrentBalance(ctx.userId);
    const burnRate = await getBurnRate(ctx.userId);
    return balance / burnRate; // months of runway
  }),
  
  getUpcomingObligations: protectedProcedure.query(async ({ ctx }) => {
    // Parse inbox cards for due dates
    const cards = await ctx.db.query.inboxCards.findMany({
      where: and(
        eq(inboxCards.userId, ctx.userId),
        isNotNull(inboxCards.dueDate),
        gte(inboxCards.dueDate, new Date())
      )
    });
    return cards;
  })
});
```

### 3. Notification Templates (1 hour)
**What exists**: Loops email integration
**Quick win**: Create smart notification templates

```typescript
const notificationTemplates = {
  lowBalance: {
    subject: "Hey {name}, you're running low on cash",
    body: "Your current burn rate is ${burnRate}/month and you have ${balance} available. That's about {runway} months of runway."
  },
  paymentDue: {
    subject: "Payment reminder: {description} due {dueDate}",
    body: "Hi {name}, remember you have a payment of ${amount} due on {dueDate}. Want to handle it now?"
  },
  taxReminder: {
    subject: "Q{quarter} tax payment due soon",
    body: "Hi {name}, your quarterly tax payment is due {dueDate}. Based on your income (${income}), estimated tax: ${estimate}"
  },
  unallocatedFunds: {
    subject: "You have ${amount} sitting idle",
    body: "Hey {name}, there's ${amount} unallocated in your account. Want me to move it to your yield vault for {apy}% APY?"
  }
};
```

## Day 2: Frontend & Automation

### 1. Proactive Inbox Cards (3 hours)
**What exists**: Inbox card UI with actions
**Quick win**: Add proactive notification cards

```typescript
// New inbox card types
type ProactiveCard = {
  type: 'proactive_insight';
  insight: FinancialInsight;
  suggestedActions: Array<{
    label: string;
    action: () => Promise<void>;
  }>;
};

// Components for each insight type
const InsightCard = ({ card }: { card: ProactiveCard }) => {
  switch (card.insight.type) {
    case 'low_balance':
      return <LowBalanceCard {...card} />;
    case 'payment_due':
      return <PaymentDueCard {...card} />;
    case 'tax_reminder':
      return <TaxReminderCard {...card} />;
    // etc...
  }
};
```

### 2. Background Job for Insights (2 hours)
**What exists**: Existing job infrastructure
**Quick win**: Daily insight generation job

```typescript
// New cron job (runs daily at 9 AM)
export const generateDailyInsights = async () => {
  const users = await getAllActiveUsers();
  
  for (const user of users) {
    // Check burn rate vs balance
    const insights = [];
    
    const burnRate = await calculateBurnRate(user.id);
    const balance = await getBalance(user.id);
    const runway = balance / burnRate;
    
    if (runway < 2) { // Less than 2 months runway
      insights.push({
        type: 'low_balance',
        urgency: runway < 1 ? 'high' : 'medium',
        data: { burnRate, balance, runway }
      });
    }
    
    // Check for upcoming payments
    const upcomingPayments = await getUpcomingPayments(user.id);
    insights.push(...upcomingPayments.map(p => ({
      type: 'payment_due',
      urgency: daysTillDue(p.dueDate) < 7 ? 'high' : 'medium',
      data: p
    })));
    
    // Check for tax obligations
    if (isEndOfQuarter()) {
      const taxEstimate = await estimateQuarterlyTax(user.id);
      insights.push({
        type: 'tax_reminder',
        urgency: 'high',
        data: taxEstimate
      });
    }
    
    // Create inbox cards for insights
    for (const insight of insights) {
      await createProactiveInboxCard(user.id, insight);
    }
    
    // Send email for high urgency items
    const highUrgency = insights.filter(i => i.urgency === 'high');
    if (highUrgency.length > 0) {
      await sendInsightEmail(user, highUrgency[0]);
    }
  }
};
```

### 3. Quick Actions Integration (3 hours)
**What exists**: Action buttons on inbox cards
**Quick win**: Add smart actions to proactive cards

```typescript
// Action handlers
const proactiveActions = {
  payNow: async (invoiceId: string) => {
    // Redirect to payment flow with pre-filled data
    router.push(`/pay/${invoiceId}`);
  },
  
  moveToYieldVault: async (amount: number) => {
    // One-click transfer to yield vault
    await transferToVault({ amount, vault: 'yield' });
    toast.success(`Moved $${amount} to earn ${APY}% APY`);
  },
  
  categorizeExpense: async (expenseId: string, category: string) => {
    // Quick categorization
    await updateExpenseCategory(expenseId, category);
    toast.success('Expense categorized');
  },
  
  setTaxAside: async (amount: number) => {
    // Auto-allocate to tax safe
    await transferToVault({ amount, vault: 'tax' });
    toast.success(`Set aside $${amount} for taxes`);
  }
};
```

### 4. Settings for Preferences (1 hour)
**What exists**: User settings infrastructure
**Quick win**: Add notification preferences

```typescript
// Add to user settings
interface NotificationPreferences {
  enableProactiveInsights: boolean;
  insightFrequency: 'daily' | 'weekly' | 'monthly';
  lowBalanceThreshold: number; // months of runway
  emailNotifications: boolean;
  insightTypes: {
    burnRate: boolean;
    taxReminders: boolean;
    paymentDue: boolean;
    unallocatedFunds: boolean;
  };
}
```

## Implementation Checklist

### Day 1 (8 hours)
- [ ] Enhance AI extraction to identify financial insights (2 hrs)
- [ ] Create analytics tRPC endpoints for burn rate, runway (2 hrs)
- [ ] Build notification template system (1 hr)
- [ ] Create database schema for insights storage (1 hr)
- [ ] Test insight extraction with real data (2 hrs)

### Day 2 (8 hours)
- [ ] Create proactive inbox card UI components (3 hrs)
- [ ] Implement daily insights background job (2 hrs)
- [ ] Add quick action handlers (2 hrs)
- [ ] Add user preferences for notifications (1 hr)

## Success Metrics
- Generate at least 1 relevant insight per active user per week
- 50%+ engagement rate with proactive cards
- 30%+ completion rate on suggested actions
- Reduce average time to pay invoices by 2 days

## What We're NOT Doing (Save for Later)
- Complex financial projections
- Multi-channel notifications (just email + in-app)
- Natural language chat interface
- Advanced tax calculations
- Automated transaction execution
- Custom insight rules
- Voice/SMS notifications

## Technical Dependencies
All of these already exist in the codebase:
- ✅ OpenAI integration (o3 model)
- ✅ Inbox card system
- ✅ Email via Loops
- ✅ Background job infrastructure
- ✅ tRPC API
- ✅ Transaction/expense data
- ✅ Multi-safe architecture

## Risk Mitigation
- Start with read-only insights (no automated transfers)
- Add feature flag for easy rollback
- Test with internal team first
- Limit to 1 notification per user per day initially
- Clear opt-out mechanism

## Post-Launch Iterations
Week 1: Monitor engagement, adjust thresholds
Week 2: Add more insight types based on usage
Week 3: Implement user feedback, A/B test messages
Week 4: Add automation for most-used actions

This 80/20 approach delivers immediate value by:
1. Using existing AI and data infrastructure
2. Focusing on actionable insights over complex analytics
3. Leveraging the inbox as the delivery mechanism
4. Providing one-click actions for common tasks

The beauty is that users will immediately see value through proactive financial insights without us building an entirely new system. We're just making the existing system smarter.

"Automated banking and bookkeeping for solopreneurs"

