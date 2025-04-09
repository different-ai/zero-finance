import { CreateInvoiceWithTRPC } from '../create-invoice/trpc-example';

export default function TRPCExamplePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">tRPC Example</h1>
      <p className="mb-6">
        This page demonstrates how to use tRPC to create invoices. The form below will create
        a sample invoice using the tRPC API.
      </p>
      
      <div className="mt-8">
        <CreateInvoiceWithTRPC />
      </div>
    </div>
  );
} 