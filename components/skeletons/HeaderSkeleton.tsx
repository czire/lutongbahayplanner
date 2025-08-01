import { Skeleton } from "@/components/ui/skeleton";

interface HeaderSkeletonProps {
  /** Additional CSS classes to apply to the skeleton container */
  className?: string;
}

export function HeaderSkeleton({ className = "" }: HeaderSkeletonProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* User info skeleton - represents user icon and welcome text */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full bg-primary-foreground/20" />
        <Skeleton className="h-4 w-20 bg-primary-foreground/20" />
      </div>

      {/* Action button skeletons - represents auth/settings buttons */}
      <Skeleton className="h-8 w-16 bg-primary-foreground/20" />
      <Skeleton className="h-8 w-18 bg-primary-foreground/20" />
    </div>
  );
}
