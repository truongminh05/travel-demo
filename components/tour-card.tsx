// File: components/tour-card.tsx

"use client";

import { StarIcon, MapPinIcon, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react"; // ADDED: Import React

interface TourCardProps {
  id: string;
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
  boldKeywords?: string[]; // ADDED: Prop để nhận các từ khóa cần in đậm
}

// Hàm format tiền tệ VNĐ (không đổi)
const formatCurrency = (value: number) => {
  if (!value) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

// ===================================================================
// NEW: Component helper để tìm và in đậm từ khóa
// Component này hỗ trợ tiếng Việt và không phân biệt chữ hoa/thường.
// ===================================================================
const HighlightedText = ({
  text,
  keywords = [],
}: {
  text: string;
  keywords?: string[];
}) => {
  if (!keywords || keywords.length === 0 || !text) {
    return <>{text}</>;
  }

  // Tạo regex từ danh sách keywords. 'gi' = global, case-insensitive
  const regex = new RegExp(`(${keywords.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        keywords.some(
          (keyword) => part.toLowerCase() === keyword.toLowerCase()
        ) ? (
          <strong key={index}>{part}</strong>
        ) : (
          part
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
  boldKeywords, // ADDED: Lấy prop mới
}: TourCardProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col"
      role="article"
      aria-labelledby={`tour-title-${id}`}
    >
      {/* Phần hình ảnh không thay đổi */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/tours/${slug || id}`} className="cursor-pointer">
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
                href={`/tours/${slug || id}`}
                className="hover:text-primary transition-colors"
              >
                {/* CHANGED: Sử dụng component HighlightedText */}
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
            <div
              className="flex items-center"
              aria-label={`Đánh giá: ${rating} trên 5 sao`}
            >
              <StarIcon
                className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1"
                aria-hidden="true"
              />
              <span className="font-medium text-foreground">{rating}</span>
              <span className="ml-1">({reviewCount || 0})</span>
            </div>
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
                aria-label={`Giá gốc: ${formatCurrency(originalPrice)}`}
              >
                {formatCurrency(originalPrice)}
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

          <Button
            size="sm"
            className="min-h-[36px] px-4"
            aria-label={`Xem chi tiết tour ${title}`}
            asChild
          >
            <Link href={`/tours/${slug || id}`}>Xem chi tiết</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
