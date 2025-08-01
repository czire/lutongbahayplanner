import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
  variant?: "text" | "button" | "card" | "avatar";
  width?: "sm" | "md" | "lg" | "full";
  height?: "sm" | "md" | "lg";
}

/**
 * Reusable loading skeleton component for various UI elements
 * Provides consistent loading states across the application
 */
export function LoadingSkeleton({
  lines = 1,
  className = "",
  variant = "text",
  width = "md",
  height = "md",
}: LoadingSkeletonProps) {
  const getWidthClass = () => {
    switch (width) {
      case "sm":
        return "w-16";
      case "md":
        return "w-24";
      case "lg":
        return "w-32";
      case "full":
        return "w-full";
      default:
        return "w-24";
    }
  };

  const getHeightClass = () => {
    switch (height) {
      case "sm":
        return "h-4";
      case "md":
        return "h-6";
      case "lg":
        return "h-8";
      default:
        return "h-6";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "button":
        return "h-8 w-20 rounded-md";
      case "card":
        return "h-24 w-full rounded-lg";
      case "avatar":
        return "h-8 w-8 rounded-full";
      case "text":
      default:
        return `${getHeightClass()} ${getWidthClass()} rounded`;
    }
  };

  if (lines === 1) {
    return <Skeleton className={`${getVariantClasses()} ${className}`} />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={getVariantClasses()} />
      ))}
    </div>
  );
}
