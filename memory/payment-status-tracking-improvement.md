# payment status tracking improvement

## overview
improved the payment status tracking in the email processor to better distinguish between paid and unpaid items based on document type and content analysis.

## key changes

### 1. smart payment status determination
- **receipts**: always marked as "paid" since they are proof of payment
- **invoices**: default to "unpaid" unless ai finds evidence of payment (e.g., "paid", "payment received", "settled")
- **payment reminders**: always marked as "unpaid"
- **other documents**: marked as "unpaid" if they have an amount, otherwise "not_applicable"

### 2. implementation details
added `determinePaymentStatus()` helper function in `email-processor.ts` that:
- analyzes document type
- checks ai-extracted content for payment indicators
- returns appropriate payment status

### 3. logging
added console logging to track payment status determination for debugging and monitoring

## benefits
- more accurate financial tracking
- better distinction between paid receipts and unpaid invoices
- improved unpaid summary calculations on the inbox page
- clearer financial overview for users

## future improvements
- could add more sophisticated payment indicator detection
- might integrate with payment processor apis to verify payment status
- could track payment history over time (invoice → paid receipt) 