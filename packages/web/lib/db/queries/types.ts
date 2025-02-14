export interface InsertInvoice {
  invoiceNumber: string;
  vendor: string;
  amount: string;
  invoiceDate: string;
  dueDate: string;
  userId: string;
}

export interface InsertAdminObligation {
  obligation: string;
  dueDate: string;
  notes?: string;
  userId: string;
}
