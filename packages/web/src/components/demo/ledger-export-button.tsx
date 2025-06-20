"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface LedgerExportButtonProps {
  onExport: () => void
}

export function LedgerExportButton({ onExport }: LedgerExportButtonProps) {
  return (
    <Button variant="outline" onClick={onExport} onMouseEnter={onExport}>
      <Download className="mr-2 h-4 w-4" />
      Export Ledger
    </Button>
  )
}
