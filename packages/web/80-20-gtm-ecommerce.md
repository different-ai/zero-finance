# 80/20 GTM: International E-commerce Sellers

## Segment Overview
- **Size**: 9.7M Amazon sellers worldwide, 1.9M active in US
- **Pain**: 3-6% of gross sales lost to FX/fees
- **Opportunity**: $500-2000 ARPU = $5B+ TAM  
- **Competition**: Payoneer, Wise Business, OFX (but not integrated with operations)

## 2-Day Feature Build

### Day 1: Multi-Currency Infrastructure (8 hours)

#### 1. Currency Vault System (3 hours)
```typescript
// Extend existing safe architecture for currencies
const currencyVaults = {
  supported: ['USD', 'EUR', 'GBP', 'CNY', 'INR', 'MXN', 'CAD'],
  
  createVault: async (userId: string, currency: string) => {
    // Create sub-safe for each currency
    const vault = await createSafe({
      userId,
      type: 'currency',
      currency,
      name: `${currency} Vault`
    });
    
    // Set up auto-conversion rules
    await createConversionRule({
      vaultId: vault.id,
      minBalance: 1000, // Keep minimum for operations
      excessTarget: 'USD' // Convert excess to USD
    });
    
    return vault;
  },
  
  getConsolidatedBalance: async (userId: string) => {
    const vaults = await getUserVaults(userId);
    const rates = await getCurrentFXRates();
    
    return vaults.reduce((total, vault) => {
      const usdValue = vault.balance * rates[vault.currency].toUSD;
      return total + usdValue;
    }, 0);
  }
};
```

#### 2. FX Optimization Engine (3 hours)
```typescript
// Monitor rates and alert on opportunities
const fxOptimizer = {
  analyzeRates: async (userId: string) => {
    const needs = await getUpcomingPayments(userId);
    const holdings = await getCurrencyHoldings(userId);
    const rates = await getFXRates();
    
    const opportunities = [];
    
    for (const payment of needs) {
      const currentRate = rates[payment.currency];
      const avg30Day = await get30DayAvgRate(payment.currency);
      
      if (currentRate < avg30Day * 0.98) { // 2% better than average
        opportunities.push({
          action: 'convert_now',
          from: 'USD',
          to: payment.currency,
          amount: payment.amount,
          savings: payment.amount * 0.02,
          urgency: 'high'
        });
      }
    }
    
    return opportunities;
  },
  
  autoBatchPayments: async (userId: string) => {
    // Group payments by currency to reduce transfer fees
    const payments = await getPendingPayments(userId);
    const batches = groupBy(payments, 'currency');
    
    for (const [currency, batch] of Object.entries(batches)) {
      if (batch.length > 3) { // Worth batching
        await createInboxCard({
          type: 'batch_opportunity',
          title: `Save $${batch.length * 25} by batching ${batch.length} ${currency} payments`,
          action: 'batch_payments',
          data: batch
        });
      }
    }
  }
};
```

#### 3. Marketplace Integration (2 hours)
```typescript
// Track marketplace payouts and reserves
const marketplaceSync = {
  syncAmazonPayouts: async (userId: string, credentials: AmazonCreds) => {
    const payouts = await fetchAmazonPayouts(credentials);
    
    for (const payout of payouts) {
      // Track rolling reserve
      if (payout.reserve) {
        await createReserveTracking({
          userId,
          marketplace: 'amazon',
          amount: payout.reserve,
          releaseDate: payout.reserveReleaseDate,
          currency: payout.currency
        });
      }
      
      // Create cash flow projection
      await updateCashProjection({
        userId,
        date: payout.expectedDate,
        amount: payout.net,
        type: 'marketplace_payout',
        confidence: 0.95
      });
    }
  }
};
```

### Day 2: E-commerce Specific Features (8 hours)

#### 1. VAT Compliance Automation (3 hours)
```typescript
const vatAutomation = {
  trackTransaction: async (transaction: Transaction) => {
    if (isEUTransaction(transaction)) {
      const vatRate = await getVATRate(transaction.country);
      const vatAmount = transaction.amount * vatRate;
      
      // Auto-allocate to VAT vault
      await transferToVault({
        amount: vatAmount,
        vault: 'vat',
        description: `VAT for ${transaction.country} sale`
      });
      
      // Track for reporting
      await recordVATLiability({
        country: transaction.country,
        amount: vatAmount,
        quarter: getCurrentQuarter(),
        transactionId: transaction.id
      });
    }
  },
  
  generateOSSReturn: async (userId: string, quarter: string) => {
    const liabilities = await getVATLiabilities(userId, quarter);
    const grouped = groupBy(liabilities, 'country');
    
    return {
      totalDue: sum(liabilities, 'amount'),
      byCountry: grouped,
      dueDate: getVATDueDate(quarter),
      report: generateOSSReport(grouped)
    };
  }
};
```

