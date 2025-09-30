import { cn } from "@/lib/utils";
import { StarHalfIcon, StarIcon } from "lucide-react";

interface StarRatingProps {
  value?: number | null;
  reviewCount?: number | null;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
  label?: string;
}

const sizeMap: Record<NonNullable<StarRatingProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  value = 0,
  reviewCount,
  size = "sm",
  showValue = true,
  className,
  label,
}: StarRatingProps) {
  const numericValue =
    typeof value === "number" && Number.isFinite(value) ? value : 0;
  const rating = Math.min(5, Math.max(0, numericValue));
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = rating - index;
    if (starValue >= 1) {
      return (
        <StarIcon
          key={`star-full-${index}`}
          className={cn(sizeMap[size], "text-yellow-400")}
          fill="currentColor"
          strokeWidth={0}
          aria-hidden="true"
        />
      );
    }
    if (starValue >= 0.5) {
      return (
        <StarHalfIcon
          key={`star-half-${index}`}
          className={cn(sizeMap[size], "text-yellow-400")}
          aria-hidden="true"
        />
      );
    }
    return (
      <StarIcon
        key={`star-empty-${index}`}
        className={cn(sizeMap[size], "text-muted-foreground/40")}
        aria-hidden="true"
      />
    );
  });

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={label}>
      <div className="flex items-center" aria-hidden="true">
        {stars}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      {typeof reviewCount === "number" && showValue && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}


