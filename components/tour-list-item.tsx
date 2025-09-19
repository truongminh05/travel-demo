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

interface TourListItemProps {
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
  highlights: string[];
}

export function TourListItem({
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
}: TourListItemProps) {
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-64 h-48 sm:h-40 flex-shrink-0">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge
                variant={co2Badge.variant}
                className="bg-background/90 text-foreground text-xs"
              >
                <LeafIcon className="w-3 h-3 mr-1" />
                {co2Badge.text}
              </Badge>
            </div>
            {originalPrice && (
              <div className="absolute top-2 right-2">
                <Badge
                  variant="destructive"
                  className="bg-red-500 text-white text-xs"
                >
                  Save ${originalPrice - price}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between h-full">
              <div className="flex-1 mb-4 sm:mb-0">
                <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                  {title}
                </h3>
                <div className="flex items-center text-muted-foreground text-sm mb-2">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {location}
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      ({reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {duration}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {highlights &&
                    highlights.length > 0 &&
                    highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                </div>

                <div className="text-xs text-muted-foreground">
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
                      <XIcon className="w-3 h-3 inline mr-1" />
                      {getCancellationText(cancellation)}
                    </span>
                  )}
                </div>
              </div>

              {/* Price and Book Button */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-2 sm:w-32">
                <div className="text-right">
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-0">
                    {originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${originalPrice}
                      </span>
                    )}
                    <span className="text-xl font-bold text-primary">
                      ${price}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    per person
                  </span>
                </div>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 whitespace-nowrap"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
