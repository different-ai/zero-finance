import type { Message, DemoStep } from "@/lib/types"

const TYPING_SPEED = 60
const calculateTypingDelay = (text: string, speed = TYPING_SPEED) => text.length * speed + 1000

// --- MESSAGE & THREAD DEFINITIONS ---

function linkThread(thread: Message[], threadId: string): Message[] {
  return thread.map((msg, index) => ({
    ...msg,
    threadId,
    isActionable: true, // Mark all messages in solution threads as actionable
    previousMessage: index > 0 && !msg.isForwarded ? thread[index - 1] : msg.previousMessage,
  }))
}

// -- Chaos Emails (Actionable) - E-commerce specific
const supplierOrderRequest: Message = {
  id: "chaos-1",
  sender: "Shenzhen Electronics Co.",
  senderEmail: "sales@shenzhen-electronics.cn",
  recipient: "Sarah",
  subject: "Re: Order #SE-2024-892 - Payment Confirmation Needed",
  body: "Dear Sarah, Your order for 500 units is ready. Please confirm payment of ¥182,500 CNY. We accept bank transfer or Alipay. Early payment gets 2% discount.",
  timestamp: "2025-07-22T08:30:00Z",
  isRead: false,
  avatar: "/avatars/supplier-cn.png",
  isActionable: true,
}

const amazonPayout: Message = {
  id: "chaos-2",
  sender: "Amazon Seller Central",
  senderEmail: "payments-noreply@amazon.com",
  recipient: "Sarah",
  subject: "Your disbursement of $12,350.42 is on the way",
  body: "Your Amazon payout for the period ending July 20, 2024 has been initiated. Funds will be available in 3-5 business days.",
  timestamp: "2025-07-22T08:32:00Z",
  isRead: false,
  avatar: "/avatars/amazon.png",
  isActionable: true,
}

const vatReminder: Message = {
  id: "chaos-3",
  sender: "EU VAT Services",
  senderEmail: "vat@eu-tax-services.com",
  recipient: "Sarah",
  subject: "Q3 2024 VAT Return Due - €8,234",
  body: "Your quarterly EU VAT return is due in 3 days. Based on your sales of €142,350, you owe €8,234. File now to avoid penalties.",
  timestamp: "2025-07-22T08:35:00Z",
  isRead: false,
  avatar: "/avatars/vat.png",
  isActionable: true,
}

const indiaSupplier: Message = {
  id: "chaos-4",
  sender: "Mumbai Textiles Ltd",
  senderEmail: "accounts@mumbaitextiles.in",
  recipient: "Sarah",
  subject: "Invoice MT-3421: Payment Request ₹850,000",
  body: "Please process payment for your fabric order. We now accept INR direct transfers. USD conversion at current rate would be $10,241.",
  timestamp: "2025-07-22T08:40:00Z",
  isRead: false,
  avatar: "/avatars/supplier-in.png",
  isActionable: true,
}

const mexicanCustomer: Message = {
  id: "chaos-5",
  sender: "Carlos Martinez",
  senderEmail: "carlos@distribuidora-mx.com",
  recipient: "Sarah",
  subject: "Wholesale order - Can I pay in MXN?",
  body: "Hi Sarah, I want to order 1000 units. Can I pay MX$320,500 pesos directly? USD conversion fees from my bank are very high.",
  timestamp: "2025-07-22T08:45:00Z",
  isRead: false,
  avatar: "/avatars/customer-mx.png",
  isActionable: true,
}

// -- Chaos Emails (Non-Actionable Clutter)
const shopifyBill: Message = {
  id: "chaos-6",
  sender: "Shopify",
  senderEmail: "billing@shopify.com",
  recipient: "Sarah",
  subject: "Your Shopify invoice",
  body: "Your monthly subscription of $299 has been charged. Thanks for using Shopify Plus!",
  timestamp: "2025-07-22T08:36:00Z",
  isRead: false,
  avatar: "/shopify-logo.png",
  threadId: "shopify-thread",
  isActionable: false,
}

const googleAds: Message = {
  id: "chaos-7",
  sender: "Google Ads",
  senderEmail: "noreply@google.com",
  recipient: "Sarah",
  subject: "Your Google Ads spent $2,450 next week",
  body: "Your campaigns are performing well with a 3.2% conversion rate.",
  timestamp: "2025-07-22T08:37:00Z",
  isRead: false,
  avatar: "/google-logo.png",
  threadId: "google-thread",
  isActionable: false,
}

const alibabaPromo: Message = {
  id: "chaos-8",
  sender: "Alibaba.com",
  senderEmail: "promotion@alibaba.com",
  recipient: "Sarah",
  subject: "New suppliers for Electronics category",
  body: "Check out verified Gold suppliers with trade assurance.",
  timestamp: "2025-07-22T08:20:00Z",
  isRead: false,
  avatar: "/alibaba-logo.png",
  isActionable: false,
}

const chaosMessages = [
  alibabaPromo,
  supplierOrderRequest,
  amazonPayout,
  vatReminder,
  shopifyBill,
  googleAds,
  indiaSupplier,
  mexicanCustomer,
]

export const chaosMessageIds = chaosMessages.map(m => m.id)

// -- 0.finance Welcome
const zeroWelcome: Message = {
  id: "welcome-zero",
  sender: "0.finance AI CFO",
  senderEmail: "ai@0.finance",
  recipient: "Sarah",
  subject: "Welcome to 0.finance!",
  body: "Hey Sarah, I'm your AI CFO. I handle supplier payments, multi-currency transactions, and keep your books clean. Just forward me any financial task and I'll take care of it.",
  timestamp: "2025-07-22T09:00:00Z",
  isRead: false,
  avatar: "/new-logo-bluer.png",
  threadId: "welcome-thread",
  isActionable: true,
}

// -- Solution Threads
const supplierPaymentThread = linkThread(
  [
    supplierOrderRequest,
    {
      id: "supplier-forward",
      sender: "Sarah",
      senderEmail: "sarah@sarahsimports.com",
      recipient: "ai@0.finance",
      subject: "Fwd: Re: Order #SE-2024-892 - Payment Confirmation Needed",
      body: "pay this and take the 2% discount",
      timestamp: "2025-07-22T09:05:00Z",
      isRead: true,
      avatar: "/avatars/sarah.png",
      isForwarded: true,
      previousMessage: supplierOrderRequest,
    },
    {
      id: "supplier-reply",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Sarah",
      subject: "Re: Fwd: Re: Order #SE-2024-892 - Payment Confirmation Needed",
      body: "Done. Paid ¥178,850 CNY (with 2% discount) to Shenzhen Electronics. Saved you $68 on FX vs traditional banks. Confirmation #ZF-892-2024.",
      timestamp: "2025-07-22T09:06:00Z",
      isRead: false,
      avatar: "/new-logo-bluer.png",
    },
  ],
  "supplier-thread",
)

const vatThread = linkThread(
  [
    vatReminder,
    {
      id: "vat-q",
      sender: "Sarah",
      senderEmail: "sarah@sarahsimports.com",
      recipient: "ai@0.finance",
      subject: "Re: Q3 2024 VAT Return Due - €8,234",
      body: "Can you prepare and pay this? Also set up quarterly reminders",
      timestamp: "2025-07-22T09:10:00Z",
      isRead: true,
      avatar: "/avatars/sarah.png",
    },
    {
      id: "vat-a1",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Sarah",
      subject: "Re: Q3 2024 VAT Return Due - €8,234",
      body: "I've analyzed your EU transactions. The €8,234 is correct. Should I pay it now from your USD account? Current rate is favorable - you'll save about €120 vs waiting.",
      timestamp: "2025-07-22T09:11:00Z",
      isRead: false,
      avatar: "/new-logo-bluer.png",
    },
    {
      id: "vat-q2",
      sender: "Sarah",
      senderEmail: "sarah@sarahsimports.com",
      recipient: "ai@0.finance",
      subject: "Re: Q3 2024 VAT Return Due - €8,234",
      body: "Yes, pay it now",
      timestamp: "2025-07-22T09:12:00Z",
      isRead: true,
      avatar: "/avatars/sarah.png",
    },
    {
      id: "vat-a2",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Sarah",
      subject: "Re: Q3 2024 VAT Return Due - €8,234",
      body: "Paid €8,234 to EU VAT. Quarterly reminders set. I'll also prepare your returns automatically going forward. Next VAT due: Oct 15.",
      timestamp: "2025-07-22T09:13:00Z",
      isRead: false,
      avatar: "/new-logo-bluer.png",
    },
  ],
  "vat-thread",
)

const multiCurrencyThread = linkThread(
  [
    mexicanCustomer,
    {
      id: "mexico-q",
      sender: "Sarah",
      senderEmail: "sarah@sarahsimports.com",
      recipient: "ai@0.finance",
      subject: "Re: Wholesale order - Can I pay in MXN?",
      body: "Can we accept Mexican pesos? What's the best way to handle this?",
      timestamp: "2025-07-22T09:20:00Z",
      isRead: true,
      avatar: "/avatars/sarah.png",
    },
    {
      id: "mexico-a",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Sarah",
      subject: "Re: Wholesale order - Can I pay in MXN?",
      body: "Yes! I can set up an MXN receiving account for you. Carlos can pay directly in pesos, and I'll convert at 0.3% (vs 2-3% he'd pay). Want me to send him payment details?",
      timestamp: "2025-07-22T09:21:00Z",
      isRead: false,
      avatar: "/new-logo-bluer.png",
    },
    {
      id: "mexico-q2",
      sender: "Sarah",
      senderEmail: "sarah@sarahsimports.com",
      recipient: "ai@0.finance",
      subject: "Re: Wholesale order - Can I pay in MXN?",
      body: "Perfect, please send him the details",
      timestamp: "2025-07-22T09:22:00Z",
      isRead: true,
      avatar: "/avatars/sarah.png",
    },
    {
      id: "mexico-a2",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Sarah",
      subject: "Re: Wholesale order - Can I pay in MXN?",
      body: "Sent! Carlos can now pay MX$320,500 directly. You'll receive $18,850 USD after conversion. That's $370 more than if he converted on his end.",
      timestamp: "2025-07-22T09:23:00Z",
      isRead: false,
      avatar: "/new-logo-bluer.png",
    },
  ],
  "mexico-thread",
)

const debitCardThread = linkThread(
  [
    {
      id: "debit-q",
      sender: "Sarah",
      senderEmail: "sarah@sarahsimports.com",
      recipient: "ai@0.finance",
      subject: "Need a debit card for Canton Fair",
      body: "I'm going to the Canton Fair next week. Can I get a debit card linked to my CNY account?",
      timestamp: "2025-07-22T09:30:00Z",
      isRead: true,
      avatar: "/avatars/sarah.png",
    },
    {
      id: "debit-a",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Sarah",
      subject: "Re: Need a debit card for Canton Fair",
      body: "Your virtual debit card is ready! Physical card ships today (arrives in 3 days). It's linked to your CNY balance for direct supplier payments. No FX fees in China. Card details sent securely to your app.",
      timestamp: "2025-07-22T09:31:00Z",
      isRead: false,
      avatar: "/new-logo-bluer.png",
    },
  ],
  "debit-thread",
)

