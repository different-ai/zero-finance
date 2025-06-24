import { Skeleton } from "@/components/ui/skeleton";

export function InboxCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 mb-2">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}