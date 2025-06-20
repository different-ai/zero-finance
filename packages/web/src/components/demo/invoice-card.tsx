import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, AlertTriangle, Send, MoreHorizontal, CalendarClock, AlertOctagon } from "lucide-react"
import type { InvoiceData, InvoiceStatus } from "@/context/demo-timeline-context" // Ensure InvoiceData is imported
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface InvoiceCardProps {
  invoice: InvoiceData // Changed from NonNullable<DemoScene["invoice"]>
  isHighlighted?: boolean
}

const statusConfig: Record<
  InvoiceStatus,
  {
    text: string
    icon: React.ElementType
    colorClasses: string // Tailwind classes for border, text, badge background
    badgeVariant: "default" | "destructive" | "secondary" | "outline"
  }
> = {
  new: {
    text: "New",
    icon: Send,
    colorClasses: "border-blue-500 text-blue-600 bg-blue-500/10",
    badgeVariant: "outline",
  },
  reminder_scheduled: {
    text: "Reminder Scheduled",
    icon: CalendarClock,
    colorClasses: "border-sky-500 text-sky-600 bg-sky-500/10",
    badgeVariant: "secondary",
  },
  due_soon: {
    text: "Due Soon",
    icon: Clock,
    colorClasses: "border-amber-500 text-amber-600 bg-amber-500/10",
    badgeVariant: "secondary",
  },
  reminder_sent: {
    text: "Reminder Sent",
    icon: AlertTriangle,
    colorClasses: "border-yellow-500 text-yellow-600 bg-yellow-500/10",
    badgeVariant: "outline",
  },
  overdue: {
    text: "Overdue",
    icon: AlertOctagon,
    colorClasses: "border-red-500 text-red-600 bg-red-500/10",
    badgeVariant: "destructive",
  },
  paid_matched: {
    text: "Paid & Matched",
    icon: CheckCircle2,
    colorClasses: "border-green-500 text-green-600 bg-green-500/10",
    badgeVariant: "default",
  },
}

export function InvoiceCard({ invoice, isHighlighted }: InvoiceCardProps) {
  const config = statusConfig[invoice.status]
  const currencySymbol = invoice.currencySymbol || "€"

  return (
    <Card
      className={`transition-all duration-300 ${config.colorClasses.split(" ")[0]} border-l-4 ${isHighlighted ? "shadow-lg scale-[1.01] bg-primary/5" : "shadow-sm"}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Invoice #{invoice.id}</CardTitle>
            <CardDescription>To: {invoice.client}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={config.badgeVariant}
              className={`capitalize ${config.colorClasses.split(" ")[1]} ${config.colorClasses.split(" ")[2]} border ${config.colorClasses.split(" ")[0]}`}
            >
              <config.icon className={`mr-1 h-3 w-3`} />
              {config.text}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">invoice actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Send Manual Reminder</DropdownMenuItem>
                <DropdownMenuItem>Mark as Paid Manually</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-xl font-semibold">
              {currencySymbol}
              {invoice.amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="text-lg font-medium capitalize">{invoice.dueDate}</p>
          </div>
        </div>
        {invoice.lastAction && <p className="text-xs text-muted-foreground">Last Action: {invoice.lastAction}</p>}
      </CardContent>
      {(invoice.status === "reminder_scheduled" || invoice.status === "due_soon") && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            {invoice.status === "reminder_scheduled" ? "Automatic reminder scheduled." : "Payment expected soon."}
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
