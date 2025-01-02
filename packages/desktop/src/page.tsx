import InvoiceForm from './invoice-form'
import { ProgressSidebar } from './progress-sidebar'

export default function InvoicePage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <InvoiceForm />
      </div>
      <ProgressSidebar />
    </div>
  )
}

