import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MoreVertical, Trash2, Brain, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";

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
  
  // Check if this is a classification action
  const isClassificationAction = log.actionType?.startsWith('classification_');
  const classificationResults = log.executionDetails?.classificationResults;
  
  // Get appropriate icon and color for classification actions
  const getClassificationIcon = () => {
    switch (log.actionType) {
      case 'classification_evaluated':
        return <Brain className="h-4 w-4 text-blue-500" />;
      case 'classification_matched':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'classification_auto_approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getStatusBadgeVariant = () => {
    switch (log.actionType) {
      case 'classification_evaluated':
        return 'secondary';
      case 'classification_matched':
        return 'outline';
      case 'classification_auto_approved':
        return 'default';
      default:
        return log.status === 'executed' ? 'default' : 'secondary';
    }
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow",
      isClassificationAction && "border-blue-200 dark:border-blue-800"
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isClassificationAction && getClassificationIcon()}
            <CardTitle className="text-sm font-medium">{log.actionTitle}</CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {log.actionSubtitle || `${log.actionType} • ${log.status}`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {amountStr && (
            <Badge variant="secondary" className="text-xs">{amountStr}</Badge>
          )}
          <Badge variant={getStatusBadgeVariant()} className="text-xs">
            {log.status}
          </Badge>
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
        {/* Show classification details if available */}
        {isClassificationAction && classificationResults && (
          <div className="space-y-2 text-xs">
            {classificationResults.evaluated && classificationResults.evaluated.length > 0 && (
              <div>
                <span className="text-muted-foreground">Rules evaluated:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {classificationResults.evaluated.map((rule: any, idx: number) => (
                    <Badge 
                      key={idx} 
                      variant={rule.matched ? "default" : "outline"} 
                      className="text-xs"
                    >
                      {rule.name}
                      {rule.matched && <CheckCircle className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {log.confidence && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">AI Confidence:</span>
                <Badge variant="outline" className="text-xs">{log.confidence}%</Badge>
              </div>
            )}
          </div>
        )}
        
        {log.note && (
          <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{log.note}</p>
        )}
        
        {log.categories && log.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {log.categories.map((cat:string)=>(<Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>))}
          </div>
        )}
        
        {/* Show source type for classification actions */}
        {isClassificationAction && log.sourceType && (
          <div className="text-xs text-muted-foreground">
            Source: {log.sourceType}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-right">
          {log.approvedAt ? format(new Date(log.approvedAt), "PPpp") : ""}
        </p>
      </CardContent>
    </Card>
  );
} 