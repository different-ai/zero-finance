import { Metadata } from "next";
import { CardActionsDisplay } from "@/components/card-actions-display";

export const metadata: Metadata = {
  title: "action logs | 0 finance",
  description: "view all actions performed on your inbox cards",
};

export default function ActionLogsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">action logs</h1>
        <p className="text-muted-foreground">
          comprehensive history of all actions performed on your inbox cards
        </p>
      </div>
      
      <CardActionsDisplay />
    </div>
  );
} 