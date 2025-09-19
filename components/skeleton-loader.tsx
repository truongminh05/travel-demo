export function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card animate-pulse">
      <div className="aspect-[4/3] bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-muted rounded w-12"></div>
          <div className="h-4 bg-muted rounded w-16"></div>
          <div className="h-4 bg-muted rounded w-14 ml-auto"></div>
        </div>
        <div className="flex gap-1">
          <div className="h-6 bg-muted rounded w-20"></div>
          <div className="h-6 bg-muted rounded w-16"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded w-16"></div>
          <div className="h-8 bg-muted rounded w-20"></div>
        </div>
      </div>
    </div>
  )
}

export function TourListSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-64 h-48 sm:h-40 bg-muted"></div>
        <div className="flex-1 p-4 space-y-3">
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-muted rounded w-12"></div>
            <div className="h-4 bg-muted rounded w-14"></div>
          </div>
          <div className="flex gap-1">
            <div className="h-6 bg-muted rounded w-20"></div>
            <div className="h-6 bg-muted rounded w-16"></div>
            <div className="h-6 bg-muted rounded w-18"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