const indiaPaymentThread = linkThread(
  [
    indiaSupplier,
    {
      id: "india-q",
      sender: "Sarah",
      senderEmail: "sarah@sarahsimports.com",
      recipient: "ai@0.finance",
      subject: "Re: Invoice MT-3421: Payment Request ₹850,000",
      body: "What's the best way to pay this? They prefer INR",
      timestamp: "2025-07-22T09:35:00Z",
      isRead: true,
      avatar: "/avatars/sarah.png",
    },
    {
      id: "india-a",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Sarah",
      subject: "Re: Invoice MT-3421: Payment Request ₹850,000",
      body: "I'll pay directly in INR from your multi-currency account. Current rate saves you $310 vs USD wire. Also, they offer 1.5% discount for INR payments. Should I take it?",
      timestamp: "2025-07-22T09:36:00Z",
      isRead: false,
      avatar: "/new-logo-bluer.png",
    },
    {
      id: "india-q2",
      sender: "Sarah",
      senderEmail: "sarah@sarahsimports.com",
      recipient: "ai@0.finance",
      subject: "Re: Invoice MT-3421: Payment Request ₹850,000",
      body: "Yes! Take all discounts",
      timestamp: "2025-07-22T09:37:00Z",
      isRead: true,
      avatar: "/avatars/sarah.png",
    },
    {
      id: "india-a2",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Sarah",
      subject: "Re: Invoice MT-3421: Payment Request ₹850,000",
      body: "Paid ₹837,250 (with discount) to Mumbai Textiles. Total savings: $463. All your books are updated and categorized for tax season.",
      timestamp: "2025-07-22T09:38:00Z",
      isRead: false,
      avatar: "/new-logo-bluer.png",
    },
  ],
  "india-thread",
)

export const allPossibleMessages = [
  ...supplierPaymentThread,
  ...vatThread,
  ...multiCurrencyThread,
  ...debitCardThread,
  ...indiaPaymentThread,
  shopifyBill,
  googleAds,
  alibabaPromo,
  zeroWelcome,
]

// --- DEMO SCRIPT ---

// Value popups for e-commerce scenarios - synchronized with demo actions
export const ecommerceValuePopups = [
  {
    trigger: 1, // When emails start landing
    message: "Your list of tasks keeps growing",
    duration: 5000,
  },
  {
    trigger: 6, // AI CFO arrives
    message: "0.finance is the VA for your e-commerce",
    duration: 4000,
  },
  {
    trigger: 8, // Back to inbox after reading welcome
    message: "Let's see how it works",
    duration: 3000,
  },
  {
    trigger: 9, // Handle supplier payment starts
    message: "Instantly pay your suppliers",
    duration: 7000, // Longer duration to cover multiple steps
  },
  {
    trigger: 14, // Back to inbox - clear banner
    message: "",
    duration: 0,
  },
  {
    trigger: 15, // Handle VAT payment (step 7 in titles)
    message: "Stay on top of your tax obligations",
    duration: 5000,
  },
  {
    trigger: 22, // Clear before customer currency
    message: "",
    duration: 0,
  },
  {
    trigger: 23, // Customer currency request (step 14 in titles)
    message: "Make it easy to pay you, using the lowest fees",
    duration: 5000,
  },
  {
    trigger: 29, // Need a debit card (step 21 in titles)
    message: "Automatically fund debit accounts for business trips",
    duration: 4000,
  },
  {
    trigger: 32, // Ask about INR payment (step 25 in titles)
    message: "Easily pay suppliers at the lowest rates, whatever their currency",
    duration: 6000,
  },
  {
    trigger: 38, // Archive Non-Actionable - near the end
    message: "That's 0.finance",
    duration: 5000,
  },
  {
    trigger: 41, // Demo Complete - clear the banner
    message: "",
    duration: 0,
  },
]

