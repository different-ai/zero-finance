"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileWarning } from "lucide-react" // Or a more appropriate icon

export function OutstandingBalanceTile({ amount }: { amount: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
        <FileWarning className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-muted-foreground">Sum of Unpaid Invoices</p>
      </CardContent>
    </Card>
  )
}
