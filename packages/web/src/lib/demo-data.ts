// @ts-nocheck
import type { InboxCard } from "@/types/inbox"
import { v4 as uuidv4 } from "uuid"

const generateUserComment = (
  text: string,
  minutesAgo: number,
  userName = "Alice Wonderland",
  userId = "user_123",
): Comment => ({
  id: uuidv4(),
  userId,
  authorName: userName,
  avatarUrl: `/placeholder.svg?height=32&width=32&query=${userName.split(" ")[0]}`,
  timestamp: new Date(Date.now() - 1000 * 60 * minutesAgo).toISOString(),
  text,
  role: "user",
})

const generateAiComment = (text: string, minutesAgo: number): Comment => ({
  id: uuidv4(),
  userId: "ai_assistant_01",
  authorName: "AI Assistant",
  avatarUrl: `/placeholder.svg?height=32&width=32&query=AI bot`,
  timestamp: new Date(Date.now() - 1000 * 60 * minutesAgo).toISOString(),
  text,
  role: "ai",
})

export function generateDemoCards(): InboxCard[] {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return [
    {
      id: uuidv4(),
      icon: "bank",
      title: "Sweep $12,500 to high-yield vault",
      subtitle: "Idle balance > $10K for 3 days • Vault earning 10.2% APY",
      confidence: 94,
      status: "pending",
      blocked: false,
      timestamp: now.toISOString(),
      rationale: "Your checking account has accumulated a large balance that's been idle for 3 days. Moving to our high-yield vault would earn 10.2% APY vs the current 0.1% rate, generating $1,275 additional annual income.",
      codeHash: "sha256:f8e2a0b3c4d5e6f7a8b9c0d1",
      chainOfThought: [
        "Detected idle cash balance exceeding $10,000 threshold",
        "Verified funds available for 3+ consecutive days",
        "Current vault yield rate: 10.2% APY (verified secure)",
        "Calculated annual benefit: $1,275 vs current earnings"
      ],
      impact: {
        currentBalance: 25500,
        postActionBalance: 13000,
        yield: 10.2
      },
      logId: "tx_sweep_7f8e9d6c5b4a3210",
      sourceType: "hyperstable_bank",
      sourceDetails: {
        name: "Zero Finance Main Account",
        identifier: "ACC...7890",
        icon: "building-2"
      },
      comments: []
    },
    {
      id: uuidv4(),
      icon: "invoice",
      title: "Invoice #4128 payment received - $8,500",
      subtitle: "ACH from Acme Corp • Funds ready for deployment",
      confidence: 99,
      status: "pending",
      blocked: false,
      timestamp: yesterday.toISOString(),
      rationale: "Client payment of $8,500 received via ACH from verified sender Acme Corp. Funds have cleared and are available for immediate deployment to yield strategies.",
      codeHash: "sha256:a1b2c3d4e5f6g7h8i9j0k1l2",
      chainOfThought: [
        "ACH payment detected from verified client Acme Corp",
        "Amount $8,500 matches pending invoice #4128",
        "Funds cleared successfully with no fees",
        "Ready for automatic yield optimization"
      ],
      impact: {
        currentBalance: 25500,
        postActionBalance: 34000
      },
      logId: "tx_invoice_1a2b3c4d5e6f7g8h",
      sourceType: "bank_transaction",
      sourceDetails: {
        name: "ACH Transfer",
        identifier: "Invoice #4128 - Acme Corp"
      },
      comments: []
    },
    {
      id: uuidv4(),
      icon: "compliance",
      title: "Q4 tax withholding optimization",
      subtitle: "Potential $3,200 over-withholding • Due in 14 days",
      confidence: 78,
      status: "pending",
      blocked: false,
      timestamp: lastWeek.toISOString(),
      rationale: "Analysis of your Q4 estimated tax payments suggests you may be over-withholding by approximately $3,200. This represents excess working capital that could be earning yield instead.",
      codeHash: "sha256:9i8h7g6f5e4d3c2b1a0z9y8x",
      chainOfThought: [
        "Analyzed Q4 tax obligations vs current withholding schedule",
        "Identified potential over-withholding of $3,200",
        "Verified calculations against previous year patterns",
        "Recommended adjustment to optimize cash flow"
      ],
      impact: {
        currentBalance: 25500,
        postActionBalance: 28700
      },
      logId: "tx_tax_8h7g6f5e4d3c2b1a",
      sourceType: "system_alert",
      sourceDetails: {
        name: "Tax Optimization Engine",
        identifier: "Q4_2024_ANALYSIS"
      },
      comments: []
    },
    {
      id: uuidv4(),
      icon: "bank",
      title: "Weekly USDC vault transfer - $2,000",
      subtitle: "DeFi strategy earning 8.4% APY • Auto-scheduled",
      confidence: 96,
      status: "pending",
      blocked: false,
      timestamp: now.toISOString(),
      rationale: "Scheduled weekly transfer to USDC vault as part of your automated DeFi yield strategy. Current rate is 8.4% APY with minimal smart contract risk.",
      codeHash: "sha256:x7w6v5u4t3s2r1q0p9o8n7m6",
      chainOfThought: [
        "Weekly schedule triggered for USDC conversion",
        "Verified vault yield rate at 8.4% APY",
        "Smart contract security audit: PASSED",
        "Auto-execution ready for $2,000 transfer"
      ],
      impact: {
        currentBalance: 25500,
        postActionBalance: 23500,
        yield: 8.4
      },
      logId: "tx_usdc_vault_weekly_001",
      sourceType: "system_alert",
      sourceDetails: {
        name: "DeFi Strategy Engine",
        identifier: "WEEKLY_USDC_TRANSFER"
      },
      comments: []
    },
    {
      id: uuidv4(),
      icon: "invoice",
      title: "AWS bill payment approval needed",
      subtitle: "$1,247.82 due in 3 days • Auto-pay disabled for >$1K",
      confidence: 88,
      status: "pending",
      blocked: false,
      timestamp: yesterday.toISOString(),
      rationale: "Monthly AWS infrastructure bill of $1,247.82 requires approval as it exceeds the $1,000 auto-pay threshold. Payment due in 3 days to avoid service interruption.",
      codeHash: "sha256:l6k5j4i3h2g1f0e9d8c7b6a5",
      chainOfThought: [
        "AWS monthly bill received: $1,247.82",
        "Amount exceeds $1,000 auto-pay threshold",
        "Payment due date: 3 days from now",
        "Manual approval required to prevent late fees"
      ],
      impact: {
        currentBalance: 25500,
        postActionBalance: 24252
      },
      logId: "tx_aws_bill_monthly_001",
      sourceType: "email",
      sourceDetails: {
        name: "AWS Billing",
        identifier: "Invoice #AWS-2024-Q4-001"
      },
      comments: []
    }
  ];
}
