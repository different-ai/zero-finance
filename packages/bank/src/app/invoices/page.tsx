import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-[#2038E5]/60">Create and manage your invoices</p>
        </div>
        <Button className="bg-[#2038E5] hover:bg-[#2038E5]/90 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <div className="border rounded-xl border-[#2038E5]/10 bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#2038E5]/10 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-[#2038E5]" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Invoices Yet</h3>
          <p className="text-[#2038E5]/60 max-w-md mx-auto mb-6">
            Create your first invoice to get paid faster with smart payment tracking and automated payment reminders.
          </p>
          <Button className="bg-[#2038E5] hover:bg-[#2038E5]/90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>
    </div>
  );
} 