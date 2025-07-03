import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";

interface ActionLogCardProps {
  log: any;
  onDeleted?: () => void;
}

export function ActionLogCard({ log, onDeleted }: ActionLogCardProps) {
  const { toast } = useToast();
  const deleteActionLogMutation = api.actionLedger.deleteActionLog.useMutation({
    onSuccess: () => {
      toast({
        title: "Action log deleted",
        description: "The action log has been removed from your history",
      });
      onDeleted?.();
    },
    onError: (error) => {
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this action log?")) {
      await deleteActionLogMutation.mutateAsync({ actionLogId: log.id });
    }
  };

  const amountStr = log.amount && log.currency ? `${log.amount} ${log.currency}` : undefined;
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">{log.actionTitle}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {log.actionType} • {log.status}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {amountStr && (
            <Badge variant="secondary" className="text-xs">{amountStr}</Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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