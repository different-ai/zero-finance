// GL Code (Chart of Accounts) definitions
export const GL_CODES = [
  { code: '1000', name: 'Cash and Bank', category: 'Assets' },
  { code: '1200', name: 'Accounts Receivable', category: 'Assets' },
  { code: '1500', name: 'Inventory', category: 'Assets' },
  { code: '2000', name: 'Accounts Payable', category: 'Liabilities' },
  { code: '3000', name: 'Revenue', category: 'Revenue' },
  { code: '3100', name: 'Service Revenue', category: 'Revenue' },
  { code: '4000', name: 'Cost of Goods Sold', category: 'COGS' },
  { code: '5000', name: 'Operating Expenses', category: 'Expenses' },
  { code: '5100', name: 'Marketing & Advertising', category: 'Expenses' },
  { code: '5200', name: 'Software & Subscriptions', category: 'Expenses' },
  { code: '5300', name: 'Professional Services', category: 'Expenses' },
  { code: '5400', name: 'Office Supplies', category: 'Expenses' },
  { code: '5500', name: 'Travel & Entertainment', category: 'Expenses' },
  { code: '5600', name: 'Utilities', category: 'Expenses' },
  { code: '5700', name: 'Insurance', category: 'Expenses' },
  { code: '5800', name: 'Rent & Lease', category: 'Expenses' },
  { code: '6000', name: 'Payroll', category: 'Expenses' },
  { code: '6100', name: 'Employee Benefits', category: 'Expenses' },
  { code: '7000', name: 'Interest & Fees', category: 'Other' },
  { code: '8000', name: 'Taxes', category: 'Other' },
];

// Vendor to GL Code mappings (learned patterns)
export const VENDOR_GL_MAPPINGS = [
  { vendor: 'AWS', glCode: '5200', confidence: 95 },
  { vendor: 'Google Workspace', glCode: '5200', confidence: 90 },
  { vendor: 'Slack', glCode: '5200', confidence: 88 },
  { vendor: 'Microsoft', glCode: '5200', confidence: 92 },
  { vendor: 'Uber', glCode: '5500', confidence: 85 },
  { vendor: 'Lyft', glCode: '5500', confidence: 85 },
  { vendor: 'Office Depot', glCode: '5400', confidence: 92 },
  { vendor: 'Staples', glCode: '5400', confidence: 90 },
  { vendor: 'LinkedIn', glCode: '5100', confidence: 87 },
  { vendor: 'Facebook', glCode: '5100', confidence: 88 },
  { vendor: 'Legal Services', glCode: '5300', confidence: 85 },
  { vendor: 'Accounting Services', glCode: '5300', confidence: 87 },
];

// Automatic categorization rules
export const GL_RULES = [
  {
    id: 'rule-1',
    name: 'Software Subscriptions',
    conditions: [
      { field: 'description', operator: 'contains', value: 'subscription' },
      { field: 'description', operator: 'contains', value: 'software' },
      { field: 'description', operator: 'contains', value: 'SaaS' },
    ],
    glCode: '5200',
    autoApprove: true,
  },
  {
    id: 'rule-2',
    name: 'Travel Expenses',
    conditions: [
      { field: 'vendor', operator: 'contains', value: 'Uber' },
      { field: 'vendor', operator: 'contains', value: 'Lyft' },
      { field: 'vendor', operator: 'contains', value: 'Airlines' },
      { field: 'vendor', operator: 'contains', value: 'Hotel' },
    ],
    glCode: '5500',
    autoApprove: false,
  },
  {
    id: 'rule-3',
    name: 'Marketing Costs',
    conditions: [
      { field: 'description', operator: 'contains', value: 'advertising' },
      { field: 'description', operator: 'contains', value: 'marketing' },
      { field: 'vendor', operator: 'contains', value: 'LinkedIn' },
      { field: 'vendor', operator: 'contains', value: 'Google Ads' },
    ],
    glCode: '5100',
    autoApprove: false,
  },
  {
    id: 'rule-4',
    name: 'Professional Services',
    conditions: [
      { field: 'description', operator: 'contains', value: 'consulting' },
      { field: 'description', operator: 'contains', value: 'legal' },
      { field: 'description', operator: 'contains', value: 'accounting' },
    ],
    glCode: '5300',
    autoApprove: false,
  },
];

// Function to suggest GL code based on transaction details
export function suggestGLCode(transaction: {
  vendor?: string | null;
  description?: string | null;
  amount?: number;
}): { glCode: string; confidence: number } | null {
  const vendor = transaction.vendor?.toLowerCase() || '';
  const description = transaction.description?.toLowerCase() || '';

  // Check vendor mappings first (highest confidence)
  for (const mapping of VENDOR_GL_MAPPINGS) {
    if (vendor.includes(mapping.vendor.toLowerCase())) {
      return { glCode: mapping.glCode, confidence: mapping.confidence };
    }
  }

  // Check rules (medium confidence)
  for (const rule of GL_RULES) {
    for (const condition of rule.conditions) {
      const fieldValue = condition.field === 'vendor' ? vendor : description;
      if (fieldValue.includes(condition.value.toLowerCase())) {
        return { glCode: rule.glCode, confidence: 75 };
      }
    }
  }

  // Default fallback (low confidence)
  if (
    description.includes('software') ||
    description.includes('subscription')
  ) {
    return { glCode: '5200', confidence: 60 };
  }
  if (description.includes('travel') || description.includes('hotel')) {
    return { glCode: '5500', confidence: 60 };
  }
  if (description.includes('office') || description.includes('supplies')) {
    return { glCode: '5400', confidence: 60 };
  }

  return null;
}
