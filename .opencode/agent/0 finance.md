---
description: This agent is used to manage the 0 Finance MCP tools and demo the capabilities of the 0 Finance MCP.
mode: primary
model: anthropic/claude-opus-4-5-20251101
temperature: 0.1
tools:
  zero-finance: true
---

# 0 Finance MCP Demo

This demo showcases how AI agents can automate financial operations using 0 Finance's MCP tools.

---

## Demo Script

### The Conversation

```
AI: Hi! I'm your 0 Finance assistant. What can I help you with today?

User: [drops sample-invoice.pdf]

AI: I see you've shared an invoice. Let me analyze it...

📄 Invoice #INV-2024-001
━━━━━━━━━━━━━━━━━━━━━━━━
From: Acme Design Co. (Sarah Johnson)
      Berlin, Germany

Amount: €5,500.00

Services:
  • UI/UX Design Services - December 2024    €3,200.00
  • Brand Identity Consultation                €800.00
  • Motion Design Package                    €1,500.00

Due: January 5, 2025

Would you like me to pay this invoice?

User: Yes please

AI: Let me check your balance first.

[Uses get_balance tool]

✓ You have $12,450 USDC available - more than enough for €5,500.

I don't see Sarah in your saved bank accounts. I found these payment details in the invoice:

  Account Holder: Sarah Johnson
  Bank: N26
  IBAN: DE89 3704 0044 0532 0130 00
  BIC: NTSBDEB1XXX

Should I save this account and proceed with the payment?

User: Yes, go ahead

AI: [Uses create_bank_account tool]

✓ Saved "Sarah Johnson - Acme Design" to your bank accounts.

[Uses propose_bank_transfer tool]

✓ Transfer proposed!

━━━━━━━━━━━━━━━━━━━━━━━━
PENDING APPROVAL
━━━━━━━━━━━━━━━━━━━━━━━━
Amount: $5,500 USDC → €5,500 EUR
To: Sarah Johnson (N26)
Ref: Invoice #INV-2024-001

Please approve this transfer in your 0 Finance dashboard
under Transfers → Pending Approvals.

Once approved, Sarah will receive the funds via SEPA transfer
within 1-2 business days.
```

---

## How to Run This Demo

### 1. Generate the Invoice PDF

Open `sample-invoice.html` in your browser and print to PDF:

- **Chrome/Edge**: Ctrl+P (Cmd+P on Mac) → Save as PDF
- **Safari**: File → Export as PDF

Save as `sample-invoice.pdf` in this folder.

### 2. Configure Your AI Assistant

Add the 0 Finance MCP endpoint to your AI assistant:

```
Endpoint: https://www.0.finance/api/mcp
Auth: Bearer <your_workspace_api_key>
```

### 3. Start the Conversation

Open your AI assistant and wait for it to greet you, then drop the PDF.

---

## MCP Tools Used

| Tool                       | Purpose                         |
| -------------------------- | ------------------------------- |
| `get_balance`              | Check available USDC balance    |
| `list_saved_bank_accounts` | See existing recipients         |
| `create_bank_account`      | Save new recipient from invoice |
| `propose_bank_transfer`    | Create transfer for approval    |
| `list_proposals`           | Check pending transfers         |

---

## Security

- **Human approval required** - AI proposes, you approve
- **Workspace isolation** - API keys are scoped per workspace
- **Full audit trail** - Every action is logged

---

## Files

| File                  | Description                        |
| --------------------- | ---------------------------------- |
| `sample-invoice.html` | Invoice template (open in browser) |
| `sample-invoice.pdf`  | Generated PDF (you create this)    |
| `README.md`           | This guide                         |
