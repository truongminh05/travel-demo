import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, CalendarIcon } from "lucide-react";
import { StarRating } from "@/components/star-rating";

type TourListItemProps = {
  id: string;
  slug?: string | null;
  title: string;
  location: string;
  image?: string | null;
  price?: number | null;
  originalPrice?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  duration?: string | null;
  cancellation?: string | null;
  description?: string | null;
};

const formatCurrency = (value?: number | null) => {
  if (value == null) return "Giá đang cập nhật";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCancellation = (value?: string | null) => {
  if (!value) return "Chính sách hủy đang cập nhật";
  const normalized = value.trim().toLowerCase();
  if (normalized.includes("free") || normalized.includes("miễn")) {
    return "Hủy miễn phí";
  }
  if (normalized.includes("partial") || normalized.includes("50")) {
    return "Hỗ trợ hoàn một phần";
  }
  if (normalized.includes("none") || normalized.includes("không")) {
    return "Không hoàn hủy";
  }
  return value;
};

export function TourListItem({
  id,
  slug,
  title,
  location,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  duration,
  cancellation,
  description,
}: TourListItemProps) {
  const detailHref = slug ? `/tours/${encodeURIComponent(slug)}` : "#";
  const hasDiscount =
    price != null && originalPrice != null && originalPrice > price;

  return (
    <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-64 h-48 md:h-48 flex-shrink-0">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
            />
            {hasDiscount && price != null && originalPrice != null && (
              <Badge
                variant="destructive"
                className="absolute top-3 right-3 bg-red-500 text-white text-xs"
              >
                Tiết kiệm {formatCurrency(originalPrice - price)}
              </Badge>
            )}
          </div>

          <div className="flex-1 p-5 flex flex-col gap-4">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2">{title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" /> {location}
                  </p>
                </div>
                <div className="text-right">
                  {hasDiscount && originalPrice != null && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatCurrency(originalPrice)}
                    </p>
                  )}
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(price ?? null)}
                  </p>
                  <p className="text-xs text-muted-foreground">/ người</p>
                </div>
              </div>

              {description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {rating != null && (
                  <StarRating
                    value={rating}
                    reviewCount={typeof reviewCount === "number" ? reviewCount : undefined}
                    size="sm"
                    className="gap-1"
                  />
                )}
                {duration && (
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" /> {duration}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatCancellation(cancellation)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>ID tour: {id}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm" className="whitespace-nowrap">
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem bản đồ
                  </Link>
                </Button>
                <Button asChild size="sm" disabled={!slug} className="whitespace-nowrap">
                  <Link href={detailHref}>Xem chi tiết</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