export const demoScript: DemoStep[] = [
  {
    title: "Start with a typical e-commerce inbox",
    description: "Supplier emails, marketplace notifications, and bills.",
    action: "START_WITH_MESSAGES",
    messageIds: [chaosMessageIds[0], chaosMessageIds[4], chaosMessageIds[5]],
    delayAfter: 2000,
  },
  {
    title: "The Daily E-commerce Chaos",
    description: "Supplier payment requests start coming in...",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[1], // supplier order
    delayAfter: 800,
  },
  {
    title: "...",
    description: "Amazon payout notification...",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[2], // amazon payout
    delayAfter: 600,
  },
  {
    title: "...",
    description: "Tax obligations...",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[3], // VAT
    delayAfter: 600,
  },
  {
    title: "...",
    description: "More supplier invoices...",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[6], // india supplier
    delayAfter: 400,
  },
  {
    title: "Global Business Complexity",
    description: "Customer wants to pay in local currency.",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[7], // mexican customer
    delayAfter: 2000,
  },
  {
    title: "Your AI CFO Arrives",
    description: "0.finance simplifies global e-commerce finance.",
    action: "AI_WELCOME",
    delayAfter: 2000,
  },
  {
    title: "Read the Welcome",
    description: "Learn what your AI CFO can do.",
    action: "OPEN_MESSAGE",
    messageId: zeroWelcome.id,
    threadId: "welcome-thread",
    delayAfter: 2500,
  },
  {
    title: "Back to Inbox",
    description: "Time to tackle these financial tasks.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  // --- Chinese Supplier Payment ---
  {
    title: "1. Handle Supplier Payment",
    description: "Open the urgent supplier payment request.",
    action: "OPEN_MESSAGE",
    messageId: supplierOrderRequest.id,
    threadId: "supplier-thread",
    delayAfter: 2000,
  },
  {
    title: "2. Forward to AI CFO",
    description: "Let AI handle the international payment.",
    action: "FORWARD_MESSAGE",
    messageId: supplierOrderRequest.id,
    highlightButton: "forward",
    delayAfter: 1500,
  },
  {
    title: "3. Quick Instruction",
    description: "Tell AI to pay and take the discount.",
    action: "TYPE_AND_SEND_FORWARD",
    messageId: supplierOrderRequest.id,
    threadId: "supplier-thread",
    forwardBody: "pay this and take the 2% discount",
    delayAfter: calculateTypingDelay("pay this and take the 2% discount") + 1000,
  },
  {
    title: "4. Payment Confirmed",
    description: "AI pays in CNY, saves on FX and discount.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "supplier-reply",
    threadId: "supplier-thread",
    delayAfter: 3000,
  },
  {
    title: "5. Back to Inbox",
    description: "One task completed efficiently.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  {
    title: "6. Task Cleared",
    description: "Supplier payment handled and archived.",
    action: "CLEAR_THREAD",
    threadId: "supplier-thread",
    delayAfter: 2000,
  },
  // --- VAT Payment ---
  {
    title: "7. Handle VAT Payment",
    description: "Critical tax deadline approaching.",
    action: "OPEN_MESSAGE",
    messageId: vatReminder.id,
    threadId: "vat-thread",
    delayAfter: 2000,
  },
  {
    title: "8. Ask for Help",
    description: "Request AI to handle VAT payment.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "vat-q",
    threadId: "vat-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Can you prepare and pay this? Also set up quarterly reminders"),
  },
  {
    title: "9. AI Analyzes",
    description: "AI checks the amount and suggests timing.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "vat-a1",
    threadId: "vat-thread",
    delayAfter: 4000,
  },
  {
    title: "10. Approve Payment",
    description: "Confirm to proceed with payment.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "vat-q2",
    threadId: "vat-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Yes, pay it now"),
  },
  {
    title: "11. VAT Paid",
    description: "AI handles payment and sets up automation.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "vat-a2",
    threadId: "vat-thread",
    delayAfter: 3000,
  },
  {
    title: "12. Back to Inbox",
    description: "Tax compliance handled.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  {
    title: "13. VAT Task Done",
    description: "Tax payment completed and archived.",
    action: "CLEAR_THREAD",
    threadId: "vat-thread",
    delayAfter: 2000,
  },
  // --- Multi-Currency Customer ---
  {
    title: "14. Customer Currency Request",
    description: "Mexican customer wants to pay in pesos.",
    action: "OPEN_MESSAGE",
    messageId: mexicanCustomer.id,
    threadId: "mexico-thread",
    delayAfter: 2000,
  },
  {
    title: "15. Ask AI for Solution",
    description: "Can we accept Mexican pesos?",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "mexico-q",
    threadId: "mexico-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Can we accept Mexican pesos? What's the best way to handle this?"),
  },
  {
    title: "16. AI Offers Solution",
    description: "AI can set up MXN receiving account.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "mexico-a",
    threadId: "mexico-thread",
    delayAfter: 4000,
  },
  {
    title: "17. Approve Setup",
    description: "Enable peso payments for customer.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "mexico-q2",
    threadId: "mexico-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Perfect, please send him the details"),
  },
  {
    title: "18. Account Ready",
    description: "Customer can now pay in MXN directly.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "mexico-a2",
    threadId: "mexico-thread",
    delayAfter: 3000,
  },
  {
    title: "19. Back to Inbox",
    description: "New revenue stream enabled.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  {
    title: "20. Customer Handled",
    description: "Multi-currency payment set up.",
    action: "CLEAR_THREAD",
    threadId: "mexico-thread",
    delayAfter: 2000,
  },
  // --- Debit Card Request ---
  {
    title: "21. Need a Debit Card",
    description: "Request card for Canton Fair.",
    action: "OPEN_MESSAGE",
    messageId: "debit-q",
    threadId: "debit-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("I'm going to the Canton Fair next week. Can I get a debit card linked to my CNY account?"),
  },
  {
    title: "22. Instant Card Issuance",
    description: "AI provides virtual card immediately.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "debit-a",
    threadId: "debit-thread",
    delayAfter: 3000,
  },
  {
    title: "23. Back to Inbox",
    description: "Ready for trade show payments.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  // --- India Supplier Payment ---
  {
    title: "24. Indian Supplier Invoice",
    description: "Another international payment request.",
    action: "OPEN_MESSAGE",
    messageId: indiaSupplier.id,
    threadId: "india-thread",
    delayAfter: 2000,
  },
  {
    title: "25. Ask About INR Payment",
    description: "Check best payment method.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "india-q",
    threadId: "india-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("What's the best way to pay this? They prefer INR"),
  },
  {
    title: "26. AI Finds Savings",
    description: "Direct INR payment saves money.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "india-a",
    threadId: "india-thread",
    delayAfter: 4000,
  },
  {
    title: "27. Take the Discount",
    description: "Always maximize savings.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "india-q2",
    threadId: "india-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Yes! Take all discounts"),
  },
  {
    title: "28. Payment Complete",
    description: "Saved $463 on this transaction alone.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "india-a2",
    threadId: "india-thread",
    delayAfter: 3000,
  },
  {
    title: "29. Return to Clean Inbox",
    description: "All urgent tasks handled.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  {
    title: "30. Archive Completed Tasks",
    description: "Keep inbox organized.",
    action: "CLEAR_THREAD",
    threadId: "india-thread",
    delayAfter: 1500,
  },
  {
    title: "31. Archive Non-Actionable",
    description: "Clear the remaining clutter.",
    action: "ARCHIVE_NON_ACTIONABLE",
    delayAfter: 2000,
  },
  // --- Conclusion ---
  {
    title: "Global E-commerce Simplified",
    description: "Multi-currency payments, tax compliance, all automated.",
    action: "FINISH_EMPTY",
    delayAfter: 5000,
  },
  {
    title: "Demo Complete",
    description: "This is how 0.finance powers global e-commerce.",
    action: "END",
    delayAfter: 0,
  },
]