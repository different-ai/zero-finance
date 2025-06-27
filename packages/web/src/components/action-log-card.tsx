import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ActionLogCardProps {
  log: any;
}

export function ActionLogCard({ log }: ActionLogCardProps) {
  const amountStr = log.amount && log.currency ? `${log.amount} ${log.currency}` : undefined;
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{log.actionTitle}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {log.actionType} • {log.status}
          </CardDescription>
        </div>
        {amountStr && (
          <Badge variant="secondary" className="text-xs">{amountStr}</Badge>
        )}
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {log.note && (
          <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{log.note}</p>
        )}
        {log.categories && log.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {log.categories.map((cat:string)=>(<Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>))}
          </div>
        )}
        <p className="text-xs text-muted-foreground text-right">
          {log.approvedAt ? format(new Date(log.approvedAt), "PPpp") : ""}
        </p>
      </CardContent>
    </Card>
  );
} 