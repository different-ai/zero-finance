import { Skeleton } from "@/components/ui/skeleton";

export function InboxCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <Skeleton variant="text" className="h-4 w-4 rounded-sm" />
      <Skeleton variant="avatar" className="h-12 w-12" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-3 w-1/2" />
      </div>
      <div className="flex flex-col items-end space-y-1">
        <Skeleton variant="text" className="h-4 w-16" />
        <Skeleton variant="text" className="h-3 w-12" />
      </div>
    </div>
  );
}