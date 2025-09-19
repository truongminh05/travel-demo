"use client";

import {
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  LeafIcon,
  XIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface TourCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  duration: string;
  cancellation: "free" | "partial" | "none";
  co2Impact: "low" | "medium" | "high";
  highlights?: string[]; // Added default empty array to prevent undefined error
}

export function TourCard({
  id,
  title,
  location,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  duration,
  cancellation,
  co2Impact,
  highlights = [], // Added default empty array to prevent undefined error
}: TourCardProps) {
  const getCancellationText = (type: string) => {
    switch (type) {
      case "free":
        return "Free cancellation";
      case "partial":
        return "Partial refund";
      case "none":
        return "Non-refundable";
      default:
        return "";
    }
  };

  const getCO2Badge = (impact: string) => {
    switch (impact) {
      case "low":
        return { text: "Low CO2e", variant: "default" as const };
      case "medium":
        return { text: "Medium CO2e", variant: "secondary" as const };
      case "high":
        return { text: "High CO2e", variant: "destructive" as const };
      default:
        return { text: "Low CO2e", variant: "default" as const };
    }
  };

  const co2Badge = getCO2Badge(co2Impact);

  return (
    <Card
      className="group overflow-hidden hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 cursor-pointer"
      role="article"
      aria-labelledby={`tour-title-${id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={`${title} - Beautiful view of ${location}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 ease-out" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant={co2Badge.variant}
            className="bg-background/90 text-foreground transform group-hover:scale-105 transition-transform duration-300 ease-out"
            aria-label={`Environmental impact: ${co2Badge.text}`}
          >
            <LeafIcon className="w-3 h-3 mr-1" aria-hidden="true" />
            {co2Badge.text}
          </Badge>
        </div>
        {originalPrice && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="destructive"
              className="bg-red-500 text-white animate-pulse group-hover:animate-none group-hover:scale-105 transition-transform duration-300 ease-out"
              aria-label={`Discount: Save $${originalPrice - price}`}
            >
              Save ${originalPrice - price}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3
              id={`tour-title-${id}`}
              className="font-semibold text-lg text-foreground mb-1 line-clamp-2 text-balance"
            >
              {title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPinIcon className="w-4 h-4 mr-1" aria-hidden="true" />
              <span aria-label={`Location: ${location}`}>{location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center"
            aria-label={`Rating: ${rating} out of 5 stars`}
          >
            <StarIcon
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              aria-hidden="true"
            />
            <span className="text-sm font-medium ml-1">{rating}</span>
          </div>
          <span
            className="text-sm text-muted-foreground"
            aria-label={`${reviewCount} customer reviews`}
          >
            ({reviewCount} reviews)
          </span>
          <div className="flex items-center text-sm text-muted-foreground ml-auto">
            <CalendarIcon className="w-4 h-4 mr-1" aria-hidden="true" />
            <span aria-label={`Duration: ${duration}`}>{duration}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div
            className="flex flex-wrap gap-1"
            role="list"
            aria-label="Tour highlights"
          >
            {highlights &&
              highlights.length > 0 &&
              highlights.slice(0, 2).map((highlight, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs"
                  role="listitem"
                >
                  {highlight}
                </Badge>
              ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {originalPrice && (
                  <span
                    className="text-sm text-muted-foreground line-through"
                    aria-label={`Original price: $${originalPrice}`}
                  >
                    ${originalPrice}
                  </span>
                )}
                <span
                  className="text-xl font-bold text-primary group-hover:scale-105 transition-transform duration-300 ease-out"
                  aria-label={`Current price: $${price} per person`}
                >
                  ${price}
                </span>
              </div>
              <span
                className="text-xs text-muted-foreground"
                aria-hidden="true"
              >
                per person
              </span>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px] px-4 transition-all duration-200 ease-out shadow-md hover:shadow-lg"
            aria-label={`View details for ${title} tour`}
            asChild
          >
            <Link href={id ? `/tours/${id}` : "#"}>View Details</Link>
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span
              className="flex items-center"
              aria-label={`Cancellation policy: ${getCancellationText(
                cancellation
              )}`}
            >
              {cancellation === "free" ? (
                <span className="text-green-600">
                  ✓ {getCancellationText(cancellation)}
                </span>
              ) : cancellation === "partial" ? (
                <span className="text-yellow-600">
                  ⚠ {getCancellationText(cancellation)}
                </span>
              ) : (
                <span className="text-red-600">
                  <XIcon className="w-3 h-3 inline mr-1" aria-hidden="true" />
                  {getCancellationText(cancellation)}
                </span>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
