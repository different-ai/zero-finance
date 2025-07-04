import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "card" | "text" | "avatar" | "button";
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  const baseClasses = "relative overflow-hidden rounded-lg";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100",
    card: "bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-100 shadow-sm",
    text: "bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-md",
    avatar: "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-full",
    button: "bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-md"
  };

  return (
    <div
      data-slot="skeleton"
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 to-transparent" />
    </div>
  )
}

// Preset skeleton components for common use cases
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("p-6 space-y-4", className)} {...props}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="avatar" className="h-12 w-12" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="h-4 w-3/4" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-5/6" />
        <Skeleton variant="text" className="h-4 w-4/6" />
      </div>
      <div className="flex justify-between pt-4">
        <Skeleton variant="button" className="h-10 w-24" />
        <Skeleton variant="button" className="h-10 w-20" />
      </div>
    </div>
  )
}

function SkeletonList({ items = 3, className, ...props }: { items?: number } & React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Skeleton variant="avatar" className="h-10 w-10" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" className="h-4 w-2/3" />
            <Skeleton variant="text" className="h-3 w-1/2" />
          </div>
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonList }
