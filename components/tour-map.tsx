"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, CalendarIcon, StarIcon, ExternalLinkIcon } from "lucide-react";

type MapTour = {
  id: string;
  title: string;
  location: string;
  slug?: string | null;
  image?: string | null;
  price?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  duration?: string | null;
};

interface TourMapProps {
  tours: MapTour[];
}

const formatCurrency = (value?: number | null) => {
  if (value == null) return "Giá đang cập nhật";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

export function TourMap({ tours }: TourMapProps) {
  const validTours = useMemo(
    () => tours.filter((tour) => tour.location && tour.location.trim().length > 0),
    [tours]
  );

  const [selectedId, setSelectedId] = useState(
    validTours.length ? validTours[0].id : null
  );

  const selectedTour = useMemo(() => {
    if (!validTours.length) return null;
    if (!selectedId) return validTours[0];
    return validTours.find((tour) => tour.id === selectedId) ?? validTours[0];
  }, [selectedId, validTours]);

  if (!validTours.length || !selectedTour) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-10 text-center text-muted-foreground">
          Không tìm thấy địa điểm hợp lệ để hiển thị bản đồ.
        </CardContent>
      </Card>
    );
  }

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    selectedTour.location
  )}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    selectedTour.location
  )}`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r bg-muted/30">
          <div className="p-4 flex items-center gap-2 border-b bg-background">
            <MapPinIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Chọn địa điểm</span>
          </div>
          <ul className="max-h-[420px] overflow-y-auto divide-y">
            {validTours.map((tour) => {
              const isActive = tour.id === selectedTour.id;
              return (
                <li key={tour.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(tour.id)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                        {tour.image ? (
                          <Image
                            src={tour.image}
                            alt={tour.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                            Không có ảnh
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-tight line-clamp-2">
                          {tour.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3" /> {tour.location}
                        </p>
                        <p className="text-xs text-primary font-medium">
                          {formatCurrency(tour.price ?? undefined)}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="flex-1 min-h-[440px] relative">
          <div className="absolute inset-0">
            <iframe
              key={selectedTour.id + selectedTour.location}
              src={mapSrc}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title={`Bản đồ ${selectedTour.location}`}
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm border rounded-lg shadow-lg p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {selectedTour.title}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPinIcon className="w-3 h-3" /> {selectedTour.location}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {selectedTour.duration && (
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {selectedTour.duration}
                    </span>
                  )}
                  {selectedTour.rating != null && (
                    <span className="flex items-center gap-1">
                      <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {selectedTour.rating.toFixed(1)}
                      {selectedTour.reviewCount ? ` (${selectedTour.reviewCount})` : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary text-sm font-medium">
                  {formatCurrency(selectedTour.price ?? undefined)}
                </Badge>
                <Button asChild size="sm" variant="outline">
                  <Link href={mapLink} target="_blank" rel="noopener noreferrer">
                    Mở Google Maps <ExternalLinkIcon className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
                {selectedTour.slug && (
                  <Button asChild size="sm">
                    <Link href={`/tours/${encodeURIComponent(selectedTour.slug)}`}>
                      Xem tour
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
