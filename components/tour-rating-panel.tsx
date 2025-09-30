"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { StarRating } from "@/components/star-rating";

interface TourRatingPanelProps {
  tourId: number;
  initialAverage: number;
  initialCount: number;
}

export function TourRatingPanel({
  tourId,
  initialAverage,
  initialCount,
}: TourRatingPanelProps) {
  const [averageRating, setAverageRating] = useState(initialAverage);
  const [reviewCount, setReviewCount] = useState(initialCount);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRatings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/tours/${tourId}/reviews`, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        if (!isMounted) return;
        setAverageRating(data.averageRating ?? 0);
        setReviewCount(data.reviewCount ?? 0);
        setUserRating(data.userRating ?? null);
      } catch (fetchError) {
        console.error("Failed to load ratings", fetchError);
        if (isMounted) {
          setError("Không thể tải thông tin đánh giá. Vui lòng thử lại sau.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchRatings();
    return () => {
      isMounted = false;
    };
  }, [tourId]);

  const handleSelectRating = async (value: number) => {
    if (isSubmitting) return;
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/tours/${tourId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });

      if (res.status === 401) {
        throw new Error("Vui lòng đăng nhập để đánh giá tour.");
      }

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Không thể lưu đánh giá");
      }

      const data = await res.json();
      setAverageRating(data.averageRating ?? value);
      setReviewCount(data.reviewCount ?? 0);
      setUserRating(data.userRating ?? value);
      setSuccess("Cảm ơn bạn đã đánh giá!");
    } catch (submitError) {
      console.error("Submit rating error", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không thể lưu đánh giá"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const starButtons = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const value = index + 1;
      const isActive = (hoverRating ?? userRating ?? 0) >= value;
      return (
        <button
          key={value}
          type="button"
          className="p-1"
          onMouseEnter={() => setHoverRating(value)}
          onMouseLeave={() => setHoverRating(null)}
          onFocus={() => setHoverRating(value)}
          onBlur={() => setHoverRating(null)}
          onClick={() => handleSelectRating(value)}
          aria-label={`Đánh giá ${value} sao`}
          disabled={isSubmitting}
        >
          <StarIcon
            className={`h-6 w-6 transition-colors ${
              isActive ? "text-yellow-400" : "text-muted-foreground/40"
            }`}
            fill={isActive ? "currentColor" : "none"}
            strokeWidth={isActive ? 0 : 1.5}
          />
        </button>
      );
    });
  }, [hoverRating, userRating, isSubmitting]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đánh giá tour</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <StarRating
            value={averageRating}
            reviewCount={reviewCount}
            size="md"
            className="gap-1"
            label={`Điểm trung bình ${averageRating.toFixed(1)} trên 5`}
          />
          <span className="text-sm text-muted-foreground">
            {reviewCount > 0
              ? `${reviewCount} lượt đánh giá`
              : "Chưa có đánh giá nào"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {starButtons}
          {userRating ? (
            <span className="text-sm text-muted-foreground">
              Đánh giá của bạn: {userRating}/5
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Chạm để đánh giá tour này
            </span>
          )}
        </div>
        {isLoading && (
          <p className="text-xs text-muted-foreground">Đang tải thông tin đánh giá...</p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}
      </CardContent>
    </Card>
  );
}