#### 2. Supplier Payment Optimization (2 hours)
```typescript
const supplierPayments = {
  optimizePayment: async (invoice: SupplierInvoice) => {
    const options = [];
    
    // Check early payment discount
    if (invoice.earlyPayDiscount) {
      const savings = invoice.amount * invoice.earlyPayDiscount;
      const roi = (savings / invoice.amount) * 365 / invoice.earlyPayDays;
      
      options.push({
        strategy: 'pay_early',
        savings,
        annualizedROI: roi,
        recommendation: roi > 0.12 ? 'highly_recommended' : 'recommended'
      });
    }
    
    // Check currency optimization
    const currentRate = await getFXRate(invoice.currency);
    const predictedRate = await predictFXRate(invoice.currency, invoice.dueDate);
    
    if (predictedRate > currentRate * 1.02) {
      options.push({
        strategy: 'convert_now',
        savings: invoice.amount * 0.02,
        recommendation: 'recommended'
      });
    }
    
    return options;
  }
};
```

#### 3. True Cash Dashboard (3 hours)
```typescript
// Show real available cash accounting for reserves
const trueCashDashboard = {
  calculate: async (userId: string) => {
    const balances = await getAllBalances(userId);
    const reserves = await getActiveReserves(userId);
    const pendingPayouts = await getPendingPayouts(userId);
    const vatLiabilities = await getCurrentVATLiabilities(userId);
    const pendingSupplierPayments = await getPendingSupplierPayments(userId);
    
    return {
      totalBalance: sum(balances),
      lessReserves: sum(reserves),
      lessPendingObligations: sum(pendingSupplierPayments) + sum(vatLiabilities),
      plusIncoming: sum(pendingPayouts),
      trueAvailable: sum(balances) - sum(reserves) - sum(pendingSupplierPayments) - sum(vatLiabilities),
      breakdown: {
        byMarketplace: groupBy(reserves, 'marketplace'),
        byCurrency: groupBy(balances, 'currency'),
        obligations: {
          suppliers: pendingSupplierPayments,
          vat: vatLiabilities
        }
      }
    };
  }
};
```

## GTM Strategy

### Week 1: Beta Launch
**Target**: 100 high-volume Amazon sellers ($1M+ annual)
**Focus**: US-based selling internationally

**Tactics**:
1. **Direct Outreach**
   - LinkedIn: Target "Amazon FBA" + "International"
   - Facebook Groups: FBA Mastermind, Amazon Sellers
   - Email: Scrape Jungle Scout top sellers

2. **Partnership Approach**
   - Reach out to Amazon aggregators
   - FBA prep centers
   - E-commerce accountants

3. **Content Marketing**
   ```
   Case studies:
   - "How We Saved $45k/year on FX Fees"
   - "The Hidden Cost of Amazon Rolling Reserves"
   - "VAT Compliance Made Simple"
   ```

### Week 2-4: Scale

**Channels**:
1. **Marketplace Forums**
   - Seller Central forums
   - r/FulfillmentByAmazon (250k members)
   - Warrior Forum marketplace section
   - EcommerceFuel private forum

2. **Influencer Partnerships**
   - YouTube: MyWifeQuitHerJob, Jungle Scout
   - Podcasts: AM/PM Podcast, The Amazing Seller
   - Course creators: Amazing Selling Machine

3. **Paid Acquisition**
   - Google Ads: "multi currency business account"
   - Facebook: Lookalike from Amazon Seller groups
   - LinkedIn: Target e-commerce titles

### Messaging Framework

**Hero Message**: "Your money, every currency, zero friction"

**Value Props**:
1. Save 3-6% on every international transaction
2. See your true cash (minus reserves)
3. Never miss a VAT deadline
4. Pay suppliers in any currency

**Proof Points**:
- "$287k saved on FX in 2024" - John, Kitchen Supplies
- "VAT compliance went from nightmare to automatic" - Lisa, Beauty Products
- "Finally know my real cash position" - Ahmad, Electronics

### Launch Sequence

**Pre-Launch**:
- Week -2: Build integration with Amazon SP-API
- Week -1: Test with 5 power sellers

**Launch**:
- Day 1-2: Build core features
- Day 3: Test with 10 beta users
- Day 4-7: Daily iterations
- Week 2: Open to 100 users
- Week 3: Influencer push
- Week 4: Paid ads begin

### Competitive Positioning

**vs Payoneer**: "Built for e-commerce ops, not just transfers"
**vs Wise**: "See through marketplace reserves"
**vs Traditional Banks**: "Multi-currency native, not bolted on"

### Pricing Strategy
- Starter: $49/month (up to $50k/month volume)
- Growth: $149/month (up to $500k/month)
- Scale: $499/month (unlimited + dedicated support)
- FX: 0.5% markup (vs 2-4% competitors)

## Success Criteria
- 25 power sellers ($1M+) in beta
- $500k monthly payment volume by Week 4
- 80% monthly retention
- $25k MRR by Week 4
- Average FX savings: $2k/month/user

## Partnership Strategy
1. **Jungle Scout**: Data partnership + co-marketing
2. **Helium 10**: Integration + webinar
3. **A2X**: Accounting sync partnership
4. **Inventory Lab**: Joint solution for suppliers

## Risk Mitigation
- Start with read-only marketplace data
- Manual FX for first 2 weeks
- Partner with Wise for initial FX rails
- 24/7 support for beta users
- Daily liquidity monitoring