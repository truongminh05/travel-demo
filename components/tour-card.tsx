// File: components/tour-card.tsx

"use client";

import { MapPinIcon, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { BookTourButton } from "@/components/book-tour-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TourCardProps {
  id: number | string;
  slug: string;
  title: string;
  location: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  duration: string;
  description?: string;
  cancellation: string;
  boldKeywords?: string[];
}

const formatCurrency = (value: number) => {
  if (!value) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HighlightedText = ({
  text,
  keywords = [],
}: {
  text: string;
  keywords?: string[];
}) => {
  if (!text || !keywords.length) return <>{text}</>;
  const escaped = keywords.filter(Boolean).map(escapeRegExp);
  if (!escaped.length) return <>{text}</>;
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        escaped.some(
          (kw) =>
            part.toLowerCase() ===
            kw.toLowerCase().replace(/\\([.*+?^${}()|[\]\\])/g, "$1")
        ) ? (
          <strong key={i}>{part}</strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

export function TourCard({
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
  description,
  cancellation,
  boldKeywords,
}: TourCardProps) {
  const hasDiscount = !!originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const detailHref = slug ? `/tours/${encodeURIComponent(slug)}` : "#";
  const numericId = Number(id);
  const isNumericId = Number.isFinite(numericId) && numericId > 0;

  return (
    <Card
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col"
      role="article"
      aria-labelledby={`tour-title-${id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link
          href={detailHref}
          className="cursor-pointer"
          aria-label={`Xem chi tiết tour ${title}`}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={`Ảnh của tour ${title}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent group-hover:from-black/30 transition-all duration-300" />
        </Link>
        {hasDiscount && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="destructive"
              className="bg-red-500 text-white text-xs font-bold"
            >
              GIẢM {discountPercentage}%
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-grow gap-4">
        <div className="flex flex-col flex-grow gap-3">
          <div>
            <div className="flex items-center text-muted-foreground text-sm mb-1">
              <MapPinIcon
                className="w-4 h-4 mr-1.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{location}</span>
            </div>
            <h3
              id={`tour-title-${id}`}
              className="font-semibold text-lg text-foreground line-clamp-2"
            >
              <Link
                href={detailHref}
                className="hover:text-primary transition-colors"
              >
                <HighlightedText text={title} keywords={boldKeywords} />
              </Link>
            </h3>
          </div>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <StarRating
              value={rating}
              reviewCount={reviewCount}
              size="sm"
              className="gap-1"
              label={`Đánh giá: ${rating} trên 5 sao`}
            />
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>{duration}</span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between border-t pt-4">
          <div className="flex flex-col">
            {hasDiscount && (
              <span
                className="text-sm text-muted-foreground line-through"
                aria-label={`Giá gốc: ${formatCurrency(originalPrice!)}`}
              >
                {formatCurrency(originalPrice!)}
              </span>
            )}
            <span
              className="text-xl font-bold text-primary"
              aria-label={`Giá hiện tại: ${formatCurrency(price)} mỗi người`}
            >
              {formatCurrency(price)}
            </span>
            <span className="text-xs text-muted-foreground -mt-1">/ người</span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" asChild disabled={!slug}>
              <Link href={detailHref}>Xem chi tiết</Link>
            </Button>
            {isNumericId && (
              <BookTourButton
                tourId={numericId}
                tourSlug={slug}
                unitPrice={price}
                buttonVariant="secondary"
                buttonSize="sm"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
