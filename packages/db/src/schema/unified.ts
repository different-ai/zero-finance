export const userRequestsTable = table(\'user_requests\', ({ table }) => ({\
  invoiceData: json(\'invoice_data\').notNull(), // Store the full invoice structure for RN
  createdAt: timestamp(\'created_at\').defaultNow().notNull(),
  updatedAt: timestamp(\'updated_at\').defaultNow().notNull(),
  // Add share_token for the Request Network shareable link
  shareToken: text(\'share_token\'), // Nullable token generated when committing to RN
}));

export const userRequestsRelations = relations(userRequestsTable, ({ one }) => ({\
// ... existing code ...

})); 